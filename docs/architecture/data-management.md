# Data Management

> Location and menu data management in Roma Mart

## Overview

Roma Mart uses static JavaScript data files as the single source of truth for locations, menu items, and configuration.

## Data Sources

### Location Data

**File:** `src/data/locations.js`

```javascript
export const locations = [
  {
    id: 'wellington-st',
    name: 'Wellington St. Location',
    address: '3-189 Wellington St',
    city: 'Sarnia',
    province: 'ON',
    postalCode: 'N7T 1G7',
    phone: '+1-382-342-2000',
    coordinates: {
      lat: 42.970389,
      lng: -82.404589
    },
    hours: {
      monday: { open: '08:00', close: '22:00' },
      // ...
    },
    services: ['atm', 'bitcoin_atm', 'rocafe'],
    type: 'convenience_store',
    googlePlaceId: 'ChIJ...'
  }
];
```

### Location Types

| Type | Description |
|------|-------------|
| `convenience_store` | Full-service store |
| `minimart` | Smaller format |
| `vending_machine` | Automated service |
| `atm_standalone` | ATM only |

### Services Array

Available services per location:

- `atm` - Cash ATM
- `bitcoin_atm` - Bitcoin ATM
- `rocafe` - RoCafé coffee bar
- `lottery` - Lottery tickets
- `money_transfer` - Money services

## Menu Data

**File:** `src/data/menu.js`

```javascript
export const menuItems = [
  {
    id: 'drip-coffee',
    name: 'Drip Coffee',
    description: 'Fresh brewed house coffee',
    price: 2.49,
    category: 'hot-drinks',
    image: '/images/menu/drip-coffee.webp',
    available: true
  }
];
```

## Context Usage

### LocationContext

Provides location state across components:

```jsx
// Provider setup in App.jsx
<LocationProvider>
  <App />
</LocationProvider>

// Usage in components
import { useLocationContext } from '../hooks/useLocationContext';

function LocationCard() {
  const { 
    selectedLocation, 
    setSelectedLocation,
    nearestLocation 
  } = useLocationContext();
}
```

## Data Flow

```
src/data/locations.js
        ↓
LocationProvider (context)
        ↓
useLocationContext (hook)
        ↓
Components (LocationsPage, NearestStoreButton, etc.)
```

## Adding Data

### New Location

1. Add location object to `src/data/locations.js`
2. Include all required fields
3. Add Google Place ID for maps
4. Update coordinates for geolocation

### New Menu Item

1. Add item to `src/data/menu.js`
2. Add image to `public/images/menu/`
3. Assign to appropriate category
4. Test on RoCafé page

## Data Validation

The quality checker validates:

- All locations have required fields
- Coordinates are valid
- Services are from allowed list
- Prices are numeric

---

**Related:** [Component System](./component-system.md) | [RoCafé Menu Template](../content/rocafe-menu-template.md)
