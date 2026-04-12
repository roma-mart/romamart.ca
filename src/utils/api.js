/**
 * Centralized API utilities for Roma Mart public endpoints.
 *
 * Provides:
 * - URL construction (dev proxy vs prod absolute)
 * - ETag-based conditional requests (304 Not Modified)
 * - Optional API key header (future RBAC)
 * - Structured error response parsing
 * - Proactive rate-limit awareness (X-RateLimit-Remaining)
 *
 * @module utils/api
 */

/**
 * Build a full API URL for the given path.
 * Dev: relative URL (Vite proxy handles CORS)
 * Prod: absolute URL to the backend
 *
 * @param {string} path - API path, e.g. '/api/v1/public-menu'
 * @returns {string}
 */
export const apiUrl = (path) => {
  if (import.meta.env.DEV) return path;
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://romamart.netlify.app').replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Build common headers for API requests.
 * Includes X-API-Key when VITE_API_KEY env var is set.
 *
 * @returns {Object} Headers object
 */
export const apiHeaders = () => {
  const headers = {};
  const key = import.meta.env.VITE_API_KEY;
  if (key) headers['X-API-Key'] = key;
  return headers;
};

/** In-memory ETag cache: path → { etag, data } */
const etagCache = new Map();

/**
 * Parse a structured error body from a non-ok API response.
 * Backend returns: { error: string, code: string, requestId: string }
 *
 * @param {Response} res - Fetch Response object
 * @returns {Promise<{error: string, code: string|null, requestId: string|null}>}
 */
async function parseErrorBody(res) {
  try {
    const body = await res.json();
    return {
      error: body.error || `HTTP ${res.status}`,
      code: body.code || null,
      requestId: body.requestId || null,
    };
  } catch {
    return {
      error: `HTTP ${res.status}`,
      code: null,
      requestId: null,
    };
  }
}

/**
 * Check rate-limit headers and warn/act proactively.
 *
 * @param {Response} res - Fetch Response
 * @param {string} path - API path (for logging)
 * @param {Object} [circuitBreaker] - Optional circuit breaker instance
 */
function checkRateLimitHeaders(res, path, circuitBreaker) {
  const remaining = res.headers.get('x-ratelimit-remaining');
  if (remaining === null) return;

  const remainingNum = parseInt(remaining, 10);
  if (Number.isNaN(remainingNum)) return;

  if (remainingNum <= 10 && remainingNum > 0 && import.meta.env.DEV) {
    console.warn(`⚠️ [API] Rate limit low for ${path}: ${remainingNum} requests remaining`);
  }

  if (remainingNum === 0 && circuitBreaker) {
    const resetHeader = res.headers.get('x-ratelimit-reset');
    let resetAfterMs;
    if (resetHeader) {
      const resetTime = parseInt(resetHeader, 10) * 1000; // seconds → ms
      const now = Date.now();
      resetAfterMs = Math.max(resetTime - now, 60_000); // at least 1 minute
    }
    // Proactively open the circuit breaker before a 429 hits
    circuitBreaker.openProactively(resetAfterMs);
    if (import.meta.env.DEV) {
      console.warn(`🚨 [API] Rate limit exhausted for ${path}. Circuit breaker opened proactively.`);
    }
  }
}

/**
 * Fetch an API endpoint with ETag caching, API key, rate-limit awareness,
 * and structured error parsing.
 *
 * @param {string} path - API path, e.g. '/api/v1/public-menu'
 * @param {Object} [options] - Additional fetch options
 * @param {Object} [options.circuitBreaker] - Circuit breaker instance for rate-limit integration
 * @returns {Promise<{data: any, status: number, fromCache: boolean, errorBody: Object|null}>}
 */
export async function fetchWithEtag(path, options = {}) {
  const { circuitBreaker, ...fetchOptions } = options;
  const url = apiUrl(path);
  const cached = etagCache.get(path);

  const headers = { ...apiHeaders() };
  const incomingHeaders = fetchOptions.headers;
  if (incomingHeaders) {
    if (incomingHeaders instanceof Headers) {
      incomingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, incomingHeaders);
    }
  }
  if (cached?.etag) {
    headers['If-None-Match'] = cached.etag;
  }

  const res = await fetch(url, { ...fetchOptions, headers });

  // 304 Not Modified — return cached data
  if (res.status === 304 && cached?.data) {
    checkRateLimitHeaders(res, path, circuitBreaker);
    return { data: cached.data, status: 304, fromCache: true, errorBody: null };
  }

  // Non-ok response — parse structured error
  if (!res.ok) {
    checkRateLimitHeaders(res, path, circuitBreaker);
    const errorBody = await parseErrorBody(res);

    if (import.meta.env.DEV && errorBody.requestId) {
      console.warn(
        `[API] ${path} failed (${res.status} ${errorBody.code || ''}): ${errorBody.error} [requestId: ${errorBody.requestId}]`
      );
    }

    return { data: null, status: res.status, fromCache: false, errorBody };
  }

  // Success — update ETag cache and check rate limits
  checkRateLimitHeaders(res, path, circuitBreaker);

  const data = await res.json();
  const etag = res.headers.get('etag');
  if (etag) {
    etagCache.set(path, { etag, data });
  }

  return { data, status: res.status, fromCache: false, errorBody: null };
}
