/**
 * Location Provider
 * Component-based auto-location system
 * Automatically requests location when location-aware components mount
 * Prevents duplicate requests across the app
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { getPrimaryLocation } from '../data/locations';
import { LocationContext } from '../contexts/LocationContext';
import { findNearestLocation } from '../utils/locationMath';

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
  const userLocation = location && location.latitude !== null && location.latitude !== undefined && location.longitude !== null && location.longitude !== undefined
    ? { latitude: location.latitude, longitude: location.longitude }
    : cachedLocation;

  // Compute nearest location: user/cached, else fallback to HQ
  // ...existing code...

  // Store location when received (only updates external systems, no setState)
  useEffect(() => {
    if (!location || location.latitude === null || location.latitude === undefined || location.longitude === null || location.longitude === undefined) return;

    // Store for offline use (external system sync only)
    const locationData = {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
      localStorage.setItem('roma_mart_user_lat', location.latitude.toString());
      localStorage.setItem('roma_mart_user_lng', location.longitude.toString());
    } catch { /* Safari private mode */ }
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

  // Manual re-request (for user-initiated actions like LocationButton)
  // Bypasses session deduplication — every call triggers a fresh geolocation request
  const forceRequestLocation = () => {
    if (!canUseGeolocation) return;
    getCurrentLocation();
  };

  // Auto-request when first location-aware component mounts
  const registerLocationAwareComponent = () => {
    if (!locationRequested && canUseGeolocation) {
      requestLocation();
    }
  };

  // Compute nearest location: user/cached, else fallback to HQ
  let nearestLocation = null;
  if (userLocation && userLocation.latitude !== null && userLocation.latitude !== undefined && userLocation.longitude !== null && userLocation.longitude !== undefined) {
    nearestLocation = findNearestLocation(userLocation);
    if (!nearestLocation) {
      nearestLocation = getPrimaryLocation();
    }
  } else {
    nearestLocation = getPrimaryLocation();
  }

  const value = {
    userLocation,
    nearestLocation,
    loading,
    error,
    canUseGeolocation,
    requestLocation,
    forceRequestLocation,
    registerLocationAwareComponent
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
