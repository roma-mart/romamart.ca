/**
 * Excel Menu Transformation Utilities
 * Converts Excel data to StandardizedItem-compatible format
 * 
 * Used by:
 * - pages/RoCafePage.jsx
 * 
 * @since December 8, 2025
 */

import { Coffee, Wine, UtensilsCrossed, IceCream, Sparkles, Beef } from 'lucide-react';

/**
 * Constant prefix for Excel-generated item IDs
 */
const EXCEL_ITEM_ID_PREFIX = 'excel-';

/**
 * Map of oc_page categories to display metadata
 * Icons and descriptions for each Excel category
 */
export const EXCEL_CATEGORY_MAP = {
  'RoCafe Hot Coffee': {
    icon: <Coffee size={24} />,
    name: 'Hot Coffee',
    description: 'Freshly brewed coffee made to perfection'
  },
  'RoCafe Iced Coffee': {
    icon: <Coffee size={24} />,
    name: 'Iced Coffee',
    description: 'Refreshing cold coffee beverages'
  },
  'RoCafe Tea': {
    icon: <Wine size={24} />, // Wine glass icon used for tea/beverage consistency with bubble tea
    name: 'Tea & Matcha',
    description: 'Premium tea selections and matcha lattes'
  },
  'RoCafe Fresh Juice': {
    icon: <IceCream size={24} />,
    name: 'Fresh Juice',
    description: 'Healthy fruit beverages made fresh'
  },
  'RoCafe Smoothies': {
    icon: <IceCream size={24} />,
    name: 'Smoothies',
    description: 'Blended fruit smoothies with fresh ingredients'
  },
  'RoCafe Frappe': {
    icon: <Sparkles size={24} />,
    name: 'Frappés',
    description: 'Blended iced coffee drinks'
  },
  'RoCafe Food': {
    icon: <UtensilsCrossed size={24} />,
    name: 'Food',
    description: 'Fresh food options and snacks'
  },
  'RoCafe Ready2Eat': {
    icon: <Beef size={24} />,
    name: 'Ready to Eat',
    description: 'Pre-prepared meals ready to enjoy'
  }
};



export function normalizeMenuItem(row) {
  return {
    id: row.Upc || row.Name,
    name: row.Name,
    description: row.Description || "", // or other fields
    price: row.cents ? row.cents / 100 : 0,
    size: row.size || "",
    category: row.oc_page || "Other",   // <------ KEY LINE
    // add any other fields your UI expects
  };
}


/**
 * Transform Excel row to StandardizedItem format
 * Converts Excel fields (Name, size, cents, oc_page) to menu item object
 * 
 * @param {Object} excelRow - Raw Excel row data
 * @param {number} index - Row index (for generating unique IDs)
 * @returns {Object} Menu item in StandardizedItem format
 */
export const transformExcelToMenuItem = (excelRow, index) => {
  // Extract and normalize fields
  const name = excelRow.Name || excelRow.name || 'Unnamed Item';
  const size = excelRow.size || '1 ea';
  const cents = parseInt(excelRow.cents, 10) || 0;
  const category = excelRow.oc_page || excelRow.oc_Page || 'Other';
  const upc = excelRow.Upc || excelRow['Upc Actual'] || `${EXCEL_ITEM_ID_PREFIX}${index}`;
  
  // Convert cents to dollars
  const price = cents / 100;
  
  return {
    id: `${EXCEL_ITEM_ID_PREFIX}${upc}`,
    name: name,
    tagline: size,
    description: `${name} - ${size}`,
    image: null,
    badge: null,
    sizes: [
      {
        name: size,
        price: price,
        calories: null
      }
    ],
    defaultSize: 0,
    category: category,
    customizations: [],
    allergens: [],
    dietary: [],
    prepTime: '2-5 min',
    temperature: [],
    caffeineLevel: null,
    flavorProfile: [],
    locationStatus: 'Available at RoCafé locations',
    isAvailable: true,
    // Store original Excel data for reference
    _excelData: {
      oc_page: category,
      oc_color: excelRow.oc_color,
      oc_key: excelRow.oc_key,
      oc_relpos: excelRow.oc_relpos,
      upc: upc
    }
  };
};

/**
 * Group Excel menu items by oc_page category
 * Returns array of category objects with items
 * 
 * @param {Array} excelItems - Array of Excel row objects
 * @returns {Array} Array of category objects
 */
export const groupExcelItemsByCategory = (excelItems) => {
  if (!Array.isArray(excelItems) || excelItems.length === 0) {
    return [];
  }
  
  // Transform Excel rows to menu items
  const menuItems = excelItems.map((row, index) => transformExcelToMenuItem(row, index));
  
  // Group by category
  const categoryMap = {};
  
  menuItems.forEach(item => {
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
      description: `${categoryKey} items`
    };
    
    return {
      id: categoryKey.toLowerCase().replace(/\s+/g, '-'),
      name: metadata.name,
      icon: typeof metadata.icon === "function" ? React.createElement(metadata.icon, { size: 24 }) : metadata.icon,
      description: metadata.description,
      items: items,
      _excelCategory: categoryKey
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
    'RoCafe Ready2Eat'
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
  return categories.filter(cat => cat.items.length > 0);
};

/**
 * Merge Excel categories with static menu categories
 * Allows fallback to static menu while preferring Excel data
 * 
 * @param {Array} excelCategories - Categories from Excel data
 * @param {Array} staticCategories - Static fallback categories
 * @returns {Array} Merged category array
 */
export const mergeCategoriesWithFallback = (excelCategories, staticCategories) => {
  // If Excel has data, use it exclusively
  if (excelCategories && excelCategories.length > 0) {
    return excelCategories;
  }
  
  // Otherwise fallback to static
  return staticCategories;
};
