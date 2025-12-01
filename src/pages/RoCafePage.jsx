import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ChevronDown, Coffee, Wine, UtensilsCrossed, IceCream, Sparkles } from 'lucide-react';
import ShareButton from '../components/ShareButton';

const RoCafePage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const [expandedCategory, setExpandedCategory] = useState(null);

  // Menu structure - ready for full data
  const menuCategories = [
    {
      id: 'hot-coffee',
      name: 'Hot Coffee',
      icon: <Coffee size={24} />,
      description: 'Freshly brewed coffee made to perfection',
      items: [
        // Placeholder - will be replaced with actual menu data
        { name: 'Espresso', description: 'Rich and bold', price: '$3.99', calories: '5', sizes: ['Single', 'Double'], image: '/images/menu/espresso.jpg' }
      ]
    },
    {
      id: 'iced-coffee',
      name: 'Iced Coffee',
      icon: <Coffee size={24} />,
      description: 'Refreshing cold coffee beverages',
      items: []
    },
    {
      id: 'tea',
      name: 'Tea',
      icon: <Wine size={24} />,
      description: 'Premium tea selections',
      items: []
    },
    {
      id: 'fresh-juice',
      name: 'Fresh Juice',
      icon: <Wine size={24} />,
      description: 'Made fresh daily',
      items: []
    },
    {
      id: 'smoothies',
      name: 'Smoothies',
      icon: <IceCream size={24} />,
      description: 'Healthy and delicious blends',
      items: []
    },
    {
      id: 'frappes',
      name: 'Frappés',
      icon: <IceCream size={24} />,
      description: 'Blended frozen beverages',
      items: []
    },
    {
      id: 'specialty',
      name: 'Specialty Drinks',
      icon: <Sparkles size={24} />,
      description: 'Unique RoCafé creations',
      items: []
    },
    {
      id: 'food',
      name: 'Food',
      icon: <UtensilsCrossed size={24} />,
      description: 'Fresh baked goods and snacks',
      items: []
    },
    {
      id: 'seasonal',
      name: 'Seasonal Items',
      icon: <Sparkles size={24} />,
      description: 'Limited time offerings',
      items: []
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>RoCafé Menu | Roma Mart Convenience</title>
        <meta name="description" content="Explore the RoCafé menu featuring hot coffee, iced coffee, tea, fresh juice, smoothies, frappés, specialty drinks, food, and seasonal items." />
        <link rel="canonical" href="https://romamart.ca/rocafe" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a 
              href={`${BASE_URL}`} 
              className="hover:text-yellow-500 transition-colors"
              style={mutedTextColor}
            >
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>RoCafé Menu</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center">
          <h1 
            className="text-4xl md:text-5xl font-coco uppercase mb-6"
            style={{ color: 'var(--color-heading)' }}
          >
            RoCafé <span style={{ color: COLORS.yellow }}>Menu</span>
          </h1>
          <p className="text-lg font-inter leading-relaxed max-w-3xl mx-auto mb-6" style={textColor}>
            Welcome to RoCafé, where quality meets convenience. Enjoy our premium selection of beverages and food, 
            crafted fresh daily with the finest ingredients.
          </p>
          <div className="flex justify-center">
            <ShareButton 
              title="RoCafé Menu"
              text="Check out the delicious RoCafé menu at Roma Mart!"
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            />
          </div>
          
          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-coco mb-2" style={{ color: COLORS.yellow }}>50+</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Menu Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-coco mb-2" style={{ color: COLORS.yellow }}>100%</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Fresh Daily</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-coco mb-2" style={{ color: COLORS.yellow }}>9</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="space-y-4">
          {menuCategories.map((category) => (
            <div 
              key={category.id}
              className="rounded-2xl overflow-hidden border transition-all"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: expandedCategory === category.id ? COLORS.yellow : 'var(--color-border)',
                borderWidth: expandedCategory === category.id ? '2px' : '1px'
              }}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: COLORS.yellow + '20', color: 'var(--color-icon)' }}
                  >
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-coco text-2xl mb-1" style={{ color: 'var(--color-heading)' }}>
                      {category.name}
                    </h3>
                    <p className="font-inter text-sm" style={mutedTextColor}>
                      {category.description}
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  size={24} 
                  className={`transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                  style={{ color: COLORS.yellow }}
                />
              </button>

              {/* Category Items (Expandable) */}
              {expandedCategory === category.id && (
                <div className="px-6 pb-6 space-y-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {category.items.length > 0 ? (
                    category.items.map((item, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-xl flex gap-4"
                        style={{ backgroundColor: 'var(--color-bg)' }}
                      >
                        {/* Item Image */}
                        {item.image && (
                          <div 
                            className="w-24 h-24 rounded-lg flex-shrink-0"
                            style={{ 
                              backgroundImage: `url(${item.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundColor: 'var(--color-surface)'
                            }}
                          />
                        )}
                        
                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-coco text-lg" style={{ color: 'var(--color-heading)' }}>
                              {item.name}
                            </h4>
                            <span className="font-bold" style={{ color: COLORS.yellow }}>
                              {item.price}
                            </span>
                          </div>
                          <p className="font-inter text-sm mb-2" style={mutedTextColor}>
                            {item.description}
                          </p>
                          <div className="flex gap-4 text-xs font-inter" style={mutedTextColor}>
                            {item.calories && <span>{item.calories} cal</span>}
                            {item.sizes && <span>Sizes: {item.sizes.join(', ')}</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8" style={mutedTextColor}>
                      <p className="font-inter">Menu items coming soon! Check back for updates.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: COLORS.navy }}>
          <h2 className="text-3xl md:text-4xl font-coco uppercase text-white mb-4">
            Visit RoCafé Today
          </h2>
          <p className="text-white/90 font-inter text-lg mb-8 max-w-2xl mx-auto">
            Come taste the difference! Fresh ingredients, expertly crafted beverages, and friendly service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE_URL}#contact`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
            >
              Get Directions
            </a>
            <a
              href={`${BASE_URL}#rocafe`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 border-2 text-white"
              style={{ borderColor: 'white' }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoCafePage;
