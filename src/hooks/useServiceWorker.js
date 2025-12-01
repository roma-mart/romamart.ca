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
        const reg = await navigator.serviceWorker.register('/romamart.ca/sw.js', {
          scope: '/romamart.ca/'
        });

        setRegistration(reg);
        console.log('[SW] Service Worker registered:', reg.scope);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          console.log('[SW] Update found');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available');
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
      window.location.reload();
    }
  };

  return {
    registration,
    updateAvailable,
    skipWaiting,
    isOnline
  };
};

/**
 * Background Sync Hook
 * Queue actions for background sync
 */
export const useBackgroundSync = () => {
  const [syncSupported] = useState(
    'serviceWorker' in navigator && 'sync' in navigator.serviceWorker
  );

  const queueSync = async (tag) => {
    if (!syncSupported) {
      console.log('[Background Sync] Not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log('[Background Sync] Queued:', tag);
      return true;
    } catch (error) {
      console.error('[Background Sync] Failed:', error);
      return false;
    }
  };

  return {
    syncSupported,
    queueSync
  };
};
