/**
 * Service Worker Registration Hook
 * Handles SW lifecycle and updates
 */

import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [registration, setRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let updateInterval;
    let cleanupControllerChange;

    // Register Service Worker
    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
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
        updateInterval = setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    };

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      registerServiceWorker();

      // Reload when a new SW takes control after user-initiated skipWaiting.
      // Guard: only reload if there was already a controller (prevents reload on first visit
      // when clients.claim() fires controllerchange from null → new SW).
      let refreshing = false;
      const handleControllerChange = () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      };
      // Only listen if a controller already exists (i.e., not the very first SW install)
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      }

      // Clean up controllerchange listener
      cleanupControllerChange = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (updateInterval) clearInterval(updateInterval);
      if (cleanupControllerChange) cleanupControllerChange();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
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
    isOnline
  };
};
