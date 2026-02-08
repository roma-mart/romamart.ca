import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES } from '../data/services';

/**
 * ServicesContext - Single source of truth for services data
 * Fetches from API with fallback to static SERVICES array
 * Prevents duplicate API calls when services are needed on multiple routes
 * Caches results and shares across components
 *
 * @since February 5, 2026
 */
const ServicesContext = createContext();

const API_URL = 'https://romamart.netlify.app/api/public-services';

/**
 * ServicesProvider - Wraps app to provide shared services state
 * Makes a single API call and shares results via context
 * Falls back to static SERVICES if API fails
 */
export function ServicesProvider({ children }) {
  const [services, setServices] = useState(SERVICES); // Start with static fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'

  useEffect(() => {
    let cancelled = false;

    const fetchServicesData = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) {
          // API failed, use static fallback
          if (import.meta.env.DEV) console.warn('Services API unavailable, using static data');
          if (!cancelled) {
            setServices(SERVICES);
            setSource('static');
            setError('API unavailable, using static data');
          }
          return;
        }

        const data = await res.json();

        // Validate API response structure
        if (!data.success || !Array.isArray(data.services)) {
          if (import.meta.env.DEV) console.warn('Invalid services API response, using static data');
          if (!cancelled) {
            setServices(SERVICES);
            setSource('static');
            setError('Invalid API response, using static data');
          }
          return;
        }

        // API success - use API data
        if (!cancelled) {
          setServices(data.services);
          setSource('api');
          setError('');
        }
      } catch (err) {
        // Network error or other exception - use static fallback
        if (import.meta.env.DEV) console.warn('Services API error, using static data:', err.message);
        if (!cancelled) {
          setServices(SERVICES);
          setSource('static');
          setError(err.message || 'Failed to load services, using static data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchServicesData();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = { services, loading, error, source };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

/**
 * useServices - Access shared services data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { services: Array, loading: boolean, error: string, source: 'api'|'static' }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
}
