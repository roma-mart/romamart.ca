import { ShoppingCart } from 'lucide-react';
import Button from './Button';
import { getOrderingUrl } from '../config/ordering';
import { useState, useEffect } from 'react';

const OrderCTA = ({ orderUrl = getOrderingUrl() }) => {
  // Determine initial visibility based on hero section presence
  const hasHeroSection = typeof window !== 'undefined' && document.querySelector('#hero-section');
  const [isVisible, setIsVisible] = useState(() => hasHeroSection ? false : true);

  // Hide button only when hero section is visible (homepage)
  useEffect(() => {
    const heroSection = document.querySelector('#hero-section');
    if (!heroSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px'
      }
    );
    observer.observe(heroSection);
    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    <Button
      variant="order"
      icon={<ShoppingCart className="w-6 h-6" aria-hidden="true" />}
      iconPosition="left"
      analyticsEvent={{ event: 'order_cta_click', cta_location: 'floating_button', cta_text: 'Order Online' }}
      ariaLabel="Order online from Roma Mart"
      href={orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-6 right-6 md:bottom-6 md:right-6 left-1/2 md:left-auto z-50 font-semibold text-lg flex items-center gap-3 transition-all duration-500 will-change-opacity focus-visible:outline-2 focus-visible:outline-accent ${
        isVisible
          ? 'opacity-100 pointer-events-auto animate-fab-in'
          : 'opacity-0 pointer-events-none animate-fab-out'
      }`}
      style={{ boxShadow: 'none', transform: 'none' }}
      aria-hidden={!isVisible}
    >
      <span className="hidden md:inline">Order Online</span>
    </Button>
  );
};

export default OrderCTA;
