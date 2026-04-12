import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiUrl, apiHeaders, fetchWithEtag } from '../api';
import { mockResponse } from '../../contexts/__tests__/helpers';

describe('api utility', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('apiUrl', () => {
    it('should return the exact path in dev mode', () => {
      vi.stubEnv('DEV', true);
      const result = apiUrl('/api/v1/public-menu');
      expect(result).toBe('/api/v1/public-menu');
    });

    it('should return absolute URL with base in prod mode', () => {
      vi.stubEnv('DEV', false);
      vi.stubEnv('VITE_API_BASE_URL', 'https://example.com');
      const result = apiUrl('/api/v1/public-menu');
      expect(result).toBe('https://example.com/api/v1/public-menu');
    });

    it('should strip trailing slashes from base URL', () => {
      vi.stubEnv('DEV', false);
      vi.stubEnv('VITE_API_BASE_URL', 'https://example.com/');
      const result = apiUrl('/api/v1/public-menu');
      expect(result).toBe('https://example.com/api/v1/public-menu');
    });
  });

  describe('apiHeaders', () => {
    it('should return empty object when VITE_API_KEY is not set', () => {
      const headers = apiHeaders();
      expect(headers).toEqual({});
    });

    it('should include X-API-Key when VITE_API_KEY is set', () => {
      vi.stubEnv('VITE_API_KEY', 'test-key-123');
      const headers = apiHeaders();
      expect(headers['X-API-Key']).toBe('test-key-123');
    });
  });

  describe('fetchWithEtag', () => {
    it('should return parsed data on 200 response', async () => {
      const payload = { menu: [{ name: 'Latte' }] };
      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: true,
            status: 200,
            json: () => Promise.resolve(payload),
          })
        )
      );

      const result = await fetchWithEtag('/api/v1/public-menu');

      expect(result.data).toEqual(payload);
      expect(result.status).toBe(200);
      expect(result.fromCache).toBe(false);
      expect(result.errorBody).toBeNull();
    });

    it('should store and send ETag for conditional requests', async () => {
      const payload = { menu: [{ name: 'Latte' }] };
      // First request returns ETag
      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: true,
            status: 200,
            json: () => Promise.resolve(payload),
            headers: { etag: '"abc123"' },
          })
        )
      );

      await fetchWithEtag('/api/v1/test-etag');

      // Second request should send If-None-Match
      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: false,
            status: 304,
            headers: { etag: '"abc123"' },
          })
        )
      );

      const result = await fetchWithEtag('/api/v1/test-etag');

      // Should have sent If-None-Match header
      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[1].headers['If-None-Match']).toBe('"abc123"');

      // Should return cached data
      expect(result.status).toBe(304);
      expect(result.fromCache).toBe(true);
      expect(result.data).toEqual(payload);
    });

    it('should return null data on non-ok response with parsed error body', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: false,
            status: 429,
            json: () =>
              Promise.resolve({
                error: 'Too many requests',
                code: 'RATE_LIMITED',
                requestId: 'req-xyz',
              }),
          })
        )
      );

      const result = await fetchWithEtag('/api/v1/public-menu');

      expect(result.data).toBeNull();
      expect(result.status).toBe(429);
      expect(result.errorBody.error).toBe('Too many requests');
      expect(result.errorBody.code).toBe('RATE_LIMITED');
      expect(result.errorBody.requestId).toBe('req-xyz');
    });

    it('should handle non-JSON error responses gracefully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: false,
            status: 502,
            json: () => Promise.reject(new Error('not json')),
          })
        )
      );

      const result = await fetchWithEtag('/api/v1/public-menu');

      expect(result.data).toBeNull();
      expect(result.status).toBe(502);
      expect(result.errorBody.error).toBe('HTTP 502');
      expect(result.errorBody.code).toBeNull();
    });

    it('should include API key header when VITE_API_KEY is set', async () => {
      vi.stubEnv('VITE_API_KEY', 'my-api-key');

      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: true,
            json: () => Promise.resolve({ data: [] }),
          })
        )
      );

      await fetchWithEtag('/api/v1/public-services');

      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[1].headers['X-API-Key']).toBe('my-api-key');
    });

    it('should proactively open circuit breaker when rate limit exhausted', async () => {
      const mockBreaker = {
        failureThreshold: 5,
        failureCount: 0,
        isOpen: false,
        lastFailureTime: null,
        resetAfterMs: 3600000,
        _proactivelyOpened: false,
        openProactively: vi.fn(function (resetMs) {
          this.failureCount = this.failureThreshold;
          this.isOpen = true;
          this.lastFailureTime = Date.now();
          this._proactivelyOpened = true;
          if (resetMs && resetMs > 0) this.resetAfterMs = resetMs;
        }),
      };

      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ data: [] }),
            headers: {
              'x-ratelimit-remaining': '0',
              'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 300),
            },
          })
        )
      );

      await fetchWithEtag('/api/v1/test-rate-limit', { circuitBreaker: mockBreaker });

      expect(mockBreaker.openProactively).toHaveBeenCalled();
      expect(mockBreaker.isOpen).toBe(true);
      expect(mockBreaker.failureCount).toBe(5);
    });

    it('should handle Headers instance in fetch options', async () => {
      const incomingHeaders = new Headers({ 'X-Custom': 'value1' });

      global.fetch = vi.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: true,
            json: () => Promise.resolve({ data: [] }),
          })
        )
      );

      await fetchWithEtag('/api/v1/public-menu', { headers: incomingHeaders });

      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[1].headers['X-Custom'] || fetchCall[1].headers['x-custom']).toBe('value1');
    });
  });
});
