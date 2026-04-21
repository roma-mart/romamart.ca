/**
 * Network Status Indicator
 * Shows online/offline status to users
 */

import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useIsOnline } from '../hooks/useIsOnline';

const NetworkStatus = () => {
  const isOnline = useIsOnline();
  const [showReconnected, setShowReconnected] = React.useState(false);
  const prevIsOnlineRef = React.useRef(isOnline);

  // Detect offline→online transition and trigger reconnected message
  React.useEffect(() => {
    if (!prevIsOnlineRef.current && isOnline) {
      setShowReconnected(true);
    }
    prevIsOnlineRef.current = isOnline;
  }, [isOnline]);

  // Auto-dismiss reconnection message after 3 seconds
  React.useEffect(() => {
    if (!showReconnected) return;
    const timer = setTimeout(() => setShowReconnected(false), 3000);
    return () => clearTimeout(timer);
  }, [showReconnected]);

  const showOfflineMessage = !isOnline || showReconnected;

  if (!showOfflineMessage) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down"
      role="status"
      aria-live="polite"
    >
      <div
        className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-inter font-semibold ${
          isOnline ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'
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
