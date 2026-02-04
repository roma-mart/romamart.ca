/**
 * Toast Container Component
 * Manages multiple toast notifications
 */

import React, { useState, useCallback, createContext, useContext } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

// Custom hook must be in separate file per ESLint rules, but keeping together for simplicity
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message) => addToast(message, 'success'), [addToast]);
  const showError = useCallback((message) => addToast(message, 'error'), [addToast]);
  const showInfo = useCallback((message) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showInfo }}>
      {children}
      
      {/* Toast Container - Fixed position, avoids OrderCTA overlap (56px button + safe spacing) */}
      <div
        className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,1rem))] md:bottom-[calc(56px+1.5rem)] right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
