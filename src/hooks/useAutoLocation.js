/**
 * Auto Location Hook
 * Automatically requests user location on mount (once per session)
 * LocationProvider is the sole writer to localStorage (stores only nearest location ID, not coordinates)
 */

import { useEffect } from 'react';
import { useGeolocation } from './useBrowserFeatures';

const SESSION_REQUESTED_KEY = 'roma_mart_location_requested';

export const useAutoLocation = (onLocationFound, options = {}) => {
  const {
    autoRequest = true,  // Whether to auto-request on mount
  } = options;

  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();

  // Auto-request location on mount (once per session)
  useEffect(() => {
    if (!autoRequest || !canUseGeolocation) return;

    // Check if we already requested this session
    const alreadyRequested = sessionStorage.getItem(SESSION_REQUESTED_KEY);
    if (alreadyRequested) return;

    // Request fresh location (browser caches the permission)
    getCurrentLocation();
    sessionStorage.setItem(SESSION_REQUESTED_KEY, 'true');
  }, [autoRequest, canUseGeolocation, getCurrentLocation]);

  // Notify parent when location is received (in-memory only)
  useEffect(() => {
    if (location && onLocationFound) {
      onLocationFound({
        coords: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      });
    }
  }, [location, onLocationFound]);

  return { location, loading, error };
};
