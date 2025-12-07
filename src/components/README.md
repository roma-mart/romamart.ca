# Components

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

// Location button (triggers geolocation, custom vibration/animation)
<Button
  variant="location"
  onLocationFound={handleLocationFound}
  aria-label="Find Nearest Store"
/>

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
| `onClick`        | function            | Click handler (non-location variants)                            |
| `onLocationFound`| function            | Callback for location found (location variant only)              |
| `analyticsEvent` | string \| object    | Custom analytics event (overrides default per variant)           |
| `vibrationPattern`| number \| array    | Custom vibration strength (overrides default per variant)        |
| `aria-label`     | string              | Accessibility label (required for icon-only buttons)             |
| ...              | ...                 | All standard button props                                        |

## Features
- Per-variant vibration, animation, analytics, color, and shape
- Location variant triggers geolocation and callback
- Accessible: keyboard activation, focus-visible, aria-labels
- Consistent design tokens and responsive styles

## Migration Notes
- Replace all legacy `NearestStoreButton` usages with `<Button variant="location" ... />`
- All interactive actions should use the unified Button for consistency

---

For more examples, see `/src/components/Button.jsx` and project documentation.