/**
 * Menu Helpers
 * Universal utilities for menu item calculations and formatting
 * 
 * Used by:
 * - components/StandardizedItem.jsx
 * - Any component displaying menu items with pricing
 * 
 * @since December 4, 2025
 */

/**
 * Format price with currency symbol
 * @param {number|string} price - Price value
 * @returns {string} Formatted price string (e.g., "$4.99")
 */
export const formatPrice = (price) => {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
};

/**
 * Calculate total price based on size and selected customization options
 * Handles three types of customizations:
 * - Single selection (radio buttons)
 * - Multiple selection (checkboxes)
 * - Quantity selection (number inputs)
 * 
 * @param {Object} item - Menu item object
 * @param {number} selectedSizeIndex - Index of selected size
 * @param {Object} selectedOptions - Object mapping customization type to selections
 * @returns {number} Total calculated price
 */
export const calculateItemPrice = (item, selectedSizeIndex = 0, selectedOptions = {}) => {
  if (!item || !item.sizes || !item.sizes[selectedSizeIndex]) {
    return 0;
  }
  
  let totalPrice = item.sizes[selectedSizeIndex].price;
  
  // Add prices from customizations
  if (item.customizations && selectedOptions) {
    item.customizations.forEach((customization) => {
      const selectedValue = selectedOptions[customization.type];
      
      if (customization.multiple && Array.isArray(selectedValue)) {
        // Multiple selections: sum all selected option prices
        selectedValue.forEach(optionName => {
          const option = customization.options.find(opt => opt.name === optionName);
          if (option && option.price) {
            totalPrice += option.price;
          }
        });
      } else if (customization.quantity && typeof selectedValue === 'object') {
        // Quantity: multiply option price by quantity
        Object.entries(selectedValue).forEach(([optionName, quantity]) => {
          const option = customization.options.find(opt => opt.name === optionName);
          if (option && option.price && quantity > 0) {
            totalPrice += option.price * quantity;
          }
        });
      } else if (typeof selectedValue === 'string') {
        // Single selection
        const option = customization.options.find(opt => opt.name === selectedValue);
        if (option && option.price) {
          totalPrice += option.price;
        }
      }
    });
  }
  
  return totalPrice;
};

/**
 * Get lowest price from item's size options
 * Used for "from $X.XX" display
 * 
 * @param {Object} item - Menu item object
 * @returns {number} Lowest price among all sizes
 */
export const getLowestPrice = (item) => {
  if (!item || !item.sizes || item.sizes.length === 0) {
    return 0;
  }
  return Math.min(...item.sizes.map(size => size.price));
};

/**
 * Initialize default selections for customizations
 * Handles multiple/quantity/single selection types
 * 
 * @param {Array} customizations - Array of customization objects
 * @returns {Object} Default selections map
 */
export const getDefaultSelections = (customizations = []) => {
  const defaults = {};
  
  customizations.forEach(customization => {
    if (customization.multiple) {
      // Multiple selection: array of selected option names
      const defaultOpts = customization.options.filter(opt => opt.default).map(opt => opt.name);
      defaults[customization.type] = defaultOpts.length > 0 ? defaultOpts : [];
    } else if (customization.quantity) {
      // Quantity support: object with option name and quantity
      const defaultOption = customization.options.find(opt => opt.default);
      defaults[customization.type] = defaultOption ? { [defaultOption.name]: 1 } : {};
    } else {
      // Single selection: string
      const defaultOption = customization.options.find(opt => opt.default);
      defaults[customization.type] = defaultOption ? defaultOption.name : '';
    }
  });
  
  return defaults;
};

/**
 * Get calories for a specific size selection
 * Fallback to item-level calories if size doesn't have specific value
 * 
 * @param {Object} item - Menu item object
 * @param {number} selectedSizeIndex - Index of selected size
 * @returns {number|null} Calorie count or null
 */
export const getCaloriesForSize = (item, selectedSizeIndex = 0) => {
  if (!item) return null;
  return item.sizes?.[selectedSizeIndex]?.calories || item.calories || null;
};

/**
 * Validate customization selections
 * Ensures required customizations are selected
 * 
 * @param {Array} customizations - Array of customization objects
 * @param {Object} selectedOptions - Current selections
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateSelections = (customizations = [], selectedOptions = {}) => {
  const errors = [];
  
  customizations.forEach(customization => {
    if (customization.required) {
      const selection = selectedOptions[customization.type];
      
      if (customization.multiple && (!Array.isArray(selection) || selection.length === 0)) {
        errors.push(`${customization.type} is required`);
      } else if (!customization.multiple && !selection) {
        errors.push(`${customization.type} is required`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
