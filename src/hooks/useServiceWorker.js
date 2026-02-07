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

      // Reload when the new SW takes control (standard pattern)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (updateInterval) clearInterval(updateInterval);
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
