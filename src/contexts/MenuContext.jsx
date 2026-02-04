import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * MenuContext - Single source of truth for menu data
 * Prevents duplicate API calls when menu is needed on multiple routes
 * Caches results and shares across components
 */
const MenuContext = createContext();

const API_URL = 'https://romamart.netlify.app/api/public-menu';

/**
 * MenuProvider - Wraps app to provide shared menu state
 * Makes a single API call and shares results via context
 */
export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchMenuData = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch menu data');
        const data = await res.json();
        
        const menu = data.menu || [];
        if (!cancelled) setMenuItems(menu);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load menu data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMenuData();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = { menuItems, loading, error };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

/**
 * useMenu - Access shared menu data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 */
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
