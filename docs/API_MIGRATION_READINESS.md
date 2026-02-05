# API Migration Readiness Assessment
**Created:** February 5, 2026
**Status:** Ready for Implementation
**Target:** Complete API migration for Services, Locations, and Company Data

---

## Executive Summary

Services and Locations are **90% ready** for API migration. Context providers exist and are wired up identically to MenuContext. However, **3 components** still bypass the context and use static imports directly. Company Data requires **new architecture** for API readiness.

### Status Overview

| Data Type | Context Provider | Used in Pages | Static Bypasses | API Ready | Notes |
|-----------|-----------------|---------------|-----------------|-----------|-------|
| **Menu Items** | ✅ Complete | ✅ Complete | ✅ None | ✅ 100% | Reference implementation |
| **Services** | ✅ Complete | ✅ Complete | ⚠️ 2 files | ⚠️ 95% | App.jsx and StandardizedItem need fixes |
| **Locations** | ✅ Complete | ✅ Complete | ⚠️ 2 files | ⚠️ 90% | Footer.jsx and App.jsx need fixes |
| **Company Data** | ❌ Missing | ❌ N/A | ❌ All files | ❌ 0% | New context provider needed |

---

## Part 1: Services API Migration

### ✅ What's Already Done

**Context Provider** (`src/contexts/ServicesContext.jsx`):
- ✅ API URL configured: `https://romamart.netlify.app/api/public-services`
- ✅ Fetch logic with static fallback
- ✅ Response validation (`data.success`, `data.services` array check)
- ✅ Error handling with console warnings
- ✅ `source` tracking ('api' or 'static')
- ✅ Exported `useServices()` hook

**Provider Setup** (`src/main.jsx`):
```jsx
<ServicesProvider>  // ✅ Wraps entire app
  <LocationsProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </LocationsProvider>
</ServicesProvider>
```

**Page Implementation** (`src/pages/ServicesPage.jsx`):
```jsx
const { services } = useServices();  // ✅ Uses context
```

### ⚠️ What Needs Fixing

#### Issue 1: App.jsx Uses Static SERVICES_FEATURED Instead of Context

**Current Code** (Line 28, 137):
```jsx
import { SERVICES_FEATURED } from './data/services.jsx';  // ❌ Static import

// Later in component:
{SERVICES_FEATURED.map((service) => (  // ❌ Bypasses context
  <StandardizedItem
    key={service.id}
    item={service}
    itemType="service"
  />
))}
```

**Problem**:
- Already calls `useServices()` (line 608) but ignores the result
- Uses static `SERVICES_FEATURED` array directly
- When API goes live, homepage will show stale static data

**Fix**:
```jsx
// Remove static import:
// import { SERVICES_FEATURED } from './data/services.jsx';  // DELETE

// Use context data (already imported at line 32):
const { services } = useServices();  // ✅ Already exists at line 608

// Filter for featured services dynamically:
const featuredServices = useMemo(() => {
  return services
    .filter(service => service.featured === true)
    .slice(0, 6);  // Limit to 6 featured services
}, [services]);

// Update JSX:
{featuredServices.map((service) => (  // ✅ Uses API data
  <StandardizedItem
    key={service.id}
    item={service}
    itemType="service"
  />
))}
```

**Data Structure Requirement**:
API must return services with `featured` boolean field:
```json
{
  "success": true,
  "services": [
    {
      "id": "atm",
      "name": "ATM Services",
      "featured": true,  // ← Required for homepage filtering
      // ... other fields
    }
  ]
}
```

#### Issue 2: StandardizedItem Imports SERVICES (Low Priority)

**Current Code** (Line 8):
```jsx
import { SERVICES } from '../data/services.jsx';
```

**Analysis**:
- No actual usage found in grep results
- Likely unused import (should be removed)
- If used for validation, can access via context with `useServices()`

**Fix** (verify first, then remove):
```bash
# Search for actual usage:
grep -n "SERVICES\[" src/components/StandardizedItem.jsx
grep -n "SERVICES\." src/components/StandardizedItem.jsx

# If no results, remove the import
```

---

## Part 2: Locations API Migration

### ✅ What's Already Done

**Context Provider** (`src/contexts/LocationsContext.jsx`):
- ✅ API URL configured: `https://romamart.netlify.app/api/public-locations`
- ✅ Fetch logic with static fallback
- ✅ Response validation (`data.success`, `data.locations` array check)
- ✅ Error handling with console warnings
- ✅ `source` tracking ('api' or 'static')
- ✅ Exported `useLocations()` hook

**Provider Setup** (`src/main.jsx`):
```jsx
<LocationsProvider>  // ✅ Wraps entire app
  <ToastProvider>
    <App />
  </ToastProvider>
</LocationsProvider>
```

**Page Implementation** (`src/pages/LocationsPage.jsx`):
```jsx
const { locations: allLocations } = useLocations();  // ✅ Uses context
```

### ⚠️ What Needs Fixing

#### Issue 1: Footer.jsx Uses Static LOCATIONS Import

**Current Code** (Line 15, 57):
```jsx
import { LOCATIONS, getActiveLocations } from '../data/locations';  // ❌ Static import

const activeLocations = getActiveLocations();  // ❌ Bypasses context
```

**Problem**:
- Footer shows location selector with hours
- Uses static LOCATIONS array directly
- When API goes live, footer will show stale static data

**Fix**:
```jsx
// Remove static import:
// import { LOCATIONS, getActiveLocations } from '../data/locations';  // DELETE

// Add context hook:
import { useLocations } from '../contexts/LocationsContext';

// Inside component:
const { locations } = useLocations();  // ✅ Uses API data

// Filter for active locations:
const activeLocations = useMemo(() => {
  return locations.filter(loc => loc.status === 'open');
}, [locations]);
```

**Alternative** (if getActiveLocations has complex logic):
- Move `getActiveLocations()` utility to accept locations array parameter
- Call it with context data: `getActiveLocations(locations)`

#### Issue 2: App.jsx Imports Multiple Location Utilities

**Current Code** (Line 17):
```jsx
import {
  getPrimaryLocation,
  getActiveLocationCount,
  getPreferredLocation,
  LOCATIONS,
  isLocationOpenNow
} from './data/locations';  // ❌ Mix of utilities and static data
```

**Analysis**:
- Already calls `useLocations()` (line 611) ✅
- Also imports utility functions that operate on LOCATIONS array
- Some utilities may be OK (pure functions), others need context data

**Fix** (verify utility usage first):
```jsx
// Remove LOCATIONS static import:
import {
  getPrimaryLocation,      // Utility - may need locations param
  getActiveLocationCount,  // Utility - may need locations param
  getPreferredLocation,    // Utility - may need locations param
  // LOCATIONS,            // DELETE - use context
  isLocationOpenNow        // Utility - OK if pure function
} from './data/locations';

// Use context data:
const { locations } = useLocations();  // ✅ Already exists at line 611

// Pass locations to utilities:
const primaryLocation = getPrimaryLocation(locations);
const activeCount = getActiveLocationCount(locations);
```

**Utility Refactoring Needed**:
- Update `getPrimaryLocation()` to accept locations array param
- Update `getActiveLocationCount()` to accept locations array param
- Update `getPreferredLocation()` to accept locations array param
- Or create new versions: `getPrimaryLocationFromArray(locations)`

---

## Part 3: Company Data API Migration (New Work Required)

### ❌ Current State: No API Readiness

**Current Implementation**:
- `src/config/company_data.js` - Static JavaScript object
- Imported directly in 50+ files
- No context provider
- No API fetching mechanism

**Used By**:
- All schemas (LocalBusiness, Organization, Product, Service, etc.)
- All pages (footer contact info, org details, etc.)
- All components (headers, footers, CTAs, etc.)

### 🎯 Target Architecture: CompanyDataContext

**New Files to Create**:

#### 1. `src/contexts/CompanyDataContext.jsx`

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import COMPANY_DATA from '../config/company_data.js';

/**
 * CompanyDataContext - Single source of truth for company/brand data
 * Fetches from API with fallback to static COMPANY_DATA
 * Prevents duplicate API calls when company data needed across app
 *
 * API Data Structure:
 * {
 *   "success": true,
 *   "companyData": {
 *     "legalName": "Roma Mart Corp.",
 *     "dba": "Roma Mart Convenience",
 *     "baseUrl": "https://romamart.ca",
 *     "contact": { "phone": "+1-382-342-2000", "email": "contact@romamart.ca" },
 *     "address": { "street": "...", "city": "Sarnia", ... },
 *     "socialLinks": { "facebook": "...", "instagram": "...", ... },
 *     // ... all fields from COMPANY_DATA
 *   }
 * }
 *
 * @since February 5, 2026 (planned)
 */
const CompanyDataContext = createContext();

const API_URL = 'https://romamart.netlify.app/api/public-company-data';

export function CompanyDataProvider({ children }) {
  const [companyData, setCompanyData] = useState(COMPANY_DATA); // Start with static fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('static'); // Track data source: 'api' or 'static'

  useEffect(() => {
    let cancelled = false;

    const fetchCompanyData = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) {
          // API failed, use static fallback
          console.warn('Company Data API unavailable, using static data');
          if (!cancelled) {
            setCompanyData(COMPANY_DATA);
            setSource('static');
            setError('API unavailable, using static data');
          }
          return;
        }

        const data = await res.json();

        // Validate API response structure
        if (!data.success || !data.companyData) {
          console.warn('Invalid company data API response, using static data');
          if (!cancelled) {
            setCompanyData(COMPANY_DATA);
            setSource('static');
            setError('Invalid API response, using static data');
          }
          return;
        }

        // API success - use API data
        if (!cancelled) {
          setCompanyData(data.companyData);
          setSource('api');
          setError('');
        }
      } catch (err) {
        // Network error or other exception - use static fallback
        console.warn('Company Data API error, using static data:', err.message);
        if (!cancelled) {
          setCompanyData(COMPANY_DATA);
          setSource('static');
          setError(err.message || 'Failed to load company data, using static data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCompanyData();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = { companyData, loading, error, source };

  return (
    <CompanyDataContext.Provider value={value}>
      {children}
    </CompanyDataContext.Provider>
  );
}

/**
 * useCompanyData - Access shared company data from context
 * Returns the same cached data across all components
 * Eliminates duplicate API calls
 *
 * @returns {Object} { companyData: Object, loading: boolean, error: string, source: 'api'|'static' }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCompanyData() {
  const context = useContext(CompanyDataContext);
  if (!context) {
    throw new Error('useCompanyData must be used within CompanyDataProvider');
  }
  return context;
}
```

#### 2. Update `src/main.jsx` to Include CompanyDataProvider

```jsx
import { CompanyDataProvider } from './contexts/CompanyDataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <CompanyDataProvider>  {/* ← NEW: Wrap entire app */}
        <MenuProvider>
          <ServicesProvider>
            <LocationsProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </LocationsProvider>
          </ServicesProvider>
        </MenuProvider>
      </CompanyDataProvider>
    </HelmetProvider>
  </StrictMode>,
)
```

#### 3. Migration Strategy for Existing Files

**Phase 1: High-Priority Components** (10-15 files)
- Schema builders (menuItemSchema, serviceSchema, locationSchema, etc.)
- Core pages (App.jsx, HomePage, Footer, Navbar)
- StructuredData component

**Phase 2: Medium-Priority Components** (20-30 files)
- Individual pages (About, Contact, Services, Locations, etc.)
- Utility components (CTAs, buttons, links)

**Phase 3: Low-Priority Components** (remaining files)
- Helper functions
- Configuration files that reference COMPANY_DATA
- Test files

**Migration Pattern**:
```jsx
// OLD:
import COMPANY_DATA from '../config/company_data';

const MyComponent = () => {
  return (
    <div>
      <h1>{COMPANY_DATA.dba}</h1>
      <p>{COMPANY_DATA.contact.phone}</p>
    </div>
  );
};

// NEW:
import { useCompanyData } from '../contexts/CompanyDataContext';

const MyComponent = () => {
  const { companyData } = useCompanyData();

  return (
    <div>
      <h1>{companyData.dba}</h1>
      <p>{companyData.contact.phone}</p>
    </div>
  );
};
```

**Schema Files Migration** (Critical for API readiness):
```jsx
// OLD: src/schemas/serviceSchema.js
import COMPANY_DATA from '../config/company_data.js';

export const buildServiceSchema = (service, options = {}) => {
  // Direct COMPANY_DATA usage
  const baseUrl = COMPANY_DATA.baseUrl;
  const dba = COMPANY_DATA.dba;
  // ...
};

// NEW: Requires companyData parameter
export const buildServiceSchema = (service, companyData, options = {}) => {
  // Use passed companyData
  const baseUrl = companyData.baseUrl;
  const dba = companyData.dba;
  // ...
};

// Usage in StructuredData component:
const { companyData } = useCompanyData();
const schema = buildServiceSchema(service, companyData, options);
```

### Implementation Effort

**Company Data Context Creation:**
- Create `CompanyDataContext.jsx` - 30 minutes
- Update `main.jsx` to include provider - 5 minutes
- Test API fallback behavior - 15 minutes

**File Migrations:**
- Schema builders (8 files) - 2 hours
- Core components (Navbar, Footer, App) - 1 hour
- Pages (10 files) - 2 hours
- Utility components (20+ files) - 3 hours
- Testing and validation - 2 hours

**Total Estimated Time:** 10-12 hours

**Complexity:** Medium
- Pattern is well-established (MenuContext, ServicesContext, LocationsContext)
- Widespread usage requires careful migration
- Schema builders need parameter updates
- Risk of breaking existing functionality if not tested thoroughly

---

## Part 4: Implementation Action Plan

### Step 1: Fix Services Migration (30 minutes)

**Files to Update:**
1. `src/App.jsx` (Lines 28, 137, 165-178)
   - Remove `SERVICES_FEATURED` import
   - Filter services from context for featured items
   - Use `featuredServices` in JSX

**Validation:**
- Homepage shows 6 featured services
- Services come from API when available
- Falls back to static when API unavailable
- `source` tracking shows 'api' or 'static' in console

**Testing:**
```bash
# Run dev server
npm run dev

# Check homepage
# Open browser console, look for:
# "Services source: api" or "Services source: static"

# Test API fallback by blocking network request:
# DevTools > Network > Block request pattern > "public-services"
# Should see static fallback
```

### Step 2: Fix Locations Migration (45 minutes)

**Files to Update:**

1. `src/components/Footer.jsx` (Lines 15, 57)
   - Remove `LOCATIONS, getActiveLocations` import
   - Add `useLocations()` hook
   - Filter for active locations with useMemo

2. `src/App.jsx` (Line 17)
   - Remove `LOCATIONS` from imports
   - Update utility function calls to accept locations array param

3. `src/data/locations.js` (Refactor utilities)
   - Update `getPrimaryLocation` to accept locations param
   - Update `getActiveLocationCount` to accept locations param
   - Update `getPreferredLocation` to accept locations param
   - Maintain backward compatibility with default param = LOCATIONS

**Validation:**
- Footer location selector works
- Homepage location info shows correct data
- Locations come from API when available
- Falls back to static when API unavailable

**Testing:**
```bash
# Same as services testing above
# Check for "Locations source: api" in console
```

### Step 3: Create Company Data Context (2-3 hours)

**Tasks:**
1. Create `src/contexts/CompanyDataContext.jsx`
2. Update `src/main.jsx` to include CompanyDataProvider
3. Test basic functionality (API fetch, fallback, source tracking)
4. Document usage in comments

**Validation:**
- CompanyDataProvider wraps app
- API URL returns expected structure
- Static fallback works when API fails
- `useCompanyData()` hook accessible from any component

### Step 4: Migrate Critical Schema Files (2-3 hours)

**Priority Order:**
1. `src/schemas/menuItemSchema.js`
2. `src/schemas/serviceSchema.js`
3. `src/schemas/locationSchema.js`
4. `src/schemas/privacyPolicySchema.js`
5. `src/schemas/returnPolicySchema.js`
6. `src/schemas/webApplicationSchema.js`
7. `src/schemas/breadcrumbSchema.js`

**Pattern:**
- Add `companyData` parameter to all `build*Schema` functions
- Replace `COMPANY_DATA` references with `companyData` parameter
- Update JSDoc to document new parameter
- Update callers (StructuredData.jsx, pages) to pass companyData

### Step 5: Migrate Core Components (2 hours)

**Files:**
- `src/components/StructuredData.jsx`
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/App.jsx`

**Pattern:**
- Replace `import COMPANY_DATA` with `import { useCompanyData }`
- Call `const { companyData } = useCompanyData();`
- Replace all `COMPANY_DATA.` with `companyData.`

### Step 6: Migrate Remaining Files (3-4 hours)

**Approach:**
- Search all files: `grep -r "import.*COMPANY_DATA" src/`
- Migrate in batches of 5-10 files
- Test after each batch
- Use ESLint to catch errors

### Step 7: Testing & Validation (2 hours)

**Test Scenarios:**
1. All API endpoints working → should use API data
2. All API endpoints failing → should fallback to static
3. Individual API failures → should fallback for that resource only
4. Schemas remain valid with API data
5. No console errors or warnings
6. Performance (ensure no duplicate API calls)

**Validation Checklist:**
- [ ] Menu items load from API
- [ ] Services load from API
- [ ] Locations load from API
- [ ] Company data loads from API
- [ ] All schemas pass Rich Results Test
- [ ] Fallbacks work when APIs unavailable
- [ ] No duplicate network requests
- [ ] ESLint 0 errors
- [ ] Build succeeds
- [ ] All pages render correctly

---

## Part 5: API Contract Requirements

### Services API Endpoint

**URL:** `https://romamart.netlify.app/api/public-services`

**Required Response Structure:**
```json
{
  "success": true,
  "services": [
    {
      "id": "atm",
      "name": "ATM Services",
      "description": "24/7 cash withdrawal services",
      "category": "financial",
      "tagline": "Access cash anytime",
      "icon": "banknote",
      "status": "available",
      "featured": true,  // ← REQUIRED for homepage filtering
      "features": [
        "24/7 access",
        "Multiple currencies",
        "Low fees"
      ],
      "ageRestricted": false,
      "availableAt": ["loc-wellington-001"],
      "partner": {...},  // Optional
      "contactEmail": "...",  // Optional
      "contactUrl": "..."  // Optional
    }
  ]
}
```

**Required Fields:**
- `success` (boolean)
- `services` (array of objects)
  - `id` (string, unique)
  - `name` (string)
  - `featured` (boolean) - **NEW REQUIREMENT**
  - All other fields from current static SERVICES array

### Locations API Endpoint

**URL:** `https://romamart.netlify.app/api/public-locations`

**Required Response Structure:**
```json
{
  "success": true,
  "locations": [
    {
      "id": "loc-wellington-001",
      "type": "convenience_store",
      "name": "Roma Mart Convenience",
      "shortName": "Roma Mart 001",
      "isPrimary": true,
      "status": "open",
      "address": {
        "street": "3-189 Wellington Street",
        "city": "Sarnia",
        "province": "ON",
        "postalCode": "N7T 1G6",
        "country": "Canada",
        "formatted": "3-189 Wellington Street, Sarnia, ON N7T 1G6"
      },
      "contact": {
        "phone": "+1 (382) 342-2000",
        "email": "contact@romamart.ca"
      },
      "hours": {
        "timezone": "America/Toronto",
        "daily": {
          "Monday": "8:30 AM - 9:00 PM",
          // ... all 7 days
        },
        "display": "Mon-Thu, Sat-Sun: 8:30 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM",
        "is24Hours": false
      },
      "google": {
        "placeId": "ChIJCfo3t6SdJYgRIQVbpCppKmY",
        "mapLink": "...",
        "embedUrl": "...",
        "coordinates": {
          "lat": 42.970389,
          "lng": -82.404589
        }
      },
      "services": ["atm", "bitcoin_atm", "rocafe", "lottery"],
      "amenities": [  // ← Google-compliant structure
        { "name": "Free Wi-Fi", "value": true },
        { "name": "Wheelchair-accessible entrance", "value": true },
        { "name": "Parking", "value": true }
      ],
      "images": {
        "storefront": null,
        "interior": null
      },
      "metadata": {
        "isHeadquarters": true,
        "employees": {
          "fullTime": 3,
          "partTime": 2
        }
      }
    }
  ]
}
```

**Required Fields:**
- `success` (boolean)
- `locations` (array of objects)
  - All fields from current static LOCATIONS array
  - `amenities` must use Google-compliant structure

### Company Data API Endpoint

**URL:** `https://romamart.netlify.app/api/public-company-data`

**Required Response Structure:**
```json
{
  "success": true,
  "companyData": {
    "legalName": "Roma Mart Corp.",
    "dba": "Roma Mart Convenience",
    "gstNumber": "780971768",
    "naicsCode": "4541",
    "naicsDescription": "Grocery Stores",
    "baseUrl": "https://romamart.ca",
    "logoUrl": "https://romamart.ca/logo.png",
    "onlineStoreUrl": "https://ordering.romamart.ca",
    "endpoints": {
      "returnPolicy": "/return-policy",
      "privacy": "/privacy",
      "services": "/services",
      "locations": "/locations",
      "menu": "/menu"
    },
    "defaults": {
      "productCategory": "Food & Beverage",
      "priceRange": "$$",
      "country": "CA",
      "currency": "CAD",
      "timezone": "America/Toronto",
      "ageRestriction": "19-"
    },
    "paymentMethods": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "Interac",
      "Visa",
      "Mastercard",
      "American Express",
      "Bitcoin"
    ],
    "returnPolicy": {
      "merchantReturnDays": 1,
      "returnMethod": "https://schema.org/ReturnInStore",
      "returnFees": "https://schema.org/FreeReturn",
      "itemCondition": "https://schema.org/DamagedCondition",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow"
    },
    "socialLinks": {
      "facebook": "https://www.facebook.com/romamartca",
      "instagram": "https://www.instagram.com/romamartca/",
      "tiktok": "https://www.tiktok.com/@romamartca/",
      "snapchat": "https://www.snapchat.com/@romamartca/",
      "x": "https://www.x.com/romamartca/"
    },
    "address": {
      "street": "3-189 Wellington Street",
      "city": "Sarnia",
      "province": "ON",
      "postalCode": "N7T 1G6",
      "country": "Canada",
      "formatted": "3-189 Wellington Street, Sarnia, ON N7T 1G6"
    },
    "hours": {
      "timezone": "America/Toronto",
      "daily": {
        "Monday": "8:30 AM - 9:00 PM",
        // ... all 7 days
      }
    },
    "contact": {
      "phone": "+1 (382) 342-2000",
      "email": "contact@romamart.ca",
      "web3FormsAccessKey": "YOUR_WEB3FORMS_KEY"
    },
    "contextualEmails": {
      "general": "contact@romamart.ca",
      "privacy": "privacy@romamart.ca",
      "accessibility": "accessibility@romamart.ca",
      "technology": "technology@romamart.ca",
      "legal": "legal@romamart.ca",
      "support": "support@romamart.ca"
    },
    "location": {
      // Full primary location object from locations array
    },
    "trustpilotReviewUrl": "https://www.trustpilot.com/review/romamart.ca",
    "pwa": {
      "webApplication": {
        "name": "Roma Mart Convenience",
        "url": "https://romamart.ca",
        "description": "Shop Roma Mart online...",
        "applicationCategory": "Shopping",
        "operatingSystem": "Any (Web Browser)",
        "offers": {
          "price": "0",
          "priceCurrency": "CAD"
        },
        "browserRequirements": "Requires JavaScript...",
        "permissions": ["Location (optional, for nearest store)"]
      }
    }
  }
}
```

**Required Fields:**
- `success` (boolean)
- `companyData` (object with all fields from current COMPANY_DATA)

---

## Part 6: Benefits of Complete API Migration

### For Development Team

1. **Zero Code Changes for Data Updates**
   - Update business hours → API only
   - Add new service → API only
   - Change company contact info → API only
   - No git commits, no deployments needed

2. **Consistency Guaranteed**
   - Single API endpoint = single source of truth
   - No risk of stale data in static files
   - All pages/components see same data simultaneously

3. **Easier Testing**
   - Test with different data sets via API
   - A/B test service descriptions
   - Preview changes before going live

### For Business Team

1. **Real-Time Updates**
   - Change hours during emergencies → live instantly
   - Promote new services → show on website immediately
   - Update contact info → reflects everywhere

2. **Content Management**
   - Manage all data through admin panel
   - No need to edit code files
   - Preview changes before publishing

### For SEO & Schemas

1. **Always Accurate**
   - Hours in schemas match actual hours
   - Service offerings accurate
   - Contact info up-to-date

2. **Better Google Indexing**
   - Fresh content signals to Google
   - Accurate structured data improves rankings
   - No schema validation errors from stale data

---

## Part 7: Rollback Plan

If API migration causes issues, rollback is simple:

### Services Rollback
```jsx
// App.jsx - revert to static import
import { SERVICES_FEATURED } from './data/services.jsx';

// Change back to:
{SERVICES_FEATURED.map(...)}
```

### Locations Rollback
```jsx
// Footer.jsx - revert to static import
import { LOCATIONS, getActiveLocations } from '../data/locations';

// Change back to:
const activeLocations = getActiveLocations();
```

### Company Data Rollback
```jsx
// Any file - revert to static import
import COMPANY_DATA from '../config/company_data';

// Change back to:
const data = COMPANY_DATA.field;
```

**Static files remain unchanged** - they serve as permanent fallback.

---

## Conclusion

**Services & Locations:** 90-95% ready, only 3-4 files need updates (2-3 hours work)
**Company Data:** 0% ready, requires new context provider (10-12 hours work)

**Total Implementation:** 12-15 hours for complete API migration

**Risk:** Low - existing static files serve as permanent fallback

**Recommendation:**
1. Fix Services & Locations migration first (quick wins)
2. Create CompanyDataContext (bigger investment, highest ROI)
3. Migrate files in phases (schema → core → pages)
4. Test thoroughly at each phase

The architecture is already proven (MenuContext reference implementation). This is primarily refactoring work following an established pattern.
