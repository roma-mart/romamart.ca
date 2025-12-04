import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ChevronDown, Coffee, Wine, UtensilsCrossed, IceCream, Sparkles, AlertTriangle } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import StandardizedItem from '../components/StandardizedItem';
import { useLocationAware } from '../hooks/useLocationContext';
import { ROCAFE_FULL_MENU, MENU_CATEGORIES, ALLERGEN_WARNING } from '../data/rocafe-menu';

const RoCafePage = () => {
  const COLORS = {
    navy: 'var(--color-primary)',
    yellow: 'var(--color-accent)',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  // Auto-request location since StandardizedItem components need it
  useLocationAware(() => {
    // Location stored and available for StandardizedItem availability states
  });

  // Group menu items by category
  const menuCategories = useMemo(() => {
    const categories = [
      {
        id: MENU_CATEGORIES.BUBBLE_TEA,
        name: 'Bubble Tea',
        icon: <Wine size={24} />,
        description: 'Classic and creative bubble tea with tapioca pearls',
        items: ROCAFE_FULL_MENU.filter(item => item.category === MENU_CATEGORIES.BUBBLE_TEA)
      },
      {
        id: MENU_CATEGORIES.HOT_COFFEE,
        name: 'Hot Coffee',
        icon: <Coffee size={24} />,
        description: 'Freshly brewed coffee made to perfection',
        items: ROCAFE_FULL_MENU.filter(item => item.category === MENU_CATEGORIES.HOT_COFFEE)
      },
      {
        id: MENU_CATEGORIES.ICED_COFFEE,
        name: 'Iced Coffee',
        icon: <Coffee size={24} />,
        description: 'Refreshing cold coffee beverages',
        items: ROCAFE_FULL_MENU.filter(item => item.category === MENU_CATEGORIES.ICED_COFFEE)
      },
      {
        id: MENU_CATEGORIES.TEA,
        name: 'Tea & Matcha',
        icon: <Wine size={24} />,
        description: 'Premium tea selections and matcha lattes',
        items: ROCAFE_FULL_MENU.filter(item => item.category === MENU_CATEGORIES.TEA)
      },
      {
        id: MENU_CATEGORIES.SMOOTHIES,
        name: 'Smoothies & Fresh Juice',
        icon: <IceCream size={24} />,
        description: 'Healthy blended fruit beverages made fresh',
        items: ROCAFE_FULL_MENU.filter(item => item.category === MENU_CATEGORIES.SMOOTHIES)
      },
      {
        id: MENU_CATEGORIES.SPECIALTY,
        name: 'Specialty Drinks',
        icon: <Sparkles size={24} />,
        description: 'Unique RoCafé creations',
        items: ROCAFE_FULL_MENU.filter(item => item.category === MENU_CATEGORIES.SPECIALTY)
      }
    ];
    
    // Only return categories with items
    return categories.filter(cat => cat.items.length > 0);
  }, []);

  // create memoized handlers map for categories
  const categoryHandlers = useMemo(() => {
    const map = {};
    for (const cat of menuCategories) {
      map[cat.id] = () => toggleCategory(cat.id);
    }
    return map;
  }, [toggleCategory, menuCategories]);

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
              <div className="text-4xl font-coco mb-2" style={{ color: COLORS.yellow }}>{ROCAFE_FULL_MENU.length}+</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Menu Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-coco mb-2" style={{ color: COLORS.yellow }}>100%</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Fresh Daily</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-coco mb-2" style={{ color: COLORS.yellow }}>{menuCategories.length}</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Allergen Warning Section */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div 
          className="p-6 rounded-2xl border-4"
          style={{ 
            backgroundColor: COLORS.yellow,
            borderColor: COLORS.navy
          }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle size={32} style={{ color: COLORS.navy, flexShrink: 0 }} />
            <div>
              <h2 className="text-2xl font-coco font-bold mb-2" style={{ color: COLORS.navy }}>
                {ALLERGEN_WARNING.title}
              </h2>
              <p className="font-inter text-sm mb-4" style={{ color: COLORS.navy }}>
                {ALLERGEN_WARNING.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ALLERGEN_WARNING.allergens.map((allergen, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    <span className="text-lg">{allergen.icon}</span>
                    <span className="text-xs font-inter font-bold" style={{ color: COLORS.yellow }}>
                      {allergen.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-inter text-xs font-bold mb-2" style={{ color: COLORS.navy }}>
                {ALLERGEN_WARNING.footer}
              </p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: COLORS.navy, opacity: 0.8 }}>
                {ALLERGEN_WARNING.disclaimer}
              </p>
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
                type="button"
                onClick={categoryHandlers[category.id]}
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
                <div className="px-6 pb-6 space-y-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {category.items.length > 0 ? (
                    category.items.map((item) => (
                      <StandardizedItem 
                        key={item.id}
                        item={item}
                        defaultExpanded={false}
                      />
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
