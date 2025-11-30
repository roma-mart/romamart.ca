import { ShoppingCart } from 'lucide-react';

const OrderCTA = ({ orderUrl = 'https://nrsplus.com/orders/your-store-link' }) => {
  const handleOrderClick = () => {
    // Track in GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'order_cta_click',
        cta_location: 'floating_button',
        cta_text: 'Order Online'
      });
    }
    
    // Open ordering link from STORE_DATA config
    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleOrderClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
      aria-label="Order online from Roma Mart"
    >
      <ShoppingCart className="w-6 h-6" />
      <span>Order Online</span>
    </button>
  );
};

export default OrderCTA;
