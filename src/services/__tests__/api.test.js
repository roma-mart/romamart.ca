/**
 * api.js tests -- validates compliance API service layer.
 *
 * Since COMPLIANCE_API_URL is set at module import time from import.meta.env.VITE_API_URL,
 * the default test environment (no VITE_API_URL) exercises the mock delegation path.
 * For fetch-path tests, we use a separate describe block that re-imports with the env set.
 */

describe('complianceApi (mock delegation)', () => {
  let complianceApi, complianceGet, compliancePost, compliancePatch;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../api.js');
    complianceApi = mod.complianceApi;
    complianceGet = mod.complianceGet;
    compliancePost = mod.compliancePost;
    compliancePatch = mod.compliancePatch;
  });

  it('delegates to mockApi when VITE_API_URL is not set', async () => {
    const result = await complianceApi('/auth/me', { method: 'GET' });
    // Mock API returns SESSION_EXPIRED when not logged in
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('SESSION_EXPIRED');
  });

  it('processes login through mock API successfully', async () => {
    const result = await complianceApi('/auth/login', {
      method: 'POST',
      body: { phone: '5191234567', pin: '1234' },
    });
    expect(result.success).toBe(true);
    expect(result.data.employee.role).toBe('staff');
    expect(result.data.accessToken).toBeTruthy();
  });

  it('passes accessToken to mock API', async () => {
    const loginResult = await complianceApi('/auth/login', {
      method: 'POST',
      body: { phone: '5191234567', pin: '1234' },
    });
    const token = loginResult.data.accessToken;

    const result = await complianceApi('/logs', {
      method: 'GET',
      accessToken: token,
    });
    expect(result.success).toBe(true);
  });

  it('complianceGet convenience method works', async () => {
    const result = await complianceGet('/auth/me');
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('SESSION_EXPIRED');
  });

  it('compliancePost convenience method works', async () => {
    const result = await compliancePost('/auth/login', { phone: '5191234567', pin: '1234' });
    expect(result.success).toBe(true);
    expect(result.data.employee.name).toBe('Test Staff');
  });

  it('compliancePatch convenience method passes body', async () => {
    // PATCH without auth should return SESSION_EXPIRED
    const result = await compliancePatch('/logs/1', { notes: 'updated' });
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('SESSION_EXPIRED');
  });
});

describe('complianceApi (fetch path)', () => {
  let complianceApi, complianceCircuitBreaker;
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    vi.resetModules();

    // Set VITE_API_URL to enable the real fetch path
    vi.stubEnv('VITE_API_URL', 'https://api.test.com');

    const mod = await import('../api.js');
    complianceApi = mod.complianceApi;
    complianceCircuitBreaker = mod.complianceCircuitBreaker;

    // Reset circuit breaker state
    complianceCircuitBreaker.reset?.();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it('builds URL correctly with /api/compliance prefix (HSC-09)', async () => {
    let capturedUrl;
    globalThis.fetch = vi.fn(async (url) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await complianceApi('/auth/login', { method: 'POST', body: { phone: '123', pin: '1234' } });
    expect(capturedUrl).toBe('https://api.test.com/api/compliance/auth/login');
  });

  it('includes credentials:include on every request (HSC-02)', async () => {
    let capturedOptions;
    globalThis.fetch = vi.fn(async (url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await complianceApi('/auth/me', { method: 'GET' });
    expect(capturedOptions.credentials).toBe('include');
  });

  it('includes Authorization header when accessToken provided (HSC-01)', async () => {
    let capturedOptions;
    globalThis.fetch = vi.fn(async (url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await complianceApi('/logs', { method: 'GET', accessToken: 'my-token' });
    expect(capturedOptions.headers['Authorization']).toBe('Bearer my-token');
  });

  it('does not include Authorization header without accessToken', async () => {
    let capturedOptions;
    globalThis.fetch = vi.fn(async (url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await complianceApi('/auth/me', { method: 'GET' });
    expect(capturedOptions.headers['Authorization']).toBeUndefined();
  });

  it('parses 401 as SESSION_EXPIRED', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ success: false, error: { code: 'SESSION_EXPIRED' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
    );

    const result = await complianceApi('/auth/me', { method: 'GET' });
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('SESSION_EXPIRED');
  });

  it('parses 429 as RATE_LIMITED with retryAfter', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            success: false,
            error: { code: 'RATE_LIMITED', message: 'Too many attempts', retryAfter: 900 },
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
    );

    const result = await complianceApi('/auth/login', { method: 'POST', body: {} });
    expect(result.error.code).toBe('RATE_LIMITED');
    expect(result.error.retryAfter).toBe(900);
  });

  it('parses 422 as VALIDATION_ERROR', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Bad phone', field: 'phone' } }),
          { status: 422, headers: { 'Content-Type': 'application/json' } }
        )
    );

    const result = await complianceApi('/auth/login', { method: 'POST', body: {} });
    expect(result.error.code).toBe('VALIDATION_ERROR');
    expect(result.error.field).toBe('phone');
  });

  it('returns NETWORK_ERROR on fetch failure', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });

    const result = await complianceApi('/auth/me', { method: 'GET' });
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('NETWORK_ERROR');
  });

  it('returns TIMEOUT on abort', async () => {
    globalThis.fetch = vi.fn(async (url, options) => {
      // Simulate slow response by waiting for abort
      return new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const err = new DOMException('The operation was aborted.', 'AbortError');
          reject(err);
        });
      });
    });

    vi.useFakeTimers();
    const promise = complianceApi('/logs', { method: 'GET' });
    // Advance past the read timeout (10s)
    vi.advanceTimersByTime(10001);
    const result = await promise;
    vi.useRealTimers();

    expect(result.success).toBe(false);
    expect(result.error.code).toBe('TIMEOUT');
  });

  it('returns CIRCUIT_OPEN when circuit breaker is open', async () => {
    // Trip the circuit breaker with quota-related errors (429/403/402 only)
    for (let i = 0; i < 5; i++) {
      complianceCircuitBreaker.recordFailure(429);
    }

    const result = await complianceApi('/logs', { method: 'GET' });
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('CIRCUIT_OPEN');
  });
});
