/**
 * API Circuit Breaker Utility
 * 
 * Implements the Circuit Breaker pattern for protecting against API quota exhaustion.
 * Detects repeated failures (429, 403, 402 errors) and stops API calls to prevent
 * wasting quota when the service is down or quota is exceeded.
 * 
 * ARCHITECTURE:
 * - Reusable across any API integration (Google Places, Web3Forms, etc.)
 * - Fail-fast pattern: stops retrying after threshold reached
 * - Auto-resets after timeout to attempt recovery
 * - Integrates with fallback/offline strategies
 * 
 * USAGE:
 *   const breaker = new ApiCircuitBreaker({ failureThreshold: 5, resetAfterMs: 3600000 });
 *   if (breaker.shouldAttemptCall()) {
 *     try {
 *       const response = await fetch(...);
 *       if (!response.ok) breaker.recordFailure(response.status);
 *     } catch (error) {
 *       breaker.recordFailure(error);
 *     }
 *   }
 *   breaker.getStatus();
 * 
 * @module utils/apiCircuitBreaker
 */

/**
 * Circuit Breaker for API resilience
 * 
 * States:
 * - CLOSED: Normal operation, API calls allowed
 * - OPEN: Too many failures detected, API calls blocked
 * - HALF_OPEN: Testing recovery (resets periodically)
 */
export class ApiCircuitBreaker {
  constructor(options = {}) {
    const {
      failureThreshold = 5,        // Number of failures before opening
      resetAfterMs = 60 * 60 * 1000, // 1 hour default
      apiName = 'API'               // For logging/identification
    } = options;

    this.failureThreshold = failureThreshold;
    this.resetAfterMs = resetAfterMs;
    this.apiName = apiName;

    this.failureCount = 0;
    this.lastFailureTime = null;
    this.isOpen = false;
  }

  /**
   * Record a failed API call
   * Only counts quota-related errors: 429 (rate limit), 403/402 (forbidden/quota)
   * 
   * @param {number|Error} statusOrError - HTTP status code or Error object
   * @returns {boolean} True if circuit just opened due to this failure
   */
  recordFailure(statusOrError) {
    // Extract HTTP status if error object passed
    let httpStatus = statusOrError;
    if (statusOrError instanceof Error) {
      httpStatus = statusOrError.status || statusOrError.statusCode;
    }

    // Only count quota/rate-limit errors (not generic network errors)
    const isQuotaError = [429, 403, 402].includes(httpStatus);
    if (!isQuotaError) {
      return false;
    }

    this.failureCount++;
    this.lastFailureTime = Date.now();

    const justOpened = this.failureCount >= this.failureThreshold && !this.isOpen;
    if (justOpened) {
      this.isOpen = true;
      if (import.meta.env.DEV) {
        console.error(
          `🚨 CIRCUIT BREAKER OPEN [${this.apiName}]: ` +
          `${this.failureCount} failures detected. API quota likely exceeded. ` +
          `Falling back to static data. Will retry in ${Math.round(this.resetAfterMs / 1000 / 60)} minutes.`
        );
      }
    }

    return justOpened;
  }

  /**
   * Check if an API call should be attempted
   * 
   * @returns {boolean} True if circuit is closed (call allowed), false if open (blocked)
   */
  shouldAttemptCall() {
    if (!this.isOpen) {
      return true; // Circuit closed, proceed normally
    }

    // Circuit is open - check if timeout expired to attempt recovery
    const timeElapsed = Date.now() - this.lastFailureTime;
    if (timeElapsed > this.resetAfterMs) {
      this.isOpen = false;
      this.failureCount = 0;
      if (import.meta.env.DEV) {
        console.warn(
          `🔄 CIRCUIT BREAKER RESET [${this.apiName}]: ` +
          `Timeout expired. Attempting API calls again.`
        );
      }
      return true; // Try again
    }

    // Still in open/locked state
    return false;
  }

  /**
   * Get current circuit breaker status
   * 
   * @returns {Object} Status object
   *   - isOpen: boolean - Is circuit currently blocking calls?
   *   - failureCount: number - Total failures recorded
   *   - quotaExceeded: boolean - Did we hit quota limit?
   *   - timeUntilReset: number - Milliseconds until auto-reset (if open)
   */
  getStatus() {
    const timeUntilReset = this.isOpen 
      ? Math.max(0, this.resetAfterMs - (Date.now() - this.lastFailureTime))
      : 0;

    return {
      isOpen: this.isOpen,
      failureCount: this.failureCount,
      quotaExceeded: this.failureCount >= this.failureThreshold,
      timeUntilReset,
      apiName: this.apiName
    };
  }

  /**
   * Record successful API call (clears failure count)
   * Safe to use in production
   */
  recordSuccess() {
    if (this.failureCount > 0 || this.isOpen) {
      this.failureCount = 0;
      this.lastFailureTime = null;
      this.isOpen = false;
    }
  }

  /**
   * Manually reset circuit breaker (dev/testing only)
   * 
   * @internal
   */
  reset() {
    if (import.meta.env.DEV) {
      this.isOpen = false;
      this.failureCount = 0;
      this.lastFailureTime = null;
      if (import.meta.env.DEV) {
        console.warn(`🔄 CIRCUIT BREAKER MANUALLY RESET [${this.apiName}]`);
      }
    }
  }
}

/**
 * Factory function for creating circuit breakers with sensible defaults
 * 
 * @param {string} apiName - Name of the API (for logging)
 * @param {Object} options - Override options
 * @returns {ApiCircuitBreaker}
 */
export function createApiCircuitBreaker(apiName, options = {}) {
  return new ApiCircuitBreaker({
    failureThreshold: 5,
    resetAfterMs: 60 * 60 * 1000, // 1 hour
    apiName,
    ...options
  });
}

// Pre-created instances for common APIs
export const circuitBreakers = {
  googlePlaces: createApiCircuitBreaker('Google Places API'),
  web3Forms: createApiCircuitBreaker('Web3Forms API'),
  reviews: createApiCircuitBreaker('Reviews API')
};

export default ApiCircuitBreaker;
