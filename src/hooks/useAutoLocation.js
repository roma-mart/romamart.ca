/**
 * Auto Location Hook
 * Automatically requests user location on mount (once per session)
 * Stores location in sessionStorage and localStorage for offline use
 */

import { useEffect } from 'react';
import { useGeolocation } from './useBrowserFeatures';

const LOCATION_STORAGE_KEY = 'roma_mart_user_location';
const SESSION_REQUESTED_KEY = 'roma_mart_location_requested';

export const useAutoLocation = (onLocationFound, options = {}) => {
  const { 
    autoRequest = true,  // Whether to auto-request on mount
    storeForOffline = true  // Whether to store in localStorage for offline access
  } = options;
  
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();

  // Auto-request location on mount (once per session)
  useEffect(() => {
    if (!autoRequest || !canUseGeolocation) return;
    
    // Check if we already requested this session
    const alreadyRequested = sessionStorage.getItem(SESSION_REQUESTED_KEY);
    if (alreadyRequested) return;
    
    // Check if we have recent cached location (within 1 hour)
    const cached = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (cached) {
      try {
        const { latitude, longitude, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        // If cached location is less than 1 hour old, use it
        if (age < 3600000) {
          if (onLocationFound) {
            onLocationFound({
              coords: { latitude, longitude }
            });
          }
          sessionStorage.setItem(SESSION_REQUESTED_KEY, 'true');
          return;
        }
      } catch {
        // Invalid cache, request fresh location
      }
    }
    
    // Request fresh location
    getCurrentLocation();
    sessionStorage.setItem(SESSION_REQUESTED_KEY, 'true');
  }, [autoRequest, canUseGeolocation, getCurrentLocation, onLocationFound]);

  // Store location when received
  useEffect(() => {
    if (location) {
      // Call parent callback
      if (onLocationFound) {
        onLocationFound({
          coords: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        });
      }
      
      // Store for offline use
      if (storeForOffline) {
        const locationData = {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: Date.now()
        };
        
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
        
        // Also store as separate items for easier access in offline.html
        localStorage.setItem('roma_mart_user_lat', location.latitude);
        localStorage.setItem('roma_mart_user_lng', location.longitude);
      }
    }
  }, [location, onLocationFound, storeForOffline]);

  return { location, loading, error };
};

/**
 * Get stored location from localStorage (for use in offline.html)
 */
export const getStoredLocation = () => {
  try {
    const lat = localStorage.getItem('roma_mart_user_lat');
    const lng = localStorage.getItem('roma_mart_user_lng');
    
    if (lat && lng) {
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      };
    }
  } catch (error) {
    console.error('Error reading stored location:', error);
  }
  
  return null;
};
