# Availability & Live Data System Architecture

> Comprehensive documentation for the live data preference system with static fallback

**Date:** February 4, 2026  
**Status:** Active  
**Components:** `isLocationOpen()`, `StandardizedItem`, `LiveHoursDisplay`, `CurrentLocalTime`

---

## Overview

Roma Mart implements a **live-first, static-fallback architecture** for availability indicators across all features:
- RoCafé menu items
- Services (ATM, Bitcoin ATM, etc.)
- Location hours and open/closed status
- Current local time display

This ensures users see real-time data from Google Places API while gracefully falling back to static data if API is unavailable.

---

## System Architecture

### Data Hierarchy

```
Live Google Places API (isOpenNow)
         ↓ (if available)
    Use in UI immediately
         ↓ (if unavailable)
Static location.status fallback
         ↓
Display availability badge
```

### Key Components

#### 1. `isLocationOpen(location, isOpenNow?)` - [src/utils/availability.js](../../src/utils/availability.js)

**Purpose:** Centralized availability check with live data preference

**Signature:**
```javascript
export function isLocationOpen(location, isOpenNow = undefined) {
  // Prefer live data from Google Places API
  if (isOpenNow !== undefined) {
    return isOpenNow;
  }
  // Fallback to static location status
  return location.status === 'open';
}
```

**Parameters:**
- `location` (object): Location data from `src/data/locations.js`
- `isOpenNow` (boolean, optional): Live status from Google Places API

**Returns:** `boolean` - True if location is open (live) or marked open (fallback)

**Design Principles:**
- ✅ **Live-first:** Accepts live data as parameter, prefers it over static
- ✅ **Graceful fallback:** Uses `location.status` if live data unavailable
- ✅ **No hardcoding:** Avoids assumptions about defaults
- ✅ **Explicit:** Parameter name makes flow clear (no magic defaults)

**Usage Pattern:**
```javascript
// In component with access to live data
const { isOpenNow: liveOpenStatus } = useGooglePlaceHours(placeId);
const locationIsOpen = isLocationOpen(nearestLocation, liveOpenStatus);

// Without live data (e.g., prerendering)
const locationIsOpen = isLocationOpen(nearestLocation);
```

---

#### 2. `StandardizedItem` Component - [src/components/StandardizedItem.jsx](../../src/components/StandardizedItem.jsx)

**Purpose:** Unified component for RoCafé items and services with real-time availability

**Live Data Integration:**
```jsx
// Get live open/closed status from Google Places API if available
const { isOpenNow: liveOpenStatus } = useGooglePlaceHours(
  nearestLocation?.google?.placeId || null
);

// Compute effective status for item at nearest location
let locationIsOpen = nearestLocation 
  ? isLocationOpen(nearestLocation, liveOpenStatus) 
  : false;
```

**Availability States:**
| State | Condition | Display |
|-------|-----------|---------|
| `available` | Item available AND store open (live or static) | Green badge: "Available now at [Location]" |
| `available_but_closed` | Item available BUT store closed (live or static) | Orange badge: "Available (Closed) at [Location]" |
| `coming_soon` | Item coming soon | Blue badge: "Coming soon at [Location]" |
| `unavailable` | Item not available at location | Gray badge: "Not available at [Location]" |
| `select_location` | No location selected | Gray: "Select a location to check availability" |

**Data Flow:**
1. Hook fetches live `isOpenNow` from Google Places API
2. `isLocationOpen()` called with live data
3. `AvailabilityIndicator` renders with computed state
4. If API fails, falls back to `location.status` (silent, no error UX)

**Features:**
- ✅ Real-time status without page reload
- ✅ Respects location selection (auto-detects nearest)
- ✅ Handles both menu items and services
- ✅ Applies overrides per location if defined
- ✅ Dark mode + accessibility compliant

---

#### 3. `LiveHoursDisplay` Component - [src/components/LiveHoursDisplay.jsx](../../src/components/LiveHoursDisplay.jsx)

**Purpose:** Display location hours with live Google Places data, refresh on error

**Live Data Integration:**
```javascript
const { hours, isLoading, error, refetch, isOpenNow } = useGooglePlaceHours(placeId);
```

**New Prop: `showRefreshOnError`**
```jsx
<LiveHoursDisplay 
  placeId={location.google.placeId}
  fallbackHours={{ daily: location.hours.daily, exceptions: location.hours.exceptions }}
  showStatus={true}
  showRefreshOnError={true}  // ← Shows refresh button on API error
/>
```

**Behavior:**
- Shows live hours from Google Places if available
- Falls back silently to static hours if API unavailable
- On manual refresh attempt: shows error if it persists
- Refresh button only appears when both `showRefreshOnError && error` are true

**Usage Locations:**
- Homepage (App.jsx, line 475)
- Contact page (ContactPage.jsx, line 172)
- Locations detail page (LocationsPage.jsx, line 200+) - **NEW with `showRefreshOnError`**

---

#### 4. `CurrentLocalTime` Component - [src/components/CurrentLocalTime.jsx](../../src/components/CurrentLocalTime.jsx)

**Purpose:** Display real-time local time for selected location in footer

**Features:**
- ✅ Updates every second with current time
- ✅ Uses location's timezone from `location.timezone`
- ✅ Defaults to `'America/Toronto'` if no timezone specified
- ✅ Hydration-safe: uses `useRef` to detect client-side mount
- ✅ Graceful degradation: returns null if no data
- ✅ Locale-aware: uses `Intl.DateTimeFormat` with `'en-CA'` locale

**Integration:**
```jsx
// In Footer.jsx
import CurrentLocalTime from './CurrentLocalTime';

// Usage
<CurrentLocalTime location={getCurrentLocation()} />
```

**Data Requirements:**
Location object must include:
```javascript
{
  timezone: 'America/Toronto',  // or any valid IANA timezone
  name: 'Roma Mart Location'    // displayed in UI
}
```

**Rendering:**
```
⏰ Local time: 02:45:30 PM
```

**Technical Safety:**
- ✅ No hydration mismatches (client-only rendering)
- ✅ Efficient: one interval per component instance
- ✅ Cleanup: intervals cleared on unmount
- ✅ Error handling: catches `Intl.DateTimeFormat` errors gracefully

---

## Data Source Integration

### Locations Data - [src/data/locations.js](../../src/data/locations.js)

**Structure:**
```javascript
export const LOCATIONS = [
  {
    // ... basic info
    status: 'open',  // ← Fallback for availability
    
    // ... address, contact
    
    hours: {
      timezone: 'America/Toronto',  // ← Used by CurrentLocalTime
      daily: {
        Monday: '8:30 AM - 9:00 PM',
        Tuesday: '8:30 AM - 9:00 PM',
        // ...
      },
      exceptions: [ /* ... */ ]  // Holiday hours
    },
    
    google: {
      placeId: 'ChIJCfo3t6SdJYgRIQVbpCppKmY',  // ← Enables Google Places API calls
      coordinates: { lat: 42.970389, lng: -82.404589 }
    },
    
    services: ['atm', 'bitcoin_atm', 'rocafe']  // ← Availability checks
  }
];
```

**SSOT Principle:**
- All location data sourced from `locations.js` ONLY
- No hardcoded fallbacks in components
- Updates to status/hours cascade to all availability indicators
- Single point of truth for timezone data

---

## Hook: `useGooglePlaceHours` - [src/hooks/useGooglePlaceHours.js](../../src/hooks/useGooglePlaceHours.js)

**Returns:**
```javascript
{
  hours: {           // Live Google data or null if error/loading
    display: {
      full: [...],      // Full hours array
      dayMap: [...],    // Per-day breakdown
      grouped: [...],   // Grouped display (Mon-Fri, etc)
      exceptions: [...]
    }
  },
  isLoading: false,   // Fetching from API
  error: null,        // Error message if API failed
  refetch: fn,        // Manual refresh function
  isOpenNow: true     // ← Live open/closed status (boolean or null)
}
```

**Circuit Breaker Protection:**
- Stops API calls if quota exceeded
- Automatic fallback to static hours
- No cascading errors across components

---

## Design Ethos Alignment

### ✅ Principle 1: Systems over Spot Fixes
- Implemented unified `isLocationOpen()` rather than patching individual components
- Centralized availability logic in one place
- Reusable across menu items, services, and displays

### ✅ Principle 5: Brand Consistency
- All availability indicators use same logic
- Consistent styling via CSS variables (`var(--color-success)`, etc.)
- Dark mode support via CSS custom properties

### ✅ Principle 6: Accessibility First
- Semantic HTML: `<span role="status">` for status badges
- ARIA labels: `aria-label="Currently open"` on indicators
- Color + icon + text: Not relying on color alone
- Keyboard accessible: All interactive elements have proper focus states

### ✅ Principle 7: Dark Mode + Forced Colors
- All colors use CSS variables, not hardcoded hex values
- Tested with DevTools: forced-colors mode works correctly
- Status colors respect system preferences

### ✅ Principle 9: Security by Default
- No exposed API keys in components
- Uses environment variable: `VITE_GOOGLE_PLACES_API_KEY`
- Circuit breaker prevents rate limit exploitation

### ✅ Principle 13: Error Resilience
- Graceful degradation: static hours shown if API fails
- No error UX unless user explicitly refreshes
- Hydration-safe components (no SSR mismatches)

### ✅ Principle 16: Cohesive Design Tokens
- All colors use design token system
- No hardcoded values (`#FF0000`, `rgb(255, 0, 0)`, etc.)
- Example: `color: 'var(--color-success)'`

### ✅ Principle 18: Minimal Duplication
- Phone utilities extracted to `src/utils/phone.js`
- Availability logic not repeated across components
- Shared `CurrentLocalTime` component for all timezone displays

### ✅ Principle 22: Transparent Documentation
- Component JSDoc comments explain all parameters
- Prop types documented with `PropTypes`
- System architecture documented here

---

## Quality Standards Compliance

### ESLint
- ✅ 0 errors across all modified files
- ✅ React Hooks rules enforced
- ✅ No console.log in production code
- ✅ All imports properly resolved

### Accessibility (WCAG 2.2 AA+)
- ✅ Semantic HTML elements
- ✅ ARIA roles and labels on status indicators
- ✅ Color contrast meets AA standard
- ✅ Keyboard navigation functional
- ✅ Focus indicators visible

### Performance
- ✅ Component lazy loading maintained
- ✅ Memoization used for expensive computations
- ✅ Event handlers use `useCallback` for frequently rendered items
- ✅ No unnecessary re-renders

### Bundle Impact
- ✅ No new dependencies added
- ✅ ~100 lines of new code (CurrentLocalTime component)
- ✅ Minimal bundle growth

---

## Testing & Validation

### Manual Tests Performed

#### Availability Indicators
- [x] RoCafé menu items show live status
- [x] Services show correct availability
- [x] Fallback to static status when API unavailable
- [x] Correct state transitions (available → closed → unavailable)
- [x] Dark mode: colors display correctly
- [x] Light mode: colors display correctly

#### Hours Display
- [x] Live hours fetch and display from Google Places
- [x] Refresh button appears only on error (not always visible)
- [x] Manual refresh triggers API retry
- [x] Fallback hours display when API fails
- [x] Exception hours (holidays) display correctly

#### Local Time Display
- [x] Footer shows current time in location timezone
- [x] Clock updates every second
- [x] Timezone conversion works correctly
- [x] No console errors on mount/unmount
- [x] Hydration-safe (no server/client mismatch)

#### Accessibility
- [x] Status badges have `role="status"` and `aria-label`
- [x] Keyboard navigation through all controls
- [x] Focus indicators visible with ring style
- [x] Color + icon + text for status (not color alone)
- [x] Screen reader announces status changes

#### Build & Quality
- [x] `npm run lint` - 0 errors
- [x] `npm run check:quality` - All dimensions pass
- [x] `npm run build` - All 11 routes prerender
- [x] No TypeScript/JSDoc issues

---

## Integration Points

### Components Using Live Data
```
StandardizedItem
  ├─ useGooglePlaceHours (hook)
  ├─ isLocationOpen (utility)
  ├─ AvailabilityIndicator (sub-component)
  └─ Uses nearestLocation from LocationContext

LiveHoursDisplay
  ├─ useGooglePlaceHours (hook)
  └─ showRefreshOnError prop

CurrentLocalTime
  └─ location.timezone from LocationContext
```

### Data Flow
```
LocationContext (nearestLocation selected)
  ↓
StandardizedItem reads nearestLocation.google.placeId
  ↓
useGooglePlaceHours fetches from Google Places API
  ↓
isOpenNow returned to component
  ↓
isLocationOpen(location, isOpenNow) called
  ↓
Availability badge rendered with live or static status
```

---

## Common Patterns & Usage

### Pattern 1: Using Live Data in a Component
```jsx
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';
import { isLocationOpen } from '../utils/availability';

function MyComponent({ location }) {
  const { isOpenNow } = useGooglePlaceHours(location.google.placeId);
  const isOpen = isLocationOpen(location, isOpenNow);
  
  return <span>{isOpen ? 'Open' : 'Closed'}</span>;
}
```

### Pattern 2: Displaying Timezone-Aware Time
```jsx
import CurrentLocalTime from '../components/CurrentLocalTime';

function MyFooter({ location }) {
  return <CurrentLocalTime location={location} />;
}
```

### Pattern 3: Adding showRefreshOnError to Hours
```jsx
<LiveHoursDisplay 
  placeId={location.google.placeId}
  fallbackHours={location.hours}
  showRefreshOnError={true}  // Show refresh on API error
/>
```

---

## Troubleshooting

### Issue: Availability shows "Available (Closed)" when store is "Open Now"
**Cause:** `isOpenNow` not passed to `isLocationOpen()`
**Solution:** Ensure component fetches `isOpenNow` from `useGooglePlaceHours` hook and passes it

### Issue: Current time not updating in footer
**Cause:** Component not mounted on client or timezone invalid
**Solution:** Check `isClientRef` is being set to true, verify location has valid `timezone`

### Issue: Refresh button always visible
**Cause:** `showRefreshOnError` not set or error state incorrect
**Solution:** Add `showRefreshOnError={true}` to `LiveHoursDisplay` props

### Issue: Hardcoded color values instead of CSS variables
**Cause:** Using direct hex/rgb colors
**Solution:** Replace with `color: 'var(--color-success)'` pattern

---

## Future Enhancements

- [ ] Cache live data client-side (IndexedDB) for offline support
- [ ] Add WebSocket subscription for real-time updates
- [ ] Implement analytics tracking for availability conversions
- [ ] Add manual override capability for emergency closures
- [ ] Support for future API integrations (location-specific events, reservations)

---

## Documentation Maintenance

This document is the **single source of truth** for availability system architecture.

**Update this file when:**
- [ ] New availability features added
- [ ] Integration points change
- [ ] New patterns emerge
- [ ] Quality standards modified

**Related Documentation:**
- [Data Management](./data-management.md) - Location data structure
- [Component System](./component-system.md) - Component patterns
- [Circuit Breaker Pattern](./circuit-breaker-pattern.md) - API protection
- [DEVELOPMENT_ETHOS.md](../../DEVELOPMENT_ETHOS.md) - Core principles

---

**Maintained by:** GitHub Copilot  
**Last Updated:** February 4, 2026  
**Status:** Active & Complete

