# Structured Data Implementation - Master Plan

**Status:** Ready for Phase 2 Implementation  
**Last Updated:** February 4, 2026  
**Version:** 1.0.1 (Aligned with actual codebase & standards)  
**Created By:** GitHub Copilot + Roma Mart Team  
**Audience:** Development team, colleague, AI assistants (for continuity)

---

## Executive Summary

Roma Mart 2.0 needs structured data (JSON-LD schemas) to improve Google Search visibility for menu items, services, and location information.

### Current State

- ✅ LocalBusiness schema exists (basic)
- ❌ Zero Product schemas for menu items (CRITICAL GAP - ~40% of searchable content)
- ❌ Service schemas hardcoded in StructuredData.jsx instead of imported from SERVICES (data duplication problem)
- ❌ Return Policy schema missing
- ❌ Location schema incomplete (missing services details)

### What We're Doing

Building intelligent schema builders following Roma Mart's development ethos (Systems over spot fixes, SSOT principle, quality enforcement). Schema builders will import data from official sources (SERVICES array, locations.js, rocafe-menu.js) and dynamically generate valid schema.org JSON-LD, avoiding all duplication.

### Why This Matters

Menu items + services account for ~40% of searchable content. Without proper schemas, Google Search can't understand what Roma Mart sells, reducing visibility and traffic. Rich results also improve click-through rates by 20-30%.

### Alignment with Development Ethos

- **Principle #1:** Systems over spot fixes (comprehensive schema builders, not ad-hoc patches)
- **Principle #16:** Cohesive design tokens & single source of truth (import from SERVICES, locations.js, rocafe-menu.js)
- **Principle #25:** Deep understanding before action (completed - full codebase review)

### Timeline

4 weeks (Phase 2 implementation) + 4-6 weeks (Phase 3 migration to Toolpad APIs)

---

## Part 1: Architecture & Current Understanding

### Schema Placement Strategy

**Architecture Decision:** All structured data resides on the **homepage (/)** as the primary source.

**Why Homepage:**

- Google's crawler always starts at homepage for business schema discovery
- Local business best practice: comprehensive schemas on root URL
- SPA routing means individual pages only render when visited
- Ensures complete business data even if not all pages crawled
- Modern browsers/Google handle large JSON-LD efficiently (~50KB for all schemas)

**Implementation:**

```text
Homepage (/) - PRIMARY SCHEMAS (All Business Data):
├── LocalBusiness (complete with services)
├── WebSite
├── ItemList (all 24+ RoCafé menu products)
├── ServiceList (all services)
├── LocationList (all store locations)
└── AggregateRating (reviews)

Specific Pages - REDUNDANT SCHEMAS (Optional, Google ignores duplicates):
├── /rocafe - ItemList (products)
├── /services - ServiceList
├── /locations - LocationList
└── /about - Organization
```

**Performance Impact:** Negligible (~50KB JSON-LD doesn't block rendering)

**Prerender vs Runtime Behavior:**

- **Prerendered HTML:** Contains LocalBusiness + WebSite schemas (from `scripts/prerender.js`)
- **After Hydration:** React adds ItemList with all Product schemas to `<head>`
- **Google Impact:** None (Googlebot renders JavaScript and sees all schemas)
- **Future Enhancement:** Modify prerender script to include Product schemas in @graph for instant visibility

### Three-Component System

Roma Mart operates across three distinct systems that must work together:

#### Component 1: React Frontend (This Repo)

- GitHub repository (c:\src\romamart.ca)
- Deployed: GitHub Pages
- Role: Renders UI, generates and injects schemas
- Technologies: React 19, Vite 7, React Helmet, Tailwind

#### Component 2: Colleague's Admin System (External)

- Platform: MIUI Toolpad
- URL: [https://romamart.netlify.app/](https://romamart.netlify.app/) (password protected)
- Deployed: Netlify
- Role: Manages menu items, prices, allergens, dietary info
- Interface: PriceBook (like a spreadsheet-based CMS)
- Future: Will also manage services and locations (Phase 3)

#### Component 3: API Bridge (External)

- Endpoint: [https://romamart.netlify.app/api/public-menu](https://romamart.netlify.app/api/public-menu)
- Returns: JSON array of menu items (colleague's system)
- Format: Matches rocafe-menu.js structure with prices in cents from API
- Updates: Real-time when colleague edits items in Toolpad

### Data Sources (SSOT - Single Source of Truth)

| Data Type | Current Source | Format | Future (Phase 3+) |
| --- | --- | --- | --- |
| Menu Items | Colleague's Toolpad (API) | JSON via endpoint | Same (extended) |
| Services | services.jsx (static) | JavaScript array | Colleague's Toolpad + API |
| Locations | locations.js (static) | JavaScript array | Colleague's Toolpad + API |
| Company Info | company_data.js (static) | JavaScript object | Static (brand constants) |

### The rocafe-menu.js Reality

**What it's NOT:** Not a fallback menu database. Not a deprecated system.

**What it IS:** The authoritative data structure template showing all supported fields:

```javascript
{
  itemType: 'menu',
  id: 'item-001',
  name: 'Espresso',
  tagline: 'Rich and bold',
  description: 'Single or double shot of our signature espresso',
  image: null,
  badge: null,
  categories: ['coffee', 'hot-drinks'],
  sizes: [
    { size: 'Small', price: 249 },   // Prices in CENTS from API
    { size: 'Large', price: 349 }
  ],
  allergens: ['dairy'],              // If milk added
  dietary: ['vegan-option'],         // If applicable
  featured: false,
  status: 'available',
  ageRestricted: false
}
```

**Where used:**

- API responses from colleague's Toolpad match this structure exactly
- Schema builders use this as type reference for field mapping
- UI components use this for rendering with excelMenuTransform
- Tests validate against this structure
- Falls back to static ROCAFE_FULL_MENU if API fails

### Key Files & Their Actual Purpose

| File | Purpose | SSOT? | Notes |
| --- | --- | --- | --- |
| src/components/StructuredData.jsx | Schema generation & injection | No (integration layer) | Needs refactoring - imports hardcoded services instead of SERVICES array |
| src/data/rocafe-menu.js | Data structure template + static fallback | Yes for schema template | 309 lines, 4 example items showing all field types |
| src/data/services.jsx | ALL service definitions | YES | 444 lines, 12+ services with complete metadata. StructuredData should import this. |
| src/data/locations.js | ALL location definitions | YES | 544 lines, location services array, hours, contact. Primary location = HQ. |
| src/config/company_data.js | Company/HQ data, social links | YES | Imports primary location from locations.js as fallback |
| src/hooks/useExcelMenu.js | Fetches menu from API | No (integration) | Calls [https://romamart.netlify.app/api/public-menu](https://romamart.netlify.app/api/public-menu) |
| src/utils/excelMenuTransform.jsx | Transforms API data for UI | No (transformation) | Price conversion, field mapping for display |

---

## Part 2: Current Problems (What Needs Fixing)

### Problem 1: Zero Product Schemas (CRITICAL)

**File:** src/components/StructuredData.jsx  
**Issue:** Generates LocalBusiness schema only. Menu items have no schemas.  
**Impact:** Google can't understand what Roma Mart sells (~40% of content invisible to search).  
**Fix:** Build `buildMenuItemSchema()` function (Phase 2, Week 1)

### Problem 2: Service Data Disconnection (HIGH)

**File:** src/components/StructuredData.jsx (lines 73-82)  
**Issue:** Hardcodes 10 service mappings in serviceMap instead of importing SERVICES array from services.jsx  
**Impact:** Duplication = maintenance nightmare. If services.jsx updates, schemas don't. Violates SSOT principle.  
**Example of duplication:**

```jsx
// Current PROBLEM: Hardcoded in StructuredData.jsx
const serviceMap = {
  atm: { name: 'ATM Services', type: 'Service', description: '...' },
  bitcoin_atm: { name: 'Bitcoin ATM', type: 'Service', description: '...' },
  // ... 8 more hardcoded
};

// Source of truth being ignored:
// import { SERVICES } from '../data/services'; // NOT imported!
```

**Fix:** Import SERVICES array directly, build `buildServiceSchema()` (Phase 2, Week 2)

### Problem 3: Price Format Mismatch (HIGH)

**File:** Multiple (useExcelMenu, StructuredData, excelMenuTransform)  
**Issue:** API sends prices in cents (499), schemas need dollars ("4.99")  
**Impact:** Price data incorrect in Google Search results.  
**Current handling:** excelMenuTransform handles display conversion, but schema generation doesn't.  
**Fix:** Build `convertCentsToDollars()` utility, use consistently (Phase 2, Week 1-2)

### Problem 4: Missing Return Policy Schema (MEDIUM)

**File:** StructuredData.jsx  
**Issue:** No ReturnPolicy schema implemented.  
**Impact:** Return policy not searchable in Google Shopping / Google Business.  
**Fix:** Build `buildReturnPolicySchema()` (Phase 2, Week 2)

### Problem 5: Incomplete Location Schemas (MEDIUM)

**File:** StructuredData.jsx (lines 14-61)  
**Issue:** LocalBusiness schema exists but doesn't fully utilize locations.js data. Services not in schema even though they're available.  
**Impact:** Location details not fully searchable. Services not connected to locations in schema.  
**Current data available but unused:**

- locations.js has complete location details, hours, services array
- StructuredData.jsx hardcodes service mappings instead of using location.services

**Fix:** Enhance LocalBusiness schema to pull full data from locations.js (Phase 2, Week 2)

### Problem 6: Return Policy Not Published (MEDIUM)

**File:** Missing - no /return-policy page exists  
**Issue:** Return policy exists in-store as poster but not on website. No searchable policy page. Schema won't render properly without policy URL.  
**Impact:** Policy not searchable. Customers can't find policy online. Return Policy schema incomplete without URL.  
**Fix:** Create /pages/ReturnPolicyPage.jsx during Phase 2, Week 2

### Problem 7: Privacy Policy Outdated & Missing Schema (MEDIUM)

**File:** src/pages/PrivacyPage.jsx (Effective Date: November 30, 2025 - SHOULD BE July 28, 2025)  
**Issue:** PrivacyPage exists but doesn't match actual in-store Privacy Policy Notice (Updated 28.07.25). Missing details: CCTV, PIPEDA-specific language, data retention specifics, third-party policy. No PrivacyPolicy schema implemented.  
**Missing from current page:**

- Collection of purchase history for loyalty/returns
- CCTV footage collection and retention
- Specific CCTV auto-deletion policy
- Explicit "no third-party sharing unless required by law" language
- Consent language ("by shopping... you consent")
- Response time: 30 days for access requests

**Impact:** Website policy doesn't match in-store policy (compliance issue). Privacy Policy schema missing (searchability, legal compliance). Customers see incomplete information.  
**Fix:** Update /src/pages/PrivacyPage.jsx + create PrivacyPolicy schema during Phase 2, Week 2/3

### Problem 8: Cookie Policy Schema Missing (LOW)

**File:** src/pages/CookiesPage.jsx exists but has no schema  
**Issue:** CookiesPage exists but no CookieConsent or WebSite schema with cookieConsentManagement.  
**Impact:** Cookie consent not structured for search or compliance tools.  
**Fix:** Add CookieConsent schema to CookiesPage during Phase 2, Week 3 (optional, low priority)

---

## Part 3: Phase 2 Implementation Plan (4 Weeks)

### Week 1: Menu Item Schemas (Foundation)

**Goal:** Build schema generation for menu items, validate with Google

#### Day 1-2: Setup & Architecture

- Read through this plan (Part 1-2)
- Review rocafe-menu.js field mappings (60 lines)
- Review useExcelMenu.js API contract (40 lines)
- Create `src/utils/schemaHelpers.js` with utility functions:
  - `convertCentsToDollars(cents)` → returns "4.99"
  - `buildAggregateRating(reviews)` → aggregateRating object (optional, for future)
  - `formatAddress(addressObj)` → formatted string
  - `safeString(str)` → sanitized text

**Commit:** `feat(schema): add schema utility helpers`

**Quality Checks:**

- Run `npm run lint`
- Run `npm run check:quality` (must pass with 0 critical/high)

#### Day 3-4: Build Menu Item Schema Builder

- Create `src/schemas/menuItemSchema.js` with `buildMenuItemSchema(menuItem, baseUrl)` function
- Maps rocafe-menu.js/API fields to schema.org Product fields:
  - `name` → Product.name
  - `description` → Product.description
  - `tagline` → Product.description (short version)
  - `sizes[].price` (cents) → Offer.price (dollars string)
  - `sizes[].size` → Offer.name
  - `categories` → Product.keywords
  - `dietary` → Product.dietarySuitability
  - `allergens` → Product.allergyWarning
  - `featured` → Product.position (optional)

- Handle edge cases:
  - Multiple sizes = AggregateOffer with multiple Offers
  - Single size = single Offer (no aggregate)
  - Missing fields = omit from schema (don't add null)
  - Prices in cents = convert to dollars with 2 decimals
  - No image = omit image field

- Write tests in `src/test/schemas/menuItemSchema.test.js`:
  - Test single-size item
  - Test multi-size item
  - Test price conversion accuracy
  - Test missing field handling
  - Test allergen mapping
  - Target: 90%+ coverage

**Commit:** `feat(schema): implement buildMenuItemSchema() function`

#### Day 5: Integration & Testing

- Integrate into StructuredData.jsx:
  - Import `buildMenuItemSchema` from schemas/menuItemSchema.js
  - Call it for each menu item in renderSchema() switch statement
  - Add case 'Product' in switch statement
  - Test with real API data via useExcelMenu hook

- Create test data file: `src/test/fixtures/menu-items.json` with 5 representative items

- Validate with Google Rich Results Test:
  - Go to [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
  - Paste schema JSON
  - Verify no errors

- Test with multiple sizes, allergens, dietary tags

**Commit:** `feat(schema): integrate menu item schemas into StructuredData`

**Success Criteria for Week 1:**

- ✅ buildMenuItemSchema() generates valid schema.org Product JSON-LD
- ✅ Passes Google Rich Results Test with no errors
- ✅ 90%+ test coverage
- ✅ Price conversion tested (499 cents = "4.99")
- ✅ All edge cases handled (missing fields, multiple sizes)
- ✅ npm run check:quality passes
- ✅ All commits follow conventional commit format
- ✅ No console warnings or errors

### Week 2: Services, Locations, & Return Policy

**Goal:** Complete all remaining schema builders, fix data duplication

#### Day 1-2: Service Schema Builder

- Create `src/schemas/serviceSchema.js` with `buildServiceSchema(service)` function
- Maps SERVICES array fields:
  - `name` → Service.name
  - `description` → Service.description
  - `category` → Service.serviceType
  - `icon` → Service.icon (optional, include URL if available)
  - `features` → Service.featureList (array)

- Handle services without prices (services are free by nature)
- Import SERVICES directly from `../data/services`

- Write tests: 90%+ coverage

**Commit:** `feat(schema): implement buildServiceSchema()`

#### Day 2-3: Location & Return Policy Schemas

- Enhance `buildLocalBusinessSchema()` in StructuredData.jsx:
  - Add full address components from locations.js
  - Add phone, email, social profiles from company_data.js
  - Add service offerings (use location.services array)
  - Add opening hours from locations.js with proper schema
  - Add geo coordinates from locations.js

- Create `src/schemas/returnPolicySchema.js` with `buildReturnPolicySchema()`:
  - Based on actual Returns & Refund Policy (Revised 27.07.2025)
  - itemCondition: "Faulty" (not just "Unused" - only faulty items accepted)
  - returnMethod: "In-store" (in-person, not by mail)
  - returnFees: "Free"
  - returnPeriodDays: 1 (must report within 24 hours of purchase)
  - acceptanceConditions: Fault must be clearly attributable to Roma Mart Corp. Original receipt and packaging required.
  - nonAcceptedReturns: Food/beverages, tobacco, lottery, gift cards, personal hygiene, opened/damaged items
  - Include policy URL: points to /return-policy page (create this page if not exists)
  - Currency: CAD (not USD - Ontario, Canada)

- Write tests: 90%+ coverage
  - Test that policy correctly identifies non-returnable items
  - Test 24-hour window condition
  - Test faulty vs. customer damage distinction

**Note:** If /return-policy page doesn't exist, create it during this phase. It should display the actual policy text so it's searchable and linked from schema.

- **BONUS (same time):** Update /src/pages/PrivacyPage.jsx to match actual in-store Privacy Policy Notice (Updated 28.07.25):
  - Change Effective Date from November 30, 2025 to July 28, 2025
  - Add to Information We Collect:
    - Purchase history for loyalty programs or returns
    - Video footage from in-store security cameras (CCTV)
  - Add to Why We Collect This Information:
    - Managing customer loyalty programs (optional)
    - Ensuring the safety and security of staff and customers
    - Complying with legal and regulatory requirements
  - Add to How We Protect It:
    - "We do not sell or share your personal information with third parties unless required by law."
  - Add to How Long We Keep Your Data:
    - "CCTV footage is retained for a limited time and automatically deleted unless required for a security investigation."
    - "Customer data (e.g. loyalty program) is kept only as long as needed to provide you with service."
  - Add Consent clause at end of Your Rights section:
    - "This privacy policy is displayed in-store, available at the checkout and upon request. By shopping with us or participating in store programs, you consent to this policy."

- Create `src/schemas/privacyPolicySchema.js` with `buildPrivacyPolicySchema()`:
  - @type: PrivacyPolicy or Organization with privacyPolicy property
  - name: "Roma Mart Privacy Policy"
  - url: "/privacy"
  - dataCoverage: specifies what data is collected
  - dataUsage: specifies how data is used
  - dataProtection: specifies protection methods
  - dataRetention: specifies retention periods
  - userRights: specifies PIPEDA rights
  - contactInfo: points to [privacy@romamart.ca](mailto:privacy@romamart.ca) and phone

**Commit (separate):** `feat(schema): add privacy policy schema`  
**Commit:** `refactor(schema): integrate all schemas, remove hardcoded service duplication`

#### Day 4-5: Integration & Remove Duplication

- Integrate all new schemas into StructuredData.jsx
- **CRITICAL:** Remove hardcoded serviceMap (lines 73-82)
- Import SERVICES array from services.jsx
- Use buildServiceSchema() for dynamic generation
- Verify all schemas still render correctly
- Run Google Rich Results Test on all schema types
- Test complete page rendering

**Commit:** `refactor(schema): integrate all schemas, remove hardcoded service duplication`

**Success Criteria for Week 2:**

- ✅ Services, locations, and return policy schemas valid
- ✅ All schemas pass Google Rich Results Test
- ✅ SERVICES array properly imported (NO hardcoding)
- ✅ service data duplication fixed
- ✅ 90%+ test coverage across all new builders
- ✅ npm run check:quality passes
- ✅ npm run check:integrity passes (meta-checker validates quality system)

### Week 3: Integration & Google Validation

**Goal:** Ensure all schemas pass validation, optimize performance, prepare deployment

#### Day 1-2: Full Page Validation

- Run all pages through Google Rich Results Test
- Document results: Which pages pass? Which need fixes?
- Check for common schema.org validation errors
- Fix any issues (usually: missing required fields, wrong format)

**Commit:** `test(schema): validate all pages with Google Rich Results Test`

#### Day 3: Performance & Edge Cases

- Test with missing/incomplete data
- Test with large menu (50+ items) - measure rendering time
- Monitor bundle size increase (should be < 100KB)
- Optimize schema generation if needed (memoization, lazy evaluation)

**Commit:** `perf(schema): optimize schema generation, handle edge cases`

#### Day 4-5: Documentation & Deployment Prep

- Update README.md with structured data implementation details
- Document schema structure and field mapping in JSDoc
- Create maintenance guide for updating schemas when data changes
- Update ARCHITECTURE.md if needed (probably just add schema builder info)
- No breaking changes (schemas are additive)

**Commit:** `docs(schema): add schema documentation`

**Success Criteria for Week 3:**

- ✅ All schemas pass Google Rich Results Test
- ✅ Bundle size increase < 100KB
- ✅ Performance metrics acceptable (< 10ms per item)
- ✅ Documentation complete
- ✅ Maintenance procedures documented

### Week 4: Deployment & Monitoring

**Goal:** Deploy to production, verify schemas in real Google index

#### Day 1-2: Staging Deploy

- Deploy to GitHub Pages staging
- Verify schemas render correctly in production build
- Test in real browser environments (Chrome, Firefox, Safari)
- Check mobile rendering
- Verify with browser DevTools: inspect rendered HTML for schema JSON-LD

**Commit:** `ci(schema): staging deployment`

#### Day 3: Production Deploy

- Follow deployment procedures in BRANCHING_STRATEGY.md
- Create release branch: `git checkout -b release/v2.1.0`
- Update CHANGELOG.md with structured data implementation details
- Commit: `chore(release): prepare v2.1.0`
- Create PR with deployment checklist
- Get approval
- Merge to main
- Tag release: `git tag -a v2.1.0 -m "Release v2.1.0 - structured data implementation"`
- Push: `git push origin main && git push origin v2.1.0`
- GitHub Actions auto-deploys to GitHub Pages

**Commit & Tag:** `release(v2.1.0)`

#### Day 4-5: Monitoring & Handoff

- Set up monitoring for schema errors in Google Search Console
- Document how to monitor schema performance
- Create support procedures (what to do if schemas break)
- Begin Phase 3 coordination with colleague

**Documentation:**

- Update docs/README.md with Schema section
- Add troubleshooting guide for common schema issues
- Document Phase 3 planning assumptions

**Commit:** `chore(schema): add monitoring and maintenance procedures`

**Success Criteria for Week 4:**

- ✅ Production deployment successful
- ✅ Schemas rendering in real Google index within 2-4 weeks
- ✅ No errors in Search Console
- ✅ Colleague reviewed and approved
- ✅ Phase 3 planning initiated

---

## Part 4: Technical Reference - Schema Examples

### Menu Item Schema (Product)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Espresso",
  "description": "Single or double shot of our signature espresso",
  "keywords": "coffee, hot-drinks",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "offers": [
      {
        "@type": "Offer",
        "name": "Small",
        "price": "2.49",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Large",
        "price": "3.49",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
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
  "name": "WiFi",
  "description": "Free high-speed WiFi available for all customers",
  "serviceType": "WiFi",
  "areaServed": {
    "@type": "Place",
    "name": "Downtown Location"
  },
  "provider": {
    "@type": "Organization",
    "name": "Roma Mart"
  }
}
```

### Privacy Policy Schema

```json
{
  "@context": "https://schema.org/",
  "@type": "Organization",
  "name": "Roma Mart Corp.",
  "url": "https://romamart.ca/privacy",
  "privacyPolicy": {
    "@type": "PrivacyPolicy",
    "name": "Roma Mart Privacy Policy",
    "url": "https://romamart.ca/privacy",
    "description": "Roma Mart Corp. values your privacy. We collect and protect your personal information in compliance with Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA).",
    "dataCollected": [
      "Name and contact details (phone number, email)",
      "Purchase history for loyalty programs or returns",
      "Video footage from in-store security cameras (CCTV)",
      "Payment information (processed securely)"
    ],
    "dataUsage": [
      "Processing purchases and returns",
      "Managing customer loyalty programs (optional)",
      "Ensuring the safety and security of staff and customers",
      "Complying with legal and regulatory requirements"
    ],
    "dataProtection": "Your data is stored securely and only accessed by authorized personnel. We do not sell or share your personal information with third parties unless required by law.",
    "dataRetention": {
      "cctv": "CCTV footage is retained for a limited time and automatically deleted unless required for a security investigation.",
      "customerData": "Customer data (e.g. loyalty program) is kept only as long as needed to provide you with service."
    },
    "userRights": [
      "You can request access to or deletion of your personal information at any time",
      "Contact: contact@romamart.ca or (382) 342-2000",
      "Response time: 30 days or as required by law"
    ],
    "applicableLaws": "Personal Information Protection and Electronic Documents Act (PIPEDA)",
    "jurisdiction": "Canada - Ontario"
  }
}
```

### Return Policy Schema (Based on Actual Policy - Revised 27.07.2025)

**Key Policy Details:**

- All sales are FINAL - no returns/refunds except for faulty products
- Faulty = damaged/expired before purchase, manufacturing defect, clearly attributable to Roma Mart Corp
- Must be reported within 24 hours of purchase
- Receipt required, original packaging required, no signs of use or tampering
- Food/beverages, tobacco/vape, lottery, gift cards, personal hygiene, opened/damaged items: NO EXCEPTIONS

```json
{
  "@context": "https://schema.org/",
  "@type": "Organization",
  "name": "Roma Mart",
  "returnPolicy": {
    "@type": "ReturnPolicy",
    "name": "Roma Mart Returns & Refund Policy",
    "description": "All Roma Mart Corp. sales are final. Returns accepted only for faulty products confirmed to be faulty due to an issue that existed prior to purchase (damaged, expired, manufacturing defect).",
    "itemCondition": "https://schema.org/Faulty",
    "returnMethod": "https://schema.org/ReturnInStore",
    "returnFees": "Free",
    "returnShippingFeesAmount": {
      "@type": "PriceSpecification",
      "priceCurrency": "CAD",
      "price": "0"
    },
    "restockingFee": {
      "@type": "PriceSpecification",
      "priceCurrency": "CAD",
      "price": "0"
    },
    "returnPeriodDays": 1,
    "acceptanceConditions": "Product must be reported as faulty within 24 hours of purchase. Original receipt required. Product must be in original packaging (if applicable) with no signs of use or tampering. Fault must be clearly attributable to Roma Mart Corp. or manufacturer.",
    "nonAcceptedReturns": "Food and beverages (unless expired at time of purchase), tobacco or vape products, lottery tickets or scratch cards, phone cards or gift cards, personal hygiene or health products, items marked as final sale/clearance/discontinued, or any product that has been opened, used, or damaged after sale."
  }
}
```

### Price Conversion Utility

```javascript
/**
 * Convert cents to dollar string for schema.org
 * @param {number} cents - Price in cents (e.g., 499)
 * @returns {string} - Price as dollar string (e.g., "4.99")
 */
export function convertCentsToDollars(cents) {
  return (cents / 100).toFixed(2);
}

// Example usage:
convertCentsToDollars(499);   // Returns "4.99"
convertCentsToDollars(1250);  // Returns "12.50"
```

---

## Part 5: Files to Create/Modify

### New Files to Create

1. **src/utils/schemaHelpers.js** (150 lines)
   - convertCentsToDollars()
   - formatAddress()
   - safeString()
   - Common utilities for all schema builders

2. **src/schemas/menuItemSchema.js** (120 lines)
   - buildMenuItemSchema()
   - Field mapping logic
   - Edge case handling

3. **src/schemas/serviceSchema.js** (80 lines)
   - buildServiceSchema()
   - Service field mapping

4. **src/schemas/locationSchema.js** (100 lines)
   - Enhanced buildLocalBusinessSchema()
   - Full location details

5. **src/schemas/returnPolicySchema.js** (60 lines)
   - buildReturnPolicySchema()
   - Policy details

6. **src/schemas/privacyPolicySchema.js** (100 lines)
   - buildPrivacyPolicySchema()
   - PIPEDA compliance details
   - Data collection, usage, retention, user rights

7. **src/test/schemas/** (400+ lines total)
   - menuItemSchema.test.js
   - serviceSchema.test.js
   - privacyPolicySchema.test.js (optional, lower priority)
   - Test fixtures in src/test/fixtures/

### Files to Modify

1. **src/components/StructuredData.jsx** (~50 lines changed)
   - Import schema builder functions
   - Remove hardcoded service mappings (lines 73-82)
   - Import SERVICES from services.jsx
   - Add new case statements in switch
   - Integrate menu item, service, location, return policy, and privacy policy schemas

2. **src/pages/PrivacyPage.jsx** (~50 lines changed)
   - Update Effective Date to July 28, 2025
   - Add Purchase history and CCTV collection details
   - Add detailed purpose statements
   - Add explicit "no third-party sharing unless required by law" language
   - Add Consent clause at end
   - Update data retention section with CCTV auto-deletion info

3. **src/data/services.jsx**
   - No changes needed (ensure SERVICES is exported properly - it is)

4. **src/data/locations.js**
   - No changes needed

### Files to Create (New Policy Pages)

1. **src/pages/ReturnPolicyPage.jsx** (120 lines)
   - Display full Return Policy Notice (from 27.07.2025 document)
   - Use Helmet for SEO
   - Include breadcrumbs, share button
   - Format: sections matching the in-store poster

2. (Optional) Update/create **public/return-policy** or handle via routing

---

## Part 6: Testing & Quality Standards

### Unit Tests (90%+ Coverage Target)

Each schema builder should be tested with:

- Valid data (complete fields)
- Valid data (minimal required fields only)
- Missing optional fields
- Edge cases:
  - Empty arrays
  - Null values
  - Very long strings
  - Special characters
  - Unicode characters

### Schema Validation

Use online tools:

- [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- [https://schema.org/Validator](https://schema.org/Validator)

### Quality System Compliance

All changes must pass:

- `npm run lint` (ESLint - 0 errors)
- `npm run check:quality` (Quality system - 0 critical/high issues)
- `npm run check:integrity` (Meta-checker - validates quality system itself)
- `npm run build` (Vite production build)

---

## Part 6.5: Search Engines, AI, and Voice Assistants Coverage

### Search Engines (Google, Bing, others)

- Google explicitly uses structured data to understand content and enable rich results, and recommends JSON-LD for maintainability.
- Schema.org vocabularies are consumed by multiple platforms (Google, Microsoft/Bing, Yandex, Pinterest), so schema.org JSON-LD is the broadest compatibility baseline.

**Outcome:** The plan targets Google rich results directly and provides maximum compatibility for other major engines via schema.org JSON-LD.

### AI & Voice Assistants (Reality Check)

- AI and voice assistants primarily rely on search indexes and knowledge graphs; structured data improves machine understanding but does **not** guarantee special display.
- Google’s `speakable` markup is **beta** and focused on news content for Google Assistant in U.S. English; it’s not a fit for Roma Mart’s non-news pages.

**Outcome:** This plan maximizes AI/voice readiness by providing clean, accurate schema.org data (Product, Service, LocalBusiness, policies). We do **not** add `speakable` because it is not aligned with our content type.

### Validation Tools

- Google Rich Results Test (eligibility for Google rich results)
- Schema.org validator (general structured data correctness)

---

## Part 7: Phase 3 Expansion Plan (Services & Locations → Toolpad APIs)

**Status:** Planning & Pre-Implementation  
**Start Date:** After Phase 2 Deployment (Week 5)  
**Duration:** 4-6 weeks  

### Phase 3 Goal

Migrate services and locations from static JavaScript files (services.jsx, locations.js) into colleague’s Toolpad database, served via API endpoints similar to menu items. This removes data duplication, enables real-time updates, and ensures a single source of truth across all data types.

### Phase 3 Overview

**Current State:** Services + locations are static (code changes required for updates)  
**Target State:** Services + locations served by Toolpad APIs (no code changes for updates)  
**Benefit:** Colleague manages all data centrally; website updates instantly

---

### Phase 3 Week 1: API Contract Design & Specification

#### Services Endpoint (Public)

**Request:**

```http
GET https://romamart.netlify.app/api/public-services
```

**Response Format:**

```json
{
  "success": true,
  "timestamp": "2026-02-10T15:30:00Z",
  "services": [
    {
      "id": "atm",
      "itemType": "service",
      "name": "ATM",
      "tagline": "Cash when you need it",
      "description": "Convenient ATM access with competitive fees. Withdraw cash safely and securely.",
      "category": "financial",
      "serviceType": "ATM",
      "availableAt": ["loc-wellington-001"],
      "availability": "store_hours",
      "features": [
        "Available during store hours",
        "Low transaction fees",
        "All major bank networks",
        "Secure transactions",
        "Receipt provided"
      ],
      "badge": null,
      "ageRestricted": false,
      "status": "available",
      "featured": true,
      "partner": null,
      "action": null
    }
  ]
}
```

**Required Fields:** id, itemType, name, description, category, serviceType, availableAt, availability, status, featured, ageRestricted

#### Locations Endpoint (Public)

**Request:**

```http
GET https://romamart.netlify.app/api/public-locations
```

**Response Format:**

```json
{
  "success": true,
  "timestamp": "2026-02-10T15:30:00Z",
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
        "email": "contact@romamart.ca",
        "whatsapp": null
      },
      "hours": {
        "timezone": "America/Toronto",
        "weekdays": "8:30 AM - 9:00 PM",
        "weekends": "8:30 AM - 9:00 PM",
        "display": "Open Daily 8:30 AM - 9:00 PM",
        "is24Hours": false,
        "isSeasonal": false,
        "exceptions": []
      },
      "services": [
        "atm",
        "bitcoin_atm",
        "rocafe"
      ],
      "google": {
        "placeId": "ChIJCfo3t6SdJYgRIQVbpCppKmY",
        "mapLink": "https://maps.google.com/?q=place_id:ChIJCfo3t6SdJYgRIQVbpCppKmY",
        "coordinates": {
          "lat": 42.970389,
          "lng": -82.404589
        }
      },
      "features": {
        "parking": true,
        "wheelchairAccessible": true,
        "wifi": true,
        "restroom": true
      },
      "photos": {
        "primary": "https://romamart.ca/images/romamart-opening1.png"
      }
    }
  ]
}
```

**Required Fields:** id, type, name, isPrimary, status, address, contact, hours, services, google

#### Week 1 Deliverable

Send an API specification package to colleague covering:

- field definitions, enum values, validation rules
- example payloads
- error responses
- expected response times
- timeline and integration steps

---

### Phase 3 Week 2: React Hooks & Fallback Strategy

#### Build useServices() Hook

Create `src/hooks/useServices.js` that fetches services from API and falls back to static SERVICES if API fails.

#### Build useLocations() Hook

Create `src/hooks/useLocations.js` that fetches locations from API and falls back to static LOCATIONS if API fails.

#### Update Components

Replace all direct imports of SERVICES/LOCATIONS in UI components with useServices/useLocations hooks.

#### Week 2 Deliverable

Hooks with complete fallback and tests proving:

- API success → live data
- API failure → fallback static data
- No UI breakage

---

### Phase 3 Week 3: Schema Builders Updated for API Data

#### Service Schema (API)

Update `buildServiceSchema()` to work with API services data. No changes to mapping if API matches services.jsx structure.

#### LocalBusiness Schema

Update `buildLocalBusinessSchema()` to pull services from API via location.services array, and resolve to actual service objects.

#### StructuredData Integration

StructuredData.jsx pulls services + locations from hooks (API or fallback) and builds schema objects accordingly.

---

### Phase 3 Week 4: Migration Plan + Dry Run

#### Migration Strategy

Recommended approach: **parallel run with feature flag**

- Default: static data
- If API stable → toggle env flag → use API data
- Static files remain permanent fallback

#### Dry Run Checklist

- Staging endpoints live
- Hooks point to staging API
- Schema validation passes
- Fallback confirmed
- Performance stable (< 500ms)

---

### Phase 3 Week 5-6: Colleague Build & Integration

#### Colleague’s Tasks

- Implement /api/public-services
- Implement /api/public-locations
- Populate Toolpad database with current data

#### Our Tasks

- Validate endpoints with real payloads
- Run full schema validation
- Gradual rollout (10% → 50% → 100%)
- Monitor errors and performance

---

### Phase 3 Success Criteria

**Technical:**

- ✅ useServices/useLocations hooks with fallback
- ✅ All schemas validate with API data
- ✅ No data duplication
- ✅ API response times < 500ms

**Business:**

- ✅ Colleague can update services and locations without code deploys
- ✅ Real-time updates appear on site
- ✅ Single source of truth in Toolpad

---

### Phase 3+ Roadmap (Future Enhancements)

1. Add image URLs in Toolpad for menu items
2. Integrate customer reviews & ratings
3. Inventory availability in schemas
4. Multiple locations support (Toolpad drives expansion)
5. Dynamic pricing updates

---

## Part 8: Deployment Checklist

**Pre-Deployment:**

- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run check:quality` passes (0 critical/high)
- [ ] `npm run check:all` passes
- [ ] All tests pass with 90%+ coverage
- [ ] Bundle size increase < 100KB
- [ ] Schemas validate with Google Rich Results Test
- [ ] No console errors in production build
- [ ] Keyboard navigation works
- [ ] Mobile responsive checked
- [ ] Dark mode tested
- [ ] Colleague reviewed changes
- [ ] No hardcoded service mappings remain
- [ ] SERVICES imported, not duplicated
- [ ] rocafe-menu.js structure matches API response structure

**Deployment Steps:**

1. Create release branch: `git checkout -b release/v2.1.0`
2. Update CHANGELOG.md
3. Commit: `chore(release): prepare v2.1.0`
4. Create PR with checklist
5. Get approval
6. Merge to main
7. Tag: `git tag -a v2.1.0`
8. Push: `git push origin main && git push origin v2.1.0`
9. GitHub Actions auto-deploys
10. Verify in production
11. Monitor Search Console

---

## Part 9: Key Implementation Principles

### Systems Over Spot Fixes (DEVELOPMENT_ETHOS Principle #1)

❌ **Wrong approach:** Add one Product schema to homepage, hardcode another on menu page

✅ **Right approach:** Build reusable schema builders that can be used anywhere data exists

### Single Source of Truth (DEVELOPMENT_ETHOS Principle #16)

❌ **Wrong approach:** Duplicate service names/descriptions in StructuredData.jsx serviceMap

✅ **Right approach:** Import SERVICES from services.jsx, build schema dynamically

### Deep Understanding Before Action (DEVELOPMENT_ETHOS Principle #25)

✅ **Done:** Full codebase review, identified all problems, understood architecture

### Quality Enforcement

All changes must pass:

- ESLint
- Quality checker (1000+ rules)
- Meta-checker (validates quality system)

No exceptions. No warnings suppressed.

---

## Part 10: Quick Reference for Developers & AI

### What's the Problem?

Google can't find menu items or services because there are no Product or Service schemas. This reduces search visibility by ~40%.

### What's the Solution?

Build schema builders that:

1. Import data from SSOT sources (SERVICES, rocafe-menu.js, locations.js)
2. Transform data to schema.org format
3. Inject into page HTML via React Helmet
4. Validate with Google Rich Results Test
5. Monitor in Search Console

### Key Files to Remember

| File | Role | SSOT? |
| --- | --- | --- |
| src/components/StructuredData.jsx | Integration point (calls schema builders) | No |
| src/schemas/*.js | Schema builders (one per type) | No |
| src/utils/schemaHelpers.js | Shared utilities | No |
| src/data/services.jsx | All services definitions | YES |
| src/data/rocafe-menu.js | Menu data structure template | YES |
| src/data/locations.js | All locations definitions | YES |
| src/hooks/useExcelMenu.js | Fetches menu from API | No |

### What to Do When

**When menu items change:** API is updated automatically by colleague, schemas regenerate automatically. No code change needed.

**When services change:** Update services.jsx, schemas regenerate automatically. No schema code change needed.

**When locations change:** Update locations.js, schemas regenerate automatically. No schema code change needed.

**When schema needs new field:** Update schema builder function only. No data source change.

---

## Part 11: Success Metrics

### Development Success

- ✅ All schema builders pass Google Rich Results Test
- ✅ 90%+ test coverage achieved
- ✅ Zero schema validation errors
- ✅ Bundle size increase < 100KB
- ✅ Zero console errors in production build
- ✅ All quality checks pass (lint, check:quality, check:integrity)
- ✅ All commits follow conventional format
- ✅ No data duplication (services imported, not hardcoded)

### Business Success (Post-Launch)

- ✅ Rich results appear in Google within 2-4 weeks of deployment
- ✅ Impressions increase by 20%+ within 4 weeks
- ✅ Click-through rate improves with rich results visible
- ✅ Colleague can manage all data without manual schema updates
- ✅ Schema errors in Search Console: 0

### Maintenance Success

- ✅ Support procedures documented
- ✅ Monitoring alerts configured
- ✅ Colleague trained on Phase 3 next steps
- ✅ AI assistants can maintain without major questions
- ✅ New developers can understand system from documentation

---

## Document Information

**File:** STRUCTURED_DATA_MASTER_PLAN.md  
**Version:** 1.0.1  
**Status:** Ready for Phase 2 Implementation  
**Created:** February 4, 2026  
**Last Reviewed:** February 4, 2026  
**Next Review:** After Phase 2 completion

**How to Use This Document:**

1. **First time reading:** Read Part 1 (Architecture) to understand the system
2. **Implementation:** Follow Part 3 (Phase 2 Implementation Plan) week by week
3. **Technical details:** Refer to Part 4 (Schema Examples) when coding
4. **Questions:** Check Part 10 (Quick Reference) first
5. **Deployment:** Follow Part 8 (Deployment Checklist)

This is the single source of truth for this project. All decisions and trade-offs are documented here.
