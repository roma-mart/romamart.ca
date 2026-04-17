import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SERVICES } from '../data/services';
import { normalizeService } from '../utils/normalize';
import { circuitBreakers } from '../utils/apiCircuitBreaker';
import { fetchWithEtag } from '../utils/api';

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

const API_PATH = '/api/v1/public-services';

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

  // Pure async fetch — returns result object (no setState), safe to call from effects
  const performFetch = useCallback(async () => {
    try {
      if (!circuitBreakers.services.shouldAttemptCall()) {
        if (import.meta.env.DEV) console.warn('Services circuit breaker open, using static data');
        return { items: SERVICES, source: 'static', error: 'API circuit breaker open, using static data' };
      }

      const { data, status, errorBody } = await fetchWithEtag(API_PATH, {
        circuitBreaker: circuitBreakers.services,
      });

      if (status === 304) {
        if (import.meta.env.DEV) console.warn('[ServicesContext] 304 Not Modified, using cached data');
        circuitBreakers.services.recordSuccess();
        return { items: null, source: null, error: '' }; // API healthy; clear error but keep existing data
      }

      if (!data) {
        circuitBreakers.services.recordFailure(status);
        if (import.meta.env.DEV) {
          console.warn('Services API unavailable, using static data');
          if (errorBody?.code === 'RATE_LIMITED') console.warn('[ServicesContext] Rate limited by API');
          if (errorBody?.code === 'INVALID_API_KEY') console.error('[ServicesContext] Invalid API key configured');
        }
        return { items: SERVICES, source: 'static', error: errorBody?.error || 'API unavailable, using static data' };
      }

      // Accept both shapes: { services: [...] } or { data: { services: [...] } } or top-level array
      const servicesPayload = Array.isArray(data) ? data : (data.services ?? data.data?.services);

      // Validate API response structure
      if (!Array.isArray(servicesPayload)) {
        if (import.meta.env.DEV) console.warn('Invalid services API response, using static data');
        return { items: SERVICES, source: 'static', error: 'Invalid API response, using static data' };
      }

      // API success - use API data (normalized)
      circuitBreakers.services.recordSuccess();
      return { items: servicesPayload.map((s) => normalizeService(s, 'api')), source: 'api', error: '' };
    } catch (err) {
      // Network error or other exception - use static fallback
      if (import.meta.env.DEV) console.warn('Services API error, using static data:', err.message);
      circuitBreakers.services.recordFailure(err);
      return { items: SERVICES, source: 'static', error: err.message || 'Failed to load services, using static data' };
    }
  }, []);

  // Apply fetch result to state
  const applyResult = useCallback((result) => {
    if (result) {
      if (result.items !== null) {
        // null items = 304 Not Modified: keep existing data, only clear error
        setServices(result.items);
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

  // refetch exposed to consumers is always silent (no spinner) — content stays visible during retry
  const refetch = useCallback(() => performFetch().then(applyResult), [performFetch, applyResult]);

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
