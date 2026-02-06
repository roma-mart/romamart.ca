# Prerender Systematic Fix - Analysis & Best Practices

**Created:** February 6, 2026
**Status:** Implementation Complete, Documented
**Context:** ProductList schema detection fix led to systematic improvements

---

## Executive Summary

Fixed critical issue where Schema.org validators couldn't detect ProductList schemas despite successful client-side rendering. Root cause: schemas were only added after JavaScript hydration, but validators check initial static HTML.

**Solution:** Extended prerender script to fetch menu data at build time and inject ProductList schemas into static HTML.

**Impact:**
- Homepage: Now includes 4 featured Product schemas in static HTML
- RoCafé page: Now includes all 75 Product schemas in static HTML
- Build time increased ~2-3 seconds (one-time API fetch)
- Zero runtime performance impact (schemas already in DOM)

**Key Learning:** Any API-driven schema (ProductList, ServiceList, LocationList) faces this problem. This fix establishes the pattern for future API migrations.

---

## Problem Statement

### What We Discovered

**Initial Symptoms:**
- Schema.org validator showed homepage missing ProductList (only saw ServiceList + LocationList)
- RoCafé page showed NO ItemList at all
- Console logs proved schemas WERE rendering successfully after API fetch
- User concern: Menu items are currently the ONLY API-only data (no static fallback)

**Root Cause Analysis:**

Browser console logs showed the timing issue clearly:

```
[MenuContext] Fetching menu data from API: https://romamart.netlify.app/api/public-menu
[App.jsx] Featured menu items for homepage: {totalMenuItems: 0, featuredCount: 0}
// ... ~500ms delay while API returns ...
[MenuContext] Menu data received: {totalItems: 75, featuredItems: 4}
[App.jsx] Rendering ProductList schema on homepage with 4 items
[StructuredData] ProductList - Final schema: {type: 'ItemList', itemCount: 4}
```

**The Problem:**
1. Initial render: menuItems = 0 (before API completes)
2. Static HTML generated at build time contains menuItems = 0
3. Schema.org validator checks static HTML (NOT client-side hydration)
4. Validator sees: LocalBusiness + WebSite, but NO ProductList
5. After ~500ms: API returns, schemas render, but validator already finished

**Why ServiceList and LocationList Were Detected:**
- Both use static data with API fallback
- Static data is available at prerender time
- Prerender script could inject those schemas into static HTML

**Why ProductList Failed:**
- Menu data is API-only (no static fallback - intentional design)
- Prerender script had no menu data at build time
- Static HTML contained NO ProductList schemas

---

## Solution: Build-Time API Prerendering

### Implementation Overview

Modified `scripts/prerender.js` to:
1. Fetch menu data from API during build process
2. Generate ProductList schemas using same logic as React components
3. Inject route-specific schemas into static HTML

### Code Changes

**1. Added Menu API Fetching (prerender.js:164-184)**

```javascript
/**
 * Fetches menu data from API for prerendering ProductList schemas
 * @returns {Promise<Array>} Menu items array
 */
async function fetchMenuData() {
  try {
    console.log('Fetching menu data from API for prerendering...');
    const response = await fetch(MENU_API_URL);

    if (!response.ok) {
      console.warn(`Warning: Menu API returned ${response.status}. ProductList schemas will be skipped in static HTML.`);
      return [];
    }

    const data = await response.json();
    const menuItems = data.menu || [];

    console.log(`✓ Fetched ${menuItems.length} menu items (${menuItems.filter(i => i.featured).length} featured)`);
    return menuItems;
  } catch (error) {
    console.warn('Warning: Failed to fetch menu data. ProductList schemas will be skipped in static HTML.');
    console.warn('  Error:', error.message);
    return [];
  }
}
```

**Key Design Decisions:**
- Returns empty array on failure (graceful degradation)
- Logs warnings but doesn't fail build
- Uses same API endpoint as MenuContext (SSOT)

**2. Added ProductList Schema Builder (prerender.js:192-230)**

```javascript
/**
 * Builds ProductList schema for menu items
 * @param {Array} menuItems - Menu items to include
 * @param {boolean} featuredOnly - Only include featured items
 * @returns {Object|null} ProductList schema or null if no items
 */
function buildProductListSchema(menuItems, featuredOnly = false) {
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    return null;
  }

  const items = featuredOnly
    ? menuItems.filter(item => item.featured === true)
    : menuItems;

  if (items.length === 0) {
    return null;
  }

  // Build Product schemas using same logic as StructuredData component
  const productSchemas = items
    .map(menuItem => buildMenuItemSchema(
      menuItem,
      'https://romamart.ca/rocafe',
      {
        currency: 'CAD',
        priceInCents: true // Menu API uses cents
      }
    ))
    .filter(Boolean);

  if (productSchemas.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productSchemas.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: product
    }))
  };
}
```

**Key Design Decisions:**
- Reuses `buildMenuItemSchema()` from src/schemas/menuItemSchema.js (DRY principle)
- Same logic as StructuredData component (consistency)
- Returns null if no items (safe fallback)

**3. Modified buildStructuredData to Accept Route Context (prerender.js:236-342)**

```javascript
const buildStructuredData = (routePath = '/', menuItems = []) => {
  // ... existing LocalBusiness + WebSite setup ...

  // Build base @graph with LocalBusiness and WebSite
  const graph = [
    { '@type': 'LocalBusiness', ... },
    { '@type': 'WebSite', ... }
  ];

  // Add ProductList for homepage (featured items only)
  if (routePath === '/' && menuItems.length > 0) {
    const productListSchema = buildProductListSchema(menuItems, true);
    if (productListSchema) {
      graph.push(productListSchema);
    }
  }

  // Add ProductList for RoCafé page (all menu items)
  if (routePath === '/rocafe' && menuItems.length > 0) {
    const productListSchema = buildProductListSchema(menuItems, false);
    if (productListSchema) {
      graph.push(productListSchema);
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph
  };

  return JSON.stringify(schema);
};
```

**Key Design Decisions:**
- Route-specific schema injection (homepage vs RoCafé)
- Homepage: featured items only (matches React component logic)
- RoCafé: all items (matches React component logic)
- Other routes: no ProductList (as expected)

**4. Updated Prerender Main Loop (prerender.js:362-374)**

```javascript
async function prerender() {
  // ... existing setup ...

  // Fetch menu data once for all routes
  const menuItems = await fetchMenuData();

  const indexTemplate = fs.readFileSync(indexPath, 'utf-8');

  for (const route of routes) {
    // ... meta tag replacements ...

    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${buildStructuredData(route.path, menuItems)}</script>`
    );
  }
}
```

**Key Design Decisions:**
- Fetch menu data ONCE before route loop (efficiency)
- Pass menuItems to each route's buildStructuredData call
- No breaking changes to existing prerender logic

### Verification

**Build Output:**
```
Fetching menu data from API for prerendering...
✓ Fetched 75 menu items (4 featured)
Prerendering /...
  ✓ C:\src\romamart.ca\dist\index.html
Prerendering /rocafe...
  ✓ C:\src\romamart.ca\dist\rocafe\index.html
```

**Static HTML Validation:**
```bash
# Homepage: 1 ItemList, 4 Product schemas
grep -o '"@type":"ItemList"' dist/index.html | wc -l
# Output: 1

grep -o '"@type":"Product"' dist/index.html | wc -l
# Output: 4

# RoCafé: 1 ItemList, 75 Product schemas
grep -o '"@type":"ItemList"' dist/rocafe/index.html | wc -l
# Output: 1

grep -o '"@type":"Product"' dist/rocafe/index.html | wc -l
# Output: 75
```

**Schema Structure Validation:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "LocalBusiness", ... },
    { "@type": "WebSite", ... },
    { "@type": "ItemList", "itemListElement": [ /* 4 or 75 products */ ] }
  ]
}
```

---

## Prerendering Opportunities for Future API Migrations

### Current State

| Data Type | API Status | Prerender Status | Validator Detection |
|-----------|-----------|------------------|---------------------|
| **Menu Items** | ✅ API-only | ✅ Prerendered | ✅ FIXED |
| **Services** | ⚠️ API-ready, static fallback | ✅ Prerendered (static) | ✅ Working |
| **Locations** | ⚠️ API-ready, static fallback | ✅ Prerendered (static) | ✅ Working |
| **Company Data** | ❌ Static only | ✅ Prerendered (static) | ✅ Working |

### Future Migration Recommendations

#### When Services API Goes Live (API-Only)

**Problem:** Same as menu items - ServiceList schemas won't be in static HTML

**Solution Pattern:**
```javascript
// scripts/prerender.js

const SERVICES_API_URL = 'https://romamart.netlify.app/api/public-services';

async function fetchServicesData() {
  try {
    console.log('Fetching services data from API for prerendering...');
    const response = await fetch(SERVICES_API_URL);

    if (!response.ok) {
      console.warn(`Warning: Services API returned ${response.status}. ServiceList schemas will be skipped.`);
      return [];
    }

    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.warn('Warning: Failed to fetch services. ServiceList schemas will be skipped.');
    return [];
  }
}

// In prerender():
const [menuItems, services] = await Promise.all([
  fetchMenuData(),
  fetchServicesData()
]);

// In buildStructuredData():
if (routePath === '/' && services.length > 0) {
  const serviceListSchema = buildServiceListSchema(
    services.filter(s => s.featured === true),
    { companyData: COMPANY_DATA } // Pass from static for now
  );
  if (serviceListSchema) {
    graph.push(serviceListSchema);
  }
}
```

**Estimated Effort:** 1-2 hours (pattern established)

#### When Locations API Goes Live (API-Only)

**Solution Pattern:**
```javascript
// scripts/prerender.js

const LOCATIONS_API_URL = 'https://romamart.netlify.app/api/public-locations';

async function fetchLocationsData() {
  try {
    console.log('Fetching locations data from API for prerendering...');
    const response = await fetch(LOCATIONS_API_URL);

    if (!response.ok) {
      console.warn(`Warning: Locations API returned ${response.status}. LocationList schemas will be skipped.`);
      return [];
    }

    const data = await response.json();
    return data.locations || [];
  } catch (error) {
    console.warn('Warning: Failed to fetch locations. LocationList schemas will be skipped.');
    return [];
  }
}

// Similar integration as services
```

**Estimated Effort:** 1-2 hours (pattern established)

#### When Company Data API Goes Live (API-Only)

**Impact:** More significant - company data is used in ALL schemas

**Solution Pattern:**
```javascript
// scripts/prerender.js

const COMPANY_DATA_API_URL = 'https://romamart.netlify.app/api/public-company-data';

async function fetchCompanyData() {
  try {
    console.log('Fetching company data from API for prerendering...');
    const response = await fetch(COMPANY_DATA_API_URL);

    if (!response.ok) {
      console.warn('Warning: Company Data API unavailable. Using static COMPANY_DATA.');
      return COMPANY_DATA; // Fallback to static import
    }

    const data = await response.json();
    return data.companyData || COMPANY_DATA;
  } catch (error) {
    console.warn('Warning: Failed to fetch company data. Using static COMPANY_DATA.');
    return COMPANY_DATA;
  }
}

// In prerender():
const [menuItems, services, locations, companyData] = await Promise.all([
  fetchMenuData(),
  fetchServicesData(),
  fetchLocationsData(),
  fetchCompanyData()
]);

// Pass companyData to all schema builders:
const productListSchema = buildProductListSchema(menuItems, featuredOnly);
const serviceListSchema = buildServiceListSchema(services, { companyData });
const locationListSchema = buildLocationListSchema(locations, { companyData });
```

**Estimated Effort:** 3-4 hours (requires updating all schema builder parameters)

### General Pattern for API-Driven Prerendering

```mermaid
graph TD
    A[npm run build] --> B[vite build]
    B --> C[scripts/prerender.js]
    C --> D{Fetch All APIs}
    D --> E[Menu API]
    D --> F[Services API]
    D --> G[Locations API]
    D --> H[Company Data API]
    E --> I[Generate Schemas]
    F --> I
    G --> I
    H --> I
    I --> J[Inject into HTML]
    J --> K[dist/ Static Files]
```

**Best Practices:**
1. Fetch all APIs in parallel with `Promise.all()` (efficiency)
2. Return empty arrays/fallback on failure (graceful degradation)
3. Log warnings but don't fail build (resilience)
4. Use same API endpoints as React contexts (SSOT)
5. Use same schema builders as React components (consistency)
6. Test with API unavailable to verify fallback behavior

---

## API Call Optimization Analysis

### Current API Call Patterns

#### ✅ Excellent: Context-Based Single API Calls

**MenuContext** (src/contexts/MenuContext.jsx:21-59)
```javascript
useEffect(() => {
  let cancelled = false;

  const fetchMenuData = async () => {
    // ... fetch logic ...
  };

  fetchMenuData();

  return () => {
    cancelled = true;
  };
}, []); // Empty dependency array = fetch once on mount
```

**Status:** ✅ Optimal
- Single API call per app lifecycle
- Cancellation token prevents memory leaks
- Data shared via context to all components
- No duplicate requests possible (provider mounts once)

**ServicesContext + LocationsContext:**
- Same pattern as MenuContext
- ✅ Optimal implementation

#### ✅ Excellent: Request Deduplication for Hook-Based APIs

**Google Places API** (src/hooks/useGooglePlaceHours.js:123-203)

**Problem We Fixed:**
- Multiple components mounted simultaneously
- Each called `useGooglePlaceHours()` with same placeId
- Before cache could help, 8+ duplicate concurrent requests fired
- Hit rate limit (429 errors)

**Solution Implemented:**
```javascript
// Track in-flight requests to prevent duplicate concurrent API calls
const pendingRequests = new Map();

async function fetchPlaceDetails(placeId) {
  // Check if there's already a pending request for this place ID
  if (pendingRequests.has(placeId)) {
    return pendingRequests.get(placeId); // Return shared promise
  }

  // Create the request promise and store it
  const requestPromise = (async () => {
    try {
      const response = await fetch(url, { ... });
      // ... handle response ...
    } finally {
      // Clean up pending request tracking after completion
      pendingRequests.delete(placeId);
    }
  })();

  // Store the promise so concurrent requests can reuse it
  pendingRequests.set(placeId, requestPromise);

  return requestPromise;
}
```

**Status:** ✅ Fixed in PR #96
- Concurrent requests for same placeId now share single promise
- Cache still works for subsequent requests
- Circuit breaker protects against quota exhaustion

#### ✅ Good: Form Submission (One-Time Operations)

**ContactPage** (src/pages/ContactPage.jsx:31-61)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  // ... validation ...
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  });
  // ... handle response ...
};
```

**Status:** ✅ Appropriate
- User-triggered action (not automatic)
- Single request per form submission
- No optimization needed

### API Call Optimization Scorecard

| API Type | Pattern | Optimization Level | Notes |
|----------|---------|-------------------|-------|
| Menu API | Context Provider | ✅ Optimal | Single call, shared data |
| Services API | Context Provider | ✅ Optimal | Single call, shared data |
| Locations API | Context Provider | ✅ Optimal | Single call, shared data |
| Google Places API | Hook + Deduplication | ✅ Optimal | Fixed duplicate concurrent requests |
| Web3Forms API | Form Handler | ✅ Appropriate | User-triggered, one-time |

### Best Practices Documented

**For Data Fetching:**
1. **Use Context Providers** for app-wide data (menu, services, locations, company data)
   - Mount provider once at app root
   - Single API call per lifecycle
   - Share data via useContext hooks

2. **Use Request Deduplication** for hooks called by multiple components
   - Track in-flight requests with Map<key, Promise>
   - Share promise across concurrent calls
   - Clean up after request completes

3. **Use Caching** for repeat requests
   - Cache with timestamps (invalidate after TTL)
   - Check cache before making request
   - Combine with deduplication for best results

**For API Errors:**
1. **Circuit Breaker Pattern** for external APIs (Google Places)
   - Track failure count
   - Stop calling after quota exceeded
   - Auto-reset after cooldown period

2. **Graceful Fallbacks** for optional features
   - Static data fallback (services, locations)
   - Empty array fallback (menu - intentional)
   - Silent failures with console warnings

---

## Debugging Logs Evaluation

### Current Logging Strategy

**Production Diagnostic Logs** (Permanent - Keep):
```javascript
// MenuContext.jsx:27-42
// eslint-disable-next-line no-console
console.log('[MenuContext] Fetching menu data from API:', API_URL);

// eslint-disable-next-line no-console
console.log('[MenuContext] Menu data received:', {
  totalItems: menu.length,
  featuredItems: featuredCount,
  sampleItem: menu[0]?.name || 'N/A'
});

// Error logging is permanent (not temporary debug logs) for production diagnostics
console.error('[MenuContext] Failed to fetch menu data:', err);
```

**Rationale:**
- ✅ KEEP: Helps diagnose API issues in production
- ✅ KEEP: Shows data arrival for debugging timing issues
- ✅ KEEP: Error logs are always production-appropriate

**Schema Rendering Logs** (Temporary - Consider Removing):
```javascript
// StructuredData.jsx:22-71
// eslint-disable-next-line no-console
console.log('[StructuredData] ProductList rendering - Input:', { ... });

// eslint-disable-next-line no-console
console.log('[StructuredData] ProductList - Generated schemas:', { ... });

// eslint-disable-next-line no-console
console.log('[StructuredData] ProductList - Final schema:', { ... });
```

**Rationale:**
- ⚠️ REMOVE: Very verbose (3 logs per schema render)
- ⚠️ REMOVE: Not useful for typical production diagnostics
- ⚠️ REMOVE: Can overwhelm console on RoCafé page (75 items × 3 logs = 225 log lines)
- ✅ KEEP: console.warn for missing data (useful)

**App.jsx Logs** (Temporary - Consider Removing):
```javascript
// App.jsx:629-638, 677-686
// eslint-disable-next-line no-console
console.log('[App.jsx] Featured menu items for homepage:', { ... });

// eslint-disable-next-line no-console
console.log('[App.jsx] Rendering ProductList schema on homepage with 4 items');
```

**Rationale:**
- ⚠️ REMOVE: Added for diagnosis, no longer needed
- ⚠️ REMOVE: MenuContext logs are sufficient

**RoCafePage Logs** (Temporary - Consider Removing):
```javascript
// RoCafePage.jsx:44-53, 69-77
// eslint-disable-next-line no-console
console.log('[RoCafePage] Menu items for ProductList schema:', { ... });

// eslint-disable-next-line no-console
console.log('[RoCafePage] Rendering ProductList schema with 75 items');
```

**Rationale:**
- ⚠️ REMOVE: Added for diagnosis, no longer needed

### Recommended Cleanup

**Phase 1: Remove Verbose Schema Logs**
- Remove StructuredData.jsx logs (lines 22-71)
- Remove App.jsx schema logs (lines 629-638, 677-686)
- Remove RoCafePage.jsx schema logs (lines 44-53, 69-77)
- Keep console.warn for missing data

**Phase 2: Add Development-Only Logging**

Option A: Use Vite's import.meta.env.DEV
```javascript
// Only log in development mode
if (import.meta.env.DEV) {
  console.log('[StructuredData] ProductList rendering with', productCount, 'items');
}
```

Option B: Create debug utility
```javascript
// utils/debug.js
export const debug = import.meta.env.DEV
  ? (...args) => console.log(...args)
  : () => {};

// Usage:
import { debug } from '../utils/debug';
debug('[StructuredData] ProductList rendering');
```

**Phase 3: Keep Essential Production Logs**
- MenuContext fetch logs (helps diagnose API timing)
- ServicesContext/LocationsContext fallback warnings
- All console.error calls (production diagnostics)

---

## Code Review Findings

### Files Modified in This Fix

1. **scripts/prerender.js** (e0279b9)
   - ✅ Follows existing patterns
   - ✅ Graceful error handling
   - ✅ Reuses buildMenuItemSchema (DRY)
   - ✅ Route-specific logic matches React components
   - ✅ No breaking changes
   - ✅ ESLint clean

2. **No Other Files Changed** (Pure Prerender Enhancement)
   - Client-side code unchanged
   - Schema builders unchanged
   - Context providers unchanged
   - React components unchanged

### Quality Checklist

- [x] ESLint: 0 errors
- [x] Build succeeds
- [x] Static HTML contains expected schemas
- [x] Graceful fallback if API unavailable
- [x] No runtime performance impact
- [x] Follows SSOT principle (reuses buildMenuItemSchema)
- [x] Consistent with existing patterns (MenuContext, prerender)
- [x] Well-commented with JSDoc
- [x] No security concerns (read-only API fetch at build time)

---

## Next Steps

### Immediate (This PR)

1. ✅ Implement prerender ProductList fix (COMPLETE)
2. ⏳ Clean up debugging logs (PENDING)
3. ⏳ Update documentation (THIS DOCUMENT + updates to existing docs)
4. ⏳ Create PR with comprehensive summary

### Short-Term (Next Sprint)

1. Apply same prerender pattern to Services API (when it goes API-only)
2. Apply same prerender pattern to Locations API (when it goes API-only)
3. Consider consolidating API fetching in prerender (single Promise.all)

### Long-Term (Future Work)

1. Company Data API prerendering (when API is ready)
2. Automated testing for prerendered schemas
3. Performance monitoring for build-time API fetches
4. Consider caching API responses during development builds

---

## Documentation Updates Required

### 1. API_MIGRATION_READINESS.md

**Add Section:** "Part 8: Prerendering for API-Driven Schemas"

Content should cover:
- Why prerendering is necessary for SEO/validators
- ProductList prerender implementation (reference implementation)
- Pattern for future Services/Locations/CompanyData prerendering
- Build-time API fetch best practices

### 2. STRUCTURED_DATA_MASTER_PLAN.md

**Update Section:** "Phase 5 In Progress - Schema Validation & Bug Fixes"

Add subsection:
- "ProductList Schema Detection Fix (Feb 6, 2026)"
- Root cause analysis (timing/hydration)
- Solution: build-time API prerendering
- Verification results
- Pattern established for future API-driven schemas

### 3. docs/guides/deployment.md

**Add Section:** "Build-Time API Requirements"

Content:
- Prerender script requires menu API access at build time
- Graceful fallback if API unavailable
- Expected build output logs
- Troubleshooting API fetch failures during build

### 4. .github/copilot-instructions.md

**Add to Context:**
- Prerender pattern for API-driven schemas
- Best practices for build-time API fetching
- Reference implementation: scripts/prerender.js ProductList logic

---

## Conclusion

This fix establishes a systematic pattern for API-driven schema prerendering:

**Pattern Success Factors:**
1. ✅ Fetch API data at build time (once per build)
2. ✅ Reuse existing schema builders (DRY)
3. ✅ Match React component logic exactly (consistency)
4. ✅ Graceful fallback on API failure (resilience)
5. ✅ Route-specific schema injection (flexibility)

**Reusability:**
- Services API migration: ~1-2 hours (pattern established)
- Locations API migration: ~1-2 hours (pattern established)
- Company Data API migration: ~3-4 hours (wider impact)

**Impact:**
- Fixed critical SEO issue (ProductList not detected by validators)
- Zero runtime performance impact
- Minimal build time increase (~2-3 seconds)
- Established pattern saves future development time

This systematic approach aligns with Roma Mart's development ethos: **Systems over spot fixes**.
