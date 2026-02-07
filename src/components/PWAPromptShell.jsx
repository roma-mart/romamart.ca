/**
 * PWA Prompt Shell Component
 * Shared dialog container for PWAInstallPrompt and PWAUpdatePrompt.
 * Provides consistent layout, styling, and accessibility (focus trap, ARIA).
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

const PWAPromptShell = ({
  visible,
  onDismiss,
  icon,
  title,
  subtitle,
  idPrefix,
  zIndex,
  className,
  children,
}) => {
  const dialogRef = useRef(null);

  useFocusTrap(dialogRef, visible, {
    onEscape: onDismiss,
  });

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      className={`fixed bottom-[calc(56px+env(safe-area-inset-bottom,1rem))] md:bottom-[calc(56px+1.5rem)] left-4 right-4 md:left-auto md:right-4 md:max-w-md${className ? ` ${className}` : ''}`}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${idPrefix}-title`}
      aria-describedby={`${idPrefix}-description`}
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
            {icon}
            <div>
              <h3
                id={`${idPrefix}-title`}
                className="font-bold text-lg"
                style={{
                  color: 'var(--color-text-on-primary)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--color-text-on-primary)',
                    opacity: 0.8,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="transition-colors p-1 rounded-full hover:bg-white/10 focus-visible:bg-white/20"
            style={{ color: 'white' }}
            aria-label="Dismiss"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

PWAPromptShell.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  idPrefix: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default PWAPromptShell;
