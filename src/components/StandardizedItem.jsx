import React, { useState, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/menuHelpers';
import { getOrderingUrl } from '../config/ordering';
import { useLocationContext } from '../hooks/useLocationContext';
import BasicView from './StandardizedItem/BasicView';
import CustomizationSection from './StandardizedItem/CustomizationSection';
import AvailabilityIndicator from './StandardizedItem/AvailabilityIndicator';
import PartnerInfo from './StandardizedItem/PartnerInfo';
import LegalNoticeBox from './StandardizedItem/LegalNoticeBox';

/**
 * StandardizedItem Component
 * 
 * Universal collapsible/expandable item for Services and RoCafé menu
 * Auto-adapts styling based on item data structure (no variant prop needed)
 * 
 * Features:
 * - Compact "basic" view (default collapsed state)
 * - Expanded "detailed" view (click to expand/collapse)
 * - Optional badges (Best Seller, New, Halal, Coming Soon, 19+)
 * - 3-state availability: Green (open), Red (closed), Grey (unavailable)
 * - Multiple size options with dynamic pricing
 * - Multiple customization modes: single selection, checkboxes, quantity counters
 * - Images with loading="lazy" (local or URL)
 * - Service features, availability hours, partner info
 * - Legal notices for age-restricted items (19+)
 * - Action buttons (email, URL, ordering)
 * - Location-aware availability messaging
 * - Responsive layout (mobile, tablet, desktop)
 * 
 * @param {Object} props
 * @param {Object} props.item - Item data object (menu item or service)
 * @param {boolean} [props.defaultExpanded=false] - Start in expanded state
 */

const StandardizedItem = ({ item, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { nearestLocation } = useLocationContext();

  // Destructure item data  
  const {
    name,
    tagline,              // Short description (basic view)
    description,          // Full description (detailed view)
    image,                // Image URL or path
    badge,                // 'bestseller', 'new', 'halal', 'comingSoon', etc.
    sizes = [],           // [{name: 'Small', price: 2.99, calories: 320}, ...]
    defaultSize = 0,      // Index of default selected size
    customizations = [],  // [{type: 'Milk Choice', options: [{name: 'Whole Milk', price: 0}]}]
    calories,             // Optional: legacy nutritional info
    ingredients,          // Optional: ingredient list
    icon,                 // Optional: Icon component (for services)
    action,               // Optional: CTA button config {text, email, url, subject, body}
    features = [],        // Optional: List of features (for services)
    isAvailable,          // Optional: Boolean (for services) - false means grey/unavailable
    locationStatus,       // Optional: 'Open Now' or 'Closed'
    ageRestricted,        // Optional: Boolean for 19+ items
    legalNotice,          // Optional: {text, law, url} for age-restricted items
    partner,              // Optional: {name, url, logo} for partner services
  } = item;

  // State for size selection and customization options
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    // Initialize with default options - support multiple selections and quantities
    const defaults = {};
    customizations.forEach(customization => {
      if (customization.multiple) {
        // Multiple selection: array of selected option names
        const defaultOpts = customization.options.filter(opt => opt.default).map(opt => opt.name);
        defaults[customization.type] = defaultOpts.length > 0 ? defaultOpts : [];
      } else if (customization.quantity) {
        // Quantity support: object with option name and quantity
        const defaultOption = customization.options.find(opt => opt.default);
        defaults[customization.type] = defaultOption ? { [defaultOption.name]: 1 } : {};
      } else {
        // Single selection: string
        const defaultOption = customization.options.find(opt => opt.default);
        defaults[customization.type] = defaultOption ? defaultOption.name : '';
      }
    });
    return defaults;
  });

  // Calculate current price based on selections
  const currentPrice = useMemo(() => {
    if (!item || !item.sizes || !item.sizes[selectedSize]) {
      return 0;
    }
    
    let totalPrice = item.sizes[selectedSize].price;
    
    // Add prices from customizations
    if (item.customizations && selectedOptions) {
      item.customizations.forEach((customization) => {
        const selectedValue = selectedOptions[customization.type];
        
        if (customization.multiple && Array.isArray(selectedValue)) {
          // Multiple selections: sum all selected option prices
          selectedValue.forEach(optionName => {
            const option = customization.options.find(opt => opt.name === optionName);
            if (option && option.price) {
              totalPrice += option.price;
            }
          });
        } else if (customization.quantity && typeof selectedValue === 'object') {
          // Quantity: multiply option price by quantity
          Object.entries(selectedValue).forEach(([optionName, quantity]) => {
            const option = customization.options.find(opt => opt.name === optionName);
            if (option && option.price && quantity > 0) {
              totalPrice += option.price * quantity;
            }
          });
        } else if (typeof selectedValue === 'string') {
          // Single selection
          const option = customization.options.find(opt => opt.name === selectedValue);
          if (option && option.price) {
            totalPrice += option.price;
          }
        }
      });
    }
    
    return totalPrice;
  }, [item, selectedSize, selectedOptions]);

  // Get calories for selected size
  const currentCalories = useMemo(() => {
    return sizes[selectedSize]?.calories || calories;
  }, [sizes, selectedSize, calories]);

  // Toggle handler
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Badge configurations
  const badgeStyles = {
    bestseller: {
      bg: 'var(--color-accent)',
      text: 'var(--color-primary)',
      label: 'BEST SELLER'
    },
    new: {
      bg: 'var(--color-success)',
      text: 'white',
      label: 'NEW'
    },
    halal: {
      bg: '#059669',
      text: 'white',
      label: 'HALAL'
    },
    comingSoon: {
      bg: 'var(--color-warning)',
      text: 'var(--color-primary)',
      label: 'COMING SOON'
    },
    ageRestricted: {
      bg: '#DC2626',
      text: 'white',
      label: '19+ ONLY'
    }
  };

  const badgeStyle = badge ? badgeStyles[badge] : null;
  const ageRestrictedBadge = ageRestricted ? badgeStyles.ageRestricted : null;

  // 4-state availability system for services
  const getAvailabilityColor = () => {
    if (isAvailable === 'coming-soon') {
      return 'var(--color-accent)';
    }
    if (isAvailable === false) {
      return 'var(--color-text-muted)';
    }
    if (locationStatus === 'Open Now') {
      return getRoleColors('open').bg;
    }
    if (locationStatus === 'Closed') {
      return getRoleColors('closed').bg;
    }
    return 'var(--color-border)';
  };

  const isUnavailable = isAvailable === false;
  const isComingSoon = isAvailable === 'coming-soon';

  return (
    <div 
      className="rounded-xl border transition-all duration-300"
      style={{ 
        backgroundColor: isUnavailable ? 'var(--color-bg)' : 'var(--color-surface)',
        borderColor: isExpanded ? 'var(--color-accent)' : getAvailabilityColor(),
        borderWidth: isExpanded ? '2px' : '2px',
        opacity: isUnavailable ? 0.6 : (isComingSoon ? 0.85 : 1),
        position: 'relative'
      }}
    >
      {/* Unavailable Overlay - Large X */}
      {isUnavailable && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '6rem',
            color: 'var(--color-text-muted)',
            fontWeight: 'bold',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          ✕
        </div>
      )}
      
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--color-accent)',
            opacity: 0.2,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          Coming Soon
        </div>
      )}

      {/* BASIC VIEW (Always Visible) */}
      <BasicView
        item={item}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpanded}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        currentPrice={currentPrice}
        currentCalories={currentCalories}
        isUnavailable={isUnavailable}
        isComingSoon={isComingSoon}
      />

      {/* DETAILED VIEW (Expanded) */}
      {isExpanded && (
        <div 
          className="px-4 pb-4 border-t"
          style={{ borderColor: 'var(--color-border)', position: 'relative', zIndex: 2 }}
        >
          {/* Full Description */}
          <p 
            className="text-sm font-inter leading-relaxed mb-4 mt-4"
            style={{ color: 'var(--color-text)' }}
          >
            {description}
          </p>

          {/* Customization Options (for Menu Items) */}
          <CustomizationSection
            customizations={customizations}
            selectedOptions={selectedOptions}
            onOptionsChange={setSelectedOptions}
          />

          {/* Features List (for Services) */}
          {features.length > 0 && (
            <div className="mb-4">
              <h4 
                className="text-sm font-bold font-coco mb-2"
                style={{ color: 'var(--color-heading)' }}
              >
                Features:
              </h4>
              <ul className="space-y-1">
                {features.map((feature, idx) => (
                  <li 
                    key={idx}
                    className="text-sm font-inter flex items-start gap-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Availability Status */}
          <AvailabilityIndicator nearestLocation={nearestLocation} />

          {/* Partner Info */}
          <PartnerInfo partner={partner} />

          {/* Legal Notice (Age-Restricted Items) */}
          <LegalNoticeBox legalNotice={legalNotice} />

          {/* Nutritional Info */}
          {(currentCalories || ingredients) && (
            <div 
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              {currentCalories && (
                <p 
                  className="text-xs font-inter mb-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <strong>Calories:</strong> {currentCalories} cal
                </p>
              )}
              {ingredients && (
                <p 
                  className="text-xs font-inter"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <strong>Ingredients:</strong> {ingredients}
                </p>
              )}
            </div>
          )}

          {/* Order Now Button (for Menu Items) */}
          {customizations.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.dataLayer) {
                  window.dataLayer.push({
                    event: 'order_cta_click',
                    cta_location: 'menu_item_button',
                    cta_text: 'Order Now',
                    item_price: currentPrice
                  });
                }
                window.open(getOrderingUrl(), '_blank', 'noopener,noreferrer');
              }}
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
          )}

          {/* Action Button (for Services) */}
          {action && !isUnavailable && !isComingSoon && (
            <a
              href={action.email ? `mailto:${action.email}?subject=${encodeURIComponent(action.subject || '')}&body=${encodeURIComponent(action.body || '')}` : action.url}
              target={action.url ? "_blank" : undefined}
              rel={action.url ? "noopener noreferrer" : undefined}
              onClick={(e) => e.stopPropagation()}
              className="block w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-accent)',
                textDecoration: 'none'
              }}
            >
              {action.text}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default StandardizedItem;
