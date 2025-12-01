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
    if (userLocation && onLocationFound) {
      onLocationFound({
        coords: userLocation
      });
    }
  }, [userLocation, onLocationFound]);

  return userLocation;
};
