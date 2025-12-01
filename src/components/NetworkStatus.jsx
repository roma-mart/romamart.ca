/**
 * Network Status Indicator
 * Shows online/offline status to users
 */

import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useServiceWorker } from '../hooks/useServiceWorker';

const NetworkStatus = () => {
  const { isOnline } = useServiceWorker();
  const [showOfflineMessage, setShowOfflineMessage] = React.useState(false);
  const [wasOffline, setWasOffline] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowOfflineMessage(true);
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showOfflineMessage) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down"
      role="status"
      aria-live="polite"
    >
      <div
        className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-inter font-semibold ${
          isOnline
            ? 'bg-green-500 text-white'
            : 'bg-gray-800 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi size={20} />
            <span>Back online!</span>
          </>
        ) : (
          <>
            <WifiOff size={20} />
            <span>You're offline</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;
