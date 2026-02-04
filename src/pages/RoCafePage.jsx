import Button from '../components/Button';
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ChevronDown, Coffee, Wine, UtensilsCrossed, IceCream, Sparkles, AlertTriangle } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import CategoryAccordionHeader from '../components/CategoryAccordionHeader';
import StandardizedItem from '../components/StandardizedItem';
import { useLocationAware } from '../hooks/useLocationContext';
import { ROCAFE_FULL_MENU, MENU_CATEGORIES, ALLERGEN_WARNING } from '../data/rocafe-menu';
import COMPANY_DATA from '../config/company_data';
import MenuExcelLoader from '../components/MenuExcelHolder';
import { useExcelMenu } from '../hooks/useExcelMenu';
import { groupExcelItemsByCategory, mergeCategoriesWithFallback } from '../utils/excelMenuTransform';
import StructuredData from '../components/StructuredData';

const RoCafePage = () => {

  const { menuItems } = useExcelMenu();
  
  // Note: menuItems will be empty array during loading or on error
  // The menuCategories useMemo will handle fallback to static menu

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  // Auto-request location since StandardizedItem components need it
  useLocationAware(() => {
    // Location stored and available for StandardizedItem availability states
  });
  const menuCategories = useMemo(() => {
    return groupExcelItemsByCategory(menuItems);
  }, [menuItems]);

  const schemaMenuItems = useMemo(() => {
    return menuItems.length > 0 ? menuItems : ROCAFE_FULL_MENU;
  }, [menuItems]);

  const schemaPriceInCents = menuItems.length > 0;


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
      {/* Single JSON-LD with @graph array for all products (efficient) */}
      <StructuredData
        type="ProductList"
        data={{
          products: schemaMenuItems.map(item => ({
            menuItem: item,
            itemUrl: 'https://romamart.ca/rocafe',
            priceInCents: schemaPriceInCents
          }))
        }}
      />
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
              className="hover:text-accent transition-colors"
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
            className="text-4xl md:text-5xl var(--font-heading) uppercase mb-6"
            style={{ color: 'var(--color-heading)' }}
          >
            RoCafé <span style={{ color: 'var(--color-accent)' }}>Menu</span>
          </h1>
          <p className="text-lg font-inter leading-relaxed max-w-3xl mx-auto mb-6" style={textColor}>
            Welcome to RoCafé, where quality meets convenience. Enjoy our premium selection of beverages and food, 
            crafted fresh daily with the finest ingredients.
          </p>
          {/* <MenuExcelLoader /> */}
          <div className="flex justify-center">
            <ShareButton 
              title="RoCafé Menu"
              text="Check out the delicious RoCafé menu at Roma Mart!"
              className="bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[color-mix(in srgb, var(--color-accent) 85%, transparent)]"
            />
          </div>
          
          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl var(--font-heading) mb-2" style={{ color: 'var(--color-accent)' }}>
                {menuItems.length || ROCAFE_FULL_MENU.length}+
              </div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Menu Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl var(--font-heading) mb-2" style={{ color: 'var(--color-accent)' }}>100%</div>
              <div className="text-sm font-inter uppercase tracking-wider" style={mutedTextColor}>Fresh Daily</div>
            </div>
            <div className="text-center">
              <div className="text-4xl var(--font-heading) mb-2" style={{ color: 'var(--color-accent)' }}>{menuCategories.length}</div>
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
            backgroundColor: 'var(--color-warning-bg)',
            borderColor: 'var(--color-warning-border)'
          }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle size={32} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            <div>
              <h2 className="text-2xl var(--font-heading) font-bold mb-2" style={{ color: 'var(--color-warning)' }}>
                {ALLERGEN_WARNING.title}
              </h2>
              <p className="font-inter text-sm mb-4" style={{ color: 'var(--color-warning)' }}>
                {ALLERGEN_WARNING.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ALLERGEN_WARNING.allergens.map((allergen, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-warning)', color: 'var(--color-warning-bg)' }}
                  >
                    <span className="text-lg">{allergen.icon}</span>
                    <span className="text-xs font-inter font-bold" style={{ color: 'var(--color-warning-bg)' }}>
                      {allergen.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-inter text-xs font-bold mb-2" style={{ color: 'var(--color-warning)' }}>
                {ALLERGEN_WARNING.footer}
              </p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: 'var(--color-warning)', opacity: 0.8 }}>
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
                borderColor: expandedCategory === category.id ? 'var(--color-accent)' : 'var(--color-border)',
                borderWidth: expandedCategory === category.id ? '2px' : '1px'
              }}
            >
              {/* Category Header */}
              <CategoryAccordionHeader
                icon={category.icon}
                title={category.name}
                description={category.description}
                expanded={expandedCategory === category.id}
                onToggle={() => toggleCategory(category.id)}
                id={`category-header-${category.id}`}
                ariaControls={`category-panel-${category.id}`}
              />

              {/* Category Items (Expandable) */}
              {expandedCategory === category.id && (
                <div className="px-6 pb-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {category.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {category.items.map((item) => (
                        <StandardizedItem 
                          key={item.id}
                          item={item}
                          itemType="menu"
                          defaultExpanded={false}
                        />
                      ))}
                    </div>
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
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h2 className="text-3xl md:text-4xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-text-on-primary)' }}>
            Visit RoCafé Today
          </h2>
          <p className="font-inter text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-on-primary)', opacity: 0.9 }}>
            Come taste the difference! Fresh ingredients, expertly crafted beverages, and friendly service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              href={`${BASE_URL}locations`}
              variant="navlink"
              style={{ minWidth: 180 }}
              analyticsEvent="rocafe_get_directions"
            >
              Get Directions
            </Button>
            <Button
              href={`${BASE_URL}`}
              variant="navlink"
              style={{ minWidth: 180 }}
              analyticsEvent="rocafe_back_home"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoCafePage;
