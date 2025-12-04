# RoCafé Menu Template

> Data structure template for RoCafé menu items

## Overview

This template defines the structure for adding menu items to the RoCafé section.

## Menu Item Structure

```javascript
{
  id: 'unique-id',
  name: 'Item Name',
  description: 'Brief description of the item',
  price: 4.99,
  category: 'hot-drinks',
  image: '/images/menu/item-name.webp',
  tags: ['popular', 'new'],
  available: true,
  customizations: [
    { name: 'Size', options: ['Small', 'Medium', 'Large'] },
    { name: 'Milk', options: ['Whole', 'Skim', 'Oat', 'Almond'] }
  ]
}
```

## Categories

| Category ID | Display Name |
|-------------|--------------|
| `hot-drinks` | Hot Drinks |
| `cold-drinks` | Cold Drinks |
| `pastries` | Pastries |
| `sandwiches` | Sandwiches |
| `snacks` | Snacks |

## Example Items

### Hot Coffee

```javascript
{
  id: 'drip-coffee',
  name: 'Drip Coffee',
  description: 'Fresh brewed house coffee',
  price: 2.49,
  category: 'hot-drinks',
  image: '/images/menu/drip-coffee.webp',
  tags: ['popular'],
  available: true,
  customizations: [
    { name: 'Size', options: ['Small', 'Medium', 'Large'] }
  ]
}
```

### Specialty Drink

```javascript
{
  id: 'caramel-latte',
  name: 'Caramel Latte',
  description: 'Espresso with steamed milk and caramel',
  price: 5.49,
  category: 'hot-drinks',
  image: '/images/menu/caramel-latte.webp',
  tags: ['popular', 'signature'],
  available: true,
  customizations: [
    { name: 'Size', options: ['Medium', 'Large'] },
    { name: 'Milk', options: ['Whole', 'Skim', 'Oat', 'Almond'] },
    { name: 'Extra Shot', options: ['Yes', 'No'] }
  ]
}
```

### Food Item

```javascript
{
  id: 'breakfast-sandwich',
  name: 'Breakfast Sandwich',
  description: 'Egg, cheese, and choice of meat on a fresh bagel',
  price: 6.99,
  category: 'sandwiches',
  image: '/images/menu/breakfast-sandwich.webp',
  tags: ['popular', 'breakfast'],
  available: true,
  customizations: [
    { name: 'Meat', options: ['Bacon', 'Sausage', 'Ham', 'None'] },
    { name: 'Bread', options: ['Bagel', 'Croissant', 'English Muffin'] }
  ]
}
```

## Tags Reference

| Tag | Description |
|-----|-------------|
| `popular` | Best-selling items |
| `new` | Recently added |
| `signature` | House specialties |
| `seasonal` | Limited time |
| `breakfast` | Morning items |
| `vegan` | Vegan-friendly |
| `gluten-free` | Gluten-free option |

## Data Location

Menu data is stored in the data directory. Check the current codebase for the exact file location:
```
src/data/menu.js     # or similar location
```

## Adding New Items

1. Add item object to appropriate category array
2. Add image to `public/images/menu/`
3. Update any category filters if needed
4. Test display on RoCafé page

## Pricing Format

- Always use numeric values (not strings)
- Two decimal places in display
- Currency symbol added by component

---

**Related:** [Menu Photography](./menu-photography.md) | [Content Standards](./content-standards.md)
