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
        return `${base} border-green-500`;
      case 'error':
        return `${base} border-red-500`;
      default:
        return `${base} border-yellow-500`;
    }
  };
  
  const getColors = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#059669' };
      case 'error':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' };
      default:
        return { backgroundColor: 'rgba(228, 179, 64, 0.1)', color: '#E4B340' };
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={getStyles()}
      style={getColors()}
    >
      {getIcon()}
      <span className="flex-1 font-inter text-sm font-medium">{message}</span>
      <button
        type="button"
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
