# RoCafé Menu Template

> Data structure template for RoCafé menu items using StandardizedItem component

## Overview

This template defines the structure for adding menu items to the RoCafé section. All menu items use the universal `StandardizedItem` component with dynamic pricing, multiple customization modes, and Canadian allergen compliance.

**Implementation:** `src/data/rocafe-menu.js`  
**Component:** `src/components/StandardizedItem.jsx`  
**Utilities:** `src/utils/menuHelpers.js`

## Menu Item Structure

```javascript
{
  id: 'unique-id',
  name: 'Item Name',
  tagline: 'Short description (basic view)',
  description: 'Full description (detailed view)',
  category: 'hot-beverages', // or 'cold-beverages', 'bubble-tea', 'specialty-drinks'
  image: '/images/menu/item-name.webp',
  badge: 'bestseller', // or 'new', 'halal', 'comingSoon'
  
  // Size options with individual pricing
  sizes: [
    { name: 'Small', price: 3.99, calories: 200 },
    { name: 'Medium', price: 4.99, calories: 280 },
    { name: 'Large', price: 5.99, calories: 350 }
  ],
  defaultSize: 0, // Index of default selected size
  
  // Customization options with three modes: single, multiple, quantity
  customizations: [
    {
      type: 'Milk Choice',
      required: true,
      multiple: false, // Single selection (radio buttons)
      options: [
        { name: 'Whole Milk', price: 0, default: true },
        { name: 'Oat Milk', price: 0.50 },
        { name: 'Almond Milk', price: 0.50 }
      ]
    },
    {
      type: 'Toppings',
      required: false,
      multiple: true, // Multiple selection (checkboxes)
      maxSelections: 3, // Optional limit
      options: [
        { name: 'Tapioca Pearls', price: 0.50 },
        { name: 'Lychee Jelly', price: 0.50 },
        { name: 'Coconut Jelly', price: 0.50 }
      ]
    },
    {
      type: 'Sugar',
      required: false,
      quantity: true, // Quantity selection (+/- counters)
      options: [
        { name: 'Sugar Packets', price: 0 }
      ]
    }
  ],
  
  // Additional metadata
  allergens: ['milk', 'gluten'], // See ALLERGEN_WARNING for full list
  dietary: ['vegetarian', 'gluten-free', 'vegan', 'halal'],
  dairyFreeOption: true,
  prepTime: '3-5 min',
  temperature: ['hot', 'cold', 'frozen'],
  caffeineLevel: 'medium', // or 'none', 'low', 'high'
  flavorProfile: ['sweet', 'creamy', 'fruity'],
  
  // Availability
  locationStatus: 'Available at all locations', // or 'Seasonal', 'Limited time'
  isAvailable: true
}
```

## Categories

| Category ID | Display Name |
|-------------|--------------|
| `hot-beverages` | Hot Beverages |
| `cold-beverages` | Cold Beverages |
| `bubble-tea` | Bubble Tea |
| `specialty-drinks` | Specialty Drinks |
| `pastries` | Pastries |
| `sandwiches` | Sandwiches |
| `snacks` | Snacks |

## Customization Modes

### Single Selection (Radio Buttons)
Used when customer must select exactly one option:
```javascript
{
  type: 'Temperature',
  required: true,
  multiple: false, // Single selection mode
  options: [
    { name: 'Hot', price: 0, default: true },
    { name: 'Iced', price: 0 }
  ]
}
```

### Multiple Selection (Checkboxes)
Used when customer can select zero or more options:
```javascript
{
  type: 'Toppings',
  required: false,
  multiple: true, // Multiple selection mode
  maxSelections: 3, // Optional limit (omit for unlimited)
  options: [
    { name: 'Tapioca Pearls', price: 0.50 },
    { name: 'Lychee Jelly', price: 0.50 },
    { name: 'Mango Popping Boba', price: 0.50 }
  ]
}
```

### Quantity Selection (Counters)
Used when customer can add multiple of same item:
```javascript
{
  type: 'Sugar',
  required: false,
  quantity: true, // Quantity selection mode
  options: [
    { name: 'Sugar Packets', price: 0 },
    { name: 'Honey', price: 0.25 }
  ]
}
```

## Complete Example: Bubble Tea

```javascript
{
  id: 'signature-bubble-tea',
  name: 'Signature Bubble Tea',
  tagline: 'Premium milk tea with your choice of toppings',
  description: 'Our signature blend of premium black tea and fresh milk, served with chewy tapioca pearls. Customize sweetness and ice level to your preference.',
  category: 'bubble-tea',
  image: '/images/menu/bubble-tea.jpg',
  badge: 'bestseller',
  
  sizes: [
    { name: 'Regular', price: 4.99, calories: 320 },
    { name: 'Large', price: 5.99, calories: 450 }
  ],
  defaultSize: 0,
  
  customizations: [
    {
      type: 'Milk Choice',
      required: true,
      multiple: false,
      options: [
        { name: 'Whole Milk', price: 0, default: true },
        { name: 'Oat Milk', price: 0.50 },
        { name: 'Almond Milk', price: 0.50 },
        { name: 'Dairy-Free Creamer', price: 0.50 }
      ]
    },
    {
      type: 'Toppings',
      required: false,
      multiple: true,
      maxSelections: 3,
      options: [
        { name: 'Tapioca Pearls', price: 0.50, default: true },
        { name: 'Lychee Jelly', price: 0.50 },
        { name: 'Coconut Jelly', price: 0.50 },
        { name: 'Mango Popping Boba', price: 0.75 }
      ]
    },
    {
      type: 'Sweetness Level',
      required: true,
      multiple: false,
      options: [
        { name: '100% Sweet', price: 0 },
        { name: '75% Sweet', price: 0, default: true },
        { name: '50% Sweet', price: 0 },
        { name: '25% Sweet', price: 0 },
        { name: 'No Sugar', price: 0 }
      ]
    },
    {
      type: 'Ice Level',
      required: true,
      multiple: false,
      options: [
        { name: 'Regular Ice', price: 0, default: true },
        { name: 'Less Ice', price: 0 },
        { name: 'No Ice', price: 0 }
      ]
    }
  ],
  
  allergens: ['milk'],
  dietary: ['vegetarian'],
  dairyFreeOption: true,
  prepTime: '3-5 min',
  temperature: ['cold'],
  caffeineLevel: 'medium',
  flavorProfile: ['sweet', 'creamy', 'tea'],
  
  locationStatus: 'Available at all locations',
  isAvailable: true
}
```

## Complete Example: Coffee with Quantities

```javascript
{
  id: 'fresh-brewed-coffee',
  name: 'Fresh Brewed Coffee',
  tagline: 'Premium house blend',
  description: 'Our signature house blend coffee, freshly brewed daily. Customize with your choice of milk and sweetener.',
  category: 'hot-beverages',
  image: '/images/menu/coffee.jpg',
  badge: 'popular',
  
  sizes: [
    { name: 'Small', price: 2.49, calories: 5 },
    { name: 'Medium', price: 2.99, calories: 10 },
    { name: 'Large', price: 3.49, calories: 15 }
  ],
  defaultSize: 1,
  
  customizations: [
    {
      type: 'Milk',
      required: false,
      quantity: true, // Quantity counters for additions
      options: [
        { name: 'Cream', price: 0 },
        { name: 'Milk', price: 0 },
        { name: 'Oat Milk', price: 0.50 }
      ]
    },
    {
      type: 'Sugar',
      required: false,
      quantity: true,
      options: [
        { name: 'Sugar Packets', price: 0 },
        { name: 'Honey', price: 0.25 }
      ]
    }
  ],
  
  allergens: [],
  dietary: ['vegan', 'gluten-free', 'dairy-free'],
  dairyFreeOption: true,
  prepTime: '1-2 min',
  temperature: ['hot'],
  caffeineLevel: 'high',
  flavorProfile: ['rich', 'bold'],
  
  locationStatus: 'Available at all locations',
  isAvailable: true
}
```

## Dynamic Pricing System

The `calculateItemPrice` utility (`src/utils/menuHelpers.js`) automatically calculates total price based on selections.

## Canadian Allergen Warning

Include Health Canada's 14 priority allergens: `milk`, `crustaceans`, `eggs`, `fish`, `lupin`, `celery`, `soya`, `gluten`, `peanuts`, `nuts`, `sesame`, `mustard`, `molluscs`, `sulphites`

## Best Practices

1. **Image Format**: Use WebP/JPG, lazy load with fallback
2. **IDs**: Use kebab-case (`signature-bubble-tea`)
3. **Pricing**: Include cents (.99)
4. **Badges**: `bestseller`, `new`, `halal`, `comingSoon`
5. **Max Selections**: Set limits on checkboxes (e.g., `maxSelections: 3`)
6. **Default Values**: Always set `default: true` on one option per single-selection
7. **Calories**: Include per-size when available

## Related Files

- **Data:** `src/data/rocafe-menu.js`
- **Component:** `src/components/StandardizedItem.jsx`
- **Utilities:** `src/utils/menuHelpers.js`
- **Config:** `src/config/ordering.js`
- **Pages:** `src/pages/RoCafePage.jsx`, `src/App.jsx`

## Adding New Menu Items

1. Open `src/data/rocafe-menu.js`
2. Copy existing item structure from `ROCAFE_FULL_MENU`
3. Update all fields (id, name, sizes, customizations, etc.)
4. Add to `ROCAFE_FULL_MENU` array
5. Test with `npm run dev`
6. Run `npm run check:all` before committing

---

**Related:** [Menu Photography](./menu-photography.md) | [Content Standards](./content-standards.md) | [Implementation Details](../archive/rocafe-standardized-item-implementation.md)
