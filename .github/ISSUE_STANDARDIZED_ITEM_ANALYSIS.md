# Comprehensive Analysis: StandardizedItem Component & Location System Integration

**Created:** December 4, 2025  
**Branch:** `feature/standardized-item-services-review`  
**Status:** ✅ Phase 0 Complete → 🚀 Active Implementation  
**Priority:** HIGH (Shipping Tonight)  
**Type:** Enhancement / Refactoring / Quality Fix

---

## Executive Summary

This issue presents a comprehensive analysis of the `StandardizedItem` component (765 lines, +254 from PR #7 merge), the services data architecture (`services.jsx`, 403 lines), the location system integration (`locations.js`, 422 lines), and the new RoCafé menu system (`rocafe-menu.js`, 288 lines). The goal is to identify architectural improvements, reduce complexity, and enhance maintainability while ensuring alignment with DEVELOPMENT_ETHOS.md principles.

**Key Findings (Updated Post-PR #7 Merge):**
- ✅ Component successfully handles both menu and service variants with auto-detection
- ✅ Removed unused `variant` prop (auto-adapts based on data structure)
- ✅ LocationContext integration implemented (`useLocationContext` hook)
- ⚠️ Component grew from 511→765 lines (+50% increase from customization system)
- ⚠️ New customization state management adds complexity (3 modes: single, multiple, quantity)
- ⚠️ Dynamic pricing calculation with `useMemo` (good optimization but complex logic)
- ✅ Services data structure well-organized with helper functions
- ⚠️ Location system has robust helpers but inconsistent usage patterns remain
- ✅ **Phase 0 COMPLETE:** Quality regression fixed (30→15 issues, accessibility + dark mode resolved)

---

## 1. StandardizedItem Component Analysis

### 1.1 Architecture Overview

**File:** `src/components/StandardizedItem.jsx`  
**Lines:** 765 (794 with comments/imports) - **+254 lines from PR #7**  
**Last Major Update:** December 4, 2025 - PR #7 merged to main

**Purpose:** Universal collapsible/expandable item component for both services and menu items with auto-detection (no variant prop needed).

**New Features (PR #7):**
- Dynamic pricing calculation with `useMemo` hook
- 3-mode customization system: single selection, multiple checkboxes, quantity counters
- Integration with `menuHelpers.js` utilities (`formatPrice`, `calculateItemPrice`)
- Integration with `ordering.js` config (`getOrderingUrl`)
- LocationContext integration via `useLocationContext` hook
- Removed unused `variant` prop (component auto-adapts based on item data structure)

### 1.2 Props Interface Complexity

**Current Props Count:** 18 item properties (reduced from 29)

<details>
<summary>Complete Props Breakdown (Updated)</summary>

```javascript
const {
  name,                 // String: Item name
  tagline,              // String: Short description (basic view)
  description,          // String: Full description (detailed view)
  image,                // String: Image URL or path
  badge,                // Enum: 'bestseller', 'new', 'halal', 'comingSoon'
  sizes,                // Array: [{name, price, calories}, ...]
  defaultSize,          // Number: Index of default size (default: 0)
  customizations,       // Array: NEW - [{type, required, multiple, quantity, options}, ...]
  calories,             // String/Number: Legacy nutritional info
  ingredients,          // String: Ingredient list
  icon,                 // JSX Element: Icon component (services)
  action,               // Object: {text, email, url, subject, body}
  features,             // Array: List of features (services)
  isAvailable,          // Boolean|String: false/'coming-soon'
  locationStatus,       // String: 'Open Now'/'Closed'
  ageRestricted,        // Boolean: 19+ items
  legalNotice,          // Object: {text, law, url} for age-restricted items
  partner,              // Object: {name, url, logo} for partner services
} = item;
```

**Component Props:**
- `item` (Object) - Item data
- `defaultExpanded` (Boolean) - Start expanded

</details>

**Analysis:**
- ✅ **Improvement:** Removed unused `variant` prop
- ✅ **Good:** Single item object consolidates related data
- ⚠️ **New Complexity:** `customizations` array adds nested data structure (3 selection modes)
- ⚠️ **Issue:** Still 18 props create moderate cognitive load
- ❌ **Problem:** No prop validation or TypeScript types (project uses plain JSX)
- ✅ **Good:** Component now uses `useLocationContext` hook (removed manual prop passing)

### 1.3 State Management

**Current State:**
- `isExpanded` (Boolean) - Controlled by user interaction
- `selectedSize` (Number) - Index-based size selection
- `selectedOptions` (Object) - **NEW** - Complex state for customizations

**selectedOptions Structure:**
```javascript
{
  'Milk Choice': 'Whole Milk',                    // Single selection (string)
  'Toppings': ['Tapioca Pearls', 'Popping Boba'], // Multiple selection (array)
  'Extra Shots': { 'Espresso Shot': 2 }           // Quantity selection (object)
}
```

**Analysis:**
- ⚠️ **Increased Complexity:** 3 different data structures for customizations
- ⚠️ **Initialization Logic:** 40+ lines just to set default `selectedOptions`
- ✅ Uses `useMemo` for `currentPrice` calculation (performance optimization)
- ✅ Removed `useCallback` for `toggleExpanded` (simplified to inline arrow function)
- ✅ Keyboard navigation supported (Enter/Space keys)
- ❌ **Missing:** No validation for required customizations before "Order Now" action

### 1.4 4-State Availability System

**States:**
1. **Open Now** (Green) - `isAvailable: true`, `locationStatus: 'Open Now'`
2. **Closed** (Red) - `isAvailable: true`, `locationStatus: 'Closed'`
3. **Unavailable** (Grey) - `isAvailable: false` (not offered at location)
4. **Coming Soon** (Yellow) - `isAvailable: 'coming-soon'`

**Implementation:**
```javascript
const getAvailabilityColor = () => {
  if (isAvailable === 'coming-soon') {
    return 'var(--color-accent)';
  }
  if (isAvailable === false) {
    return 'var(--color-text-muted)';
  }
  if (locationStatus === 'Open Now') {
    return getRoleColors('open').bg;
  }
  if (locationStatus === 'Closed') {
    return getRoleColors('closed').bg;
  }
  return 'var(--color-border)';
};
```

**Analysis:**
- ⚠️ **Complex Logic:** Mixes boolean, string, and undefined checks
- ⚠️ **Inconsistent Data Types:** `isAvailable` can be `Boolean | String`
- ✅ **Visual Feedback:** Clear overlays for unavailable/coming-soon states
- ⚠️ **Dependency:** Relies on `getRoleColors()` from design tokens

**Recommendation:** Create dedicated availability state enum:
```javascript
const AVAILABILITY_STATES = {
  OPEN: 'open',
  CLOSED: 'closed',
  UNAVAILABLE: 'unavailable',
  COMING_SOON: 'coming_soon'
};
```

### 1.5 Badge System

**Supported Badges:**
- `bestseller` → Gold "BEST SELLER"
- `new` → Green "NEW"
- `halal` → Teal "HALAL"
- `comingSoon` → Yellow "COMING SOON"
- `ageRestricted` → Red "19+ ONLY" (separate prop)

**Analysis:**
- ✅ Clear visual hierarchy with role-based colors
- ⚠️ `badge` and `ageRestricted` are separate props but both render badges
- ⚠️ Badge colors hardcoded inline, duplicating design token logic

### 1.6 Render Complexity

**Component Structure (Updated):**
```
<div> Main container
  └─ Overlay (unavailable/coming-soon)
  └─ <div> Basic View (always visible)
      └─ Image
      └─ Content
          └─ Header (name, badges, expand icon)
          └─ Tagline
          └─ Size options (collapsed)
          └─ Current price display (dynamic)
  └─ <div> Detailed View (conditional: isExpanded)
      └─ Full description
      └─ Size selector (interactive buttons)
      └─ **NEW: Customizations section**
          └─ Single selection (radio-style buttons)
          └─ Multiple selection (checkboxes)
          └─ Quantity selection (increment/decrement controls)
      └─ Features list (services)
      └─ Availability status box
      └─ Partner info
      └─ Legal notice
      └─ Nutritional info
      └─ **NEW: Order Now button** (dynamic URL with selections)
      └─ Action button (CTA - services only)
```

**Analysis:**
- ✅ Clear separation of basic/detailed views
- ✅ Accessibility: Proper ARIA labels, keyboard navigation, semantic HTML
- ⚠️ **Critical Growth:** 765 lines for single component (+50% from PR #7)
- ⚠️ Inline styles throughout (mixing CSS vars with inline logic)
- ⚠️ **New Quality Issue:** Customization checkboxes lack keyboard handler (line 468)
- ✅ **Good:** Dynamic price calculation reflected in UI
- ⚠️ **Complexity:** Customizations render logic is 200+ lines

### 1.7 Accessibility Compliance

**Current Implementation:**
- ✅ `role="button"` on expandable div
- ✅ `tabIndex={0}` for keyboard focus
- ✅ `onKeyDown` handler for Enter/Space
- ✅ `aria-label` on expand/collapse button
- ✅ `aria-expanded` state tracking
- ✅ Semantic `alt` text requirement on images

**WCAG 2.2 AA Compliance:**
- ✅ Keyboard navigation
- ✅ Focus indicators (via global CSS)
- ✅ Color not sole indicator (overlays use text + symbols)
- ✅ Touch targets 44x44px minimum (buttons)

### 1.8 Performance Considerations

**Optimizations:**
- ✅ `useCallback` for `toggleExpanded` (prevents unnecessary re-renders)
- ✅ `loading="lazy"` on images
- ✅ Conditional rendering of detailed view (DOM efficiency)

**Potential Issues:**
- ⚠️ No memoization for badge styles (recalculated on every render)
- ⚠️ `getAvailabilityColor()` called multiple times per render
- ⚠️ Large component may cause re-render cascades in parent lists

---

## 2. Services Data Architecture Analysis

### 2.1 File Structure

**File:** `src/data/services.jsx`  
**Lines:** 403 (reduced from 417, -14 lines)  
**Format:** ESM with JSX icon imports

**Exports:**
- `SERVICE_CATEGORIES` (5 categories)
- `SERVICES` (14 services, 1 coming soon)
- 10 helper functions

### 2.2 Service Categories

```javascript
export const SERVICE_CATEGORIES = {
  FINANCIAL: 'financial',        // ATM, Bitcoin ATM, Money Transfer
  FOOD: 'food',                  // Halal Meat, RoCafé
  RETAIL: 'retail',              // Gift Cards, Perfumes, Groceries, Snacks, etc.
  CONVENIENCE: 'convenience',    // Printing, Package Services
  AGE_RESTRICTED: 'age_restricted' // Tobacco, Lottery
};
```

**Analysis:**
- ✅ Clear categorization for filtering/display
- ✅ Used in helper functions (`getServicesByCategory`)
- ⚠️ Not currently used in UI (ServicesPage renders flat list)
- 💡 **Opportunity:** Implement category-based filtering on Services page

### 2.3 Service Data Schema

**Required Fields (all 14 services):**
```javascript
{
  id: 'atm',                     // Unique identifier
  name: 'ATM',                   // Display name
  tagline: 'Cash when you need it', // Short description
  description: 'Full details...',   // Long description
  icon: <Banknote size={20} />,    // Lucide React component
  category: SERVICE_CATEGORIES.FINANCIAL,
  availableAt: ['loc-wellington-001'], // Location IDs
  availability: 'store_hours',     // Availability type
  features: [...],                 // Array of feature strings
  badge: null,                     // Optional badge
  ageRestricted: false,           // 19+ flag
  comingSoon: false               // Coming soon flag
}
```

**Optional Fields:**
- `partner`: `{name, url, logo}` - Partner service info (Bitcoin ATM)
- `action`: `{text, email, url, subject, body}` - CTA button config (Printing)
- `legalNotice`: `{text, law, url}` - Regulatory compliance (Tobacco, Lottery)

**Analysis:**
- ✅ Consistent schema across all services
- ✅ Self-documenting with inline JSDoc comments
- ⚠️ Icons imported directly (coupling to Lucide React)
- ⚠️ `availableAt` uses location IDs (manual sync required)

### 2.4 Location-Service Linking

**Current Pattern:**
```javascript
{
  id: 'bitcoin_atm',
  availableAt: ['loc-wellington-001'], // Hardcoded location IDs
  // ...
}
```

**Issues:**
- ❌ **Manual Sync:** Adding new location requires updating services.jsx
- ❌ **Brittle:** No validation that location IDs exist in locations.js
- ❌ **Unidirectional:** Services know locations, but locations also list services (duplication)

**Current Duplication:**
```javascript
// locations.js
{
  id: 'loc-wellington-001',
  services: ['atm', 'bitcoin_atm', 'rocafe', ...] // Service IDs
}

// services.jsx
{
  id: 'bitcoin_atm',
  availableAt: ['loc-wellington-001'] // Location IDs
}
```

**Recommendation:** Single source of truth (location-centric or service-centric, not both)

### 2.5 Helper Functions

**Available Functions:**
1. `getServiceById(id)` - Fetch service by ID
2. `getServicesByCategory(category)` - Filter by category
3. `getServicesAtLocation(locationId)` - Filter by location
4. `getAgeRestrictedServices()` - Get 19+ services
5. `getComingSoonServices()` - Get upcoming services
6. `getActiveServices()` - Get available-now services
7. `isServiceAvailableAt(serviceId, locationId)` - Check availability
8. `getServiceAvailabilityText(service, locationStatus)` - Format availability text

**Analysis:**
- ✅ Comprehensive helper library
- ✅ Pure functions (no side effects)
- ⚠️ **Underutilized:** Many helpers not used in components
- ⚠️ `getServiceAvailabilityText()` duplicates logic from StandardizedItem

### 2.6 Age-Restricted Services Compliance

**Services:**
- **Tobacco & Vape** (Active)
  - Legal notice: Smoke-Free Ontario Act, 2017
  - URL: https://www.ontario.ca/laws/statute/17s26
- **Lottery** (Coming Soon)
  - Legal notice: OLG regulations
  - URL: https://www.olg.ca/

**Analysis:**
- ✅ Proper legal notice data structure
- ✅ Rendered in StandardizedItem with red warning box
- ✅ Additional compliance section on ServicesPage
- ✅ `ageRestricted` flag enables 19+ badge

---

## 3. Location System Integration Analysis

### 3.1 Location Data Architecture

**File:** `src/data/locations.js`  
**Lines:** 422 (reduced from 457, -35 lines)  
**Format:** Pure ESM (zero external dependencies)

**Primary Location:**
```javascript
{
  id: 'loc-wellington-001',
  type: LOCATION_TYPES.CONVENIENCE_STORE,
  name: 'Roma Mart Wellington',
  isPrimary: true,
  status: 'open',
  address: { street, city, province, postalCode, country, formatted },
  google: { placeId, mapLink, embedUrl, coordinates },
  contact: { phone, email, whatsapp },
  hours: { timezone, weekdays, weekends, display, is24Hours },
  services: ['atm', 'bitcoin_atm', 'rocafe', ...], // Service IDs
  features: { parking, wheelchairAccessible, wifi, restroom, seating, ... },
  photos: { primary, exterior, interior, thumbnail },
  metadata: { openedDate, squareFootage, employeeCount, isHeadquarters, ... }
}
```

**Analysis:**
- ✅ Extremely comprehensive location schema
- ✅ Google Maps integration ready (Place ID, coordinates)
- ✅ Structured for multi-location expansion
- ⚠️ Only 1 location defined (Wellington Street)
- ⚠️ `services` array duplicates services.jsx `availableAt` array

### 3.2 Location Helper Functions

**Available Functions (17 total):**
- Location retrieval: `getPrimaryLocation()`, `getLocationById(id)`, `getActiveLocations()`
- Type filtering: `getConvenienceStores()`, `getVendingMachines()`, `getStandaloneATMs()`
- Service filtering: `getLocationsByService(service)`, `hasService(location, service)`
- Feature checks: `hasFeature(location, feature)`
- Distance calculation: `calculateDistance(lat1, lon1, lat2, lon2)`, `getLocationsByDistance(userLat, userLng)`
- Status helpers: `getStatusText(location)`, `isLocationOpenNow(location)`
- Formatting: `getFormattedAddress(location)`, `formatDistance(distance)`

**Analysis:**
- ✅ **Excellent:** Haversine distance formula for accurate geo-calculations
- ✅ **Robust:** Comprehensive helper library covering all use cases
- ⚠️ **Inconsistent Usage:** Some components use helpers, others don't
- ⚠️ `isLocationOpenNow()` complex time parsing logic (85 lines)

### 3.3 Location Context System

**Architecture:**
```
LocationProvider (src/components/LocationProvider.jsx)
  └─ LocationContext (src/contexts/LocationContext.js)
      └─ useLocationContext() hook (src/hooks/useLocationContext.js)
          └─ useLocationAware() hook (auto-request pattern)
```

**LocationProvider State:**
- `userLocation`: `{latitude, longitude}` or `null`
- `loading`: Boolean (geolocation request in progress)
- `error`: Error object or `null`
- `canUseGeolocation`: Boolean (browser support check)
- `requestLocation()`: Function to trigger geolocation request
- `registerLocationAwareComponent()`: Auto-request pattern trigger

**Analysis:**
- ✅ **Smart Caching:** 1-hour cache in localStorage (reduces API calls)
- ✅ **Session Management:** Uses sessionStorage to prevent duplicate requests
- ✅ **Auto-Request Pattern:** Components register and auto-trigger location request
- ⚠️ **Underutilized:** Only used in ServicesPage and RoCafePage
- ⚠️ **Inconsistent:** StandardizedItem receives location props, doesn't use context

### 3.4 Location Integration Patterns

**Pattern 1: Manual Prop Passing (Current - ServicesPage)**
```jsx
const primaryLocation = getPrimaryLocation();
const locationIsOpen = isLocationOpenNow(primaryLocation);

<StandardizedItem
  item={{
    isAvailable: service.availableAt.includes(primaryLocation.id),
    locationStatus: locationIsOpen ? 'Open Now' : 'Closed',
    // ... other props
  }}
/>
```

**Issues:**
- ❌ **Prop Drilling:** Parent must calculate and pass availability
- ❌ **Duplication:** Every page using StandardizedItem must repeat this logic
- ❌ **Not Context-Driven:** Ignores LocationContext entirely

**Pattern 2: Context-Driven (Recommended)**
```jsx
// Inside StandardizedItem.jsx
const { userLocation } = useLocationContext();
const nearestLocation = useMemo(() => {
  if (!userLocation) return getPrimaryLocation();
  const sorted = getLocationsByDistance(userLocation.latitude, userLocation.longitude);
  return sorted[0];
}, [userLocation]);

const isAvailable = service.availableAt.includes(nearestLocation.id);
const locationStatus = isLocationOpenNow(nearestLocation) ? 'Open Now' : 'Closed';
```

**Benefits:**
- ✅ **Self-Contained:** StandardizedItem handles its own availability logic
- ✅ **Automatic Updates:** Re-renders when user location changes
- ✅ **DRY Principle:** No duplication across parent pages

### 3.5 Geolocation Flow Analysis

**Current Flow:**
1. User visits ServicesPage or RoCafePage
2. `useLocationAware()` hook registers component
3. `LocationProvider.registerLocationAwareComponent()` triggers `requestLocation()`
4. Geolocation API request (user prompt)
5. Location stored in:
   - `LocationContext.userLocation` (React state)
   - `localStorage.roma_mart_user_location` (cached, 1-hour TTL)
   - `localStorage.roma_mart_user_lat/lng` (separate keys for legacy?)
   - `sessionStorage.roma_mart_location_requested` (flag to prevent duplicate requests)

**Issues:**
- ⚠️ **Inconsistent Storage:** 3 different localStorage keys for same data
- ⚠️ **Redundant:** `roma_mart_user_lat` and `roma_mart_user_lng` duplicate `roma_mart_user_location`
- ✅ **Good:** TTL cache prevents excessive geolocation requests

### 3.6 Footer Location Selector

**File:** `src/components/Footer.jsx` (lines 31-78)

**Features:**
- Haversine distance calculation to all locations
- Auto-detects nearest location
- Manual location selector dropdown
- Persists selection to localStorage (`roma_mart_selected_location`)

**Analysis:**
- ✅ **Smart:** Auto-select nearest, allow manual override
- ✅ **Persistent:** Remembers user choice across sessions
- ⚠️ **Duplication:** Re-implements distance calculation (exists in locations.js)
- ⚠️ **Separate State:** `selectedLocationId` not connected to LocationContext

---

## 4. Identified Issues & Improvement Opportunities

### 4.1 High Priority Issues (Updated Post-PR #7)

#### Issue #1: Component Size and Complexity 🔥 NEW CRITICAL
**Problem:** StandardizedItem grew from 511→765 lines (+50% increase)

**Root Causes:**
1. Customization system adds 200+ lines of render logic
2. Three different selection modes (single, multiple, quantity)
3. 40+ lines just for `selectedOptions` initialization
4. Dynamic pricing calculation with nested iteration
5. No sub-component extraction

**Impact:** CRITICAL  
**Risk:** Maintenance burden, testing difficulty, performance concerns

**Recommendation:** Immediate refactoring required:
- Extract `<CustomizationSection>` component (200 lines → separate file)
- Extract `<SizeSelector>` component (50 lines)
- Extract `<PriceDisplay>` component with `useMemo` hook
- Extract `<OrderButton>` component with URL generation logic
- Target: Reduce main component to <300 lines

#### Issue #3: New Quality Issues from PR #7 Merge ✅ RESOLVED
**Previous Problem:** Quality checker showed 30 issues (up from 9)

**Resolution (Completed in Phase 0):**
1. ✅ **Accessibility (MEDIUM → FIXED):** Added keyboard handler to customization checkboxes
   - Added `onKeyDown` with Enter/Space key support
   - Added `tabIndex={0}` for keyboard focus
   - Passes WCAG 2.2 AA compliance

2. ✅ **Dark Mode (14 LOW → FIXED):** Replaced all hardcoded colors in `rocafe-menu.js`
   - `CAFFEINE_LEVELS`: 4 colors → CSS variables
   - `DIETARY_TAGS`: 5 colors → CSS variables  
   - Uses: `var(--color-success)`, `var(--color-warning)`, `var(--color-error)`, etc.
   - Adapts to `prefers-color-scheme` automatically

**Results:**
- Quality issues: 30 → 15 (50% reduction)
- Medium issues: 2 → 1 (only Node v24 warning)
- All accessibility violations resolved
- All dark mode violations resolved
- Build successful, ESLint passing

**Status:** CLOSED ✅  
**Committed:** commit b91a9a9

#### Issue #4: StandardizedItem Prop Complexity (Improved but Still High)
**Problem:** Reduced from 29→18 props, but still high cognitive load

**Impact:** Medium  
**Risk:** Difficult to debug, prone to prop-passing errors

**Recommendation:** Extract sub-components:
- `<CustomizationSection>` (200+ lines) 🔥 CRITICAL
- `<ItemHeader>` (name, badges, expand icon)
- `<SizeSelector>` (interactive size buttons)
- `<PriceDisplay>` (dynamic price calculation)
- `<AvailabilityIndicator>` (4-state availability logic)
- `<LegalNoticeBox>` (age-restricted compliance)
- `<OrderButton>` (URL generation with selections)

**Benefits:** Reduce main component to ~200 lines, improve testability
**Risk:** Data inconsistency, manual sync errors when adding locations

**Recommendation:** Choose single source of truth:
- **Option A (Location-Centric):** Remove `availableAt` from services.jsx, query `locations.js` for service availability
- **Option B (Service-Centric):** Remove `services` from locations.js, query `services.jsx` for location offerings
- **Option C (Junction Table):** Create `serviceAvailability.js` mapping `{serviceId, locationId, customAvailability?}`

**Preferred:** Option C (most flexible for future multi-location scenarios)

#### Issue #2: StandardizedItem Prop Complexity
**Problem:** 29 props create high cognitive load

**Impact:** Medium  
**Risk:** Difficult to debug, prone to prop-passing errors

**Recommendation:** Extract sub-components:
- `<ItemHeader>` (name, badges, expand icon)
- `<ItemBasicView>` (tagline, image, compact sizes)
- `<ItemDetailedView>` (description, features, availability, actions)
- `<AvailabilityIndicator>` (4-state availability logic)
- `<LegalNoticeBox>` (age-restricted compliance)

**Benefits:** Reduce main component to ~150 lines, improve testability

#### Issue #3: Availability Logic Partially Context-Driven ✅ IMPROVED
**Previous Problem:** Parents must calculate and pass `isAvailable` and `locationStatus`

**Current Status (Post-PR #7):**
- ✅ StandardizedItem now imports `useLocationContext` hook
- ✅ Accesses `nearestLocation` directly from context
- ⚠️ Still requires parents to pass `isAvailable` and `locationStatus` as props

**Remaining Work:** Complete migration to self-contained availability logic
```javascript
// Inside StandardizedItem.jsx (proposed)
const { nearestLocation } = useLocationContext();
const availability = useServiceAvailability(item.id, nearestLocation);
// Remove isAvailable and locationStatus from item props
```

**Impact:** Low (partially resolved)  
**Risk:** Minor duplication remains

### 4.2 Medium Priority Improvements

#### Issue #4: Inconsistent LocationContext Usage
**Problem:** Footer has separate `selectedLocationId` state, StandardizedItem doesn't use context

**Recommendation:** Expand LocationContext to include:
```javascript
{
  userLocation,           // Geolocation coords
  selectedLocation,       // User's chosen location (manual override)
  nearestLocation,        // Calculated nearest location
  setSelectedLocation,    // Manual location picker
}
```

#### Issue #5: Unused `variant` Prop ✅ RESOLVED
**Previous Problem:** `variant="service"` passed to StandardizedItem but never referenced

**Resolution (PR #7):** ✅ **Removed completely**
- Component now auto-detects variant based on item data structure
- No longer needs explicit variant prop
- Cleaner API surface

**Status:** CLOSED - No action needed

#### Issue #6: Helper Function Underutilization
**Problem:** Comprehensive helpers in locations.js and services.jsx not used consistently

**Recommendation:** Audit component usage, refactor to use helpers
- Example: Footer calculates distance manually instead of using `getLocationsByDistance()`

### 4.3 Low Priority Enhancements

#### Issue #7: No Service Categories in UI
**Problem:** `SERVICE_CATEGORIES` defined but not used for filtering/organization

**Recommendation:** Add category tabs to ServicesPage
```jsx
<Tabs>
  <Tab name="All Services" />
  <Tab name="Financial" />
  <Tab name="Food" />
  <Tab name="Retail" />
  <Tab name="Convenience" />
</Tabs>
```

#### Issue #8: Memoization Opportunities
**Problem:** Badge styles and availability colors recalculated every render

**Recommendation:** Use `useMemo` for expensive calculations
```javascript
const badgeStyle = useMemo(() => 
  badge ? badgeStyles[badge] : null,
  [badge]
);
```

---

## 5. Proposed Refactoring Strategy (Updated for PR #7 Changes)

### Phase 0: URGENT - Quality Regression Fixes ✅ COMPLETE
**Priority:** P0 - Must complete before other phases

**Completed Tasks:**
1. ✅ **Fixed Accessibility Issue**
   - Added keyboard handler to customization checkboxes (StandardizedItem.jsx:468)
   - Tested with keyboard-only navigation (Enter/Space keys work)
   - WCAG 2.2 AA compliant
   
2. ✅ **Fixed Dark Mode Issues**
   - Replaced all hardcoded colors in `rocafe-menu.js` with CSS variables
   - Updated `CAFFEINE_LEVELS` colors (4 instances)
   - Updated `DIETARY_TAGS` colors (5 instances)
   - Verified in dark mode - colors adapt correctly

3. ✅ **Verified Quality**
   - `npm run check:quality` → 15 issues (down from 30, 50% reduction)
   - `npm run check:all` → PASSING
   - Build successful in 8.6s

**Actual Effort:** 2 hours (matched estimate)  
**Committed:** commit b91a9a9  
**Status:** COMPLETE ✅

### Phase 1: Component Decomposition 🚀 ACTIVE (TONIGHT)
**Priority:** P0 - Blocks maintainability  
**Timeline:** December 4, 2025 (Ship tonight)

**Tasks (In Progress):**
1. ⏳ **Extract `<CustomizationSection>`** (200+ lines → new file)
   - Handle single/multiple/quantity selection modes
   - Manage `selectedOptions` state internally
   - Expose `onOptionsChange` callback
   
2. ⏳ **Extract `<SizeSelector>`** (50 lines → new file)
   - Interactive size buttons with pricing
   - Expose `onSizeChange` callback
   
3. ⏳ **Extract `<PriceDisplay>`** (20 lines → new file)
   - Dynamic price calculation with `useMemo`
   - Format with `formatPrice` helper
   
4. ⏳ **Extract `<OrderButton>`** (30 lines → new file)
   - Generate ordering URL with selections
   - Handle validation (required customizations)

5. ⏳ **Refactor StandardizedItem**
   - Reduce to <300 lines (from 765)
   - Use composition pattern with extracted components
   - Add unit tests for extracted components

**Target Effort:** 6-8 hours (aggressive)  
**Risk:** Medium (requires comprehensive testing)  
**Blockers:** None - starting immediately

### Phase 2: Data Architecture (Week 2)
1. **Create `serviceAvailability.js`** junction table
2. Remove `availableAt` from services.jsx
3. Remove `services` array from locations.js
4. Update helper functions to use junction table
5. Add data validation script

**Estimated Effort:** 8 hours  
**Risk:** Low (isolated data layer change)

### Phase 3: Context Enhancement (Week 2)
1. Expand LocationContext with `selectedLocation` (already has `nearestLocation`)
2. Create `useServiceAvailability(serviceId, location)` hook
3. Refactor Footer to use enhanced context
4. Update ServicesPage to remove manual availability calculation

**Estimated Effort:** 4 hours (reduced - LocationContext already integrated)  
**Risk:** Low (partial implementation exists)

### Phase 4: Logic Migration (Week 3)
1. Move availability calculation into StandardizedItem
2. Remove `isAvailable` and `locationStatus` from parent components
3. Update all usages in ServicesPage, RoCafePage
4. Add unit tests for availability logic

**Estimated Effort:** 4 hours  
**Risk:** Low (simplifies parents, contained in StandardizedItem)

### Phase 5: UI Enhancements (Week 3)
1. Implement SERVICE_CATEGORIES tabs on ServicesPage
2. Add service search/filter functionality
3. Implement location switcher in header (global)
4. Add loading states for geolocation
5. **NEW:** Add customization validation before order submission

**Estimated Effort:** 12 hours  
**Risk:** Low (new features, doesn't break existing)

### Phase 6: New Feature - RoCafé Menu System Documentation (Week 4)
1. Document customization data schema
2. Create menu item template/generator
3. Add validation for menu items
4. Document allergen compliance requirements
5. Create photography guide for menu items

**Estimated Effort:** 8 hours  
**Risk:** Low (documentation only)

---

## 6. Testing Strategy

### 6.1 Unit Tests
- `services.jsx` helper functions
- `locations.js` helper functions
- `isLocationOpenNow()` time parsing logic
- Distance calculation accuracy (Haversine)
- Availability state resolution

### 6.2 Integration Tests
- StandardizedItem with LocationContext
- ServicesPage service rendering
- Footer location selector
- Geolocation request flow

### 6.3 Visual Regression Tests
- StandardizedItem expanded/collapsed states
- 4-state availability indicators
- Badge rendering (all types)
- Legal notice boxes

### 6.4 Accessibility Tests
- Keyboard navigation (Tab, Enter, Space)
- Screen reader compatibility (NVDA, JAWS)
- Color contrast (WCAG 2.2 AA)
- Focus indicators
- ARIA labels and states

### 6.5 Performance Tests
- Render time with 14 services (ServicesPage)
- Geolocation request latency
- Distance calculation with multiple locations
- Context re-render frequency

---

## 7. Ethos Alignment Check

### Principle #1: Systems Over Spot Fixes ✅
- **Analysis:** This issue proposes comprehensive refactoring, not ad-hoc patches
- **Evidence:** Junction table approach, context enhancement, component decomposition

### Principle #3: Zero Hardcoding ⚠️
- **Current State:** Some inline styles, hardcoded colors in badge system
- **Recommendation:** Move all styles to design tokens, use CSS variables

### Principle #4: DRY Principle ❌
- **Current Issues:** Location-service duplication, availability logic duplication
- **Solution:** Phases 1-4 address all duplication

### Principle #12: Accessibility-First ✅
- **Current State:** Excellent keyboard navigation, ARIA labels, semantic HTML
- **Maintain:** Ensure all refactoring preserves accessibility

### Principle #25: Deep Understanding Before Action ✅
- **This Document:** 100+ lines of analysis before proposing changes

---

## 7. New System: RoCafé Menu Architecture

### 7.1 Overview

**File:** `src/data/rocafe-menu.js`  
**Lines:** 288 (299 with imports)  
**Created:** December 4, 2025 (PR #7)

**Purpose:** Centralized menu data with comprehensive metadata for RoCafé beverage and food items.

### 7.2 Data Schema

**Menu Item Structure:**
```javascript
{
  id: 'signature-bubble-tea',
  name: 'Signature Bubble Tea',
  tagline: 'Short description for basic view',
  description: 'Full description for expanded view',
  image: null, // Placeholder
  badge: 'bestseller',
  sizes: [
    { name: 'Regular', price: 4.99, calories: 320 },
    { name: 'Large', price: 5.99, calories: 410 }
  ],
  defaultSize: 0,
  category: MENU_CATEGORIES.SPECIALTY,
  customizations: [
    {
      type: 'Ice Level',
      required: true,
      multiple: false,
      quantity: false,
      options: [
        { name: 'Regular Ice', price: 0, default: true },
        { name: 'Less Ice', price: 0 },
        { name: 'No Ice', price: 0 }
      ]
    }
    // ... more customizations
  ],
  allergens: ['DAIRY'],
  dietaryTags: ['VEGETARIAN'],
  caffeineLevel: 'MEDIUM'
}
```

### 7.3 Configuration Constants

**9 Menu Categories:**
- `HOT_COFFEE`, `ICED_COFFEE`, `TEA`, `FRESH_JUICE`, `SMOOTHIES`, `FRAPPES`, `SPECIALTY`, `FOOD`, `SEASONAL`

**Caffeine Levels (4):**
- `NONE` (0mg), `LOW` (1-50mg), `MEDIUM` (51-100mg), `HIGH` (101+mg)
- ⚠️ **Issue:** Colors hardcoded (#6B7280, #10B981, #F59E0B, #EF4444)

**Allergens (5):**
- `DAIRY`, `NUTS`, `SOY`, `GLUTEN`, `EGGS`
- ✅ Uses emoji icons (🥛, 🌰, 🫘, 🌾, 🥚)

**Dietary Tags (5):**
- `VEGAN`, `VEGETARIAN`, `GLUTEN_FREE`, `DAIRY_FREE`, `HALAL`
- ⚠️ **Issue:** Colors hardcoded (5 instances)

### 7.4 Customization System

**3 Selection Modes:**

1. **Single Selection** (`multiple: false, quantity: false`)
   - Radio button behavior
   - Example: Ice Level, Sugar Level, Milk Choice
   - Stored as string: `selectedOptions['Ice Level'] = 'Regular Ice'`

2. **Multiple Selection** (`multiple: true, quantity: false`)
   - Checkbox behavior
   - Example: Toppings, Flavor Shots
   - Stored as array: `selectedOptions['Toppings'] = ['Tapioca Pearls', 'Popping Boba']`

3. **Quantity Selection** (`multiple: false, quantity: true`)
   - Counter controls (increment/decrement)
   - Example: Extra Shots, Extra Pumps
   - Stored as object: `selectedOptions['Extra Shots'] = { 'Espresso Shot': 2 }`

**Analysis:**
- ✅ **Flexible:** Supports complex menu scenarios
- ⚠️ **Complex:** Three different data structures increase mental model
- ⚠️ **No Validation:** Required customizations not enforced before order
- ✅ **Pricing:** Each option can have independent price modifier

### 7.5 Integration Points

**Components Using RoCafé Menu:**
1. `App.jsx` - Homepage featured items (4 items)
2. `RoCafePage.jsx` - Full menu with category filtering
3. `StandardizedItem.jsx` - Renders menu items with customizations

**Helper Functions (`src/utils/menuHelpers.js`, 157 lines):**
- `formatPrice(price)` - Currency formatting
- `calculateItemPrice(item, selectedSize, selectedOptions)` - Dynamic pricing
- `getDefaultCustomizations(customizations)` - Initialize state
- `validateCustomizations(customizations, selectedOptions)` - Check required fields
- `generateOrderUrl(item, selectedSize, selectedOptions)` - Create order link

**Ordering System (`src/config/ordering.js`, 62 lines):**
- `getOrderingUrl(itemName, selectedOptions)` - Generate third-party ordering URL
- Configurable ordering provider (currently placeholder)

### 7.6 Quality Issues

**Current Problems:**
1. ❌ **Hardcoded Colors:** 9 instances in caffeine/dietary configurations
2. ⚠️ **No Dark Mode Support:** Colors won't adapt to theme
3. ⚠️ **No Image Assets:** All `image: null` (placeholders)
4. ⚠️ **Incomplete Menu:** Only 1 item fully defined (Signature Bubble Tea)
5. ⚠️ **No Validation:** Required customizations not enforced

**Recommendations:**
- Replace hardcoded colors with CSS variables
- Add content strategy for menu photography
- Implement customization validation before order
- Complete menu items (target: 20-30 items across 9 categories)

---

## 8. Success Metrics (Updated)

### Code Quality Metrics (Updated)
- [x] **URGENT:** Fix quality regression (30→15 issues, 50% reduction) ✅ COMPLETE
- [x] Replace 9 hardcoded colors in rocafe-menu.js with CSS variables ✅ COMPLETE
- [x] Add keyboard handlers to all interactive elements (100% WCAG 2.2 AA) ✅ COMPLETE
- [x] Pass all `npm run check:quality` checks (0 critical/high issues) ✅ COMPLETE
- [ ] Reduce StandardizedItem line count from 765 to <300 (Target: -60%) - IN PROGRESS TONIGHT
- [ ] Extract 7 sub-components from StandardizedItem - IN PROGRESS TONIGHT
- [ ] Eliminate location-service duplication (0 redundant data)
- [ ] Increase helper function usage to 80%+

### Performance Metrics
- [ ] ServicesPage render time <100ms (all 14 services)
- [ ] Geolocation cache hit rate >80%
- [ ] Context re-render frequency <5 per user interaction

### Maintainability Metrics
- [ ] Cognitive complexity score <10 per function (SonarQube)
- [ ] Test coverage >80% for all helpers
- [ ] Documentation completeness 100% (JSDoc on all exports)

### User Experience Metrics
- [ ] Location detection success rate >90%
- [ ] Availability accuracy 100% (correct open/closed state)
- [ ] Service discoverability (category filters improve findability)

---

## 9. Implementation Plan (Updated for PR #7 Changes)

### Milestone 0: URGENT Quality Fixes ✅ COMPLETE
**Priority:** P0 - Blocks PR #7 quality approval
**Completed:** December 4, 2025

- [x] Fix accessibility issue: Add keyboard handler to customization checkboxes ✅
- [x] Replace 9 hardcoded colors in `rocafe-menu.js` with CSS variables ✅
- [x] Test in dark mode (light/dark theme toggle) ✅
- [x] Run `npm run check:quality` → 15 issues (down from 30) ✅
- [x] Run `npm run check:all` → PASSING ✅

**Deliverable:** Committed to branch (commit b91a9a9)  
**Review Checklist:** 
- [x] Quality checker shows 15 issues (50% reduction from 30) ✅
- [x] Accessibility audit pass (WCAG 2.2 AA) ✅
- [x] Dark mode visual test pass ✅
- [x] Build successful (8.6s) ✅

### Milestone 1: Component Decomposition 🚀 IN PROGRESS (TONIGHT)
**Priority:** P0 - Critical maintainability issue  
**Timeline:** December 4, 2025 (Shipping tonight)

- [ ] Extract `<CustomizationSection>` component (200+ lines) - STARTING NOW
- [ ] Extract `<SizeSelector>` component (50 lines) - STARTING NOW
- [ ] Extract `<PriceDisplay>` component (20 lines) - STARTING NOW
- [ ] Extract `<OrderButton>` component (30 lines) - STARTING NOW
- [ ] Refactor StandardizedItem to <300 lines - STARTING NOW
- [ ] Add unit tests for extracted components
- [ ] Update component README

**Deliverable:** Commits to branch (tonight)  
**Review Checklist:**
- [ ] StandardizedItem <300 lines (from 765)
- [ ] All tests passing
- [ ] Visual regression tests pass
- [ ] Performance benchmarks (no degradation)
- [ ] Build successful
- [ ] Quality checks pass

### Milestone 2: Data Architecture (Week 2)
- [ ] Create `serviceAvailability.js` junction table
- [ ] Remove bidirectional duplication
- [ ] Update helper functions
- [ ] Add data validation script

**Deliverable:** PR #10 - Data Architecture Refactor  
**Review Checklist:** Run `npm run check:all`, verify no regressions

### Milestone 3: Context & Logic Migration (Week 3)
- [ ] Expand LocationContext with `selectedLocation`
- [ ] Create `useServiceAvailability()` hook
- [ ] Move availability logic into StandardizedItem
- [ ] Update ServicesPage and RoCafePage
- [ ] Add unit tests

**Deliverable:** PR #11 - Context Enhancement  
**Review Checklist:** Integration tests pass, no prop drilling

### Milestone 4: UI Enhancements (Week 3-4)
- [ ] Implement SERVICE_CATEGORIES tabs
- [ ] Add service search/filter
- [ ] Global location switcher
- [ ] Customization validation
- [ ] Loading states

**Deliverable:** PR #12 - Service Discovery UX  
**Review Checklist:** User testing, performance benchmarks

---

## 10. Risk Assessment

### High Risk Items
1. **Breaking Changes:** Moving availability logic could break existing pages
   - **Mitigation:** Feature flags, gradual rollout, comprehensive testing
2. **Data Migration:** Junction table changes schema
   - **Mitigation:** Write migration script, validate with automated tests

### Medium Risk Items
1. **Context Re-Renders:** Expanding LocationContext could cause performance issues
   - **Mitigation:** Use React.memo, useMemo, measure before/after
2. **Component Decomposition:** Could introduce prop-drilling again
   - **Mitigation:** Use composition patterns, Context for shared state

### Low Risk Items
1. **UI Enhancements:** New features don't break existing functionality
   - **Mitigation:** Feature flags, progressive enhancement

---

## 11. Open Questions

1. **TypeScript Migration?**
   - Current codebase is plain JSX
   - Would TypeScript solve prop complexity issues?
   - Community preference? (See CONTRIBUTING.md)

2. **Storybook Integration?**
   - Should StandardizedItem sub-components have Storybook stories?
   - Current project has no Storybook setup

3. **Service Categories in URL?**
   - `/services?category=financial`
   - Requires router update (client-side only)

4. **Multi-Location Priority?**
   - Is multi-location expansion planned soon?
   - Should junction table support location-specific customizations? (e.g., different hours per location)

5. **Partner Services Architecture?**
   - Bitcoin ATM has partner data
   - Should partners be separate entities? (e.g., `partners.js`)

---

## 12. Related Issues & PRs

### Completed Work
- ✅ **PR #7:** RoCafé menu with StandardizedItem component
- ✅ **PR #6:** Documentation restructure (caused navbar/footer breakage, fixed in PR #7)

### Future Work
- 🔮 **Issue #4:** Multi-location expansion roadmap
- 🔮 **Issue #5:** Content strategy (menu photography, service images)
- 🔮 **Issue #6:** Analytics integration (track service views, location selections)

---

## 13. Acceptance Criteria

### Definition of Done
- [ ] All 5 refactoring phases completed
- [ ] Test coverage >80%
- [ ] Documentation updated (ARCHITECTURE.md, component READMEs)
- [ ] `npm run check:all` passes with 0 critical/high issues
- [ ] Visual regression tests pass
- [ ] Accessibility audit (WCAG 2.2 AA) pass
- [ ] Performance benchmarks met
- [ ] Code review approved by 2+ reviewers
- [ ] User acceptance testing completed

---

## 14. Appendix: Code Examples

### A. Proposed Junction Table

**File:** `src/data/serviceAvailability.js`
```javascript
/**
 * Service-Location Availability Mapping
 * Single source of truth for what services are offered where
 */

export const SERVICE_AVAILABILITY = [
  {
    serviceId: 'atm',
    locationId: 'loc-wellington-001',
    isActive: true,
    customHours: null, // Override service.availability if needed
    notes: null
  },
  {
    serviceId: 'bitcoin_atm',
    locationId: 'loc-wellington-001',
    isActive: true,
    customHours: null,
    notes: 'Managed by Bitcoin4U partner'
  },
  // ... rest of mappings
];

// Helper functions
export const getServicesAtLocation = (locationId) =>
  SERVICE_AVAILABILITY.filter(sa => sa.locationId === locationId && sa.isActive);

export const getLocationsForService = (serviceId) =>
  SERVICE_AVAILABILITY.filter(sa => sa.serviceId === serviceId && sa.isActive);

export const isServiceAvailableAt = (serviceId, locationId) =>
  SERVICE_AVAILABILITY.some(
    sa => sa.serviceId === serviceId && sa.locationId === locationId && sa.isActive
  );
```

### B. Enhanced LocationContext

**File:** `src/contexts/LocationContext.js`
```javascript
export const LocationContext = createContext({
  userLocation: null,           // {latitude, longitude} from geolocation
  selectedLocation: null,       // User's manually chosen location (overrides nearest)
  nearestLocation: null,        // Calculated nearest location
  loading: false,
  error: null,
  canUseGeolocation: false,
  requestLocation: () => {},
  setSelectedLocation: (locationId) => {},
  registerLocationAwareComponent: () => {}
});
```

### C. Refactored StandardizedItem Usage

**Before (Current):**
```jsx
// ServicesPage.jsx
const primaryLocation = getPrimaryLocation();
const locationIsOpen = isLocationOpenNow(primaryLocation);

<StandardizedItem
  item={{
    ...service,
    isAvailable: service.availableAt.includes(primaryLocation.id),
    locationStatus: locationIsOpen ? 'Open Now' : 'Closed'
  }}
/>
```

**After (Proposed):**
```jsx
// ServicesPage.jsx - Much simpler!
<StandardizedItem item={service} />

// StandardizedItem.jsx - Self-contained
const StandardizedItem = ({ item }) => {
  const { nearestLocation, selectedLocation } = useLocationContext();
  const location = selectedLocation || nearestLocation;
  const availability = useServiceAvailability(item.id, location);
  
  // availability: { isAvailable, status, color, displayText }
  // ...
};
```

---

## 15. Next Steps

### Immediate Actions (This Week)
1. **Team Review:** Schedule review meeting to discuss this analysis
2. **Priority Vote:** Determine which phases are critical vs. nice-to-have
3. **Resource Allocation:** Assign developers to milestone 1
4. **Spike Task:** Prototype junction table approach (2-hour time-box)

### Short-Term Actions (Next 2 Weeks)
1. **Phase 1 Implementation:** Data architecture refactor
2. **Testing:** Set up unit test infrastructure if not present
3. **Documentation:** Update ARCHITECTURE.md with new patterns

### Long-Term Actions (Next Month)
1. **Phase 2-5 Implementation:** Complete all refactoring phases
2. **Multi-Location Planning:** Use new architecture for location expansion
3. **Performance Monitoring:** Track metrics before/after changes

---

**Document Version:** 2.0 (Updated Post-PR #7 Merge)  
**Last Updated:** December 4, 2025  
**Base Branch:** main (commit c6ae445)  
**Analysis Branch:** feature/standardized-item-services-review  
**Reviewed By:** [Pending Review]  
**Approved By:** [Pending Approval]

---

## Version History

**v2.0 (December 4, 2025)** - Updated analysis after PR #7 merge
- Component grew from 511→765 lines (+50%)
- New customization system with 3 selection modes
- LocationContext integration added
- Quality regression identified (9→30 issues)
- New RoCafé menu system analysis added
- Updated refactoring strategy with urgent fixes

**v1.0 (December 4, 2025)** - Initial comprehensive analysis
- 511-line StandardizedItem component
- Services and location system architecture review
- Original 5-phase refactoring plan

---

_This analysis was created following DEVELOPMENT_ETHOS.md Principle #25: "Deep Understanding Before Action." All recommendations align with established architectural patterns and quality standards._
