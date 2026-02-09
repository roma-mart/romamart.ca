import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

/**
 * MenuContext - Single source of truth for menu data
 * Prevents duplicate API calls when menu is needed on multiple routes
 * Caches results and shares across components
 */
const MenuContext = createContext();

// In dev, use relative URL so Vite's proxy handles the request (avoids CORS issues)
const API_URL = import.meta.env.DEV ? '/api/public-menu' : 'https://romamart.netlify.app/api/public-menu';

/**
 * MenuProvider - Wraps app to provide shared menu state
 * Makes a single API call and shares results via context
 * Exposes refetch() for retry-on-error without full page reload
 */
export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cancelledRef = useRef(false);

  const fetchMenuData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[MenuContext] Fetching menu data from API:', API_URL);
      }

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch menu data');
      const data = await res.json();

      const menu = data.menu || [];
      const featuredCount = menu.filter((item) => item.featured).length;

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[MenuContext] Menu data received:', {
          totalItems: menu.length,
          featuredItems: featuredCount,
          sampleItem: menu[0]?.name || 'N/A',
        });
      }

      if (!cancelledRef.current) setMenuItems(menu);
    } catch (err) {
      // Error logging is permanent (not temporary debug logs) for production diagnostics
      console.error('[MenuContext] Failed to fetch menu data:', err);
      if (!cancelledRef.current) setError(err.message || 'Failed to load menu data');
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    fetchMenuData();

    return () => {
      cancelledRef.current = true;
    };
  }, [fetchMenuData]);

  const value = { menuItems, loading, error, refetch: fetchMenuData };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/**
 * useMenu - Access shared menu data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
