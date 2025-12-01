/**
 * Toast Notification Component
 * Accessible toast notifications for user feedback
 */

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-2 backdrop-blur-sm';
    switch (type) {
      case 'success':
        return `${base} bg-green-50 border-green-500 text-green-900`;
      case 'error':
        return `${base} bg-red-50 border-red-500 text-red-900`;
      default:
        return `${base} bg-blue-50 border-blue-500 text-blue-900`;
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={getStyles()}
    >
      {getIcon()}
      <span className="flex-1 font-inter text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
