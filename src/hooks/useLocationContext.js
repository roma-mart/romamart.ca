/**
 * Location Context Hooks
 * Hooks for using the LocationProvider context
 */

import { useContext, useEffect } from 'react';
import { LocationContext } from '../contexts/LocationContext';

/**
 * Hook to use location context
 */
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};

/**
 * Hook that auto-registers component as location-aware
 * Triggers location request if not already done
 */
export const useLocationAware = (onLocationFound) => {
  const { userLocation, registerLocationAwareComponent } = useLocationContext();

  useEffect(() => {
    // Register this component as location-aware
    registerLocationAwareComponent();
  }, [registerLocationAwareComponent]);

  useEffect(() => {
    // Only call callback if we have valid location data and a callback function
    if (userLocation && userLocation.latitude && userLocation.longitude && onLocationFound) {
      // Match the structure expected by callbacks (position.coords.latitude/longitude)
      onLocationFound({
        coords: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        }
      });
    }
  }, [userLocation, onLocationFound]);

  return userLocation;
};
