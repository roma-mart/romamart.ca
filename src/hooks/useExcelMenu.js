import { useEffect, useState } from "react";

/**
 * Custom hook to fetch menu data from the public API.
 * 
 * Fetches menu data from https://romamart.netlify.app/api/public-menu
 * and returns the menu items along with loading and error states.
 * 
 * @param {string} apiUrl - The API endpoint URL (default: public-menu API)
 * @returns {Object} - { menuItems: Array, loading: boolean, error: string }
 */
export function useExcelMenu(apiUrl = "https://romamart.netlify.app/api/public-menu") {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false; // to avoid setState after unmount
  
    const fetchMenuData = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch menu data");
        const data = await res.json();
        
        // Extract the menu array from the API response
        const menu = data.menu || [];
        if (!cancelled) setMenuItems(menu);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load menu data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
  
    fetchMenuData();
  
    return () => { cancelled = true; };
    }, [apiUrl]);
  

  return { menuItems, loading, error };
}
