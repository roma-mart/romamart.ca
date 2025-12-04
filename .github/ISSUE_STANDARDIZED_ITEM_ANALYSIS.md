# Comprehensive Analysis: StandardizedItem Component & Location System Integration

**Created:** December 4, 2025  
**Branch:** `feature/standardized-item-services-review`  
**Status:** 🔍 Analysis Phase  
**Priority:** Medium  
**Type:** Enhancement / Refactoring Proposal

---

## Executive Summary

This issue presents a comprehensive analysis of the `StandardizedItem` component (511 lines), the services data architecture (`services.jsx`, 417 lines), and the location system integration (`locations.js`, 457 lines). The goal is to identify architectural improvements, reduce complexity, and enhance maintainability while ensuring alignment with DEVELOPMENT_ETHOS.md principles.

**Key Findings:**
- ✅ Component successfully handles both menu and service variants
- ⚠️ 29 different props create high cognitive load and potential prop-drilling issues
- ⚠️ 4-state availability logic is complex but functional
- ⚠️ Location integration relies on manual prop passing (not context-driven)
- ✅ Services data structure is well-organized with helper functions
- ⚠️ Location system has robust helper functions but inconsistent usage patterns

---

## 1. StandardizedItem Component Analysis

### 1.1 Architecture Overview

**File:** `src/components/StandardizedItem.jsx`  
**Lines:** 511 (536 with comments)  
**Last Major Update:** RoCafé menu implementation (PR #7)

**Purpose:** Universal collapsible/expandable item component for both services and menu items.

### 1.2 Props Interface Complexity

**Current Props Count:** 29 different properties

<details>
<summary>Complete Props Breakdown</summary>

```javascript
const {
  name,                 // String: Item name
  tagline,              // String: Short description (basic view)
  description,          // String: Full description (detailed view)
  image,                // String: Image URL or path
  badge,                // Enum: 'bestseller', 'new', 'halal', 'comingSoon'
  sizes,                // Array: [{name, price}, ...]
  defaultSize,          // Number: Index of default size
  calories,             // String/Number: Nutritional info
  ingredients,          // String: Ingredient list
  icon,                 // JSX Element: Icon component (services)
  action,               // Object: {text, email, url, subject, body}
  features,             // Array: List of features (services)
  availability,         // Enum: 'store_hours', '24_7', 'custom'
  isAvailable,          // Boolean|String: false/'coming-soon'
  locationStatus,       // String: 'Open Now'/'Closed'
  ageRestricted,        // Boolean: 19+ items
  legalNotice,          // Object: {text, law, url}
  partner,              // Object: {name, url, logo}
} = item;
```

**Additional Component Props:**
- `defaultExpanded` (Boolean)
- `variant` (String) - Currently unused, passed but not referenced

</details>

**Analysis:**
- ✅ **Good:** Single item object consolidates related data
- ⚠️ **Issue:** 29 props create high cognitive load when debugging
- ⚠️ **Issue:** `variant` prop is passed but never used in component logic
- ❌ **Problem:** No prop validation or TypeScript types (project uses plain JSX)

### 1.3 State Management

**Current State:**
- `isExpanded` (Boolean) - Controlled by user interaction
- `selectedSize` (Number) - Index-based size selection

**Analysis:**
- ✅ Minimal state footprint (2 variables)
- ✅ Uses `useCallback` for `toggleExpanded` (performance optimization)
- ✅ Keyboard navigation supported (Enter/Space keys)

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

**Component Structure:**
```
<div> Main container
  └─ Overlay (unavailable/coming-soon)
  └─ <div> Basic View (always visible)
      └─ Image
      └─ Content
          └─ Header (name, badges, expand icon)
          └─ Tagline
          └─ Size options (collapsed)
  └─ <div> Detailed View (conditional: isExpanded)
      └─ Full description
      └─ Size selector (interactive buttons)
      └─ Features list (services)
      └─ Availability status box
      └─ Partner info
      └─ Legal notice
      └─ Nutritional info
      └─ Action button (CTA)
```

**Analysis:**
- ✅ Clear separation of basic/detailed views
- ✅ Accessibility: Proper ARIA labels, keyboard navigation, semantic HTML
- ⚠️ 511 lines for single component (large cognitive overhead)
- ⚠️ Inline styles throughout (mixing CSS vars with inline logic)

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
**Lines:** 417  
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
**Lines:** 457  
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

### 4.1 High Priority Issues

#### Issue #1: Bidirectional Location-Service Duplication
**Problem:**
```javascript
// locations.js
services: ['atm', 'bitcoin_atm', 'rocafe', ...]

// services.jsx
availableAt: ['loc-wellington-001']
```

**Impact:** High  
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

#### Issue #3: Availability Logic Not Context-Driven
**Problem:** Parents must calculate and pass `isAvailable` and `locationStatus`

**Impact:** Medium  
**Risk:** Duplication, inconsistency across pages

**Recommendation:** Move availability logic into StandardizedItem
```javascript
// Inside StandardizedItem.jsx
const { userLocation } = useLocationContext();
const nearestLocation = useNearestLocation(userLocation);
const availability = useServiceAvailability(item.id, nearestLocation);
```

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

#### Issue #5: Unused `variant` Prop
**Problem:** `variant="service"` passed to StandardizedItem but never referenced

**Recommendation:**
- **Option A:** Remove prop if truly unused
- **Option B:** Implement variant-specific styling differences

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

## 5. Proposed Refactoring Strategy

### Phase 1: Data Architecture (Week 1)
1. **Create `serviceAvailability.js`** junction table
2. Remove `availableAt` from services.jsx
3. Remove `services` array from locations.js
4. Update helper functions to use junction table
5. Add data validation script

**Estimated Effort:** 8 hours  
**Risk:** Low (isolated data layer change)

### Phase 2: Context Enhancement (Week 1)
1. Expand LocationContext with `selectedLocation` and `nearestLocation`
2. Create `useNearestLocation()` hook
3. Create `useServiceAvailability(serviceId, location)` hook
4. Refactor Footer to use enhanced context
5. Update ServicesPage and RoCafePage

**Estimated Effort:** 6 hours  
**Risk:** Medium (touches multiple components)

### Phase 3: Component Decomposition (Week 2)
1. Extract `<AvailabilityIndicator>` component
2. Extract `<ItemHeader>` component
3. Extract `<ItemDetailedView>` component
4. Extract `<LegalNoticeBox>` component
5. Refactor StandardizedItem to orchestrator pattern
6. Update Storybook (if implemented)

**Estimated Effort:** 12 hours  
**Risk:** Medium (large refactor, requires comprehensive testing)

### Phase 4: Logic Migration (Week 2)
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

**Estimated Effort:** 10 hours  
**Risk:** Low (new features, doesn't break existing)

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

## 8. Success Metrics

### Code Quality Metrics
- [ ] Reduce StandardizedItem line count from 511 to <200
- [ ] Eliminate location-service duplication (0 redundant data)
- [ ] Increase helper function usage to 80%+
- [ ] Pass all `npm run check:quality` checks (0 critical/high issues)

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

## 9. Implementation Plan

### Milestone 1: Foundation (Week 1)
- [ ] Create `serviceAvailability.js` junction table
- [ ] Enhance LocationContext
- [ ] Create `useNearestLocation()` and `useServiceAvailability()` hooks
- [ ] Update data layer helper functions

**Deliverable:** PR #8 - Data Architecture Refactor  
**Review Checklist:** Run `npm run check:all`, verify no regressions

### Milestone 2: Component Refactor (Week 2)
- [ ] Extract sub-components from StandardizedItem
- [ ] Move availability logic into component
- [ ] Update ServicesPage and RoCafePage
- [ ] Add unit tests for new components

**Deliverable:** PR #9 - StandardizedItem Decomposition  
**Review Checklist:** Visual regression tests pass, accessibility audit pass

### Milestone 3: UI Enhancements (Week 3)
- [ ] Implement SERVICE_CATEGORIES tabs
- [ ] Add service search/filter
- [ ] Global location switcher
- [ ] Loading states for geolocation

**Deliverable:** PR #10 - Service Discovery UX  
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

**Document Version:** 1.0  
**Last Updated:** December 4, 2025  
**Reviewed By:** [Pending Review]  
**Approved By:** [Pending Approval]

---

_This analysis was created following DEVELOPMENT_ETHOS.md Principle #25: "Deep Understanding Before Action." All recommendations align with established architectural patterns and quality standards._
