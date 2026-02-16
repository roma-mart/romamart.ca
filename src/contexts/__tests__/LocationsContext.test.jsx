import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { LocationsProvider, useLocations } from '../LocationsContext';

// Mock static locations data
vi.mock('../../data/locations', () => ({
  LOCATIONS: [
    { id: 'loc-1', name: 'Downtown' },
    { id: 'loc-2', name: 'Uptown' },
  ],
}));

const STORAGE_KEY = 'roma_mart_selected_location';

describe('LocationsContext', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }) => <LocationsProvider>{children}</LocationsProvider>;

  it('should initialize with static LOCATIONS and selectedLocationId="auto"', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useLocations(), { wrapper });
    expect(result.current.locations).toEqual([
      { id: 'loc-1', name: 'Downtown' },
      { id: 'loc-2', name: 'Uptown' },
    ]);
    expect(result.current.selectedLocationId).toBe('auto');
    expect(result.current.source).toBe('static');
  });

  it('should read selectedLocationId from localStorage on init', () => {
    localStorage.setItem(STORAGE_KEY, 'loc-2');
    global.fetch = vi.fn(() => new Promise(() => {}));

    const { result } = renderHook(() => useLocations(), { wrapper });
    expect(result.current.selectedLocationId).toBe('loc-2');
  });

  it('should replace locations with API data on success', async () => {
    const apiLocations = [
      { id: 'api-1', name: 'API Location A', services: [], amenities: [] },
      { id: 'api-2', name: 'API Location B', services: [], amenities: [] },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, locations: apiLocations }),
      })
    );

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.locations).toHaveLength(2);
    expect(result.current.locations[0].id).toBe('api-1');
    expect(result.current.locations[0].services).toEqual([]);
    expect(result.current.source).toBe('api');
    expect(result.current.error).toBe('');
  });

  it('should normalize API locations with images to photos format', async () => {
    const apiLocations = [
      {
        id: 'loc-wellington-001',
        name: 'Wellington',
        services: ['svc-atm-001'],
        amenities: [{ name: 'Wi-Fi', value: true }],
        images: {
          storefront: 'https://cdn.example.com/storefront.jpg',
          interior: 'https://cdn.example.com/interior.jpg',
        },
      },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, locations: apiLocations }),
      })
    );

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const loc = result.current.locations[0];
    expect(loc.photos).toBeDefined();
    expect(loc.photos.primary).toBe('https://cdn.example.com/storefront.jpg');
    expect(loc.photos.interior).toEqual(['https://cdn.example.com/interior.jpg']);
    expect(loc.photos.exterior).toEqual(['https://cdn.example.com/storefront.jpg']);
  });

  it('should fall back to static data on non-ok response', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.locations).toEqual([
      { id: 'loc-1', name: 'Downtown' },
      { id: 'loc-2', name: 'Uptown' },
    ]);
    expect(result.current.source).toBe('static');
    expect(result.current.error).toBeTruthy();
  });

  it('should fall back to static data on invalid API response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      })
    );

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.source).toBe('static');
    expect(result.current.error).toBeTruthy();
  });

  it('should fall back to static data on network error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Offline')));

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.source).toBe('static');
    expect(result.current.error).toBe('Offline');
  });

  it('should persist selection to localStorage via selectLocation', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            locations: [
              { id: 'loc-1', name: 'Downtown' },
              { id: 'loc-2', name: 'Uptown' },
            ],
          }),
      })
    );

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.selectLocation('loc-2');
    });

    expect(result.current.selectedLocationId).toBe('loc-2');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('loc-2');
  });

  it('should remove localStorage key when selecting "auto"', async () => {
    localStorage.setItem(STORAGE_KEY, 'loc-1');
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            locations: [{ id: 'loc-1', name: 'Downtown' }],
          }),
      })
    );

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.selectLocation('auto');
    });

    expect(result.current.selectedLocationId).toBe('auto');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('should reset selection when saved ID no longer exists in locations', async () => {
    // Saved ID is 'loc-999' which won't exist in API response
    localStorage.setItem(STORAGE_KEY, 'loc-999');

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            locations: [{ id: 'loc-1', name: 'Downtown' }],
          }),
      })
    );

    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.selectedLocationId).toBe('auto');
    });
  });

  it('should throw when useLocations is used outside LocationsProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useLocations())).toThrow('useLocations must be used within LocationsProvider');
    spy.mockRestore();
  });

  it('should only call fetch once on mount', async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, locations: [] }),
      })
    );
    global.fetch = fetchSpy;

    renderHook(() => useLocations(), { wrapper });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
