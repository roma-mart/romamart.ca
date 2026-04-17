import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { LOCATIONS } from '../data/locations';
import { normalizeLocation } from '../utils/normalize';
import { circuitBreakers } from '../utils/apiCircuitBreaker';
import { fetchWithEtag } from '../utils/api';

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

const API_PATH = '/api/v1/public-locations';
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

  // Pure async fetch — returns result object (no setState), safe to call from effects
  const performFetch = useCallback(async () => {
    try {
      if (!circuitBreakers.locations.shouldAttemptCall()) {
        if (import.meta.env.DEV) console.warn('Locations circuit breaker open, using static data');
        return { items: LOCATIONS, source: 'static', error: 'API circuit breaker open, using static data' };
      }

      const { data, status, errorBody } = await fetchWithEtag(API_PATH, {
        circuitBreaker: circuitBreakers.locations,
      });

      if (status === 304) {
        if (import.meta.env.DEV) console.warn('[LocationsContext] 304 Not Modified, using cached data');
        circuitBreakers.locations.recordSuccess();
        return { items: null, source: null, error: '' }; // API healthy; clear error but keep existing data
      }

      if (!data) {
        circuitBreakers.locations.recordFailure(status);
        if (import.meta.env.DEV) {
          console.warn('Locations API unavailable, using static data');
          if (errorBody?.code === 'RATE_LIMITED') console.warn('[LocationsContext] Rate limited by API');
          if (errorBody?.code === 'INVALID_API_KEY') console.error('[LocationsContext] Invalid API key configured');
        }
        return { items: LOCATIONS, source: 'static', error: errorBody?.error || 'API unavailable, using static data' };
      }

      // Accept both shapes: { locations: [...] } or { data: { locations: [...] } } or top-level array
      const locationsPayload = Array.isArray(data) ? data : (data.locations ?? data.data?.locations);

      // Validate API response structure
      if (!Array.isArray(locationsPayload)) {
        if (import.meta.env.DEV) console.warn('Invalid locations API response, using static data');
        return { items: LOCATIONS, source: 'static', error: 'Invalid API response, using static data' };
      }

      // API success - use API data (normalized)
      circuitBreakers.locations.recordSuccess();
      return { items: locationsPayload.map((loc) => normalizeLocation(loc, 'api')), source: 'api', error: '' };
    } catch (err) {
      // Network error or other exception - use static fallback
      if (import.meta.env.DEV) console.warn('Locations API error, using static data:', err.message);
      circuitBreakers.locations.recordFailure(err);
      return {
        items: LOCATIONS,
        source: 'static',
        error: err.message || 'Failed to load locations, using static data',
      };
    }
  }, []);

  // Apply fetch result to state
  const applyResult = useCallback((result) => {
    if (result) {
      if (result.items !== null) {
        // null items = 304 Not Modified: keep existing data, only clear error
        setLocations(result.items);
        setSource(result.source);
      }
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    performFetch().then((result) => {
      if (!cancelled) applyResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, [performFetch, applyResult]);

  // Reset selection if saved ID no longer exists in locations (e.g. API returned different set)
  // State-only update during render is safe; localStorage side-effect handled by effect below
  const selectionValid =
    loading || selectedLocationId === 'auto' || locations.some((loc) => loc.id === selectedLocationId);
  if (!selectionValid) {
    setSelectedLocationId('auto');
  }

  // Sync localStorage when selection resets to 'auto' (including the render-phase reset above)
  useEffect(() => {
    if (selectedLocationId === 'auto') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* Safari private mode */
      }
    }
  }, [selectedLocationId]);

  // refetch exposed to consumers is always silent (no spinner) — content stays visible during retry
  const refetch = useCallback(() => performFetch().then(applyResult), [performFetch, applyResult]);

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
