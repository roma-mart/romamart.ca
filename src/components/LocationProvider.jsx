/**
 * Location Provider
 * Component-based auto-location system
 * Automatically requests location when location-aware components mount
 * Prevents duplicate requests across the app
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { useLocations } from '../contexts/LocationsContext';
import { LocationContext } from '../contexts/LocationContext';
import { findNearestLocation } from '../utils/locationMath';

const NEAREST_LOCATION_KEY = 'roma_mart_nearest_location';
const SESSION_REQUESTED_KEY = 'roma_mart_location_requested';
const CACHE_DURATION = 3600000; // 1 hour

/**
 * Read cached nearest location ID from localStorage.
 * Returns the ID string (not the full location object).
 * @returns {string|null}
 */
const getCachedLocationId = () => {
  try {
    const cached = localStorage.getItem(NEAREST_LOCATION_KEY);
    if (!cached) return null;

    const { locationId, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION && locationId) {
      return locationId;
    }
  } catch {
    // Invalid cache
  }
  return null;
};

export const LocationProvider = ({ children }) => {
  const { locations } = useLocations();

  // Resolve cached location ID to full object using context locations
  const cachedNearestLocation = useMemo(() => {
    const cachedId = getCachedLocationId();
    if (!cachedId) return null;
    return locations.find((loc) => loc.id === cachedId) || null;
  }, [locations]);

  // Derive primary (HQ) location from context
  const primaryLocation = useMemo(() => locations.find((loc) => loc.isPrimary) || locations[0] || null, [locations]);

  const [locationRequested, setLocationRequested] = useState(() => {
    return !!sessionStorage.getItem(SESSION_REQUESTED_KEY);
  });

  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();

  // Derive current location from geolocation hook (in-memory only, never persisted)
  const userLocation =
    location &&
    location.latitude !== null &&
    location.latitude !== undefined &&
    location.longitude !== null &&
    location.longitude !== undefined
      ? { latitude: location.latitude, longitude: location.longitude }
      : null;

  // Compute nearest location: fresh geolocation > cached nearest > HQ fallback
  let nearestLocation = null;
  if (userLocation) {
    nearestLocation = findNearestLocation(userLocation, locations);
    if (!nearestLocation) {
      nearestLocation = cachedNearestLocation || primaryLocation;
    }
  } else if (cachedNearestLocation) {
    nearestLocation = cachedNearestLocation;
  } else {
    nearestLocation = primaryLocation;
  }

  // Cache nearest location ID when it changes (no sensitive coordinates stored)
  useEffect(() => {
    if (!nearestLocation?.id) return;

    try {
      localStorage.setItem(
        NEAREST_LOCATION_KEY,
        JSON.stringify({
          locationId: nearestLocation.id,
          timestamp: Date.now(),
        })
      );
    } catch {
      /* Safari private mode */
    }
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
    registerLocationAwareComponent,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
