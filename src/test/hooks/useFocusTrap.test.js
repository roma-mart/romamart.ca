/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';

// jsdom does not support offsetParent (always null), so we mock it
// on buttons to make them pass the visibility check in useFocusTrap.
function mockOffsetParent(el) {
  Object.defineProperty(el, 'offsetParent', { value: document.body, configurable: true });
}

// Helper to create a container with focusable elements
function createContainer() {
  const container = document.createElement('div');
  const btn1 = document.createElement('button');
  btn1.textContent = 'First';
  const btn2 = document.createElement('button');
  btn2.textContent = 'Second';
  const btn3 = document.createElement('button');
  btn3.textContent = 'Third';
  [btn1, btn2, btn3].forEach(mockOffsetParent);
  container.appendChild(btn1);
  container.appendChild(btn2);
  container.appendChild(btn3);
  document.body.appendChild(container);
  return { container, btn1, btn2, btn3 };
}

// Helper to render useFocusTrap with a real DOM ref
function renderFocusTrap(container, isActive, options = {}) {
  return renderHook(
    ({ isActive: active, options: opts }) => {
      const ref = useRef(container);
      useFocusTrap(ref, active, opts);
      return ref;
    },
    { initialProps: { isActive, options } }
  );
}

describe('useFocusTrap', () => {
  let elements;

  beforeEach(() => {
    elements = createContainer();
  });

  afterEach(() => {
    elements.container.remove();
  });

  describe('focus management', () => {
    it('should focus the first focusable element when activated', async () => {
      renderFocusTrap(elements.container, true);
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });
    });

    it('should not focus anything when inactive', () => {
      renderFocusTrap(elements.container, false);
      expect(document.activeElement).not.toBe(elements.btn1);
    });

    it('should restore focus to previous element on deactivation', async () => {
      const outsideButton = document.createElement('button');
      outsideButton.textContent = 'Outside';
      document.body.appendChild(outsideButton);
      outsideButton.focus();
      expect(document.activeElement).toBe(outsideButton);

      const { rerender } = renderFocusTrap(elements.container, true);

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      rerender({ isActive: false, options: {} });

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(outsideButton);
      });

      outsideButton.remove();
    });

    it('should restore focus to returnFocusRef when provided', async () => {
      const returnTarget = document.createElement('button');
      returnTarget.textContent = 'Return Target';
      document.body.appendChild(returnTarget);

      const returnFocusRef = { current: returnTarget };

      const { rerender } = renderHook(
        ({ isActive }) => {
          const ref = useRef(elements.container);
          useFocusTrap(ref, isActive, { returnFocusRef });
          return ref;
        },
        { initialProps: { isActive: true } }
      );

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      rerender({ isActive: false });

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(returnTarget);
      });

      returnTarget.remove();
    });
  });

  describe('Tab key cycling', () => {
    it('should cycle focus from last to first on Tab', async () => {
      renderFocusTrap(elements.container, true);

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      elements.btn3.focus();
      expect(document.activeElement).toBe(elements.btn3);

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(elements.btn1);
    });

    it('should cycle focus from first to last on Shift+Tab', async () => {
      renderFocusTrap(elements.container, true);

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(elements.btn3);
    });

    it('should not prevent Tab when focus is on a middle element', async () => {
      renderFocusTrap(elements.container, true);

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      elements.btn2.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventSpy).not.toHaveBeenCalled();
    });
  });

  describe('Escape key', () => {
    it('should call onEscape when Escape is pressed', async () => {
      const onEscape = vi.fn();
      renderFocusTrap(elements.container, true, { onEscape });

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledOnce();
    });

    it('should not throw if onEscape is not provided', async () => {
      renderFocusTrap(elements.container, true);

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(elements.btn1);
      });

      expect(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
        document.dispatchEvent(event);
      }).not.toThrow();
    });
  });

  describe('inert management', () => {
    it('should set inert on sibling elements when activated', () => {
      const sibling = document.createElement('div');
      sibling.textContent = 'Sibling content';
      document.body.appendChild(sibling);

      renderFocusTrap(elements.container, true);

      expect(sibling.hasAttribute('inert')).toBe(true);

      sibling.remove();
    });

    it('should remove inert from siblings on deactivation', () => {
      const sibling = document.createElement('div');
      sibling.textContent = 'Sibling content';
      document.body.appendChild(sibling);

      const { rerender } = renderFocusTrap(elements.container, true);

      expect(sibling.hasAttribute('inert')).toBe(true);

      rerender({ isActive: false, options: {} });

      expect(sibling.hasAttribute('inert')).toBe(false);

      sibling.remove();
    });

    it('should not set inert on the container itself', () => {
      renderFocusTrap(elements.container, true);

      expect(elements.container.hasAttribute('inert')).toBe(false);
    });
  });
});
