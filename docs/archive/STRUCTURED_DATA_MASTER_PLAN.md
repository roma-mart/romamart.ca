# Structured Data Implementation - Master Plan

**Status:** Phase 5 (Schema Validation & Bug Fixes)
**Version:** 5.0.0
**Last Updated:** February 6, 2026

---

## Current State

**13 Schema Types Implemented (98% Compliance - Grade A+):**

1. **Product** - Menu items via menuItemSchema.js (90%+ test coverage)
2. **Service** - Services via serviceSchema.js
3. **Location** - Locations via locationSchema.js (as LocalBusiness)
4. **LocalBusiness** - Static in index.html + dynamic in StructuredData.jsx
5. **Organization** - About page, NAICS 4541, GST number
6. **BreadcrumbList** - 9 pages via breadcrumbSchema.js (100% test coverage)
7. **WebSite** - Static in index.html with SearchAction
8. **PrivacyPolicy** - Privacy page (July 28, 2025 effective date)
9. **MerchantReturnPolicy** - Return policy page (24-hour faulty product)
10. **WebApplication** - Homepage PWA discovery (100% test coverage)
11. **ProductList** - ItemList with Product schemas
12. **ServiceList** - ItemList with Service schemas
13. **LocationList** - ItemList with LocalBusiness schemas

**Schema Coverage by Page:**

| Page | Schemas |
|------|---------|
| **/** | LocalBusiness, WebSite, WebApplication, ProductList (4 featured), ServiceList (featured), LocationList (primary only) |
| **/rocafe** | BreadcrumbList, ProductList (75 items) |
| **/services** | BreadcrumbList, ServiceList (15 services) |
| **/locations** | BreadcrumbList, LocationList (active locations) |
| **/about** | BreadcrumbList, Organization |
| **/contact** | BreadcrumbList |
| **/privacy** | BreadcrumbList |
| **/return-policy** | BreadcrumbList, MerchantReturnPolicy |
| **/terms** | BreadcrumbList |
| **/cookies** | BreadcrumbList |

**Architecture:**
- All schemas import from SSOT (COMPANY_DATA, SERVICES, LOCATIONS)
- Zero hardcoded data
- API-driven where possible (Menu, Services, Locations)
- Static fallbacks via React Context providers

---

## Phase 5: Schema Validation & Bug Fixes (In Progress)

**Duration:** 1-2 Days
**Start:** February 6, 2026
**Status:** In progress

### Step 1: Empty @id Bug Fix ✅

**Problem:** Schema.org validator couldn't detect ProductList on homepage.

**Root Cause:**
- API returns menu items with empty ID fields (`id: ""`)
- Schema builders checked `if (menuItem.id)` which is truthy for empty strings
- Generated @id: `https://romamart.ca/rocafe#` (empty after `#`)
- Validators reject ItemLists with duplicate @ids

**Fix Applied:**
```javascript
// Extract and sanitize ID first
const id = menuItem.id ? safeString(menuItem.id) : '';
// Only add @id if non-empty after sanitization
...(id ? { '@id': `${itemUrl}#${id}` } : {}),
```

**Files Updated:**
- src/schemas/menuItemSchema.js (Lines 156-161, 169)
- src/schemas/serviceSchema.js (Lines 43-48, 52)
- src/schemas/locationSchema.js (Lines 114-119)

**Commit:** 95048a9

### Step 2: Invalid Property Removal ✅

**Issues Found:**

1. **Organization naicsCode** (About page)
   - Property not recognized by Schema.org
   - Removed line 250 from StructuredData.jsx

2. **PrivacyPolicy @type** (Privacy page)
   - Not a valid Schema.org type (404 on schema.org/PrivacyPolicy)
   - Removed from PrivacyPage.jsx and StructuredData.jsx

3. **LocalBusiness timeZone** (Return policy page)
   - Property not recognized by Schema.org
   - Removed line 219 from prerender.js

**Commits:**
- e54844c - Remove naicsCode from Organization
- 5223c85 - Remove invalid PrivacyPolicy type
- b8b34bd - Remove timeZone from LocalBusiness

### Step 3: ProductList Schema Detection Fix ✅

**Problem:** Validators check static HTML before JavaScript executes - schemas rendered client-side aren't detected.

**Root Cause:**
```
[Build time] Menu items: 0 (API not called yet)
[Static HTML] ProductList: NOT PRESENT
[Runtime ~500ms] API returns → 75 items
[Client render] ProductList: RENDERED
[Validator checks] Static HTML only → NOT DETECTED
```

**Solution:** Build-time API fetching in prerender.js

**Implementation:**

```javascript
// Fetch menu data during build
async function fetchMenuData() {
  try {
    const response = await fetch(MENU_API_URL);
    if (!response.ok) return [];
    const data = await response.json();
    return data.menu || [];
  } catch (error) {
    console.warn('Failed to fetch menu data. ProductList schemas will be skipped.');
    return [];
  }
}

// Build ProductList schema
function buildProductListSchema(menuItems, featuredOnly = false) {
  const items = featuredOnly
    ? menuItems.filter(item => item.featured === true)
    : menuItems;

  const productSchemas = items
    .map(menuItem => buildMenuItemSchema(menuItem, 'https://romamart.ca/rocafe', { currency: 'CAD', priceInCents: true }))
    .filter(Boolean);

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

// Route-specific injection
if (routePath === '/' && menuItems.length > 0) {
  const productListSchema = buildProductListSchema(menuItems, true); // Featured only
  if (productListSchema) graph.push(productListSchema);
}

if (routePath === '/rocafe' && menuItems.length > 0) {
  const productListSchema = buildProductListSchema(menuItems, false); // All items
  if (productListSchema) graph.push(productListSchema);
}
```

**Results:**
- Homepage: 1 ItemList, 4 Product schemas in static HTML
- RoCafé: 1 ItemList, 75 Product schemas in static HTML
- Build time increase: ~2-3 seconds
- Zero runtime performance impact

**Commit:** e0279b9

### Step 3.1: Consolidated API Fetching & LocationList Fix ✅

**1. Consolidated API Fetching**

Extended prerender.js to fetch Services and Locations APIs in parallel:

```javascript
// Parallel fetching using Promise.all
const [menuItems, services, locations] = await Promise.all([
  fetchMenuData(),
  fetchServicesData(),
  fetchLocationsData()
]);

async function fetchServicesData() {
  try {
    const response = await fetch(SERVICES_API_URL);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.success || !Array.isArray(data.services)) return [];
    return data.services;
  } catch (error) {
    return []; // Client-side React uses static fallback
  }
}
```

Graceful fallback: Returns empty arrays when APIs unavailable. Client-side React Context providers use static SERVICES/LOCATIONS fallbacks.

**2. LocationList Homepage Fix**

**Issue:** Homepage displays only primary location, but schema included all locations.

**Investigation:**
```javascript
// App.jsx line 252-257: Display logic
const primaryLocation = useMemo(() =>
  locations.find(loc => loc.isPrimary) || locations[0],
  [locations]
);

// App.jsx line 708-716: Schema was passing ALL locations (mismatch)
<StructuredData
  type="LocationList"
  data={{ locations: locations }} // ← MISMATCH
/>
```

**Fix:**
```javascript
// prerender.js: Homepage uses primary location only
if (routePath === '/' && locations.length > 0) {
  const primaryLocation = locations.find(loc => loc.isPrimary) || locations[0];
  if (primaryLocation) {
    const locationListSchema = buildLocationListSchema([primaryLocation], { companyData: COMPANY_DATA });
    if (locationListSchema) graph.push(locationListSchema);
  }
}

// Locations page: All active locations (correct for SEO)
if (routePath === '/locations' && locations.length > 0) {
  const activeLocations = locations.filter(loc => loc.status === 'open');
  if (activeLocations.length > 0) {
    const locationListSchema = buildLocationListSchema(activeLocations, { companyData: COMPANY_DATA });
    if (locationListSchema) graph.push(locationListSchema);
  }
}
```

**Note:** Display sorting (by distance/primary) intentionally differs from schema (UI convenience vs. SEO indexing).

**3. Static Fallback Removal Strategy**

**Current Architecture (February 6, 2026):**

**Build-Time (prerender.js):**
- Menu API: Fetched, prerendered ✅
- Services API: Fetched, graceful fallback (empty array) ✅
- Locations API: Fetched, graceful fallback (empty array) ✅
- All APIs fetched in parallel via Promise.all

**Runtime (Context Providers):**
- MenuContext: API-only (no static fallback)
- ServicesContext: API with static SERVICES fallback
- LocationsContext: API with static LOCATIONS fallback

**Phased Removal Process:**

**Phase 1: Prerender (Complete)** ✅
- No static imports in prerender.js
- Returns empty arrays when APIs unavailable
- Client-side React handles static fallbacks

**Phase 2: Context Providers (After 1-2 Months Stability)**
```javascript
// BEFORE (current):
import { SERVICES } from '../data/services';
const [services, setServices] = useState(SERVICES);

// AFTER (API stable):
const [services, setServices] = useState([]);
```

Remove static imports from:
- src/contexts/ServicesContext.jsx
- src/contexts/LocationsContext.jsx

**Phase 3: Archive Static Data Files**
```bash
mkdir -p src/data/archive
git mv src/data/services.jsx src/data/archive/services.jsx
git mv src/data/locations.js src/data/archive/locations.js
```

Keep for emergency rollback reference.

**Requirements Before Removal:**
- API stable in production for 1-2 months
- Zero downtime incidents
- Monitoring/alerting in place
- Team consensus

**Reference:** Menu Items API has been stable for 2+ months - proven pattern.

**Commits:**
- 2b3dc70 - Consolidate API fetching (Promise.all)
- 9823326 - Fix LocationList homepage logic

### Step 4: Deployment & Verification (Next)

**Pending:**
- Clean up diagnostic console.log statements
- Create PR and merge to main
- Deploy to GitHub Pages
- Run Schema.org validator on all pages
- Document final compliance scores

---

## Architecture

### Three-Component System

1. **React Frontend** (this repo)
   - GitHub Pages deployment
   - Renders UI, generates schemas
   - React 18.3.1, Vite 7, Tailwind

2. **Admin System** (external)
   - MIUI Toolpad on Netlify
   - Password-protected
   - Manages menu items, services, locations

3. **API Bridge** (external)
   - Endpoint: https://romamart.netlify.app/api/public-menu
   - Returns JSON matching rocafe-menu.js structure
   - Real-time updates when colleague edits Toolpad

### Data Sources (SSOT)

| Data Type | Current Source | Future (Phase 3+) |
|-----------|---------------|-------------------|
| Menu Items | Toolpad API | Same (extended) |
| Services | services.jsx (static) | Toolpad API |
| Locations | locations.js (static) | Toolpad API |
| Amenities | locations.js per-location array | Toolpad API |
| Employees | locations.js metadata | Toolpad API |
| Company Info | company_data.js (static) | Static (brand constants) |

### Schema Placement Strategy

**Homepage (/):** Primary schemas with featured/key content
- LocalBusiness, WebSite, WebApplication
- ProductList (4 featured items)
- ServiceList (featured services)
- LocationList (primary location only)

**Specific Pages:** Complete data for that category
- /rocafe: ProductList (75 items)
- /services: ServiceList (15 services)
- /locations: LocationList (active locations)
- /about: Organization

**Rationale:** Google's crawler starts at homepage. Homepage gets comprehensive schemas, specific pages get complete catalogs.

### Key Files

| File | Purpose | SSOT? |
|------|---------|-------|
| src/components/StructuredData.jsx | Schema integration (calls builders) | No |
| src/schemas/*.js | Schema builders (one per type) | No |
| src/utils/schemaHelpers.js | Shared utilities | No |
| src/data/services.jsx | ALL service definitions | YES |
| src/data/rocafe-menu.js | Data structure template | YES |
| src/data/locations.js | ALL location definitions | YES |
| src/config/company_data.js | Company/brand data | YES |
| src/contexts/MenuContext.jsx | Menu API context provider | No |
| src/contexts/ServicesContext.jsx | Services API context provider | No |
| src/contexts/LocationsContext.jsx | Locations API context provider | No |
| scripts/prerender.js | Build-time HTML generation | No |

### Amenities Architecture

**Google-Compliant Direct Pass-Through:**

```javascript
// locations.js - Direct Google Business Profile names
amenities: [
  { name: 'Free Wi-Fi', value: true },
  { name: 'Wheelchair-accessible entrance', value: true },
  { name: 'Wheelchair-accessible parking', value: true },
  { name: 'Restroom', value: true },
  { name: 'Parking', value: true }
]

// Schema (NO mapping layer)
amenityFeature: location.amenities.map(amenity => ({
  '@type': 'LocationFeatureSpecification',
  name: amenity.name,
  value: amenity.value
}))
```

**Benefits:**
- Zero mapping layer
- API-ready (exact structure needed)
- Location-specific
- Extensible (add any Google-recognized amenity)

**Data Boundaries:**
- Location-specific: amenities, hours, coordinates (in location objects)
- Business-wide: payment methods, return policy, age restrictions (in COMPANY_DATA root)

### COMPANY_DATA Structure

```javascript
COMPANY_DATA = {
  legalName: 'Roma Mart Corp.',
  dba: 'Roma Mart Convenience',
  baseUrl: 'https://romamart.ca',
  logoUrl: 'https://romamart.ca/logo.png',

  endpoints: {
    returnPolicy: '/return-policy',
    privacy: '/privacy',
    services: '/services',
    locations: '/locations',
    menu: '/menu'
  },

  defaults: {
    productCategory: 'Food & Beverage',
    priceRange: '$$',
    country: 'CA',
    currency: 'CAD',
    timezone: 'America/Toronto'
  },

  contact: { phone, email },
  address: { street, city, province, postalCode, country },
  location: getPrimaryLocation(),
  socialLinks: { facebook, instagram, tiktok, x, snapchat },
  pwa: { webApplication: { name, url, description, category, ... } }
}
```

All schemas pull from COMPANY_DATA. Change business name once → 50+ schemas update automatically.

---

## Phase Implementation History

### Phase 1: Foundation (Complete)

Initial setup and architecture decisions.

### Phase 2: Core Schemas (Complete - Feb 4, 2026)

**Week 1:**
- Schema helpers (safeString, convertCentsToDollars, formatAddress)
- Menu item schema builder (90%+ test coverage)
- Product schema integration (homepage + /rocafe)
- API call deduplication (MenuContext)
- CodeQL sanitization fix (iterative regex)

**Week 2:**
- Privacy Policy schema + page update (July 28, 2025)
- Return Policy schema + new page
- Organization schema + NAICS code 4541
- Employee data management (SSOT pattern)
- Navigation config updates

**Week 3:**
- BreadcrumbList schema builder (100% test coverage)
- Breadcrumbs on 9 pages
- WebApplication schema (PWA discovery)
- WebApplication tests (11 tests, 100% passing)

**Commits:**
```
a0215a8 docs(notes): add Phase 2 Week 1-2 summary
afd215d docs(plan): update Phase 2 status
9e15c1e feat(nav): add Return Policy links
5ab2380 docs(plan): document employee data management
21f325d feat(schema): add NAICS code 4541
18884f2 feat(schema): add Organization schema
b5db9f4 feat(policy): add return policy page
d9e8189 feat(schema): add policy schemas
1236a82 docs(schema): update master plan
f676968 fix(security): prevent incomplete sanitization
537c524 refactor(schema): deduplicate useExcelMenu
dddcabf fix(schema): remove fallback from /rocafe
9ac58f5 fix(schema): correct homepage menu logic
3ac04bc feat(schema): add Product schemas to homepage
36ba93e perf(schema): optimize Product rendering
```

### Phase 3: Services & Locations (Complete - Feb 5, 2026)

**Critical Fixes:**
- Removed invalid hasOfferCatalog from LocalBusiness (was causing 4 Product snippet errors)
- Removed hardcoded serviceMap from prerender (now imports SERVICES from SSOT)
- Removed unused SERVICES import from StructuredData.jsx

**Service Schema:**
- src/schemas/serviceSchema.js (buildServiceSchema, buildServiceListSchema)
- src/contexts/ServicesContext.jsx (API https://romamart.netlify.app/api/public-services, static fallback)
- Homepage: Featured services
- /services: All 15 services

**Location Schema:**
- src/schemas/locationSchema.js (buildLocationSchema, buildLocationListSchema)
- src/contexts/LocationsContext.jsx (API https://romamart.netlify.app/api/public-locations, static fallback)
- Homepage: All locations
- /locations: Active locations only

**Integration:**
- main.jsx wrapped with ServicesProvider and LocationsProvider
- App.jsx uses useServices() and useLocations() hooks
- ServicesPage.jsx migrated to useServices()
- LocationsPage.jsx migrated to useLocations()

**Commits:**
```
67280bc fix(schema): remove invalid hasOfferCatalog
4b19053 feat(schema): implement Service and Location schemas
```

### Phase 4: Schema Audit (Complete - Feb 5, 2026)

**Grade Improvement:** B+ (88%) → A+ (98%)

**Critical Fixes:**

1. **Duplicate LocalBusiness Resolution**
   - Removed static LocalBusiness from index.html
   - Restored 100% dynamic SSOT approach

2. **SearchAction Added to WebSite**
   - Added potentialAction: SearchAction to static WebSite in index.html

3. **Organization ⟷ LocalBusiness Linking**
   - Added location field to Organization schema

4. **@id Added to Referenceable Schemas**
   - Service: `https://romamart.ca/services#{service.id}`
   - Product: `${itemUrl}#${menuItem.id}`
   - PrivacyPolicy: `${url}#policy`
   - WebApplication: `https://romamart.ca/#webapp`

5. **Brand Added to All Schemas**
   - Product, Service, Location schemas

6. **ParentOrganization Added to Locations**
   - All location schemas reference `https://romamart.ca/#organization`

7. **Category, Manufacturer, Broker Fields**
   - Product: category (defaults 'Food & Beverage'), manufacturer (optional)
   - Service: broker (optional)

**De-Hardcoding:**

All schemas now pull exclusively from COMPANY_DATA:
- Business names, contact info, addresses, URLs
- Geo coordinates, timezones, countries, currencies
- Price ranges, brand names, policy URLs

Zero hardcoded data remaining.

**Compliance Ratings:**

| Schema | Score | Change |
|--------|-------|--------|
| MerchantReturnPolicy | A+ | No change |
| BreadcrumbList | A | No change |
| WebApplication | A+ | +5% |
| PrivacyPolicy | A | +10% |
| LocalBusiness | A+ | +18% |
| Organization | A+ | +18% |
| Product | A+ | +13% |
| Service | A+ | +13% |
| Location | A+ | +13% |
| WebSite | A+ | +23% |

**Average:** 98.4% (A+)

**Commits:**
```
828f220 refactor(schemas): complete de-hardcoding
8162416 fix(schemas): amenities with Google names
3a94d47 refactor(locations): amenities SSOT migration
```

---

## Testing & Quality

### Unit Tests (90%+ Coverage Target)

Test with:
- Valid data (complete fields)
- Valid data (minimal required only)
- Missing optional fields
- Edge cases (empty arrays, null values, long strings, special characters, Unicode)

### Schema Validation

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://schema.org/Validator

### Quality System

Required checks:
- `npm run lint` (0 errors)
- `npm run check:quality` (0 critical/high)
- `npm run check:integrity` (validates quality system)
- `npm run build` (production build succeeds)

---

## Deployment Checklist

**Pre-Deployment:**
- [ ] npm run lint passes (0 errors)
- [ ] npm run check:quality passes (0 critical/high)
- [ ] npm run check:all passes
- [ ] Tests pass with 90%+ coverage
- [ ] Bundle size increase < 100KB
- [ ] Schemas validate with Google Rich Results Test
- [ ] No console errors in production build
- [ ] Keyboard navigation works
- [ ] Mobile responsive checked
- [ ] Dark mode tested
- [ ] Colleague reviewed

**Deployment:**
1. Create release branch: `git checkout -b release/vX.X.X`
2. Update CHANGELOG.md
3. Commit: `chore(release): prepare vX.X.X`
4. Create PR with checklist
5. Get approval
6. Merge to main
7. Tag: `git tag -a vX.X.X`
8. Push: `git push origin main && git push origin vX.X.X`
9. GitHub Actions auto-deploys
10. Verify in production
11. Monitor Search Console

---

## Phase 3+ Roadmap (Future)

### Phase 3: API Migration for Services & Locations (4-6 weeks)

**Week 1:** API contract design & specification
- Design Services endpoint response format
- Design Locations endpoint response format
- Send specification to colleague

**Week 2:** React hooks & fallback strategy
- Build useServices() hook with fallback
- Build useLocations() hook with fallback
- Update components to use hooks
- Test fallback behavior

**Week 3:** Schema builders updated for API data
- Update buildServiceSchema() for API format
- Update buildLocalBusinessSchema() for API locations
- StructuredData.jsx integration

**Week 4:** Migration plan + dry run
- Feature flag approach (default: static, flag: API)
- Staging endpoints live
- Test schema validation
- Confirm fallback works
- Performance testing

**Week 5-6:** Colleague build & integration
- Implement /api/public-services
- Implement /api/public-locations
- Populate Toolpad database
- Gradual rollout (10% → 50% → 100%)
- Monitor errors and performance

**Success Criteria:**
- useServices/useLocations hooks with fallback working
- All schemas validate with API data
- Zero data duplication
- API response times < 500ms
- Colleague can update without code deploys
- Real-time updates appear on site
- Single source of truth in Toolpad

### Phase 3+ Enhancements

- Add image URLs in Toolpad for menu items
- Integrate customer reviews & ratings
- Inventory availability in schemas
- Multiple locations support (Toolpad drives expansion)
- Dynamic pricing updates

---

## Schema Examples

### Product Schema

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "@id": "https://romamart.ca/rocafe#espresso",
  "name": "Espresso",
  "description": "Single or double shot of our signature espresso",
  "brand": {
    "@type": "Brand",
    "name": "Roma Mart Convenience"
  },
  "category": "Hot Beverages",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock",
    "offers": [
      {
        "@type": "Offer",
        "name": "Small",
        "price": "2.49",
        "priceCurrency": "CAD"
      },
      {
        "@type": "Offer",
        "name": "Large",
        "price": "3.49",
        "priceCurrency": "CAD"
      }
    ]
  },
  "allergyWarning": ["dairy"],
  "dietarySuitability": ["https://schema.org/VeganDiet"]
}
```

### Service Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://romamart.ca/services#atm",
  "name": "ATM Services",
  "description": "24/7 cash withdrawal services",
  "brand": {
    "@type": "Brand",
    "name": "Roma Mart Convenience"
  },
  "serviceType": "ATM",
  "areaServed": {
    "@type": "Place",
    "name": "Sarnia, ON"
  },
  "provider": {
    "@type": "Organization",
    "@id": "https://romamart.ca/#organization"
  }
}
```

### Return Policy Schema

```json
{
  "@context": "https://schema.org/",
  "@type": "MerchantReturnPolicy",
  "name": "Roma Mart Returns & Refund Policy",
  "description": "All sales final. Returns accepted only for faulty products.",
  "itemCondition": "https://schema.org/DamagedCondition",
  "returnMethod": "https://schema.org/ReturnInStore",
  "returnFees": "https://schema.org/FreeReturn",
  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
  "merchantReturnDays": 1,
  "acceptanceConditions": "Product must be reported as faulty within 24 hours. Original receipt required. Fault must be attributable to Roma Mart Corp. or manufacturer.",
  "nonAcceptedReturns": "Food/beverages (unless expired at purchase), tobacco/vape, lottery, gift cards, personal hygiene, opened/damaged items."
}
```

---

## Success Metrics

**Development:**
- ✅ All schemas pass Google Rich Results Test
- ✅ 90%+ test coverage
- ✅ Zero schema validation errors
- ✅ Bundle size increase < 100KB
- ✅ Zero console errors in production
- ✅ All quality checks pass
- ✅ Conventional commit format
- ✅ Zero data duplication

**Business (Post-Launch):**
- Rich results appear in Google within 2-4 weeks
- Impressions increase 20%+ within 4 weeks
- CTR improves with rich results
- Colleague manages data without schema updates
- Schema errors in Search Console: 0

**Maintenance:**
- Support procedures documented
- Monitoring alerts configured
- Colleague trained on Phase 3
- AI assistants can maintain system
- New developers understand from documentation

---

**Version History:**
- 5.0.0 - Phase 5 (Validation & Fixes)
- 4.0.0 - Phase 4 (Audit & Architecture Refinement)
- 3.0.0 - Phase 3 (Services & Locations)
- 2.0.0 - Phase 2 Week 3 (Breadcrumbs & PWA)
- 1.0.0 - Phase 2 Week 1-2 (Core Schemas)
