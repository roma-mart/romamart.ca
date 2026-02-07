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
      icon={<ShoppingCart className="w-7 h-7" />}
      iconPosition="left"
      analyticsEvent={{ event: 'order_cta_click', cta_location: 'floating_button', cta_text: 'Order Online' }}
      ariaLabel="Order online from Roma Mart"
      href={orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-[env(safe-area-inset-bottom,1rem)] right-4 md:right-6 md:bottom-6 z-50 flex items-center justify-center rounded-full bg-surface will-change-opacity focus-visible:outline-2 focus-visible:outline-accent ${
        isVisible
          ? 'opacity-100 pointer-events-auto animate-fab-in'
          : 'opacity-0 pointer-events-none animate-fab-out'
      }`}
      style={{ 
        boxShadow: '0 4px 16px var(--color-accent-shadow,rgba(228,179,64,0.15))', 
        minWidth: 56, 
        minHeight: 56, 
        padding: 0, 
        WebkitTapHighlightColor: 'transparent'
      }}
      {...(!isVisible ? { inert: "true" } : {})}
      children={null}
    />
  );
};

export default OrderCTA;
