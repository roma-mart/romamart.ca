import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * MenuContext - Single source of truth for menu data
 * Fetches from API with no static fallback (consumers handle fallback)
 * Prevents duplicate API calls when menu is needed on multiple routes
 * Caches results and shares across components
 *
 * @since February 5, 2026
 */
const MenuContext = createContext();

const API_URL = 'https://romamart.netlify.app/api/public-menu';

/**
 * MenuProvider - Wraps app to provide shared menu state
 * Makes a single API call and shares results via context
 * Returns source='api' on success, source='static' on failure
 * Consumers should provide their own static fallback when source='static'
 */
export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'

  useEffect(() => {
    let cancelled = false;

    const fetchMenuData = async () => {
      try {
        if (!cancelled) setLoading(true);
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[MenuContext] Fetching menu data from API:', API_URL);
        }

        const res = await fetch(API_URL);

        if (!res.ok) {
          if (import.meta.env.DEV) console.warn('Menu API unavailable, consumers will use static fallback');
          if (!cancelled) {
            setSource('static');
            setError('API unavailable');
          }
          return;
        }

        const data = await res.json();
        const menu = data.menu || [];

        if (!Array.isArray(data.menu) || menu.length === 0) {
          if (import.meta.env.DEV) console.warn('Empty menu API response, consumers will use static fallback');
          if (!cancelled) {
            setSource('static');
            setError('Empty API response');
          }
          return;
        }

        if (import.meta.env.DEV) {
          const featuredCount = menu.filter((item) => item.featured).length;
          // eslint-disable-next-line no-console
          console.log('[MenuContext] Menu data received:', {
            totalItems: menu.length,
            featuredItems: featuredCount,
            sampleItem: menu[0]?.name || 'N/A',
          });
        }

        if (!cancelled) {
          setMenuItems(menu);
          setSource('api');
          setError('');
        }
      } catch (err) {
        // Error logging is permanent (not temporary debug logs) for production diagnostics
        console.error('[MenuContext] Failed to fetch menu data:', err);
        if (!cancelled) {
          setSource('static');
          setError(err.message || 'Failed to load menu data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMenuData();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = { menuItems, loading, error, source };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/**
 * useMenu - Access shared menu data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { menuItems: Array, loading: boolean, error: string, source: 'api'|'static' }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
