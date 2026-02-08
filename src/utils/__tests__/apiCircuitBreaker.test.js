import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ApiCircuitBreaker,
  createApiCircuitBreaker,
  circuitBreakers,
} from '../apiCircuitBreaker';

describe('ApiCircuitBreaker', () => {
  beforeEach(() => {
    vi.stubGlobal('import', { meta: { env: { DEV: true } } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use default options', () => {
      const breaker = new ApiCircuitBreaker();
      expect(breaker.failureThreshold).toBe(5);
      expect(breaker.resetAfterMs).toBe(60 * 60 * 1000);
      expect(breaker.apiName).toBe('API');
      expect(breaker.failureCount).toBe(0);
      expect(breaker.isOpen).toBe(false);
    });

    it('should accept custom options', () => {
      const breaker = new ApiCircuitBreaker({
        failureThreshold: 3,
        resetAfterMs: 30000,
        apiName: 'Test API',
      });
      expect(breaker.failureThreshold).toBe(3);
      expect(breaker.resetAfterMs).toBe(30000);
      expect(breaker.apiName).toBe('Test API');
    });
  });

  describe('recordFailure', () => {
    it('should count 429 status as quota error', () => {
      const breaker = new ApiCircuitBreaker();
      breaker.recordFailure(429);
      expect(breaker.failureCount).toBe(1);
    });

    it('should count 403 status as quota error', () => {
      const breaker = new ApiCircuitBreaker();
      breaker.recordFailure(403);
      expect(breaker.failureCount).toBe(1);
    });

    it('should count 402 status as quota error', () => {
      const breaker = new ApiCircuitBreaker();
      breaker.recordFailure(402);
      expect(breaker.failureCount).toBe(1);
    });

    it('should ignore non-quota error codes', () => {
      const breaker = new ApiCircuitBreaker();
      breaker.recordFailure(500);
      breaker.recordFailure(404);
      breaker.recordFailure(503);
      expect(breaker.failureCount).toBe(0);
    });

    it('should extract status from Error with .status', () => {
      const breaker = new ApiCircuitBreaker();
      const err = new Error('Rate limited');
      err.status = 429;
      breaker.recordFailure(err);
      expect(breaker.failureCount).toBe(1);
    });

    it('should extract status from Error with .statusCode', () => {
      const breaker = new ApiCircuitBreaker();
      const err = new Error('Forbidden');
      err.statusCode = 403;
      breaker.recordFailure(err);
      expect(breaker.failureCount).toBe(1);
    });

    it('should ignore Error objects without quota status', () => {
      const breaker = new ApiCircuitBreaker();
      const err = new Error('Network failure');
      breaker.recordFailure(err);
      expect(breaker.failureCount).toBe(0);
    });

    it('should return false when circuit stays closed', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 3 });
      expect(breaker.recordFailure(429)).toBe(false);
      expect(breaker.recordFailure(429)).toBe(false);
    });

    it('should return true when circuit just opens', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 3 });
      breaker.recordFailure(429);
      breaker.recordFailure(429);
      expect(breaker.recordFailure(429)).toBe(true);
      expect(breaker.isOpen).toBe(true);
    });

    it('should return false for subsequent failures after opening', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 2 });
      breaker.recordFailure(429);
      breaker.recordFailure(429); // opens here
      expect(breaker.recordFailure(429)).toBe(false); // already open
    });

    it('should record lastFailureTime', () => {
      const breaker = new ApiCircuitBreaker();
      const before = Date.now();
      breaker.recordFailure(429);
      expect(breaker.lastFailureTime).toBeGreaterThanOrEqual(before);
      expect(breaker.lastFailureTime).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('state transitions', () => {
    it('should transition from CLOSED to OPEN at threshold', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 3 });
      expect(breaker.isOpen).toBe(false);

      breaker.recordFailure(429);
      breaker.recordFailure(429);
      expect(breaker.isOpen).toBe(false);

      breaker.recordFailure(429);
      expect(breaker.isOpen).toBe(true);
    });
  });

  describe('shouldAttemptCall', () => {
    it('should return true when circuit is closed', () => {
      const breaker = new ApiCircuitBreaker();
      expect(breaker.shouldAttemptCall()).toBe(true);
    });

    it('should return false when circuit is open and timeout not expired', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 1, resetAfterMs: 60000 });
      breaker.recordFailure(429);
      expect(breaker.shouldAttemptCall()).toBe(false);
    });

    it('should return true after timeout expires (auto-reset)', () => {
      vi.useFakeTimers();
      const breaker = new ApiCircuitBreaker({ failureThreshold: 1, resetAfterMs: 60000 });

      breaker.recordFailure(429);
      expect(breaker.shouldAttemptCall()).toBe(false);

      vi.advanceTimersByTime(60001);
      expect(breaker.shouldAttemptCall()).toBe(true);
      expect(breaker.isOpen).toBe(false);
      expect(breaker.failureCount).toBe(0);

      vi.useRealTimers();
    });
  });

  describe('getStatus', () => {
    it('should report closed state', () => {
      const breaker = new ApiCircuitBreaker({ apiName: 'Test' });
      const status = breaker.getStatus();
      expect(status.isOpen).toBe(false);
      expect(status.failureCount).toBe(0);
      expect(status.quotaExceeded).toBe(false);
      expect(status.timeUntilReset).toBe(0);
      expect(status.apiName).toBe('Test');
    });

    it('should report open state with timeUntilReset', () => {
      vi.useFakeTimers();
      const breaker = new ApiCircuitBreaker({ failureThreshold: 1, resetAfterMs: 60000 });
      breaker.recordFailure(429);

      const status = breaker.getStatus();
      expect(status.isOpen).toBe(true);
      expect(status.failureCount).toBe(1);
      expect(status.quotaExceeded).toBe(true);
      expect(status.timeUntilReset).toBeGreaterThan(0);
      expect(status.timeUntilReset).toBeLessThanOrEqual(60000);

      vi.useRealTimers();
    });

    it('should decrease timeUntilReset as time passes', () => {
      vi.useFakeTimers();
      const breaker = new ApiCircuitBreaker({ failureThreshold: 1, resetAfterMs: 60000 });
      breaker.recordFailure(429);

      vi.advanceTimersByTime(30000);
      const status = breaker.getStatus();
      expect(status.timeUntilReset).toBeLessThanOrEqual(30000);
      expect(status.timeUntilReset).toBeGreaterThan(0);

      vi.useRealTimers();
    });
  });

  describe('recordSuccess', () => {
    it('should clear failure count and close circuit', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 2 });
      breaker.recordFailure(429);
      breaker.recordFailure(429); // now open

      breaker.recordSuccess();
      expect(breaker.failureCount).toBe(0);
      expect(breaker.isOpen).toBe(false);
      expect(breaker.lastFailureTime).toBeNull();
    });

    it('should be a no-op when already in clean state', () => {
      const breaker = new ApiCircuitBreaker();
      breaker.recordSuccess();
      expect(breaker.failureCount).toBe(0);
      expect(breaker.isOpen).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state in DEV mode', () => {
      const breaker = new ApiCircuitBreaker({ failureThreshold: 2 });
      breaker.recordFailure(429);
      breaker.recordFailure(429);

      breaker.reset();
      expect(breaker.failureCount).toBe(0);
      expect(breaker.isOpen).toBe(false);
      expect(breaker.lastFailureTime).toBeNull();
    });
  });
});

describe('createApiCircuitBreaker', () => {
  it('should create an instance with given name', () => {
    const breaker = createApiCircuitBreaker('My API');
    expect(breaker).toBeInstanceOf(ApiCircuitBreaker);
    expect(breaker.apiName).toBe('My API');
    expect(breaker.failureThreshold).toBe(5);
  });

  it('should allow overriding defaults', () => {
    const breaker = createApiCircuitBreaker('My API', { failureThreshold: 10 });
    expect(breaker.failureThreshold).toBe(10);
    expect(breaker.apiName).toBe('My API');
  });
});

describe('pre-created circuitBreakers', () => {
  it('should have Google Places breaker', () => {
    expect(circuitBreakers.googlePlaces).toBeInstanceOf(ApiCircuitBreaker);
    expect(circuitBreakers.googlePlaces.apiName).toBe('Google Places API');
  });

  it('should have Web3Forms breaker', () => {
    expect(circuitBreakers.web3Forms).toBeInstanceOf(ApiCircuitBreaker);
    expect(circuitBreakers.web3Forms.apiName).toBe('Web3Forms API');
  });

  it('should have Reviews breaker', () => {
    expect(circuitBreakers.reviews).toBeInstanceOf(ApiCircuitBreaker);
    expect(circuitBreakers.reviews.apiName).toBe('Reviews API');
  });
});
