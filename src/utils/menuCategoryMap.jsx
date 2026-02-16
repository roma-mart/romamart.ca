/**
 * Menu Category Mapping & Grouping
 * Maps API and static menu category names to display metadata.
 * Replaces excelMenuTransform.jsx's category handling.
 *
 * @since February 2026
 */

import React from 'react';
import { Coffee, Wine, UtensilsCrossed, IceCream, Sparkles, Beef } from 'lucide-react';

/**
 * Category display metadata keyed on new API category names.
 * The API returns raw category names like "Hot Coffee", "Tea", etc.
 */
export const MENU_CATEGORY_MAP = {
  'Hot Coffee': {
    icon: <Coffee size={24} />,
    name: 'Hot Coffee',
    description: 'Freshly brewed coffee made to perfection',
  },
  'Iced Coffee': {
    icon: <Coffee size={24} />,
    name: 'Iced Coffee',
    description: 'Refreshing cold coffee beverages',
  },
  Tea: {
    icon: <Wine size={24} />,
    name: 'Tea & Matcha',
    description: 'Premium tea selections and matcha lattes',
  },
  'Fresh Juice': {
    icon: <IceCream size={24} />,
    name: 'Fresh Juice',
    description: 'Healthy fruit beverages made fresh',
  },
  Smoothies: {
    icon: <IceCream size={24} />,
    name: 'Smoothies',
    description: 'Blended fruit smoothies with fresh ingredients',
  },
  Frappe: {
    icon: <Sparkles size={24} />,
    name: 'Frappés',
    description: 'Blended iced coffee drinks',
  },
  Specialty: {
    icon: <Sparkles size={24} />,
    name: 'Specialty',
    description: 'Unique signature drinks and seasonal favorites',
  },
  Food: {
    icon: <UtensilsCrossed size={24} />,
    name: 'Food',
    description: 'Fresh food options and snacks',
  },
  Ready2Eat: {
    icon: <Beef size={24} />,
    name: 'Ready to Eat',
    description: 'Pre-prepared meals ready to enjoy',
  },
  Seasonal: {
    icon: <Sparkles size={24} />,
    name: 'Seasonal',
    description: 'Limited-time seasonal specialties',
  },
};

/**
 * Aliases for legacy category names (old API "RoCafe" prefixes and static slug-style).
 * Maps to canonical category keys used in MENU_CATEGORY_MAP.
 */
const CATEGORY_ALIASES = {
  // Old API (Excel) format
  'RoCafe Hot Coffee': 'Hot Coffee',
  'RoCafe Iced Coffee': 'Iced Coffee',
  'RoCafe Tea': 'Tea',
  'RoCafe Fresh Juice': 'Fresh Juice',
  'RoCafe Smoothies': 'Smoothies',
  'RoCafe Frappe': 'Frappe',
  'RoCafe Food': 'Food',
  'RoCafe Ready2Eat': 'Ready2Eat',
  // Static data slug format (MENU_CATEGORIES enum values)
  'hot-coffee': 'Hot Coffee',
  'iced-coffee': 'Iced Coffee',
  tea: 'Tea',
  'fresh-juice': 'Fresh Juice',
  smoothies: 'Smoothies',
  frappes: 'Frappe',
  specialty: 'Specialty',
  food: 'Food',
  seasonal: 'Seasonal',
};

/**
 * Display order for menu categories.
 */
const CATEGORY_DISPLAY_ORDER = [
  'Hot Coffee',
  'Iced Coffee',
  'Tea',
  'Frappe',
  'Specialty',
  'Fresh Juice',
  'Smoothies',
  'Food',
  'Ready2Eat',
  'Seasonal',
];

/**
 * Resolves any category name variant to its canonical form.
 * Checks MENU_CATEGORY_MAP directly, then aliases, then returns raw string.
 *
 * @param {string|null} raw - Raw category string from API or static data
 * @returns {string} Canonical category name
 */
export const resolveCategory = (raw) => {
  if (!raw) return 'Other';
  // Direct match in the canonical map
  if (MENU_CATEGORY_MAP[raw]) return raw;
  // Alias match
  if (CATEGORY_ALIASES[raw]) return CATEGORY_ALIASES[raw];
  // Return as-is for unknown categories
  return raw;
};

/**
 * Groups menu items by category and returns sorted category objects
 * with display metadata (icon, name, description).
 *
 * Replaces groupExcelItemsByCategory — works with both API and static data.
 *
 * @param {Array} menuItems - Array of menu items (already normalized by context)
 * @returns {Array<{id: string, name: string, icon: React.ReactElement, description: string, items: Array}>}
 */
export const groupMenuItemsByCategory = (menuItems) => {
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    return [];
  }

  // Group by resolved canonical category
  const categoryMap = {};

  menuItems.forEach((item) => {
    const canonical = resolveCategory(item.category);
    if (!categoryMap[canonical]) {
      categoryMap[canonical] = [];
    }
    categoryMap[canonical].push(item);
  });

  // Convert to array format with metadata
  const categories = Object.entries(categoryMap).map(([categoryKey, items]) => {
    const metadata = MENU_CATEGORY_MAP[categoryKey] || {
      icon: <UtensilsCrossed size={24} />,
      name: categoryKey,
      description: `${categoryKey} items`,
    };

    return {
      id: categoryKey.toLowerCase().replace(/\s+/g, '-'),
      name: metadata.name,
      icon: metadata.icon,
      description: metadata.description,
      items,
    };
  });

  // Sort by display order
  categories.sort((a, b) => {
    // Find canonical key from the name for ordering
    const findOrder = (name) => {
      const entry = Object.entries(MENU_CATEGORY_MAP).find(([, meta]) => meta.name === name);
      const key = entry ? entry[0] : name;
      const idx = CATEGORY_DISPLAY_ORDER.indexOf(key);
      return idx === -1 ? CATEGORY_DISPLAY_ORDER.length : idx;
    };

    return findOrder(a.name) - findOrder(b.name);
  });

  // Filter out empty categories
  return categories.filter((cat) => cat.items.length > 0);
};
