import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/menuHelpers';

/**
 * OrderButton Component
 * 
 * "Order Now" button for menu items using site-wide NRS ordering system.
 * All delivery platforms (Uber Eats, Skip, DoorDash) are integrated on NRS store page.
 * Displays current price and tracks clicks in GTM.
 * 
 * @param {Object} props
 * @param {number} props.currentPrice - Calculated total price
 * @param {boolean} props.hasCustomizations - Whether item has customizations
 */
const OrderButton = ({ currentPrice, hasCustomizations }) => {
  if (!hasCustomizations) {
    return null;
  }

  const NRS_ORDER_URL = 'https://nrsplus.com/orders/your-store-link';

  const handleOrderClick = (e) => {
    e.stopPropagation();

    // Track in GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'order_cta_click',
        cta_location: 'menu_item_button',
        cta_text: 'Order Now',
        item_price: currentPrice
      });
    }

    // Open in new tab securely
    try {
      window.open(NRS_ORDER_URL, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Failed to open ordering window:', err);
      window.location.href = NRS_ORDER_URL;
    }
  };

  return (
    <button
      type="button"
      onClick={handleOrderClick}
      className="w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-transform hover:scale-105 mb-2 flex items-center justify-center gap-2"
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)'
      }}
      aria-label={`Order this item for ${formatPrice(currentPrice)}`}
    >
      <ShoppingCart className="w-5 h-5" aria-hidden="true" />
      <span>Order Now • {formatPrice(currentPrice)}</span>
    </button>
  );
};

export default OrderButton;
