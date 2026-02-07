/**
 * Custom React Hook: Focus Trap for Modal Dialogs
 * Traps Tab/Shift+Tab focus within a container and handles Escape to close.
 * Follows WCAG 2.2 AA dialog pattern requirements (2.1.2 Keyboard).
 */

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';

/**
 * @param {React.RefObject} containerRef - Ref to the dialog container element
 * @param {boolean} isActive - Whether the focus trap is currently active
 * @param {object} [options]
 * @param {Function} [options.onEscape] - Called when Escape is pressed
 * @param {React.RefObject} [options.returnFocusRef] - Element to restore focus to on close
 * @param {number} [options.initialFocusDelay=0] - Delay in ms before focusing first element (for animations)
 */
export function useFocusTrap(containerRef, isActive, options = {}) {
  const { onEscape, returnFocusRef, initialFocusDelay = 0 } = options;
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element to restore later
    previousActiveElement.current = document.activeElement;

    const getFocusableElements = () => {
      if (!containerRef.current) return [];
      return Array.from(containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    };

    // Capture ref value at effect setup time for cleanup
    const returnFocusElement = returnFocusRef?.current;

    // Focus first element after optional delay (for animation)
    const focusTimer = setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, initialFocusDelay);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (onEscape) onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus on deactivation
      const restoreTarget = returnFocusElement || previousActiveElement.current;
      if (restoreTarget && typeof restoreTarget.focus === 'function') {
        restoreTarget.focus();
      }
    };
  }, [isActive, containerRef, onEscape, returnFocusRef, initialFocusDelay]);
}
