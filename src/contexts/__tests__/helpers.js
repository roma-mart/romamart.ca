/**
 * Test helpers for API fetch mocking.
 * Provides a mock Response factory compatible with fetchWithEtag's header reads.
 */

/**
 * Create a mock fetch Response with headers.get() support.
 *
 * @param {Object} options
 * @param {boolean} options.ok - HTTP ok status
 * @param {number} [options.status] - HTTP status code (default 200 or 500)
 * @param {Function} [options.json] - json() resolver
 * @param {Object} [options.headers] - Headers map (lowercase keys)
 * @returns {Object} Mock Response
 */
export function mockResponse({ ok, status, json, headers = {} }) {
  return {
    ok,
    status: status ?? (ok ? 200 : 500),
    json: json ?? (() => Promise.resolve({})),
    headers: {
      get: (name) => headers[name.toLowerCase()] ?? null,
    },
  };
}
