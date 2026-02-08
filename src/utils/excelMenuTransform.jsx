/**
 * API Menu Transformation Utilities
 * Converts API menu data to StandardizedItem-compatible format
 *
 * Used by:
 * - pages/RoCafePage.jsx
 *
 * @since December 15, 2025
 */

import React from 'react';
import { Coffee, Wine, UtensilsCrossed, IceCream, Sparkles, Beef } from 'lucide-react';
import { sortSizes } from './menuHelpers';

/**
 * Map of category names to display metadata
 * Icons and descriptions for each category
 */
export const EXCEL_CATEGORY_MAP = {
  'RoCafe Hot Coffee': {
    icon: <Coffee size={24} />,
    name: 'Hot Coffee',
    description: 'Freshly brewed coffee made to perfection',
  },
  'RoCafe Iced Coffee': {
    icon: <Coffee size={24} />,
    name: 'Iced Coffee',
    description: 'Refreshing cold coffee beverages',
  },
  'RoCafe Tea': {
    icon: <Wine size={24} />, // Wine glass icon used for tea/beverage consistency with bubble tea
    name: 'Tea & Matcha',
    description: 'Premium tea selections and matcha lattes',
  },
  'RoCafe Fresh Juice': {
    icon: <IceCream size={24} />,
    name: 'Fresh Juice',
    description: 'Healthy fruit beverages made fresh',
  },
  'RoCafe Smoothies': {
    icon: <IceCream size={24} />,
    name: 'Smoothies',
    description: 'Blended fruit smoothies with fresh ingredients',
  },
  'RoCafe Frappe': {
    icon: <Sparkles size={24} />,
    name: 'Frappés',
    description: 'Blended iced coffee drinks',
  },
  'RoCafe Food': {
    icon: <UtensilsCrossed size={24} />,
    name: 'Food',
    description: 'Fresh food options and snacks',
  },
  'RoCafe Ready2Eat': {
    icon: <Beef size={24} />,
    name: 'Ready to Eat',
    description: 'Pre-prepared meals ready to enjoy',
  },
};

/**
 * Transform API menu item to StandardizedItem format
 * Converts API fields to menu item object compatible with StandardizedItem component
 *
 * API format:
 * {
 *   id, name, tagline, description, badge, featured, calories,
 *   categories: ["RoCafe Iced Coffee"],
 *   sizes: [{ name: "S", size: "12 oz", price: 599 }]
 * }
 *
 * @param {Object} apiItem - Menu item from API
 * @param {number} index - Item index (for fallback IDs)
 * @returns {Object} Menu item in StandardizedItem format
 */
export const transformExcelToMenuItem = (apiItem, index) => {
  // Extract category from categories array (use first category)
  const category = Array.isArray(apiItem.categories) && apiItem.categories.length > 0 ? apiItem.categories[0] : 'Other';

  // Convert sizes array - prices are in cents, convert to dollars
  const sizes = Array.isArray(apiItem.sizes)
    ? apiItem.sizes.map((size) => ({
        name: size.name || size.size,
        size: size.size,
        price: (size.price || 0) / 100, // Convert cents to dollars
        calories: size.calories || null,
      }))
    : [];

  // Sort sizes to ensure S, M, L order
  const sortedSizes = sortSizes(sizes);

  return {
    id: apiItem.id ? `api-${apiItem.id}` : `item-${index}`,
    name: apiItem.name || 'Unnamed Item',
    tagline: apiItem.tagline || null,
    description: apiItem.description || apiItem.name || '',
    image: apiItem.image || null,
    badge: apiItem.badge || null,
    sizes: sortedSizes,
    defaultSize: 0,
    category: category,
    customizations: apiItem.customizations || [],
    allergens: apiItem.allergens || [],
    dietary: apiItem.dietary || [],
    prepTime: apiItem.prepTime || '2-5 min',
    temperature: apiItem.temperature || [],
    caffeineLevel: apiItem.caffeineLevel || null,
    flavorProfile: apiItem.flavorProfile || [],
    locationStatus: apiItem.locationStatus || 'Available at RoCafé locations',
    isAvailable: apiItem.isAvailable !== false,
    featured: apiItem.featured || false,
    calories: apiItem.calories || null,
    // Preserve API locations array for availability mapping
    locations: apiItem.locations || [],
    status: 'available', // Default status for API items
    itemType: 'menu', // Mark as menu item for StandardizedItem
  };
};

/**
 * Group menu items by category
 * Returns array of category objects with items
 *
 * @param {Array} menuItems - Array of menu item objects from API
 * @returns {Array} Array of category objects
 */
export const groupExcelItemsByCategory = (menuItems) => {
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    return [];
  }

  // Transform API items to StandardizedItem format
  const transformedItems = menuItems.map((item, index) => transformExcelToMenuItem(item, index));

  // Group by category
  const categoryMap = {};

  transformedItems.forEach((item) => {
    const category = item.category || 'Other';
    if (!categoryMap[category]) {
      categoryMap[category] = [];
    }
    categoryMap[category].push(item);
  });

  // Convert to array format with metadata
  const categories = Object.entries(categoryMap).map(([categoryKey, items]) => {
    const metadata = EXCEL_CATEGORY_MAP[categoryKey] || {
      icon: UtensilsCrossed,
      name: categoryKey,
      description: `${categoryKey} items`,
    };

    return {
      id: categoryKey.toLowerCase().replace(/\s+/g, '-'),
      name: metadata.name,
      icon: typeof metadata.icon === 'function' ? React.createElement(metadata.icon, { size: 24 }) : metadata.icon,
      description: metadata.description,
      items: items,
      _excelCategory: categoryKey,
    };
  });

  // Sort categories by custom order if needed
  const categoryOrder = [
    'RoCafe Hot Coffee',
    'RoCafe Iced Coffee',
    'RoCafe Tea',
    'RoCafe Frappe',
    'RoCafe Fresh Juice',
    'RoCafe Smoothies',
    'RoCafe Food',
    'RoCafe Ready2Eat',
  ];

  categories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a._excelCategory);
    const indexB = categoryOrder.indexOf(b._excelCategory);

    // If both in order list, sort by order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A in list, A comes first
    if (indexA !== -1) return -1;
    // If only B in list, B comes first
    if (indexB !== -1) return 1;
    // Neither in list, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  // Filter out categories with no items
  return categories.filter((cat) => cat.items.length > 0);
};

/**
 * Map of static category IDs (from ROCAFE_FULL_MENU) to display metadata
 * Used for fallback when menu API is unavailable
 */
const STATIC_CATEGORY_MAP = {
  'hot-coffee': {
    icon: <Coffee size={24} />,
    name: 'Hot Coffee',
    description: 'Freshly brewed coffee made to perfection',
  },
  'iced-coffee': {
    icon: <Coffee size={24} />,
    name: 'Iced Coffee',
    description: 'Refreshing cold coffee beverages',
  },
  tea: {
    icon: <Wine size={24} />,
    name: 'Tea & Matcha',
    description: 'Premium tea selections and matcha lattes',
  },
  'fresh-juice': {
    icon: <IceCream size={24} />,
    name: 'Fresh Juice',
    description: 'Healthy fruit beverages made fresh',
  },
  smoothies: {
    icon: <IceCream size={24} />,
    name: 'Smoothies',
    description: 'Blended fruit smoothies with fresh ingredients',
  },
  frappes: {
    icon: <Sparkles size={24} />,
    name: 'Frappés',
    description: 'Blended iced coffee drinks',
  },
  specialty: {
    icon: <Sparkles size={24} />,
    name: 'Specialty',
    description: 'Unique signature beverages',
  },
  food: {
    icon: <UtensilsCrossed size={24} />,
    name: 'Food',
    description: 'Fresh food options and snacks',
  },
  seasonal: {
    icon: <Sparkles size={24} />,
    name: 'Seasonal',
    description: 'Limited-time seasonal offerings',
  },
};

const STATIC_CATEGORY_ORDER = [
  'hot-coffee',
  'iced-coffee',
  'tea',
  'frappes',
  'fresh-juice',
  'smoothies',
  'specialty',
  'food',
  'seasonal',
];

/**
 * Group static menu items by category (fallback)
 * Used when menu API is unavailable - groups ROCAFE_FULL_MENU items by their category field
 * Unlike groupExcelItemsByCategory, this expects items already in StandardizedItem format
 * (prices in dollars, category as string, not categories array)
 *
 * @param {Array} items - Array of static menu items from ROCAFE_FULL_MENU
 * @returns {Array} Array of category objects compatible with RoCafePage rendering
 */
export const groupStaticMenuByCategory = (items) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  // Group by category field
  const categoryMap = {};
  items.forEach((item) => {
    const cat = item.category || 'other';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(item);
  });

  // Convert to array format with metadata
  const categories = Object.entries(categoryMap).map(([catKey, catItems]) => {
    const meta = STATIC_CATEGORY_MAP[catKey] || {
      icon: <UtensilsCrossed size={24} />,
      name: catKey.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: `${catKey} items`,
    };

    return {
      id: catKey,
      name: meta.name,
      icon: typeof meta.icon === 'function' ? React.createElement(meta.icon, { size: 24 }) : meta.icon,
      description: meta.description,
      items: catItems,
    };
  });

  // Sort by defined order
  categories.sort((a, b) => {
    const indexA = STATIC_CATEGORY_ORDER.indexOf(a.id);
    const indexB = STATIC_CATEGORY_ORDER.indexOf(b.id);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return categories.filter((cat) => cat.items.length > 0);
};

/**
 * Merge API categories with static menu categories
 * Allows fallback to static menu while preferring API data
 *
 * @param {Array} apiCategories - Categories from API data
 * @param {Array} staticCategories - Static fallback categories
 * @returns {Array} Merged category array
 */
export const mergeCategoriesWithFallback = (apiCategories, staticCategories) => {
  // If API has data, use it exclusively
  if (apiCategories && apiCategories.length > 0) {
    return apiCategories;
  }

  // Otherwise fallback to static
  return staticCategories;
};
