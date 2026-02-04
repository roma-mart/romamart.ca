# API Circuit Breaker Architecture

> **Purpose:** Explain the circuit breaker pattern and why it's separate from the hook  
> **Status:** Production-ready  
> **Version:** 1.0

---

## Overview

The **Circuit Breaker** is a fault-tolerance pattern that prevents cascading failures when external services become unavailable or hit rate limits.

**In Roma Mart's context:** When Google Places API hits quota or becomes unavailable, we stop hammering the API and gracefully degrade to fallback hours.

---

## Architecture Rationale

### Why Separate from the Hook?

The circuit breaker is extracted to `src/utils/apiCircuitBreaker.js` rather than embedded in `useGooglePlaceHours.js` because:

**1. Reusability** (ETHOS: Systems Over Spot Fixes)
- Can be used for Web3Forms API, GTM tracking, or any future API integration
- Not specific to Google Places - it's a general utility
- Follows DRY principle: one implementation, many uses

**2. Testability**
- Can test circuit breaker independently of the hook
- Easier to mock API failures and verify behavior
- Cleaner unit test files

**3. Separation of Concerns**
- Hook focuses on: data fetching, caching, React state management
- Circuit breaker focuses on: failure detection, request throttling, resilience
- Each component has one responsibility (SOLID: Single Responsibility Principle)

**4. Documentation**
- Clear what the circuit breaker does (fault tolerance)
- Clear what the hook does (fetch hours with caching)
- Easier for new developers to understand architecture

**5. Future Extensions**
- Easy to add metrics/monitoring to circuit breaker
- Easy to add different strategies (exponential backoff, jitter, etc.)
- Easy to swap implementations without touching hooks

---

## How It Works

### Circuit Breaker States

```
CLOSED (Normal)
    ↓
    Fail 5 times (HTTP 403, 429, 402)
    ↓
OPEN (Blocked)
    ↓
    Wait 1 hour timeout
    ↓
CLOSED (Normal - Retry)
```

### Code Flow

```javascript
// In useGooglePlaceHours.js hook:
import { circuitBreakers } from '../utils/apiCircuitBreaker'

async function fetchPlaceDetails(placeId) {
  // 1. Check if circuit is open
  if (!circuitBreakers.googlePlaces.shouldAttemptCall()) {
    return null; // Short circuit - don't even try
  }

  // 2. Attempt API call
  const response = await fetch(apiUrl);

  // 3. Record failure if needed
  if (!response.ok) {
    circuitBreakers.googlePlaces.recordFailure(response.status);
    return null;
  }

  return await response.json();
}
```

---

## API Reference

### Creating a Circuit Breaker

```javascript
import { ApiCircuitBreaker, createApiCircuitBreaker } from '../utils/apiCircuitBreaker'

// Manual instantiation with custom options
const breaker = new ApiCircuitBreaker({
  failureThreshold: 5,        // Open after 5 failures
  resetAfterMs: 3600000,      // Try again after 1 hour
  apiName: 'My API'           // For logging
});

// Or use factory function
const breaker = createApiCircuitBreaker('My API', {
  failureThreshold: 3,
  resetAfterMs: 60000
});
```

### Pre-created Instances

```javascript
import { circuitBreakers } from '../utils/apiCircuitBreaker'

// Ready-to-use instances
circuitBreakers.googlePlaces    // Google Places API breaker
circuitBreakers.web3Forms      // Web3Forms API breaker (when added)
```

### Methods

```javascript
// Check if you should attempt an API call
if (breaker.shouldAttemptCall()) {
  // Safe to call API
}

// Record a failure (HTTP 403, 429, 402)
breaker.recordFailure(response.status);
// or
breaker.recordFailure(error);

// Get current status
const status = breaker.getStatus();
console.log(status);
// {
//   isOpen: false,
//   failureCount: 0,
//   quotaExceeded: false,
//   timeUntilReset: 0,
//   apiName: 'Google Places API'
// }

// Manual reset (dev only)
breaker.reset();
```

---

## Usage Patterns

### Pattern 1: Wrap API Call (Recommended)

```javascript
export async function fetchUserData(userId) {
  // Check circuit breaker first
  if (!circuitBreakers.myApi.shouldAttemptCall()) {
    console.warn('Circuit breaker open, using cached data');
    return getCachedUser(userId);
  }

  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      circuitBreakers.myApi.recordFailure(response.status);
      return getCachedUser(userId);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    return getCachedUser(userId);
  }
}
```

### Pattern 2: React Hook

```javascript
export function useFetchData(id) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Circuit breaker prevents unnecessary attempts
    if (!circuitBreakers.myApi.shouldAttemptCall()) {
      setError('API temporarily unavailable');
      return;
    }

    fetchData(id)
      .then(setData)
      .catch(err => {
        circuitBreakers.myApi.recordFailure(err.status);
        setError('Failed to fetch');
      });
  }, [id]);

  return { data, error };
}
```

---

## Monitoring

### In Development

Check circuit breaker status in DevTools:

```javascript
// Google Places API status
import { getPlacesQuotaStatus } from '@/hooks/useGooglePlaceHours.js'
console.log(getPlacesQuotaStatus())

// Reset if needed (testing only)
import { resetPlacesCircuitBreaker } from '@/hooks/useGooglePlaceHours.js'
resetPlacesCircuitBreaker()
```

### In Production

Circuit breaker status is logged to browser console (dev mode only) when it opens/closes:

```
🚨 CIRCUIT BREAKER OPEN [Google Places API]: 5 failures detected...
🔄 CIRCUIT BREAKER RESET [Google Places API]: Timeout expired...
```

---

## Adding New API Breakers

When integrating a new API (e.g., Web3Forms):

**1. Import the factory:**
```javascript
import { createApiCircuitBreaker, circuitBreakers } from '../utils/apiCircuitBreaker'
```

**2. Create instance (if not already pre-created):**
```javascript
// In the hook or service file
const web3FormBreaker = circuitBreakers.web3Forms || 
  createApiCircuitBreaker('Web3Forms API');
```

**3. Use in fetch logic:**
```javascript
if (!web3FormBreaker.shouldAttemptCall()) {
  return null; // Don't try, quota exhausted
}

try {
  const response = await fetch('https://api.web3forms.com/submit', { ... });
  if (!response.ok) {
    web3FormBreaker.recordFailure(response.status);
  }
} catch (error) {
  web3FormBreaker.recordFailure(error);
}
```

---

## Testing

### Test Circuit Opens on Failures

```javascript
import { ApiCircuitBreaker } from '@/utils/apiCircuitBreaker'

test('circuit opens after threshold', () => {
  const breaker = new ApiCircuitBreaker({ 
    failureThreshold: 3,
    resetAfterMs: 1000
  });

  expect(breaker.shouldAttemptCall()).toBe(true);

  // Simulate 3 failures
  breaker.recordFailure(403);
  breaker.recordFailure(403);
  breaker.recordFailure(403);

  // Circuit should be open
  expect(breaker.shouldAttemptCall()).toBe(false);
  expect(breaker.getStatus().isOpen).toBe(true);
});
```

### Test Circuit Resets

```javascript
test('circuit resets after timeout', async () => {
  const breaker = new ApiCircuitBreaker({ 
    failureThreshold: 1,
    resetAfterMs: 100 // 100ms for testing
  });

  // Trigger open
  breaker.recordFailure(403);
  expect(breaker.shouldAttemptCall()).toBe(false);

  // Wait for timeout
  await new Promise(resolve => setTimeout(resolve, 150));

  // Should attempt again
  expect(breaker.shouldAttemptCall()).toBe(true);
});
```

---

## Performance

- **Memory:** Negligible (~100 bytes per breaker instance)
- **CPU:** O(1) all operations (simple comparisons and arithmetic)
- **Network:** Reduces API calls by 95%+ when quota exceeded

---

## Compatibility

- **Browser:** All modern browsers (IE 11+ with polyfills)
- **Node.js:** 14+
- **React:** 16.8+ (hooks required)

---

## Related

- [API Quota Protection Guide](./api-quota-protection.md)
- [useGooglePlaceHours Hook](../../src/hooks/useGooglePlaceHours.js)
- [Circuit Breaker Pattern (Wikipedia)](https://en.wikipedia.org/wiki/Circuit_breaker_(design_pattern))
- [Resilience4j Documentation](https://resilience4j.readme.io/docs/circuitbreaker) - Similar pattern in Java

---

**Maintained by:** Roma Mart Development Team  
**Version:** 1.0  
**Status:** Production-ready
