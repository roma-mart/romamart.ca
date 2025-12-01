import React from 'react';
import StandardizedItem from './StandardizedItem';
import { Coffee, ShoppingBasket, Bitcoin, Utensils } from 'lucide-react';

/**
 * Proof of Concept: StandardizedItem Component Demo
 * 
 * This shows how the system works for both Services and RoCafé items
 */

const StandardizedItemDemo = () => {
  // Example RoCafé Menu Items
  const menuItems = [
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      tagline: 'Rich espresso with silky steamed milk and foam',
      description: 'A classic Italian coffee drink featuring a perfect balance of bold espresso, velvety steamed milk, and luxurious microfoam. Our cappuccinos are crafted by our skilled baristas using premium beans.',
      image: '/romamart.ca/images/rocafe/cappuccino.jpg', // Or AI-generated URL
      badge: 'bestseller',
      sizes: [
        { name: 'Small (8oz)', price: 3.49 },
        { name: 'Medium (12oz)', price: 4.29 },
        { name: 'Large (16oz)', price: 4.99 }
      ],
      defaultSize: 1, // Medium selected by default
      calories: '120 cal (Medium)',
      ingredients: 'Espresso, whole milk, microfoam'
    },
    {
      id: 'iced-latte',
      name: 'Iced Latte',
      tagline: 'Smooth espresso over ice with cold milk',
      description: 'Cool and refreshing, our iced latte combines rich espresso shots with cold milk and ice. Perfect for warm days or when you need a chilled pick-me-up. Customize with your choice of milk and flavored syrups.',
      image: 'https://example.com/ai-generated-iced-latte.jpg', // AI-generated URL example
      badge: 'new',
      sizes: [
        { name: 'Medium (16oz)', price: 4.49 },
        { name: 'Large (20oz)', price: 5.29 }
      ],
      defaultSize: 0,
      calories: '140 cal (Medium)',
      ingredients: 'Espresso, cold milk, ice, optional flavoring'
    },
    {
      id: 'muffin',
      name: 'Blueberry Muffin',
      tagline: 'Freshly baked with real blueberries',
      description: 'Our signature blueberry muffins are baked fresh daily using real, plump blueberries and a hint of lemon zest. Moist, fluffy, and bursting with flavor. Pairs perfectly with your morning coffee.',
      image: '/romamart.ca/images/rocafe/blueberry-muffin.jpg',
      badge: null,
      sizes: [
        { name: 'Regular', price: 2.99 }
      ],
      defaultSize: 0,
      calories: '380 cal',
      ingredients: 'Flour, blueberries, eggs, butter, sugar, lemon zest'
    }
  ];

  // Example Service Items
  const serviceItems = [
    {
      id: 'halal-meat',
      name: 'Halal Meat',
      tagline: 'Certified Zabiha Halal meats - fresh daily',
      description: 'We offer a complete selection of Zabiha Halal certified meats including chicken, beef, lamb, and goat. All our meats are sourced from trusted suppliers who follow strict Halal guidelines. Fresh cuts prepared daily by our experienced butchers. Pre-packaged options available for convenience.',
      image: '/romamart.ca/images/services/halal-meat.jpg',
      badge: 'halal',
      icon: <Utensils size={24} />,
      sizes: [], // Services don't always need sizes
      action: {
        text: 'View Halal Certification',
        onClick: () => alert('Opens certification PDF or modal')
      }
    },
    {
      id: 'bitcoin-atm',
      name: 'Bitcoin ATM',
      tagline: 'Buy & sell Bitcoin instantly - 24/7 access',
      description: 'Our state-of-the-art Bitcoin ATM (BTM) allows you to buy and sell Bitcoin quickly and securely. No appointment needed. Simply scan your wallet QR code and complete your transaction. We support multiple cryptocurrencies and offer competitive rates. Cash accepted.',
      image: '/romamart.ca/images/services/bitcoin-atm.jpg',
      badge: null,
      icon: <Bitcoin size={24} />,
      sizes: [],
      action: {
        text: 'See Current Rates',
        onClick: () => alert('Opens live BTC rates')
      }
    },
    {
      id: 'grocery',
      name: 'Grocery Essentials',
      tagline: 'Daily staples, fresh produce, and pantry needs',
      description: 'Stock up on all your grocery essentials without the hassle of a big-box store. We carry fresh produce, dairy products, bread, eggs, canned goods, snacks, and household items. Perfect for quick trips when you need just a few things.',
      image: '/romamart.ca/images/services/grocery.jpg',
      badge: null,
      icon: <ShoppingBasket size={24} />,
      sizes: []
    }
  ];

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <h1 
          className="text-4xl font-coco font-bold mb-2"
          style={{ color: 'var(--color-heading)' }}
        >
          Standardized Item System - Proof of Concept
        </h1>
        <p 
          className="text-lg font-inter mb-8"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Click any item to expand and see full details. This system works for both menu items and services.
        </p>

        {/* RoCafé Menu Section */}
        <section className="mb-12">
          <h2 
            className="text-3xl font-coco font-bold mb-6"
            style={{ color: 'var(--color-heading)' }}
          >
            ☕ RoCafé Menu Items
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* First item expanded by default (your suggestion) */}
            <StandardizedItem 
              item={menuItems[0]} 
              defaultExpanded={true}
              variant="menu"
            />
            
            {/* Rest collapsed */}
            {menuItems.slice(1).map(item => (
              <StandardizedItem 
                key={item.id}
                item={item}
                defaultExpanded={false}
                variant="menu"
              />
            ))}
          </div>

          <div 
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface)', borderLeft: '4px solid var(--color-accent)' }}
          >
            <p className="text-sm font-inter" style={{ color: 'var(--color-text-muted)' }}>
              <strong>💡 Homepage Strategy:</strong> Show first item expanded (showcases versatility), rest collapsed (clean layout).
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 
            className="text-3xl font-coco font-bold mb-6"
            style={{ color: 'var(--color-heading)' }}
          >
            🛍️ Services
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {serviceItems.map(item => (
              <StandardizedItem 
                key={item.id}
                item={item}
                defaultExpanded={false}
                variant="service"
              />
            ))}
          </div>

          <div 
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface)', borderLeft: '4px solid var(--color-accent)' }}
          >
            <p className="text-sm font-inter" style={{ color: 'var(--color-text-muted)' }}>
              <strong>💡 Services Strategy:</strong> All collapsed by default. Users click to learn more about each service.
            </p>
          </div>
        </section>

        {/* Features Showcase */}
        <section 
          className="p-6 rounded-xl"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <h2 
            className="text-2xl font-coco font-bold mb-4"
            style={{ color: 'var(--color-heading)' }}
          >
            ✨ System Features
          </h2>
          
          <ul className="space-y-2 font-inter" style={{ color: 'var(--color-text)' }}>
            <li>✅ <strong>Collapsible/Expandable:</strong> Click to toggle detailed view</li>
            <li>✅ <strong>Size Selection:</strong> Multiple sizes with dynamic pricing</li>
            <li>✅ <strong>Badges:</strong> Best Seller, New, Halal, Coming Soon</li>
            <li>✅ <strong>Images:</strong> Supports local files OR AI-generated URLs</li>
            <li>✅ <strong>Responsive:</strong> Adapts to mobile, tablet, desktop</li>
            <li>✅ <strong>Dark Mode:</strong> Uses CSS variables automatically</li>
            <li>✅ <strong>Accessibility:</strong> Keyboard navigation, ARIA labels</li>
            <li>✅ <strong>Optional CTA:</strong> Action buttons for services</li>
            <li>✅ <strong>Nutritional Info:</strong> Calories, ingredients (menu items)</li>
            <li>✅ <strong>Icons:</strong> Service categories can include icons</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default StandardizedItemDemo;
