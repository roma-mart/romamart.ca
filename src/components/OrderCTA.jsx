import { ShoppingCart } from 'lucide-react';
import { useVibration } from '../hooks/useBrowserFeatures';
import { getOrderingUrl } from '../config/ordering';
import { useState, useEffect } from 'react';

const OrderCTA = ({ orderUrl = getOrderingUrl() }) => {
  const { vibrate, canVibrate } = useVibration();
  const [isVisible, setIsVisible] = useState(false);

  // Hide button when hero section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when hero is NOT visible (user scrolled past it)
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px' // Start showing 100px after hero leaves viewport
      }
    );

    const heroSection = document.querySelector('#hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  const handleOrderClick = () => {
    // Strong haptic feedback for primary action (200ms total)
    if (canVibrate) {
      vibrate([50, 30, 50, 30, 50]); // Triple pulse pattern
    }

    // Track in GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'order_cta_click',
        cta_location: 'floating_button',
        cta_text: 'Order Online'
      });
    }
    
    // Open in new tab securely
    try {
      window.open(orderUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      // fallback to location assign if window.open blocked
      console.warn(e)
      window.location.href = orderUrl;
    }
  };

  return (
    <button
      type="button"
      onClick={handleOrderClick}
      className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-lg transition-all duration-500 hover:scale-105 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Order online from Roma Mart"
      aria-hidden={!isVisible}
    >
      <ShoppingCart className="w-6 h-6" aria-hidden="true" />
      <span>Order Online</span>
    </button>
  );
};

export default OrderCTA;
