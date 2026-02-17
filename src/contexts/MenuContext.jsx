import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { normalizeMenuItem } from '../utils/normalize';
import { ROCAFE_FULL_MENU } from '../data/rocafe-menu';

/**
 * MenuContext - Single source of truth for menu data
 * Prevents duplicate API calls when menu is needed on multiple routes
 * Caches results and shares across components
 * Falls back to static ROCAFE_FULL_MENU if API is unavailable
 */
const MenuContext = createContext();

// In dev, use relative URL so Vite's proxy handles the request (avoids CORS issues)
const API_URL = import.meta.env.DEV ? '/api/public-menu' : 'https://romamart.netlify.app/api/public-menu';

// Pre-normalize static fallback once (not on every render)
const STATIC_FALLBACK = ROCAFE_FULL_MENU.map((item) => normalizeMenuItem(item, 'static'));

/**
 * MenuProvider - Wraps app to provide shared menu state
 * Makes a single API call and shares results via context
 * Exposes refetch() for retry-on-error without full page reload
 */
export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState(STATIC_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static');
  const cancelledRef = useRef(false);

  const fetchMenuData = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      setError('');
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[MenuContext] Fetching menu data from API:', API_URL);
      }

      const res = await fetch(API_URL);

      if (!res.ok) {
        // API failed, use static fallback
        if (import.meta.env.DEV) console.warn('[MenuContext] Menu API unavailable, using static data');
        if (!cancelledRef.current) {
          setMenuItems(STATIC_FALLBACK);
          setSource('static');
          setError('API unavailable, using static data');
        }
        return;
      }

      const data = await res.json();

      // Validate API response structure
      if (!data.menu || !Array.isArray(data.menu) || data.menu.length === 0) {
        if (import.meta.env.DEV) console.warn('[MenuContext] Invalid or empty menu API response, using static data');
        if (!cancelledRef.current) {
          setMenuItems(STATIC_FALLBACK);
          setSource('static');
          setError(
            data.menu?.length === 0
              ? 'Empty menu from API, using static data'
              : 'Invalid API response, using static data'
          );
        }
        return;
      }

      const menu = data.menu.map((item) => normalizeMenuItem(item, 'api'));
      const featuredCount = menu.filter((item) => item.featured).length;

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[MenuContext] Menu data received:', {
          totalItems: menu.length,
          featuredItems: featuredCount,
          sampleItem: menu[0]?.name || 'N/A',
        });
      }

      if (!cancelledRef.current) {
        setMenuItems(menu);
        setSource('api');
        setError('');
      }
    } catch (err) {
      // Network error or other exception - use static fallback
      console.error('[MenuContext] Failed to fetch menu data:', err);
      if (!cancelledRef.current) {
        setMenuItems(STATIC_FALLBACK);
        setSource('static');
        setError(err.message || 'Failed to load menu data');
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    fetchMenuData(); // Initial load: spinner hides stale static data

    return () => {
      cancelledRef.current = true;
    };
  }, [fetchMenuData]);

  // refetch exposed to consumers is always silent (no spinner) — content stays visible during retry
  const refetch = useCallback(() => fetchMenuData(false), [fetchMenuData]);

  const value = { menuItems, loading, error, source, refetch };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/**
 * useMenu - Access shared menu data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {{ menuItems: Array, loading: boolean, error: string, source: 'api'|'static', refetch: Function }}
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
