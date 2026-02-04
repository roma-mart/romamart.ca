# API Quota Protection & Cost Control Guide

> **Goal:** Protect Roma Mart from unexpected Google Places API costs
> **Status:** Implemented with circuit breaker + quota limits
> **Last Updated:** February 4, 2026

---

## Overview

Roma Mart's Google Places API integration uses **three layers of protection** to ensure zero surprise bills:

- **Google Cloud Console quota limits** (hardest stop)
- **Circuit breaker pattern** (smart detection)
- **1-hour caching** (minimum API calls)

---

## Layer 1: Google Cloud Console - Hard Limits

### Set Daily Quota Limit (CRITICAL)

This is your nuclear option - when quota is hit, API returns 403 and your site uses fallbacks.

**Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate: **APIs & Services** → **Quotas**
4. Search for **"Places API"** or **"Places API (New)"**
5. Click on it → **Edit Quotas** (pencil icon)
6. Set **"Queries per day"** to a safe limit:
   - **100/day** = ~$3/month (safe buffer above 12/month usage)
   - **50/day** = extra cautious
7. Click **Update Quota**

**What happens when quota is exceeded:**

- API returns HTTP 403 Forbidden
- Circuit breaker detects this and stops trying
- Your site automatically uses fallback (static) hours
- Users still see your hours, just not live-updated

### Billing Alert (Email Warning)

Get notified before hitting limits:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate: **Billing** → **Budgets & alerts**
3. Click **+ Create Budget**
4. Set budget to **$5/month** (or your comfort level)
5. Set alerts at:
   - 50% spent ($2.50) → Warning
   - 90% spent ($4.50) → Urgent
   - 100% spent ($5.00) → Over budget
6. Add your email
7. Click **Create Budget**

**You'll receive email alerts** if approaching limits.

### API Key Restrictions (Prevent Abuse)

Lock your key to only what you need:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate: **APIs & Services** → **Credentials**
3. Click your **API Key** (the one you're using)
4. Under **Restrict and secure** section:

**API Restrictions:**

- ✅ Select "Restrict key"
- ✅ Choose only these APIs:
  - Places API (New)
  - Google Maps Embed API
  - Maps JavaScript API
- ❌ Disable everything else

**HTTP Referrers:**

- ✅ Add HTTP referrer restrictions:
  - `romamart.ca`
  - `*.romamart.ca`
  - `www.romamart.ca`
  - `localhost:*` (for local testing)
  - `127.0.0.1:*` (for local testing)

This prevents your key from being used on other domains.

---

## Layer 2: Circuit Breaker - Smart Detection

### How It Works

The code now includes a **circuit breaker** that:

1. **Detects quota exceeded** (HTTP 403, 429, 402 errors)
2. **Stops making API calls** after 5 failures
3. **Locks out for 1 hour** to avoid wasting quota
4. **Automatically resets** after timeout

**Visual flow:**

```text
API Call 1 → Fails (403) → Count: 1
API Call 2 → Fails (403) → Count: 2
API Call 3 → Fails (403) → Count: 3
API Call 4 → Fails (403) → Count: 4
API Call 5 → Fails (403) → Count: 5
⚠️ CIRCUIT BREAKER OPENS ⚠️
API Call 6 → Blocked (no API call made)
API Call 7 → Blocked (no API call made)
...
1 Hour passes
🔄 Circuit breaker resets, tries again
```

### Monitor in Browser DevTools

Check if circuit breaker is active:

1. Open **Browser DevTools** (F12)
2. Go to **Console** tab
3. Paste this command:

```javascript
import { getPlacesQuotaStatus } from '/src/hooks/useGooglePlaceHours.js'
console.log(getPlacesQuotaStatus())
```

**Example output:**

```javascript
{
  isOpen: false,
  failureCount: 0,
  quotaExceeded: false,
  timeUntilReset: 0,
  apiName: 'Google Places API'
}
```

**If quota exceeded:**

```javascript
{
  isOpen: true,
  failureCount: 5,
  quotaExceeded: true,
  timeUntilReset: 1847392,
  apiName: 'Google Places API'
}
```

### Manual Reset (Dev Only)

If you want to test recovery in development:

```javascript
// This only works in dev mode
import { resetPlacesCircuitBreaker } from '/src/hooks/useGooglePlaceHours.js'
resetPlacesCircuitBreaker()
```

---

## Layer 3: Caching - Minimum API Calls

### 1-Hour Cache

Every location's hours are cached for **1 hour** in memory. This means:

- **Hour 0:00** - User visits site → 1 API call
- **Hour 0:15** - Another user visits → 0 API calls (cached)
- **Hour 0:45** - Another user visits → 0 API calls (cached)
- **Hour 1:05** - Another user visits → 1 API call (cache expired)

**Per user impact:**

- ~24 users/day over 8 business hours = **~8 API calls/day max**
- At $5.50/month for 2.5M calls, you'd need ~700 users/day to reach $1

### Current Usage

Current Roma Mart setup:

- **12 API calls/month** (1 per unique user per hour window)
- **Cost: $0.0022/month** (well within free tier of 2.5M/month)
- **Budget cushion: 99.99%**

---

## What Happens When Quota Is Exceeded?

### User Experience

Your site **continues to work normally**:

```text
User visits homepage
  ↓
Shows preferred location with MAP
  ↓
Hours section shows: "Mon-Fri: 9:00 AM - 9:00 PM" (FALLBACK)
  ↓
User sees: Everything looks normal! Just not live-updated
```

### DevTools Console

You'll see a warning (dev only):

```text
⚠️ Circuit breaker is open. API quota likely exceeded. Using fallback hours only.
```

### Browser Behavior

- Maps still embed and work
- Hours shown are from your config (not live)
- All links (Google Maps, directions) still work
- No errors or broken pages

---

## Cost Breakdown

### Pricing Structure

Google Places API (New):

- First **10,000 requests/month** = FREE
- Additional requests = $5.50/1000 after free tier

### Roma Mart Usage

**Current:**

- 12 calls/month (1 per user, 1-hour cache)
- Cost: FREE (under 10,000/month limit)

**Even if:**

- 10x more traffic = 120 calls/month → Still FREE
- 100x more traffic = 1,200 calls/month → Still FREE
- 1000x more traffic = 12,000 calls/month → $10 (first month overage)

**With quota limit of 100/day:**

- 3,000 calls/month max (if everyone visits 3x/day)
- Cost: Still under free tier
- Your wallet: Protected

---

## Production Checklist

Before deployment to production:

- [ ] **Daily quota limit set** to 100/day in Google Cloud Console
- [ ] **Billing alerts configured** for $5/month budget
- [ ] **API key restricted** to only Places/Embed/JavaScript APIs
- [ ] **HTTP referrer restrictions** set to your domains only
- [ ] **Verified in dev mode** that fallback hours work without API
- [ ] **Tested circuit breaker** by manually closing API access
- [ ] **Confirmed environment variable** `VITE_GOOGLE_PLACES_API_KEY` is set in GitHub Actions

---

## Testing - Simulate Quota Exceeded

### Test Fallback Behavior

**In development:**

1. Remove/blank your `VITE_GOOGLE_PLACES_API_KEY` environment variable
2. Refresh the site
3. Verify hours display correctly (using fallback)
4. Check console for warnings
5. Verify maps still load and work

**Expected result:** Everything works, hours just aren't live-updated.

### Test Circuit Breaker

In **Firefox DevTools**:

1. Open Network tab
2. Go to Application → Service Workers → Disable service workers (temporary)
3. Go to Console tab
4. Mock the API to fail:

```javascript
// This is for testing only
const originalFetch = window.fetch;
window.fetch = (...args) => {
  if (args[0].includes('places.googleapis.com')) {
    return Promise.resolve(new Response('', { status: 403 }));
  }
  return originalFetch(...args);
};
```

5. Refresh page 5+ times
6. Check `getPlacesQuotaStatus()` in console
7. Should show `quotaExceeded: true`

**Expected result:** Circuit breaker opens, stops making API calls.

---

## Monitoring Dashboard

### Check Your Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Home** → **Dashboard**
3. Look for **"Places API"** usage card
4. See real-time call count and costs

### Monthly Review

First week of each month, check:

1. **Actual usage** vs budget (Google Cloud Billing)
2. **Circuit breaker status** (if any 403 errors in logs)
3. **Quotas still configured** (sometimes get reset)
4. **Billing alerts working** (test by setting low budget)

---

## FAQ

---

### Q: What if the free tier increases?

**A:** Google occasionally increases free tiers. Your quota limit will still protect you from unexpected costs.

---

### Q: Can users break the API with requests?

**A:** No, circuit breaker limits damage. After 5 failures, it stops trying for 1 hour.

---

### Q: What if I want live hours during high traffic?

**A:** Upgrade quota limit in Google Cloud Console. Double it to 200/day for ~$5 peace of mind.

---

### Q: Why fallback hours instead of error message?

**A:** Better UX. Most users won't notice hours aren't live-updated. Error messages break trust.

---

### Q: Can I use localStorage for persistent cache?

**A:** Yes! See [PR #85 comments](https://github.com/roma-mart/romamart.ca/pull/85) for persistent cache implementation options.

---

### Q: Does this work offline?

**A:** Fallback hours work offline (static data). Live hours require internet + API key.

---

## Support

**Issues? Check:**

1. Google Cloud Console quota limit is set
2. API key restrictions are configured
3. VITE_GOOGLE_PLACES_API_KEY environment variable exists
4. Circuit breaker status in console: `getPlacesQuotaStatus()`
5. Browser DevTools Network tab to see API calls

**Still broken?**

- Check [troubleshooting guide](./troubleshooting.md)
- Review [Architecture documentation](../architecture/data-management.md)

---

**Maintained by:** Roma Mart Development Team
**Version:** 1.0
**Status:** Production-Ready with triple-layer protection
