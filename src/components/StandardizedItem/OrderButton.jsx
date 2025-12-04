import React from 'react';
import { formatPrice } from '../../utils/menuHelpers';
import { getOrderingUrl } from '../../config/ordering';

/**
 * OrderButton Component
 * 
 * Dynamic "Order Now" button for menu items
 * Generates ordering URL and displays current price
 * 
 * @param {Object} props
 * @param {number} props.currentPrice - Calculated total price
 * @param {Object} props.nearestLocation - Nearest location object
 * @param {boolean} props.hasCustomizations - Whether item has customizations
 */
const OrderButton = ({ currentPrice, nearestLocation, hasCustomizations }) => {
  if (!hasCustomizations || !nearestLocation) {
    return null;
  }

  return (
    <a
      href={getOrderingUrl('ubereats', nearestLocation)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="block w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-transform hover:scale-105 mb-2"
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)',
        textDecoration: 'none'
      }}
    >
      Order Now • {formatPrice(currentPrice)}
    </a>
  );
};

export default OrderButton;
