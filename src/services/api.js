/**
 * Compliance API Service Layer
 *
 * Centralized fetch wrapper for all /api/compliance/* endpoints.
 * Automatically delegates to mockApi.js when VITE_API_URL is absent.
 *
 * Security constraints enforced:
 * - HSC-01: Access token passed as parameter, never read from storage
 * - HSC-02: credentials:'include' on every request (httpOnly cookie)
 * - HSC-09: URL constructed via URL constructor, never string concatenation
 *
 * @module services/api
 */

import { createApiCircuitBreaker } from '../utils/apiCircuitBreaker';

const COMPLIANCE_API_URL = import.meta.env.VITE_API_URL || null;
const MUTATION_TIMEOUT_MS = 15000;
const READ_TIMEOUT_MS = 10000;

// Separate circuit breaker for compliance API
const complianceCircuitBreaker = createApiCircuitBreaker('Compliance API', {
  failureThreshold: 5,
  resetAfterMs: 60 * 60 * 1000,
});

// Lazy-loaded mock API (only imported when needed)
let mockApiModule = null;

async function getMockApi() {
  if (!mockApiModule) {
    mockApiModule = await import('./mockApi.js');
  }
  return mockApiModule;
}

/**
 * Normalize any API response or error into the standard envelope.
 * @param {Response} response - fetch Response object
 * @returns {Promise<{success: boolean, data?: *, error?: {code: string, message: string, field?: string}}>}
 */
async function parseResponse(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.ok) {
    return body || { success: true };
  }

  // Map HTTP status codes to standard error codes
  const errorCodeMap = {
    401: 'SESSION_EXPIRED',
    403: 'FORBIDDEN',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMITED',
  };

  const errorCode = errorCodeMap[response.status] || 'INTERNAL_ERROR';

  return {
    success: false,
    error: body?.error || {
      code: errorCode,
      message: body?.message || response.statusText || 'Request failed',
      ...(body?.error?.field && { field: body.error.field }),
      ...(body?.error?.retryAfter !== undefined &&
        body?.error?.retryAfter !== null && { retryAfter: body.error.retryAfter }),
    },
  };
}

/**
 * Make an authenticated request to the compliance API.
 *
 * @param {string} path - API path (e.g., '/auth/login'). Will be prefixed with /api/compliance.
 * @param {Object} options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body (will be JSON-serialized)
 * @param {string} [options.accessToken] - In-memory access token (HSC-01)
 * @param {AbortSignal} [options.signal] - External abort signal
 * @returns {Promise<{success: boolean, data?: *, error?: {code: string, message: string, field?: string}}>}
 */
export async function complianceApi(path, options = {}) {
  const { method = 'GET', body, accessToken, signal: externalSignal } = options;

  // If no API URL configured, delegate to mock API
  if (!COMPLIANCE_API_URL) {
    if (import.meta.env.DEV) {
      console.warn('[Compliance API] No VITE_API_URL configured — using mock API');
    }
    const mock = await getMockApi();
    return mock.handleRequest(path, { method, body, accessToken });
  }

  // Check circuit breaker
  if (!complianceCircuitBreaker.shouldAttemptCall()) {
    return {
      success: false,
      error: {
        code: 'CIRCUIT_OPEN',
        message: 'Compliance API temporarily unavailable. Will retry automatically.',
      },
    };
  }

  // Build URL safely (HSC-09)
  const baseUrl = COMPLIANCE_API_URL.replace(/\/+$/, '');
  const fullPath = `/api/compliance${path.startsWith('/') ? path : '/' + path}`;
  const url = new URL(fullPath, baseUrl);

  // Determine timeout based on mutation vs read
  const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method.toUpperCase());
  const timeoutMs = isMutation ? MUTATION_TIMEOUT_MS : READ_TIMEOUT_MS;

  // AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Combine with external signal if provided
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  // Build headers
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method: method.toUpperCase(),
      headers,
      credentials: 'include', // HSC-02: sends httpOnly cookie
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await parseResponse(response);

    // Record circuit breaker status
    if (response.ok) {
      complianceCircuitBreaker.recordSuccess();
    } else if ([429, 403, 402, 500, 502, 503].includes(response.status)) {
      complianceCircuitBreaker.recordFailure(response.status);
    }

    return result;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: `Request timed out after ${timeoutMs}ms`,
        },
      };
    }

    // Network error
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      },
    };
  }
}

/**
 * Convenience methods for common HTTP verbs.
 */
export const complianceGet = (path, options = {}) => complianceApi(path, { ...options, method: 'GET' });

export const compliancePost = (path, body, options = {}) => complianceApi(path, { ...options, method: 'POST', body });

export const compliancePatch = (path, body, options = {}) => complianceApi(path, { ...options, method: 'PATCH', body });

/** Export circuit breaker for status/monitoring. */
export { complianceCircuitBreaker };
