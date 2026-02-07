
# Components

---
**HQ & Location Data Sourcing Standard:**
All headquarters (HQ) info (address, hours, contact, GST, etc.) must ONLY be sourced from `src/config/company_data.js` (`COMPANY_DATA`).
No hardcoded or duplicated HQ info is allowed in any component.
Dynamic location info for other stores must ONLY be sourced from `src/data/locations.js` and its helpers.
This ensures a single source of truth for overrides, fallbacks, and future scalability.

- Reusable UI components.
- Conventions: accessibility first, CSS variables, small props surface.
- Use specific icon imports; avoid wildcard.
- Add brief header comment (purpose, props).

# Button Component (Unified)

Roma Mart 2.0 uses a single, highly-configurable `Button` component for all interactive actions, including location-aware features.

## Usage

```jsx
import Button from './Button';

// Order button (strong vibration, animation, analytics)
<Button
  variant="order"
  icon={<Icon />}
  analyticsEvent="order_cta"
  onClick={handleOrderClick}
  aria-label="Order Now"
>
  Order Now
</Button>

// Location button (separate component, uses LocationContext)
import LocationButton from './LocationButton';

<LocationButton
  ariaLabel="Detect Nearest Store"
  onClick={handleClick}
>
  Detect Nearest Store
</LocationButton>

// Icon button (light vibration, pulse animation)
<Button
  variant="icon"
  icon={<MapPin />}
  aria-label="Pin"
/>
```

## Props

| Prop             | Type                | Description                                                      |
|------------------|---------------------|------------------------------------------------------------------|
| `variant`        | string              | Button style/behavior: `order`, `nav`, `action`, `icon`, etc.    |
| `icon`           | node                | Icon element (optional)                                          |
| `iconPosition`   | 'left' \| 'right'   | Icon placement (default: left)                                   |
| `onClick`        | function            | Click handler                                                    |
| `analyticsEvent` | string \| object    | Custom analytics event (overrides default per variant)           |
| `vibrationPattern`| number \| array    | Custom vibration strength (overrides default per variant)        |
| `aria-label`     | string              | Accessibility label (required for icon-only buttons)             |
| ...              | ...                 | All standard button props                                        |

## Features
- Per-variant vibration, animation, analytics, color, and shape
- Accessible: keyboard activation, focus-visible, aria-labels
- Consistent design tokens and responsive styles
- LocationButton is a separate component for geolocation (uses LocationContext)

## Migration Notes
- `NearestStoreButton` has been removed — use `LocationButton` for geolocation
- Location variant has been removed from Button — use `LocationButton` instead
- All interactive actions should use the unified Button for consistency

---

For more examples, see `/src/components/Button.jsx` and project documentation.