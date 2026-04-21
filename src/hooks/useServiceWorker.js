/**
 * Service Worker Registration Hook
 * Handles SW lifecycle and updates
 */

import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [registration, setRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let updateInterval;
    let cleanupControllerChange;

    // Register Service Worker
    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        setRegistration(reg);
        if (import.meta.env.DEV) {
          console.warn('[SW] Service Worker registered:', reg.scope);
        }

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (import.meta.env.DEV) {
            console.warn('[SW] Update found');
          }

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (import.meta.env.DEV) {
                console.warn('[SW] New version available');
              }
              setUpdateAvailable(true);
            }
          });
        });

        // Check for updates periodically (every hour)
        updateInterval = setInterval(
          () => {
            reg.update();
          },
          60 * 60 * 1000
        );
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[SW] Registration failed:', error);
        }
      }
    };

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      registerServiceWorker();

      // Reload when a new SW takes control after user-initiated skipWaiting.
      // Attach unconditionally so updates work even on first-visit sessions.
      const hadController = Boolean(navigator.serviceWorker.controller);
      let seenFirstControllerChange = false;
      let refreshing = false;
      const handleControllerChange = () => {
        // On first visit, the initial controllerchange is from null → new SW
        // due to clients.claim(). Skip that one.
        if (!hadController && !seenFirstControllerChange) {
          seenFirstControllerChange = true;
          return;
        }
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      };
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      // Clean up controllerchange listener
      cleanupControllerChange = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }

    return () => {
      if (updateInterval) clearInterval(updateInterval);
      if (cleanupControllerChange) cleanupControllerChange();
    };
  }, []);

  const skipWaiting = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    registration,
    updateAvailable,
    skipWaiting,
  };
};
