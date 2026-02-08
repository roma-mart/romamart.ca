/**
 * Custom React Hook: Browser Features Detection & Utilities
 * Provides utilities for Web Share API, Clipboard API, Geolocation, and more
 */

import { useState, useEffect } from 'react';

/**
 * Hook to detect browser support for various modern APIs
 */
export const useBrowserSupport = () => {
  // Calculate support once on mount (no setState in effect)
  const [support] = useState(() => ({
    share: typeof navigator !== 'undefined' && 'share' in navigator,
    clipboard: typeof navigator !== 'undefined' && 'clipboard' in navigator,
    geolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    vibration: typeof navigator !== 'undefined' && 'vibrate' in navigator,
    notification: typeof window !== 'undefined' && 'Notification' in window,
    serviceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    networkInfo: typeof navigator !== 'undefined' && 'connection' in navigator,
    battery: typeof navigator !== 'undefined' && 'getBattery' in navigator,
    pageVisibility: typeof document !== 'undefined' && 'visibilityState' in document,
    intersectionObserver: typeof window !== 'undefined' && 'IntersectionObserver' in window
  }));

  return support;
};

/**
 * Hook for Web Share API
 */
export const useShare = () => {
  const support = useBrowserSupport();

  const share = async (data) => {
    if (!support.share) {
      return { success: false, error: 'Web Share API not supported' };
    }

    try {
      await navigator.share({
        title: data.title || 'Roma Mart',
        text: data.text || '',
        url: data.url || window.location.href
      });
      return { success: true };
    } catch (error) {
      // User cancelled or error occurred
      if (error.name === 'AbortError') {
        return { success: false, error: 'Share cancelled' };
      }
      return { success: false, error: error.message };
    }
  };

  return { share, canShare: support.share };
};

/**
 * Hook for Clipboard API
 */
export const useClipboard = () => {
  const support = useBrowserSupport();

  const copyToClipboard = async (text) => {
    if (!support.clipboard) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return { success: true };
      } catch {
        return { success: false, error: 'Copy failed' };
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { copyToClipboard, canCopy: support.clipboard || true }; // Fallback always available
};

/**
 * Hook for Geolocation API
 */
export const useGeolocation = () => {
  const support = useBrowserSupport();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    if (!support.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  return { location, loading, error, getCurrentLocation, canUseGeolocation: support.geolocation };
};

/**
 * Hook for Local Storage with JSON support
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      if (import.meta.env.DEV) console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      if (import.meta.env.DEV) console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for Vibration API (mobile haptic feedback)
 */
export const useVibration = () => {
  const support = useBrowserSupport();

  const vibrate = (pattern = 50) => {
    if (!support.vibration) {
      return false;
    }

    try {
      navigator.vibrate(pattern);
      return true;
    } catch {
      return false;
    }
  };

  return { vibrate, canVibrate: support.vibration };
};

/**
 * Hook for Network Information API
 */
export const useNetworkStatus = () => {
  const support = useBrowserSupport();
  const [networkInfo, setNetworkInfo] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: '4g',
    downlink: null,
    saveData: false
  });

  useEffect(() => {
    if (!support.networkInfo) {
      return;
    }

    const connection = navigator.connection;
    if (!connection) {
      return;
    }

    const updateNetworkInfo = () => {
      setNetworkInfo({
        online: navigator.onLine,
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || null,
        saveData: connection.saveData || false
      });
    };

    // Initial update
    updateNetworkInfo();

    connection.addEventListener('change', updateNetworkInfo);
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
    };
  }, [support.networkInfo]);

  return networkInfo;
};

/**
 * Hook for Page Visibility API
 */
export const usePageVisibility = () => {
  const support = useBrowserSupport();
  const [isVisible, setIsVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  useEffect(() => {
    if (!support.pageVisibility) {
      return;
    }

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [support.pageVisibility]);

  return isVisible;
};

/**
 * Hook for Battery Status API
 */
export const useBatteryStatus = () => {
  const support = useBrowserSupport();
  const [battery, setBattery] = useState({
    level: 1,
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity
  });

  useEffect(() => {
    if (!support.battery) {
      return;
    }

    let batteryRef = null;

    navigator.getBattery().then((bat) => {
      batteryRef = bat;
      
      const updateBattery = () => {
        setBattery({
          level: bat.level,
          charging: bat.charging,
          chargingTime: bat.chargingTime,
          dischargingTime: bat.dischargingTime
        });
      };

      updateBattery();

      bat.addEventListener('levelchange', updateBattery);
      bat.addEventListener('chargingchange', updateBattery);
      bat.addEventListener('chargingtimechange', updateBattery);
      bat.addEventListener('dischargingtimechange', updateBattery);

      return () => {
        if (batteryRef) {
          batteryRef.removeEventListener('levelchange', updateBattery);
          batteryRef.removeEventListener('chargingchange', updateBattery);
          batteryRef.removeEventListener('chargingtimechange', updateBattery);
          batteryRef.removeEventListener('dischargingtimechange', updateBattery);
        }
      };
    });
  }, [support.battery]);

  return battery;
};

/**
 * Hook to detect device type
 */
export const useDeviceDetection = () => {
  // Calculate device info once on mount
  const [device] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        hasTouch: false,
        platform: 'unknown'
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry|mobile/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    let platform = 'unknown';
    if (/android/i.test(userAgent)) platform = 'android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'ios';
    else if (/windows/i.test(userAgent)) platform = 'windows';
    else if (/mac/i.test(userAgent)) platform = 'mac';
    else if (/linux/i.test(userAgent)) platform = 'linux';

    return {
      isMobile,
      isTablet,
      isDesktop,
      hasTouch,
      platform
    };
  });

  return device;
};
