import React, { useMemo } from 'react';
import { formatPrice } from '../../utils/menuHelpers';

/**
 * PriceDisplay Component
 * 
 * Displays dynamically calculated price for StandardizedItem
 * Handles base price + customization price modifiers
 * 
 * @param {Object} props
 * @param {Object} props.item - Item data with sizes and customizations
 * @param {number} props.selectedSize - Index of selected size
 * @param {Object} props.selectedOptions - Selected customization options
 */
const PriceDisplay = ({ item, selectedSize, selectedOptions }) => {
  // Calculate current price based on selections
  const currentPrice = useMemo(() => {
    if (!item || !item.sizes || !item.sizes[selectedSize]) {
      return 0;
    }
    
    let totalPrice = item.sizes[selectedSize].price;
    
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
  }, [item, selectedSize, selectedOptions]);

  return (
    <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
      {formatPrice(currentPrice)}
    </span>
  );
};

export default PriceDisplay;
