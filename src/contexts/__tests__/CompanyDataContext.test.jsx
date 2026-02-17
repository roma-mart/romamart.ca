import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { CompanyDataProvider, useCompanyData } from '../CompanyDataContext';

// Mock static company data
vi.mock('../../config/company_data', () => ({
  default: {
    legalName: 'Static Corp',
    gstNumber: '123456789RT0001',
    contact: {
      phone: '555-0100',
      email: 'static@example.com',
      web3FormsAccessKey: 'secret-local-key',
    },
    socialLinks: { facebook: 'https://facebook.com/static' },
    onlineStoreUrl: 'https://static-store.example.com',
    location: {
      address: { formatted: '123 Static St' },
      contact: { phone: '555-0100', email: 'static@example.com' },
      google: { placeId: 'static-place-id' },
      hours: { daily: { Monday: '9 AM - 9 PM' } },
    },
  },
}));

describe('CompanyDataContext', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }) => <CompanyDataProvider>{children}</CompanyDataProvider>;

  it('should initialize with static COMPANY_DATA', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useCompanyData(), { wrapper });

    expect(result.current.companyData.legalName).toBe('Static Corp');
    expect(result.current.source).toBe('static');
    expect(result.current.loading).toBe(true);
  });

  it('should merge API data with static config on success', async () => {
    const apiCompanyData = {
      legalName: 'API Corp Ltd',
      gstNumber: '987654321RT0001',
      contact: {
        phone: '555-0200',
        email: 'api@example.com',
        web3FormsAccessKey: 'api-provided-key',
      },
      socialLinks: { facebook: 'https://facebook.com/api', instagram: 'https://instagram.com/api' },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, companyData: apiCompanyData }),
      })
    );

    const { result } = renderHook(() => useCompanyData(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // API data should override static
    expect(result.current.companyData.legalName).toBe('API Corp Ltd');
    expect(result.current.companyData.gstNumber).toBe('987654321RT0001');
    // API-provided web3FormsAccessKey should take precedence
    expect(result.current.companyData.contact.web3FormsAccessKey).toBe('api-provided-key');
    // API contact fields should override
    expect(result.current.companyData.contact.phone).toBe('555-0200');
    expect(result.current.source).toBe('api');
    expect(result.current.error).toBe('');
  });

  it('should fall back to static web3FormsAccessKey when API omits it', async () => {
    const apiCompanyData = {
      legalName: 'API Corp Ltd',
      contact: {
        phone: '555-0200',
        email: 'api@example.com',
        // web3FormsAccessKey intentionally omitted
      },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, companyData: apiCompanyData }),
      })
    );

    const { result } = renderHook(() => useCompanyData(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Static web3FormsAccessKey should be preserved when API doesn't provide one
    expect(result.current.companyData.contact.web3FormsAccessKey).toBe('secret-local-key');
    // Other API fields should still override
    expect(result.current.companyData.contact.phone).toBe('555-0200');
    expect(result.current.source).toBe('api');
  });

  it('should fall back to static data on non-ok response', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));

    const { result } = renderHook(() => useCompanyData(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.companyData.legalName).toBe('Static Corp');
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

    const { result } = renderHook(() => useCompanyData(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.companyData.legalName).toBe('Static Corp');
    expect(result.current.source).toBe('static');
    expect(result.current.error).toBeTruthy();
  });

  it('should fall back to static data on network error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network down')));

    const { result } = renderHook(() => useCompanyData(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.companyData.legalName).toBe('Static Corp');
    expect(result.current.source).toBe('static');
    expect(result.current.error).toBe('Network down');
  });

  it('should throw when useCompanyData is used outside CompanyDataProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCompanyData())).toThrow('useCompanyData must be used within CompanyDataProvider');
    spy.mockRestore();
  });

  it('should provide getContextualEmail that returns fallback when no contextualEmails configured', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useCompanyData(), { wrapper });

    expect(typeof result.current.getContextualEmail).toBe('function');
    // With no contextualEmails in the mock data, should return the hardcoded fallback
    expect(result.current.getContextualEmail('privacy')).toBe('contact@romamart.ca');
  });
});
