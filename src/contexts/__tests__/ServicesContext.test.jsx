import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ServicesProvider, useServices } from '../ServicesContext';

// Mock the static services data to avoid importing JSX icon components
vi.mock('../../data/services', () => ({
  SERVICES: [
    { id: 'static-1', name: 'Static Service A' },
    { id: 'static-2', name: 'Static Service B' },
  ],
}));

describe('ServicesContext', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }) => <ServicesProvider>{children}</ServicesProvider>;

  it('should initialize with static SERVICES data', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useServices(), { wrapper });
    expect(result.current.services).toEqual([
      { id: 'static-1', name: 'Static Service A' },
      { id: 'static-2', name: 'Static Service B' },
    ]);
    expect(result.current.source).toBe('static');
  });

  it('should replace services with API data on success', async () => {
    const apiServices = [
      { id: 'api-1', name: 'API Service X' },
      { id: 'api-2', name: 'API Service Y' },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, services: apiServices }),
      })
    );

    const { result } = renderHook(() => useServices(), { wrapper });

    await waitFor(() => {
      expect(result.current.source).toBe('api');
    });

    // Normalized services should have availableAt and features arrays
    expect(result.current.services).toHaveLength(2);
    expect(result.current.services[0].id).toBe('api-1');
    expect(result.current.services[0].availableAt).toEqual([]);
    expect(result.current.services[0].features).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should normalize API services with availableAt and features', async () => {
    const apiServices = [
      {
        id: 'svc-atm-001',
        name: 'ATM',
        category: 'financial_services',
        availableAt: ['loc-wellington-001'],
        features: ['Cash withdrawal', 'Balance check'],
      },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, services: apiServices }),
      })
    );

    const { result } = renderHook(() => useServices(), { wrapper });

    await waitFor(() => {
      expect(result.current.source).toBe('api');
    });

    expect(result.current.services[0].availableAt).toEqual(['loc-wellington-001']);
    expect(result.current.services[0].features).toEqual(['Cash withdrawal', 'Balance check']);
    expect(result.current.services[0].category).toBe('financial_services');
  });

  it('should fall back to static data on non-ok response', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));

    const { result } = renderHook(() => useServices(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.services).toEqual([
      { id: 'static-1', name: 'Static Service A' },
      { id: 'static-2', name: 'Static Service B' },
    ]);
    expect(result.current.source).toBe('static');
  });

  it('should fall back to static data on invalid API response structure', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      })
    );

    const { result } = renderHook(() => useServices(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.source).toBe('static');
  });

  it('should fall back to static data on network error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network down')));

    const { result } = renderHook(() => useServices(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.services).toEqual([
      { id: 'static-1', name: 'Static Service A' },
      { id: 'static-2', name: 'Static Service B' },
    ]);
    expect(result.current.source).toBe('static');
    expect(result.current.error).toBe('Network down');
  });

  it('should throw when useServices is used outside ServicesProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useServices())).toThrow('useServices must be used within ServicesProvider');
    spy.mockRestore();
  });
});
