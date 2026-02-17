import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SERVICES } from '../data/services';
import { normalizeService } from '../utils/normalize';
import { circuitBreakers } from '../utils/apiCircuitBreaker';

/**
 * ServicesContext - Single source of truth for services data
 * Fetches from API with fallback to static SERVICES array
 * Prevents duplicate API calls when services are needed on multiple routes
 * Caches results and shares across components
 * Falls back to static SERVICES if API is unavailable
 *
 * @since February 5, 2026
 */
const ServicesContext = createContext();

// In dev, use relative URL so Vite's proxy handles the request (avoids CORS issues)
const API_URL = import.meta.env.DEV ? '/api/public-services' : 'https://romamart.netlify.app/api/public-services';

/**
 * ServicesProvider - Wraps app to provide shared services state
 * Makes a single API call and shares results via context
 * Exposes refetch() for retry-on-error without full page reload
 * Falls back to static SERVICES if API fails
 */
export function ServicesProvider({ children }) {
  const [services, setServices] = useState(SERVICES); // Start with static fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'
  const cancelledRef = useRef(false);

  const fetchServicesData = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      setError('');

      if (!circuitBreakers.services.shouldAttemptCall()) {
        if (import.meta.env.DEV) console.warn('Services circuit breaker open, using static data');
        if (!cancelledRef.current) {
          setServices(SERVICES);
          setSource('static');
          setError('API circuit breaker open, using static data');
        }
        return;
      }

      const res = await fetch(API_URL);

      if (!res.ok) {
        circuitBreakers.services.recordFailure(res.status);
        // API failed, use static fallback
        if (import.meta.env.DEV) console.warn('Services API unavailable, using static data');
        if (!cancelledRef.current) {
          setServices(SERVICES);
          setSource('static');
          setError('API unavailable, using static data');
        }
        return;
      }

      const data = await res.json();

      // Accept both shapes: { services: [...] } or { data: { services: [...] } } or top-level array
      const servicesPayload = Array.isArray(data) ? data : (data.services ?? data.data?.services);

      // Validate API response structure
      if (!Array.isArray(servicesPayload)) {
        if (import.meta.env.DEV) console.warn('Invalid services API response, using static data');
        if (!cancelledRef.current) {
          setServices(SERVICES);
          setSource('static');
          setError('Invalid API response, using static data');
        }
        return;
      }

      // API success - use API data (normalized)
      circuitBreakers.services.recordSuccess();
      if (!cancelledRef.current) {
        setServices(servicesPayload.map((s) => normalizeService(s, 'api')));
        setSource('api');
        setError('');
      }
    } catch (err) {
      // Network error or other exception - use static fallback
      if (import.meta.env.DEV) console.warn('Services API error, using static data:', err.message);
      circuitBreakers.services.recordFailure(err);
      if (!cancelledRef.current) {
        setServices(SERVICES);
        setSource('static');
        setError(err.message || 'Failed to load services, using static data');
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    fetchServicesData(); // Initial load: spinner hides stale static data

    return () => {
      cancelledRef.current = true;
    };
  }, [fetchServicesData]);

  // refetch exposed to consumers is always silent (no spinner) — content stays visible during retry
  const refetch = useCallback(() => fetchServicesData(false), [fetchServicesData]);

  const value = { services, loading, error, source, refetch };

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

/**
 * useServices - Access shared services data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { services: Array, loading: boolean, error: string, source: 'api'|'static', refetch: Function }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
}
