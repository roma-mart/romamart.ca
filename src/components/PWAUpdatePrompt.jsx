/**
 * PWA Update Prompt Component
 * Persistent notification when a new service worker version is available.
 * Follows the same visual language as PWAInstallPrompt.
 */

import React, { useRef, useCallback } from 'react';
import { RefreshCw, X } from 'lucide-react';
import Button from './Button';
import { useFocusTrap } from '../hooks/useFocusTrap';

const PWAUpdatePrompt = ({ updateAvailable, onUpdate, onDismiss }) => {
  const dialogRef = useRef(null);

  const handleDismiss = useCallback(() => {
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  useFocusTrap(dialogRef, updateAvailable, {
    onEscape: handleDismiss,
  });

  if (!updateAvailable) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,1rem))] md:bottom-[calc(56px+1.5rem)] left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[10001]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className="rounded-2xl shadow-2xl border-2 overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-accent)' }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <RefreshCw size={20} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            </div>
            <h3
              className="font-bold text-lg"
              style={{
                color: 'var(--color-text-on-primary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              Update Available
            </h3>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="transition-colors p-1 rounded-full hover:bg-white/10 focus-visible:bg-white/20"
            style={{ color: 'white' }}
            aria-label="Dismiss update notification"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p
            className="mb-6 leading-relaxed"
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontWeight: 'var(--font-weight-normal)',
            }}
          >
            A new version of Roma Mart is ready. Refresh to get the latest features and fixes.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="action"
              icon={<RefreshCw size={20} />}
              className="flex-1 font-bold"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-accent)' }}
              onClick={onUpdate}
              aria-label="Refresh to update"
            >
              Refresh
            </Button>
            <Button
              type="button"
              variant="action"
              className="px-4 py-3 font-semibold"
              style={{ color: 'var(--color-text)', backgroundColor: 'var(--color-surface)' }}
              onClick={handleDismiss}
              aria-label="Update later"
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
