/**
 * useAppBadge - React hook for App Icon Badging API (infrastructure only)
 * Provides setAppBadge and clearAppBadge if supported, no-ops otherwise.
 *
 * Usage:
 *   const { setAppBadge, clearAppBadge, canBadge } = useAppBadge();
 *   setAppBadge(5); // Sets badge to 5 if supported
 *   clearAppBadge(); // Clears badge if supported
 */

import { useCallback } from 'react';

export const useAppBadge = () => {
  const canBadge = typeof navigator !== 'undefined' &&
    ('setAppBadge' in navigator || 'clearAppBadge' in navigator);


  const setAppBadge = useCallback((value) => {
    if (canBadge && navigator.setAppBadge) {
      try {
        navigator.setAppBadge(value);
      } catch {
        // Ignore errors (e.g., not supported)
      }
    }
  }, [canBadge]);

  const clearAppBadge = useCallback(() => {
    if (canBadge && navigator.clearAppBadge) {
      try {
        navigator.clearAppBadge();
      } catch {
        // Ignore errors
      }
    }
  }, [canBadge]);

  return { setAppBadge, clearAppBadge, canBadge };
};
