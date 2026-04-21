import React, { createContext, useContext, useEffect, useState } from 'react';
import COMPANY_DATA from '../config/company_data';
import { circuitBreakers } from '../utils/apiCircuitBreaker';
import { fetchWithEtag } from '../utils/api';

/**
 * CompanyDataContext - Single source of truth for company data
 * Fetches from API with fallback to static COMPANY_DATA config
 * Static fields serve as defaults; API fields take precedence
 *
 * @since February 2026
 */
const CompanyDataContext = createContext();

const API_PATH = '/api/v1/public-company-data';

/**
 * CompanyDataProvider - Wraps app to provide shared company data state
 * Makes a single API call and shares results via context
 * Falls back to static COMPANY_DATA if API fails
 */
export function CompanyDataProvider({ children }) {
  const [companyData, setCompanyData] = useState(COMPANY_DATA); // Start with static fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'

  useEffect(() => {
    let cancelled = false;

    const fetchCompanyData = async () => {
      try {
        if (!cancelled) setLoading(true);

        if (!circuitBreakers.companyData.shouldAttemptCall()) {
          if (import.meta.env.DEV) console.warn('Company data circuit breaker open, using static data');
          if (!cancelled) {
            setCompanyData(COMPANY_DATA);
            setSource('static');
            setError('API circuit breaker open, using static data');
          }
          return;
        }

        const { data, status, errorBody } = await fetchWithEtag(API_PATH, {
          circuitBreaker: circuitBreakers.companyData,
        });

        if (status === 304) {
          if (import.meta.env.DEV) console.warn('[CompanyDataContext] 304 Not Modified, using cached data');
          return;
        }

        if (!data) {
          circuitBreakers.companyData.recordFailure(status);
          if (import.meta.env.DEV) {
            console.warn('Company data API unavailable, using static data');
            if (errorBody?.code === 'RATE_LIMITED') console.warn('[CompanyDataContext] Rate limited by API');
            if (errorBody?.code === 'INVALID_API_KEY') console.error('[CompanyDataContext] Invalid API key configured');
          }
          if (!cancelled) {
            setCompanyData(COMPANY_DATA);
            setSource('static');
            setError(errorBody?.error || 'API unavailable, using static data');
          }
          return;
        }

        // Validate API response structure
        if (!data.companyData || typeof data.companyData !== 'object') {
          if (import.meta.env.DEV) console.warn('Invalid company data API response, using static data');
          if (!cancelled) {
            setCompanyData(COMPANY_DATA);
            setSource('static');
            setError('Invalid API response, using static data');
          }
          return;
        }

        // API success - merge with static config as base defaults
        // Static fields serve as fallback; API fields take precedence
        // Deep merge nested objects to prevent partial API data from losing static defaults
        if (!cancelled) {
          const apiData = data.companyData;
          setCompanyData({
            ...COMPANY_DATA,
            ...apiData,
            contact: {
              ...COMPANY_DATA.contact,
              ...(apiData.contact || {}),
            },
            socialLinks: {
              ...COMPANY_DATA.socialLinks,
              ...(apiData.socialLinks || {}),
            },
            defaults: {
              ...COMPANY_DATA.defaults,
              ...(apiData.defaults || {}),
            },
            returnPolicy: {
              ...COMPANY_DATA.returnPolicy,
              ...(apiData.returnPolicy || {}),
            },
            contextualEmails: {
              ...COMPANY_DATA.contextualEmails,
              ...(apiData.contextualEmails || {}),
            },
            location: {
              ...COMPANY_DATA.location,
              ...(apiData.location || {}),
              address: {
                ...COMPANY_DATA.location.address,
                ...(apiData.location?.address || {}),
              },
              contact: {
                ...COMPANY_DATA.location.contact,
                ...(apiData.location?.contact || {}),
              },
            },
            address: {
              ...COMPANY_DATA.address,
              ...(apiData.address || {}),
            },
            endpoints: {
              ...COMPANY_DATA.endpoints,
              ...(apiData.endpoints || {}),
            },
            pwa: {
              ...COMPANY_DATA.pwa,
              ...(apiData.pwa || {}),
              webApplication: {
                ...COMPANY_DATA.pwa?.webApplication,
                ...(apiData.pwa?.webApplication || {}),
              },
            },
          });
          circuitBreakers.companyData.recordSuccess();
          setSource('api');
          setError('');
        }
      } catch (err) {
        // Network error or other exception - use static fallback
        circuitBreakers.companyData.recordFailure(err);
        if (import.meta.env.DEV) console.warn('Company data API error, using static data:', err.message);
        if (!cancelled) {
          setCompanyData(COMPANY_DATA);
          setSource('static');
          setError(err.message || 'Failed to load company data, using static data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCompanyData();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Get the appropriate email address for a given page context.
   * Derived from the current companyData (API-first, static fallback).
   * @param {'general'|'privacy'|'accessibility'|'technology'|'legal'|'support'} context
   * @returns {string}
   */
  const getContextualEmail = (context = 'general') => {
    return (
      companyData.contextualEmails?.[context] ||
      companyData.contextualEmails?.general ||
      COMPANY_DATA.contextualEmails?.general ||
      'contact@romamart.ca'
    );
  };

  const value = { companyData, loading, error, source, getContextualEmail };

  return <CompanyDataContext.Provider value={value}>{children}</CompanyDataContext.Provider>;
}

/**
 * useCompanyData - Access shared company data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { companyData: Object, loading: boolean, error: string, source: 'api'|'static', getContextualEmail: Function }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCompanyData() {
  const context = useContext(CompanyDataContext);
  if (!context) {
    throw new Error('useCompanyData must be used within CompanyDataProvider');
  }
  return context;
}
