/**
 * Toast Notification Component
 * Accessible toast notifications for user feedback
 */

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Button from './Button';

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

  const base = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-2 backdrop-blur-sm';
  const getClasses = () => {
    switch (type) {
      case 'success':
        return `${base} border-[var(--color-success)]`;
      case 'error':
        return `${base} border-[var(--color-error)]`;
      default:
        return `${base} border-[var(--color-accent)]`;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-medium)' };
      case 'error':
        return { backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-medium)' };
      default:
        return { backgroundColor: 'var(--color-accent-bg, rgba(228,179,64,0.1))', color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-medium)' };
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={getClasses()}
      style={getColors()}
    >
      {getIcon()}
      <span className="flex-1 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-medium)' }}>{message}</span>
      <Button
        type="button"
        variant="icon"
        onClick={onClose}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose(e);
          }
        }}
        aria-label="Close notification"
        style={{ padding: 0, backgroundColor: 'transparent', color: 'var(--color-text)' }}
        className="hover:opacity-70 transition-opacity"
        icon={<X size={18} />}
      />
    </div>
  );
};

export default Toast;
