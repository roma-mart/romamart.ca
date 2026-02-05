import React, { createContext, useContext, useEffect, useState } from 'react';
import { LOCATIONS } from '../data/locations';

/**
 * LocationsContext - Single source of truth for locations data
 * Fetches from API with fallback to static LOCATIONS array
 * Prevents duplicate API calls when locations are needed on multiple routes
 * Caches results and shares across components
 *
 * @since February 5, 2026
 */
const LocationsContext = createContext();

const API_URL = 'https://romamart.netlify.app/api/public-locations';

/**
 * LocationsProvider - Wraps app to provide shared locations state
 * Makes a single API call and shares results via context
 * Falls back to static LOCATIONS if API fails
 */
export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState(LOCATIONS); // Start with static fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'

  useEffect(() => {
    let cancelled = false;

    const fetchLocationsData = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) {
          // API failed, use static fallback
          console.warn('Locations API unavailable, using static data');
          if (!cancelled) {
            setLocations(LOCATIONS);
            setSource('static');
            setError('API unavailable, using static data');
          }
          return;
        }

        const data = await res.json();

        // Validate API response structure
        if (!data.success || !Array.isArray(data.locations)) {
          console.warn('Invalid locations API response, using static data');
          if (!cancelled) {
            setLocations(LOCATIONS);
            setSource('static');
            setError('Invalid API response, using static data');
          }
          return;
        }

        // API success - use API data
        if (!cancelled) {
          setLocations(data.locations);
          setSource('api');
          setError('');
        }
      } catch (err) {
        // Network error or other exception - use static fallback
        console.warn('Locations API error, using static data:', err.message);
        if (!cancelled) {
          setLocations(LOCATIONS);
          setSource('static');
          setError(err.message || 'Failed to load locations, using static data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLocationsData();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = { locations, loading, error, source };

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  );
}

/**
 * useLocations - Access shared locations data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { locations: Array, loading: boolean, error: string, source: 'api'|'static' }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useLocations() {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error('useLocations must be used within LocationsProvider');
  }
  return context;
}
