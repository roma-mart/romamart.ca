import { handleRequest, resetMockState } from '../mockApi';

/**
 * Mock API tests -- validates the executable specification for the compliance backend.
 * Tests auth endpoints, RBAC enforcement, rate limiting, and payload validation.
 */

describe('mockApi', () => {
  beforeEach(() => {
    resetMockState();
    vi.useRealTimers();
  });

  // Helper to login and get an access token
  async function loginAs(role = 'staff') {
    const phone = role === 'manager' ? '5199876543' : '5191234567';
    const pin = role === 'manager' ? '0000' : '1234';
    const result = await handleRequest('/auth/login', {
      method: 'POST',
      body: { phone, pin },
    });
    return result;
  }

  describe('POST /auth/login', () => {
    it('returns success with staff credentials', async () => {
      const result = await loginAs('staff');
      expect(result.success).toBe(true);
      expect(result.data.employee).toEqual({
        id: 'emp-001',
        name: 'Test Staff',
        role: 'staff',
        locationId: 'loc-wellington-001',
      });
      expect(result.data.accessToken).toBeTruthy();
    });

    it('returns success with manager credentials', async () => {
      const result = await loginAs('manager');
      expect(result.success).toBe(true);
      expect(result.data.employee.role).toBe('manager');
      expect(result.data.employee.name).toBe('Test Manager');
    });

    it('returns INVALID_CREDENTIALS for wrong PIN', async () => {
      const result = await handleRequest('/auth/login', {
        method: 'POST',
        body: { phone: '5191234567', pin: '9999' },
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('returns VALIDATION_ERROR for invalid phone', async () => {
      const result = await handleRequest('/auth/login', {
        method: 'POST',
        body: { phone: '123', pin: '1234' },
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.field).toBe('phone');
    });

    it('returns VALIDATION_ERROR for invalid PIN', async () => {
      const result = await handleRequest('/auth/login', {
        method: 'POST',
        body: { phone: '5191234567', pin: '12' },
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.field).toBe('pin');
    });

    it('returns VALIDATION_ERROR for missing body', async () => {
      const result = await handleRequest('/auth/login', {
        method: 'POST',
        body: {},
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /auth/me', () => {
    it('returns user info after login', async () => {
      await loginAs('staff');
      const result = await handleRequest('/auth/me', { method: 'GET' });
      expect(result.success).toBe(true);
      expect(result.data.employee.role).toBe('staff');
      expect(result.data.accessToken).toBeTruthy();
    });

    it('returns SESSION_EXPIRED without login', async () => {
      const result = await handleRequest('/auth/me', { method: 'GET' });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('SESSION_EXPIRED');
    });
  });

  describe('POST /auth/logout', () => {
    it('clears session', async () => {
      await loginAs('staff');
      const logoutResult = await handleRequest('/auth/logout', { method: 'POST' });
      expect(logoutResult.success).toBe(true);

      // Verify session is gone
      const meResult = await handleRequest('/auth/me', { method: 'GET' });
      expect(meResult.success).toBe(false);
      expect(meResult.error.code).toBe('SESSION_EXPIRED');
    });
  });

  describe('rate limiting', () => {
    it('returns RATE_LIMITED after 5 failed attempts', async () => {
      const phone = '5191234567';
      // 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await handleRequest('/auth/login', {
          method: 'POST',
          body: { phone, pin: '9999' },
        });
      }

      // 6th attempt should be rate limited
      const result = await handleRequest('/auth/login', {
        method: 'POST',
        body: { phone, pin: '1234' }, // Even correct PIN should be blocked
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('RATE_LIMITED');
      expect(result.error.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('RBAC enforcement', () => {
    it('returns FORBIDDEN when staff calls manager-only endpoint', async () => {
      const loginResult = await loginAs('staff');
      const result = await handleRequest('/signoff', {
        method: 'POST',
        body: {},
        accessToken: loginResult.data.accessToken,
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('FORBIDDEN');
    });

    it('allows manager to call manager-only endpoint', async () => {
      const loginResult = await loginAs('manager');
      // POST /signoff is a stub; it should not return FORBIDDEN for manager
      const result = await handleRequest('/signoff', {
        method: 'POST',
        body: {},
        accessToken: loginResult.data.accessToken,
      });
      // Will get NOT_FOUND since there's no handler, but NOT FORBIDDEN
      expect(result.error?.code).not.toBe('FORBIDDEN');
    });
  });

  describe('authenticated endpoints', () => {
    it('returns SESSION_EXPIRED for unauthenticated /log-entry', async () => {
      const result = await handleRequest('/log-entry', {
        method: 'POST',
        body: { logType: 'temperature' },
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('SESSION_EXPIRED');
    });

    it('returns VALIDATION_ERROR for /log-entry without logType', async () => {
      const loginResult = await loginAs('staff');
      const result = await handleRequest('/log-entry', {
        method: 'POST',
        body: {},
        accessToken: loginResult.data.accessToken,
      });
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.field).toBe('logType');
    });

    it('returns success for valid /log-entry', async () => {
      const loginResult = await loginAs('staff');
      const result = await handleRequest('/log-entry', {
        method: 'POST',
        body: { logType: 'temperature', idempotencyKey: crypto.randomUUID() },
        accessToken: loginResult.data.accessToken,
      });
      expect(result.success).toBe(true);
      expect(result.data.id).toBeTruthy();
      expect(result.data.serverReceivedAt).toBeTruthy();
    });

    it('normalizes /api/compliance prefix', async () => {
      const loginResult = await loginAs('staff');
      const result = await handleRequest('/api/compliance/logs', {
        method: 'GET',
        accessToken: loginResult.data.accessToken,
      });
      expect(result.success).toBe(true);
    });
  });
});
