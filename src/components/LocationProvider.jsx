/**
 * Location Provider
 * Component-based auto-location system
 * Automatically requests location when location-aware components mount
 * Prevents duplicate requests across the app
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { LocationContext } from '../contexts/LocationContext';

const LOCATION_STORAGE_KEY = 'roma_mart_user_location';
const SESSION_REQUESTED_KEY = 'roma_mart_location_requested';
const CACHE_DURATION = 3600000; // 1 hour

// Helper to get cached location (pure function)
const getCachedLocation = () => {
  const cached = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!cached) return null;
  
  try {
    const { latitude, longitude, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    // If cached location is less than 1 hour old, use it
    if (age < CACHE_DURATION) {
      return { latitude, longitude };
    }
  } catch {
    // Invalid cache
  }
  return null;
};

export const LocationProvider = ({ children }) => {
  // Initialize with cached location using useMemo to avoid recalculation
  const cachedLocation = useMemo(() => getCachedLocation(), []);
  
  const [locationRequested, setLocationRequested] = useState(() => {
    return !!sessionStorage.getItem(SESSION_REQUESTED_KEY);
  });
  
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();

  // Derive current location from hook location or cached location
  const userLocation = location 
    ? { latitude: location.latitude, longitude: location.longitude }
    : cachedLocation;

  // Store location when received (only updates external systems, no setState)
  useEffect(() => {
    if (!location) return;
    
    const coords = {
      latitude: location.latitude,
      longitude: location.longitude
    };
    
    // Store for offline use (external system sync only)
    const locationData = {
      ...coords,
      timestamp: Date.now()
    };
    
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
    localStorage.setItem('roma_mart_user_lat', location.latitude.toString());
    localStorage.setItem('roma_mart_user_lng', location.longitude.toString());
    sessionStorage.setItem(SESSION_REQUESTED_KEY, 'true');
  }, [location]);

  // Request location (can be called by any component)
  const requestLocation = () => {
    if (!canUseGeolocation || locationRequested) return;
    
    // Check if already requested this session
    const alreadyRequested = sessionStorage.getItem(SESSION_REQUESTED_KEY);
    if (!alreadyRequested) {
      getCurrentLocation();
      setLocationRequested(true);
    }
  };

  // Auto-request when first location-aware component mounts
  const registerLocationAwareComponent = () => {
    if (!locationRequested && canUseGeolocation) {
      requestLocation();
    }
  };

  const value = {
    userLocation,
    loading,
    error,
    canUseGeolocation,
    requestLocation,
    registerLocationAwareComponent
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
