/**
 * PWA Update Prompt Component
 * Persistent notification when a new service worker version is available.
 * Follows the same visual language as PWAInstallPrompt.
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { RefreshCw } from 'lucide-react';
import Button from './Button';
import PWAPromptShell from './PWAPromptShell';

const PWAUpdatePrompt = ({ updateAvailable, onUpdate, onDismiss }) => {
  const handleDismiss = useCallback(() => {
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  if (!updateAvailable) return null;

  return (
    <PWAPromptShell
      visible={!!updateAvailable}
      onDismiss={handleDismiss}
      icon={
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <RefreshCw size={20} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
        </div>
      }
      title="Update Available"
      idPrefix="pwa-update"
      zIndex={10001}
    >
      <p
        id="pwa-update-description"
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
    </PWAPromptShell>
  );
};

PWAUpdatePrompt.propTypes = {
  updateAvailable: PropTypes.bool,
  onUpdate: PropTypes.func,
  onDismiss: PropTypes.func,
};

export default PWAUpdatePrompt;
