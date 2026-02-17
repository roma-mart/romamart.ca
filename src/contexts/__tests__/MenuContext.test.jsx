import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MenuProvider, useMenu } from '../MenuContext';

// Mock static menu data for fallback testing
vi.mock('../../data/rocafe-menu', () => ({
  ROCAFE_FULL_MENU: [
    { id: 'static-1', name: 'Static Latte', featured: true, sizes: [{ name: 'M', price: 4.49 }] },
    { id: 'static-2', name: 'Static Espresso', featured: false, sizes: [{ name: 'M', price: 3.49 }] },
  ],
}));

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

  it('should start in loading state with static fallback data', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useMenu(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.menuItems).toHaveLength(2);
    expect(result.current.menuItems[0].name).toBe('Static Latte');
    expect(result.current.source).toBe('static');
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

    // Items are normalized — check they exist and have expected names
    expect(result.current.menuItems).toHaveLength(2);
    expect(result.current.menuItems[0].name).toBe('Latte');
    expect(result.current.source).toBe('api');
    expect(result.current.error).toBe('');
  });

  it('should normalize API menu items with cents prices to dollars', async () => {
    const mockMenu = [
      {
        id: 'cof-latte-001',
        name: 'Latte',
        featured: true,
        category: 'Hot Coffee',
        sizes: [
          { name: 'Medium', price: 449 },
          { name: 'Large', price: 549 },
        ],
        addOns: [{ id: 1, name: 'Extra Shot', price: 100 }],
        availableAt: ['loc-wellington-001'],
      },
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

    // Prices should be converted from cents to dollars
    expect(result.current.menuItems[0].sizes[0].price).toBe(4.49);
    expect(result.current.menuItems[0].sizes[1].price).toBe(5.49);
    expect(result.current.menuItems[0].addOns[0].price).toBe(1.0);
    // availableAt should be preserved
    expect(result.current.menuItems[0].availableAt).toEqual(['loc-wellington-001']);
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
    // Should fall back to static data
    expect(result.current.menuItems).toHaveLength(2);
    expect(result.current.menuItems[0].name).toBe('Static Latte');
    expect(result.current.source).toBe('static');
  });

  it('should fall back to static data on network failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    // Should fall back to static data
    expect(result.current.menuItems).toHaveLength(2);
    expect(result.current.menuItems[0].name).toBe('Static Latte');
    expect(result.current.source).toBe('static');
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

    // Empty API response is valid — overrides static fallback
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.source).toBe('api');
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

    // Missing menu key treated as empty valid response
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.source).toBe('api');
  });

  it('should throw when useMenu is used outside MenuProvider', () => {
    // Suppress React error boundary console noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useMenu())).toThrow('useMenu must be used within MenuProvider');
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

    // Flush microtasks from the resolved fetch promise
    await Promise.resolve();
    await Promise.resolve();

    // Verify no React state-update-after-unmount warnings were logged
    const stateUpdateWarnings = spy.mock.calls.filter((call) =>
      call.some((arg) => typeof arg === 'string' && arg.includes('unmounted'))
    );
    expect(stateUpdateWarnings).toHaveLength(0);
    spy.mockRestore();
  });
});
