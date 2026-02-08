/**
 * Location Provider
 * Component-based auto-location system
 * Automatically requests location when location-aware components mount
 * Prevents duplicate requests across the app
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { getPrimaryLocation, getLocationById } from '../data/locations';
import { LocationContext } from '../contexts/LocationContext';
import { findNearestLocation } from '../utils/locationMath';

const NEAREST_LOCATION_KEY = 'roma_mart_nearest_location';
const SESSION_REQUESTED_KEY = 'roma_mart_location_requested';
const CACHE_DURATION = 3600000; // 1 hour

// Helper to get cached nearest location (pure function, no sensitive data)
const getCachedNearestLocation = () => {
  try {
    const cached = localStorage.getItem(NEAREST_LOCATION_KEY);
    if (!cached) return null;

    const { locationId, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION && locationId) {
      return getLocationById(locationId) || null;
    }
  } catch {
    // Invalid cache
  }
  return null;
};

export const LocationProvider = ({ children }) => {
  // Initialize with cached nearest location (stores only ID, not coordinates)
  const cachedNearestLocation = useMemo(() => getCachedNearestLocation(), []);
  
  const [locationRequested, setLocationRequested] = useState(() => {
    return !!sessionStorage.getItem(SESSION_REQUESTED_KEY);
  });
  
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();

  // Derive current location from geolocation hook (in-memory only, never persisted)
  const userLocation = location && location.latitude !== null && location.latitude !== undefined && location.longitude !== null && location.longitude !== undefined
    ? { latitude: location.latitude, longitude: location.longitude }
    : null;

  // Compute nearest location: fresh geolocation > cached nearest > HQ fallback
  let nearestLocation = null;
  if (userLocation) {
    nearestLocation = findNearestLocation(userLocation);
    if (!nearestLocation) {
      nearestLocation = cachedNearestLocation || getPrimaryLocation();
    }
  } else if (cachedNearestLocation) {
    nearestLocation = cachedNearestLocation;
  } else {
    nearestLocation = getPrimaryLocation();
  }

  // Cache nearest location ID when it changes (no sensitive coordinates stored)
  useEffect(() => {
    if (!nearestLocation?.id) return;

    try {
      localStorage.setItem(NEAREST_LOCATION_KEY, JSON.stringify({
        locationId: nearestLocation.id,
        timestamp: Date.now()
      }));
    } catch { /* Safari private mode */ }
    sessionStorage.setItem(SESSION_REQUESTED_KEY, 'true');
  }, [nearestLocation]);

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
