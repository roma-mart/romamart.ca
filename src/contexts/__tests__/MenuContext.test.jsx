import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MenuProvider, useMenu } from '../MenuContext';

describe('MenuContext', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }) => <MenuProvider>{children}</MenuProvider>;

  it('should start in loading state', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useMenu(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.error).toBe('');
  });

  it('should populate menuItems on successful fetch', async () => {
    const mockMenu = [
      { name: 'Latte', featured: true },
      { name: 'Espresso', featured: false },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ menu: mockMenu }),
      })
    );

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.menuItems).toEqual(mockMenu);
    expect(result.current.error).toBe('');
  });

  it('should set error on non-ok response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch menu data');
    expect(result.current.menuItems).toEqual([]);
  });

  it('should set error on network failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.menuItems).toEqual([]);
  });

  it('should handle empty menu array from API', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ menu: [] }),
      })
    );

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.menuItems).toEqual([]);
    expect(result.current.error).toBe('');
  });

  it('should handle missing menu key in API response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.menuItems).toEqual([]);
  });

  it('should throw when useMenu is used outside MenuProvider', () => {
    // Suppress React error boundary console noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useMenu())).toThrow(
      'useMenu must be used within MenuProvider'
    );
    spy.mockRestore();
  });

  it('should not update state after unmount', async () => {
    let resolvePromise;
    global.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = renderHook(() => useMenu(), { wrapper });
    unmount();

    // Resolve after unmount — should not cause React state update warning
    resolvePromise({
      ok: true,
      json: () => Promise.resolve({ menu: [{ name: 'Late' }] }),
    });

    // Give it a tick to process
    await new Promise((r) => setTimeout(r, 50));

    // Verify no React state-update-after-unmount warnings were logged
    const stateUpdateWarnings = spy.mock.calls.filter((call) =>
      call.some((arg) => typeof arg === 'string' && arg.includes('unmounted'))
    );
    expect(stateUpdateWarnings).toHaveLength(0);
    spy.mockRestore();
  });
});
