import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { LOCATIONS } from '../data/locations';
import { normalizeLocation } from '../utils/normalize';

/**
 * LocationsContext - Single source of truth for locations data and selection
 * Fetches from API with fallback to static LOCATIONS array
 * Owns selectedLocationId state (persisted in localStorage)
 * Prevents duplicate API calls when locations are needed on multiple routes
 * Exposes refetch() for retry-on-error without full page reload
 *
 * @since February 5, 2026
 */
const LocationsContext = createContext();

// In dev, use relative URL so Vite's proxy handles the request (avoids CORS issues)
const API_URL = import.meta.env.DEV ? '/api/public-locations' : 'https://romamart.netlify.app/api/public-locations';
const STORAGE_KEY = 'roma_mart_selected_location';

/**
 * LocationsProvider - Wraps app to provide shared locations state
 * Makes a single API call and shares results via context
 * Exposes refetch() for retry-on-error without full page reload
 * Falls back to static LOCATIONS if API fails
 */
export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState(LOCATIONS); // Start with static fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'
  const cancelledRef = useRef(false);

  // Selected location state (persisted in localStorage)
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'auto';
    } catch {
      return 'auto';
    }
  });

  const selectLocation = useCallback((locationId) => {
    setSelectedLocationId(locationId);
    try {
      if (locationId === 'auto') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, locationId);
      }
    } catch {
      /* Safari private mode */
    }
  }, []);

  const fetchLocationsData = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      setError('');
      const res = await fetch(API_URL);

      if (!res.ok) {
        // API failed, use static fallback
        if (import.meta.env.DEV) console.warn('Locations API unavailable, using static data');
        if (!cancelledRef.current) {
          setLocations(LOCATIONS);
          setSource('static');
          setError('API unavailable, using static data');
        }
        return;
      }

      const data = await res.json();

      // Validate API response structure
      if (!Array.isArray(data.locations)) {
        if (import.meta.env.DEV) console.warn('Invalid locations API response, using static data');
        if (!cancelledRef.current) {
          setLocations(LOCATIONS);
          setSource('static');
          setError('Invalid API response, using static data');
        }
        return;
      }

      // API success - use API data (normalized)
      if (!cancelledRef.current) {
        setLocations(data.locations.map((loc) => normalizeLocation(loc, 'api')));
        setSource('api');
        setError('');
      }
    } catch (err) {
      // Network error or other exception - use static fallback
      if (import.meta.env.DEV) console.warn('Locations API error, using static data:', err.message);
      if (!cancelledRef.current) {
        setLocations(LOCATIONS);
        setSource('static');
        setError(err.message || 'Failed to load locations, using static data');
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    fetchLocationsData(); // Initial load: spinner hides stale static data

    return () => {
      cancelledRef.current = true;
    };
  }, [fetchLocationsData]);

  // Reset selection if saved ID no longer exists in locations (e.g. API returned different set)
  useEffect(() => {
    if (loading || selectedLocationId === 'auto') return;
    const exists = locations.some((loc) => loc.id === selectedLocationId);
    if (!exists) {
      selectLocation('auto');
    }
  }, [locations, loading, selectedLocationId, selectLocation]);

  // refetch exposed to consumers is always silent (no spinner) — content stays visible during retry
  const refetch = useCallback(() => fetchLocationsData(false), [fetchLocationsData]);

  const value = { locations, loading, error, source, selectedLocationId, selectLocation, refetch };

  return <LocationsContext.Provider value={value}>{children}</LocationsContext.Provider>;
}

/**
 * useLocations - Access shared locations data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { locations, loading, error, source, selectedLocationId, selectLocation, refetch }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useLocations() {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error('useLocations must be used within LocationsProvider');
  }
  return context;
}
