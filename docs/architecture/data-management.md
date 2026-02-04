# Data Management System

> **Comprehensive guide to data architecture, state management, and API integration**

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Static Data Sources](#static-data-sources)
3. [Dynamic Data (API Integration)](#dynamic-data-api-integration)
4. [State Management](#state-management)
5. [Context Providers](#context-providers)
6. [Custom Hooks](#custom-hooks)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Configuration Files](#configuration-files)
9. [Data Validation](#data-validation)
10. [Best Practices](#best-practices)

---

## Architecture Overview

Roma Mart uses a **hybrid data architecture**:

1. **Static Data Files** - Single source of truth for locations, menu items, company info
2. **Dynamic API Integration** - Live hours, ratings, and menu updates from external sources
3. **Context-Based State** - React Context for location awareness and user state
4. **Local Caching** - IndexedDB + localStorage for offline support and performance
5. **Circuit Breaker Protection** - API quota management and graceful degradation

### Data Philosophy

- **Zero External Dependencies** - All core data self-contained in `src/data/`
- **Single Source of Truth** - No hardcoded duplicates across components
- **API-First for Dynamic** - Live hours/ratings fetched from Google Places
- **Graceful Degradation** - Static fallbacks when APIs unavailable
- **Offline-First** - Cached data for PWA offline functionality

### Migration Roadmap (In Progress)

- **RoCafé Menu:** Now sourced primarily from the external database (see `useExcelMenu`).
- **Locations, Services, Employees:** Currently hardcoded, scheduled to migrate to the external database.
- **Company Data:** Currently centralized in config files, expected to migrate to the external database.
- **Color/Theme Config:** Currently in design tokens and CSS variables, expected to migrate to the external database.

---

## Static Data Sources

### 1. Location Data (`src/data/locations.js`)

**Purpose:** Complete source of truth for all Roma Mart locations (stores, ATMs, vending machines)

**Structure:**
```javascript
export const LOCATION_TYPES = {
  CONVENIENCE_STORE: 'convenience_store',
  MINIMART: 'minimart',
  VENDING_MACHINE: 'vending_machine',
  ATM_STANDALONE: 'atm_standalone',
  KIOSK: 'kiosk',
  POPUP: 'popup',
  COMING_SOON: 'coming_soon'
};

export const LOCATIONS = [
  {
    // === BASIC INFO ===
    id: 'loc-wellington-001',
    type: LOCATION_TYPES.CONVENIENCE_STORE,
    name: 'Roma Mart Convenience',
    shortName: 'Roma Mart 001',
    isPrimary: true,                    // HQ/featured location
    status: 'open',                     // open | closed | coming_soon | temporarily_closed
    
    // === ADDRESS ===
    address: {
      street: '3-189 Wellington Street',
      city: 'Sarnia',
      province: 'ON',
      postalCode: 'N7T 1G6',
      country: 'Canada',
      formatted: '3-189 Wellington Street, Sarnia, ON  N7T 1G6'
    },
    
    // === GOOGLE INTEGRATION ===
    google: {
      placeId: 'ChIJCfo3t6SdJYgRIQVbpCppKmY',
      mapLink: 'https://www.google.com/maps/...',
      embedUrl: 'https://www.google.com/maps/embed/v1/place?...',
      rating: null,                     // Fetched dynamically
      reviewCount: null,                // Fetched dynamically
      coordinates: { lat: 42.970389, lng: -82.404589 }
    },
    
    // === CONTACT ===
    contact: {
      phone: '+1 (382) 342-2000',
      email: 'contact@romamart.ca',
      whatsapp: null
    },
    
    // === HOURS (Static fallback) ===
    hours: {
      timezone: 'America/Toronto',
      daily: {
        Monday: '8:30 AM - 9:00 PM',
        Tuesday: '8:30 AM - 9:00 PM',
        // ... all 7 days
      },
      display: 'Mon-Thu, Sat-Sun: 8:30 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM',
      is24Hours: false,
      exceptions: []                    // Holiday hours
    },
    
    // === SERVICES ===
    services: ['atm', 'bitcoin_atm', 'rocafe', 'lottery'],
    
    // === METADATA ===
    features: ['wifi', 'parking', 'accessible'],
    images: { storefront: null, interior: null },
    seo: { slug: 'wellington-street-sarnia', description: '...' }
  }
];
```

**Key Exports:**
```javascript
// Get all locations
export const LOCATIONS = [...];

// Helper functions
export const getPrimaryLocation = () => LOCATIONS.find(loc => loc.isPrimary);
export const getLocationById = (id) => LOCATIONS.find(loc => loc.id === id);
export const getActiveLocations = () => LOCATIONS.filter(loc => loc.status === 'open');
export const getLocationsByType = (type) => LOCATIONS.filter(loc => loc.type === type);
```

---

### 2. RoCafé Menu Data (`src/data/rocafe-menu.js`)

**Current Reality:** The app **surfaces the external database menu**. The local file is retained for reference, fallback, and future parity, but it is no longer the primary source displayed to users.

**Structure:**
```javascript
// Category constants
export const MENU_CATEGORIES = {
  HOT_COFFEE: 'hot-coffee',
  ICED_COFFEE: 'iced-coffee',
  TEA: 'tea',
  FRESH_JUICE: 'fresh-juice',
  SMOOTHIES: 'smoothies',
  FRAPPES: 'frappes',
  SPECIALTY: 'specialty',
  FOOD: 'food',
  SEASONAL: 'seasonal'
};

// Caffeine level system
export const CAFFEINE_LEVELS = {
  NONE: { label: 'Caffeine-Free', value: 0, color: 'var(--color-text-muted)' },
  LOW: { label: 'Low Caffeine', value: 1, color: 'var(--color-success)' },
  MEDIUM: { label: 'Medium Caffeine', value: 2, color: 'var(--color-warning)' },
  HIGH: { label: 'High Caffeine', value: 3, color: 'var(--color-error)' }
};

// Allergen system
export const ALLERGENS = {
  DAIRY: { label: 'Dairy', icon: '🥛' },
  NUTS: { label: 'Tree Nuts', icon: '🌰' },
  SOY: { label: 'Soy', icon: '🫘' },
  GLUTEN: { label: 'Gluten', icon: '🌾' },
  EGGS: { label: 'Eggs', icon: '🥚' }
};

// Dietary tags
export const DIETARY_TAGS = {
  VEGAN: { label: 'Vegan', icon: '🌱', color: 'var(--color-success)' },
  VEGETARIAN: { label: 'Vegetarian', icon: '🥗', color: 'var(--color-success-light)' },
  GLUTEN_FREE: { label: 'Gluten-Free', icon: '⚪', color: 'var(--color-info)' },
  DAIRY_FREE: { label: 'Dairy-Free', icon: '🚫🥛', color: 'var(--color-primary-light)' },
  HALAL: { label: 'Halal', icon: '☪️', color: 'var(--color-success-dark)' }
};

// Full menu items (reference dataset)
export const ROCAFE_FULL_MENU = [
  {
    itemType: 'menu',
    id: 'signature-bubble-tea',
    name: 'Signature Bubble Tea',
    tagline: 'Our most popular boba tea',
    description: 'Premium black tea with brown sugar syrup...',
    image: null,                        // Placeholder for photography
    badge: 'bestseller',                // bestseller | new | limited | seasonal
    
    // Multi-size pricing
    sizes: [
      { name: 'Regular', price: 4.99, calories: 320 },
      { name: 'Large', price: 5.99, calories: 410 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.SPECIALTY,
    
    // Customization options
    customizations: [
      { 
        type: 'Ice Level', 
        required: true,
        multiple: false,
        options: [
          { name: 'Regular Ice', price: 0, default: true },
          { name: 'Less Ice', price: 0 },
          { name: 'No Ice', price: 0 }
        ]
      },
      { 
        type: 'Sugar Level', 
        required: true,
        options: [
          { name: '100%', price: 0, default: true },
          { name: '75%', price: 0 },
          { name: '50%', price: 0 }
        ]
      },
      { 
        type: 'Toppings', 
        required: false,
        multiple: true,
        options: [
          { name: 'Tapioca Pearls', price: 0.75 },
          { name: 'Jelly', price: 0.75 }
        ]
      }
    ],
    
    // Metadata
    caffeineLevel: CAFFEINE_LEVELS.MEDIUM,
    allergens: [ALLERGENS.DAIRY],
    dietaryTags: [],
    preparationTime: '3-5 minutes',
    available: true
  }
  // ... more items
];
```

**Key Features (Reference Dataset):**
- **Structured Customization System** - Required/optional, single/multiple, quantity-based
- **Multi-Size Pricing** - Small, Regular, Large with independent prices
- **Allergen Tracking** - Full allergen disclosure system
- **Dietary Filtering** - Vegan, vegetarian, gluten-free, halal
- **Caffeine Levels** - Visual caffeine indicator system

**Primary Source (Live):** External menu database accessed via `useExcelMenu` (see [Dynamic Data (API Integration)](#dynamic-data-api-integration)).

---

### 3. Configuration Files (`src/config/`)

#### `company_data.js` - Business Information
```javascript
export const COMPANY_INFO = {
  name: 'Roma Mart',
  legalName: 'Roma Mart Inc.',
  tagline: 'Your Neighborhood Convenience Store',
  description: '...',
  established: '2024',
  email: 'contact@romamart.ca',
  phone: '+1 (382) 342-2000',
  social: {
    facebook: 'https://facebook.com/romamart',
    instagram: 'https://instagram.com/romamart',
    twitter: 'https://x.com/romamart'
  },
  hours: 'Open Daily',
  location: getPrimaryLocation()
};
```

#### `navigation.js` - Site Navigation
```javascript
export const MAIN_NAV = [
  { label: 'Home', path: '/', ariaLabel: 'Navigate to homepage' },
  { label: 'Locations', path: '/locations', ariaLabel: 'View store locations' },
  { label: 'RoCafé Menu', path: '/rocafe', ariaLabel: 'View RoCafé coffee menu' },
  // ...
];

export const FOOTER_LINKS = {
  company: [...],
  legal: [...],
  support: [...]
};
```

#### `ordering.js` - Ordering CTAs
```javascript
export const ORDER_METHODS = {
  ubereats: { name: 'Uber Eats', url: '...', icon: '🚗' },
  doordash: { name: 'DoorDash', url: '...', icon: '🚪' },
  // ...
};
```

---

## Dynamic Data (API Integration)

### 1. Google Places API (`useGooglePlaceHours` hook)

**Purpose:** Fetch live opening hours, ratings, and review counts

**Hook:** `src/hooks/useGooglePlaceHours.js`

**Returns:**
```javascript
const { 
  isOpen,              // boolean - Is location currently open?
  hours,               // object - Structured hours by day
  rating,              // number - Google rating (1-5)
  userRatingCount,     // number - Total review count
  isLoading,           // boolean - API call in progress
  error,               // string | null - Error message
  refetch              // function - Manual refresh
} = useGooglePlaceHours(placeId);
```

**Features:**
- **Circuit Breaker Protection** - Stops calls after 429/403/402 errors
- **1-Hour Cache** - IndexedDB caching to minimize API calls
- **Graceful Fallback** - Returns static hours from `locations.js` on failure
- **Field Masking** - Only fetches needed fields (hours, rating, reviews)

**Circuit Breaker States:**
- `CLOSED` (normal) → API calls allowed
- `OPEN` (quota exceeded) → Blocked for 1 hour, use static data
- `HALF_OPEN` (testing) → Allow 1 test call after cooldown

**Example Usage:**
```jsx
import { useGooglePlaceHours } from '../hooks/useGooglePlaceHours';

function LocationCard({ location }) {
  const { isOpen, rating, userRatingCount, isLoading } = useGooglePlaceHours(
    location.google.placeId
  );
  
  if (isLoading) return <p>Loading hours...</p>;
  
  return (
    <div>
      <p>Status: {isOpen ? 'Open Now' : 'Closed'}</p>
      {rating && <p>Rating: {rating} ⭐ ({userRatingCount} reviews)</p>}
    </div>
  );
}
```

---

### 2. External Menu API (`useExcelMenu` hook)

**Purpose:** Fetch menu items from Excel-based API (legacy integration)

**Hook:** `src/hooks/useExcelMenu.js`

**Returns:**
```javascript
const { 
  menuItems,           // array - Menu items from API
  loading,             // boolean - Fetch in progress
  error                // string | null - Error message
} = useExcelMenu(apiUrl);
```

**API Endpoint:** `https://romamart.netlify.app/api/public-menu`

**Use Case:** External menu management system (currently the **primary** menu source)

---

## State Management

### Architecture: Context + Hooks Pattern

Roma Mart uses **React Context** for global state with custom hooks for access:

```
┌─────────────────────────────────────┐
│   LocationProvider (Component)       │
│   ┌───────────────────────────────┐ │
│   │ LocationContext (Context)     │ │
│   │  - userLocation               │ │
│   │  - nearestLocation            │ │
│   │  - loading                    │ │
│   │  - error                      │ │
│   │  - requestLocation()          │ │
│   └───────────────────────────────┘ │
└─────────────────────────────────────┘
              ↓
    useLocationContext (Hook)
              ↓
        Components
```

### Key State

1. **User Location** (`userLocation`)
   - Source: Browser Geolocation API or cached coordinates
   - Cached: localStorage for 1 hour
   - Used for: Finding nearest store, distance calculations

2. **Nearest Location** (`nearestLocation`)
   - Computed: From user location + LOCATIONS array
   - Fallback: Primary location (HQ) if no user location
   - Used for: Auto-populating forms, showing closest store

3. **Location Request State** (`locationRequested`)
   - Prevents duplicate geolocation prompts per session
   - Stored: sessionStorage
   - Auto-requested when first location-aware component mounts

---

## Context Providers

### LocationProvider (`src/components/LocationProvider.jsx`)

**Purpose:** Manages user location, geolocation requests, and nearest store calculation

**Wraps:** Entire app in `App.jsx`

**Provides:**
```javascript
{
  userLocation: { latitude, longitude } | null,
  nearestLocation: Location | null,
  loading: boolean,
  error: string | null,
  canUseGeolocation: boolean,
  requestLocation: () => void,
  registerLocationAwareComponent: () => void
}
```

**Key Features:**

1. **Auto-Location on Demand**
   - Components call `registerLocationAwareComponent()` to request location
   - Only requests once per session
   - Prevents duplicate permission prompts

2. **Smart Caching**
   - Cached location valid for 1 hour
   - Stored in localStorage: `roma_mart_user_location`
   - Session flag: `roma_mart_location_requested`

3. **Nearest Location Calculation**
   - Uses Haversine formula for distance
   - Filters by `status: 'open'`
   - Fallback to primary location (HQ)

**Example Setup:**
```jsx
// App.jsx
import { LocationProvider } from './components/LocationProvider';

function App() {
  return (
    <LocationProvider>
      <Router>
        <Routes />
      </Router>
    </LocationProvider>
  );
}
```

---

## Custom Hooks

### 1. `useLocationContext()`

**File:** `src/hooks/useLocationContext.js`

**Purpose:** Access LocationProvider context

**Returns:** Full location context object

**Usage:**
```jsx
import { useLocationContext } from '../hooks/useLocationContext';

function Component() {
  const { nearestLocation, userLocation, loading } = useLocationContext();
  // ...
}
```

---

### 2. `useLocationAware(onLocationFound)`

**File:** `src/hooks/useLocationContext.js`

**Purpose:** Auto-register component as location-aware and trigger geolocation

**Parameters:**
- `onLocationFound(position)` - Callback when location received

**Returns:** `userLocation` object

**Usage:**
```jsx
import { useLocationAware } from '../hooks/useLocationContext';

function MapComponent() {
  const handleLocationFound = (position) => {
    console.log('User at:', position.coords.latitude, position.coords.longitude);
  };
  
  const userLocation = useLocationAware(handleLocationFound);
  
  return <Map center={userLocation} />;
}
```

**Auto-Behavior:**
- Calls `registerLocationAwareComponent()` on mount
- Triggers geolocation if not already requested
- Calls callback when location received

---

### 3. `useGooglePlaceHours(placeId)`

**File:** `src/hooks/useGooglePlaceHours.js`

**Purpose:** Fetch live hours and ratings from Google Places

**Parameters:**
- `placeId` - Google Place ID (from `locations.js`)

**Returns:**
```javascript
{
  isOpen: boolean,
  hours: {
    Monday: '8:30 AM - 9:00 PM',
    // ... all 7 days
  },
  rating: number,
  userRatingCount: number,
  isLoading: boolean,
  error: string | null,
  refetch: () => void
}
```

**Caching Strategy:**
- IndexedDB cache for 1 hour
- Key: `google_place_hours_${placeId}`
- Reduces API calls by 95%+

**Circuit Breaker:**
- Monitors API responses
- Blocks calls on quota errors (429, 403, 402)
- Cooldown: 1 hour before retry
- Fallback: Static hours from `locations.js`

---

### 4. `useExcelMenu(apiUrl)`

**File:** `src/hooks/useExcelMenu.js`

**Purpose:** Fetch menu from external Excel-based API

**Returns:**
```javascript
{
  menuItems: Array,
  loading: boolean,
  error: string | null
}
```

**Status:** Available but not actively used (static menu preferred)

---

## Data Flow Patterns

### Pattern 1: Location Selection Flow

```
User Action (select location)
    ↓
LocationProvider updates nearestLocation
    ↓
useLocationContext hook notifies components
    ↓
Components re-render with new location
    ↓
useGooglePlaceHours fetches hours for new location
    ↓
UI updates with live data
```

### Pattern 2: Menu Display Flow

```
Page Mount (RoCafePage)
    ↓
Import ROCAFE_FULL_MENU from src/data/rocafe-menu.js
    ↓
Filter by category/dietary tags
    ↓
Render StandardizedItem components
    ↓
Generate structured data schemas
```

### Pattern 3: API Data with Fallback

```
Component needs hours
    ↓
useGooglePlaceHours(placeId)
    ↓
Check IndexedDB cache
    ↓
├─ Cache Hit (< 1 hour old) → Return cached data
    ↓
└─ Cache Miss → Fetch from Google Places API
    ↓
    ├─ API Success → Cache + return
    ↓
    └─ API Failure → Return static hours from locations.js
```

### Pattern 4: Geolocation Flow

```
Location-aware component mounts
    ↓
useLocationAware() registers component
    ↓
LocationProvider checks sessionStorage
    ↓
├─ Already requested this session → Skip
    ↓
└─ First request → Prompt user for location
    ↓
    User grants permission
    ↓
    Browser returns coordinates
    ↓
    Store in localStorage (1 hour cache)
    ↓
    Calculate nearest location
    ↓
    Update all location-aware components
```

---

## Configuration Files

### Company Data (`src/config/company_data.js`)

**Purpose:** Single source of truth for company info

**Exports:**
- `COMPANY_INFO` - Name, legal name, contact, social links
- `BUSINESS_HOURS` - Default hours display
- `PRIMARY_LOCATION` - HQ location reference

**Usage:**
```jsx
import { COMPANY_INFO } from '../config/company_data';

<footer>
  <p>{COMPANY_INFO.name}</p>
  <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
</footer>
```

---

### Navigation (`src/config/navigation.js`)

**Purpose:** Centralized navigation structure

**Exports:**
- `MAIN_NAV` - Primary navigation links
- `FOOTER_LINKS` - Footer sections (company, legal, support)
- `SOCIAL_LINKS` - Social media links

**Usage:**
```jsx
import { MAIN_NAV } from '../config/navigation';

<nav>
  {MAIN_NAV.map(item => (
    <a key={item.path} href={item.path}>{item.label}</a>
  ))}
</nav>
```

---

### Ordering Methods (`src/config/ordering.js`)

**Purpose:** Ordering platform CTAs

**Exports:**
- `ORDER_METHODS` - Uber Eats, DoorDash, SkipTheDishes
- `PRIMARY_ORDER_METHOD` - Default CTA

**Usage:**
```jsx
import { ORDER_METHODS } from '../config/ordering';

<a href={ORDER_METHODS.ubereats.url}>
  {ORDER_METHODS.ubereats.icon} Order on {ORDER_METHODS.ubereats.name}
</a>
```

---

## Data Validation

### Quality Checker Validation

**File:** `scripts/check-quality.js`

**Validates:**

1. **Location Data**
   - Required fields present (id, name, address, google.placeId)
   - Coordinates are valid numbers
   - Services array contains only valid service types
   - Hours format correct (HH:MM format)
   - Google Place ID format valid

2. **Menu Data**
   - All items have id, name, category
   - Prices are positive numbers
   - Categories are from MENU_CATEGORIES enum
   - Images paths start with `/` or `http`
   - Allergens are from ALLERGENS enum

3. **Configuration**
   - Company info has required fields
   - Navigation links are valid paths
   - Social links are valid URLs
   - Email format valid

**Run Validation:**
```bash
npm run check:quality
```

### Schema Validation

**File:** `src/test/schemas/*.test.js`

**Validates:**
- Structured data schemas match Schema.org standards
- Required properties present
- Data types correct
- URLs properly formatted
- Dates in ISO 8601 format

**Run Tests:**
```bash
npm test
```

---

## Best Practices

### DO ✅

1. **Use Static Data as Source of Truth**
   ```jsx
   import { LOCATIONS } from '../data/locations';
   // Use LOCATIONS array, don't hardcode
   ```

2. **Leverage Dynamic APIs for Real-Time Data**
   ```jsx
   const { isOpen, rating } = useGooglePlaceHours(location.google.placeId);
   // Live hours > static hours
   ```

3. **Cache Aggressively**
   ```jsx
   // useGooglePlaceHours caches for 1 hour
   // LocationProvider caches coordinates for 1 hour
   ```

4. **Graceful Fallbacks**
   ```jsx
   const displayHours = liveHours || staticHours || 'Call for hours';
   ```

5. **Centralize Configuration**
   ```jsx
   import { COMPANY_INFO } from '../config/company_data';
   // Don't hardcode "Roma Mart" everywhere
   ```

### DON'T ❌

1. **Don't Hardcode Location Data**
   ```jsx
   // ❌ BAD
   const address = '3-189 Wellington Street';
   
   // ✅ GOOD
   const address = getPrimaryLocation().address.formatted;
   ```

2. **Don't Duplicate Data**
   ```jsx
   // ❌ BAD - Duplicate hours in component
   const hours = { Monday: '8:30 AM - 9:00 PM', ... };
   
   // ✅ GOOD - Import from locations.js
   const hours = location.hours.daily;
   ```

3. **Don't Make Unprotected API Calls**
   ```jsx
   // ❌ BAD - Direct fetch
   const data = await fetch(googlePlacesUrl);
   
   // ✅ GOOD - Use hook with circuit breaker
   const { data } = useGooglePlaceHours(placeId);
   ```

4. **Don't Skip Caching**
   ```jsx
   // ❌ BAD - Fetch on every render
   useEffect(() => {
     fetch(apiUrl).then(...);
   }, []);
   
   // ✅ GOOD - Check cache first
   const { data } = useGooglePlaceHours(placeId); // Cached internally
   ```

5. **Don't Forget Offline Support**
   ```jsx
   // ❌ BAD - No fallback
   const hours = await fetchLiveHours();
   
   // ✅ GOOD - Static fallback
   const hours = liveHours || location.hours.daily;
   ```

---

## Data Update Workflows

### Adding a New Location

1. Open `src/data/locations.js`
2. Copy existing location object structure
3. Update all fields (ID must be unique: `loc-<city>-<number>`)
4. Get Google Place ID from [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
5. Add coordinates (use Google Maps or geolocation)
6. Test with `npm run check:quality`

### Adding a Menu Item

1. Open `src/data/rocafe-menu.js`
2. Copy existing item structure
3. Set unique ID (kebab-case: `pumpkin-spice-latte`)
4. Assign category from `MENU_CATEGORIES`
5. Add allergens, dietary tags, caffeine level
6. Test on `/rocafe` page

### Updating Company Info

1. Open `src/config/company_data.js`
2. Update relevant fields
3. No imports needed - changes propagate automatically
4. Test affected pages (Footer, Contact, About)

---

## Related Documentation

- [Component System](./component-system.md) - How components consume data
- [Circuit Breaker Pattern](./circuit-breaker-pattern.md) - API protection details
- [Theming & Tokens](./theming-tokens.md) - Design token system
- [Quality Checkers](./quality-checkers.md) - Data validation rules

---

**Last Updated:** February 4, 2026  
**Maintainer:** Roma Mart Development Team
