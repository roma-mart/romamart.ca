import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getRoleColors } from '../design/tokens';
import { calculateItemPrice, getLowestPrice, formatPrice } from '../data/rocafe-menu';
import { useLocationContext } from '../hooks/useLocationContext';

/**
 * StandardizedItem Component
 * 
 * Reusable collapsible/expandable item for Services and RoCafé menu
 * 
 * Features:
 * - Compact "basic" view (default)
 * - Expanded "detailed" view (click to expand)
 * - Optional badges (Best Seller, New, Halal, Coming Soon, 19+)
 * - 3-state availability: Green (open), Red (closed), Grey (unavailable)
 * - Multiple size options with pricing
 * - Images (local or URL)
 * - Service features, availability, partner info
 * - Legal notices for age-restricted items
 * - Action buttons (email, URL)
 * - Responsive layout
 * 
 * @param {Object} item - Item data
 * @param {boolean} defaultExpanded - Start in expanded state
 * @param {string} variant - 'service' or 'menu' (affects styling)
 */

const StandardizedItem = ({ 
  item, 
  defaultExpanded = false
}) => {
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
    availability,         // Optional: 'store_hours', '24_7', 'custom'
    isAvailable,          // Optional: Boolean (for services) - false means grey/unavailable
    locationStatus,       // Optional: 'Open Now' or 'Closed'
    ageRestricted,        // Optional: Boolean for 19+ items
    legalNotice,          // Optional: {text, law, url} for age-restricted items
    partner,              // Optional: {name, url, logo} for partner services
  } = item;

  // State for size selection and customization options
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    // Initialize with default options
    const defaults = {};
    customizations.forEach(customization => {
      const defaultOption = customization.options.find(opt => opt.default);
      if (defaultOption) {
        defaults[customization.type] = defaultOption.name;
      }
    });
    return defaults;
  });

  // Calculate current price based on selections
  const currentPrice = useMemo(() => {
    return calculateItemPrice(item, selectedSize, selectedOptions);
  }, [item, selectedSize, selectedOptions]);

  // Get calories for selected size
  const currentCalories = useMemo(() => {
    return sizes[selectedSize]?.calories || calories;
  }, [sizes, selectedSize, calories]);

  // Toggle handler memoized
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

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
      <div 
        className="p-4 cursor-pointer"
        onClick={toggleExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
          }
        }}
        role="button"
        tabIndex={0}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="flex gap-4">
          {/* Image Section */}
          {image && (
            <div className="flex-shrink-0">
              <div 
                className="rounded-lg overflow-hidden"
                style={{ 
                  width: isExpanded ? '120px' : '80px',
                  height: isExpanded ? '120px' : '80px',
                  transition: 'all 0.3s ease',
                  filter: isUnavailable ? 'grayscale(100%)' : (isComingSoon ? 'brightness(0.8)' : 'none')
                }}
              >
                <img 
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 
                  className="font-coco text-lg font-bold flex items-center gap-2 flex-wrap"
                  style={{ 
                    color: 'var(--color-heading)',
                    textDecoration: isUnavailable ? 'line-through' : 'none',
                    opacity: isComingSoon ? 0.8 : 1
                  }}
                >
                  {icon && <span className="flex-shrink-0">{icon}</span>}
                  {name}
                  {isUnavailable && (
                    <span className="text-xs font-inter font-normal" style={{ color: 'var(--color-text-muted)' }}>
                      (Not Available)
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="text-xs font-inter font-bold" style={{ color: 'var(--color-accent)' }}>
                      (Coming Soon)
                    </span>
                  )}
                </h3>
                
                {/* Badges */}
                <div className="flex gap-2 mt-1 flex-wrap">
                  {badgeStyle && (
                    <span 
                      className="badge"
                      style={{ 
                        backgroundColor: getRoleColors(badgeStyle.name || 'bestSeller').bg,
                        color: getRoleColors(badgeStyle.name || 'bestSeller').text
                      }}
                    >
                      {badgeStyle.label}
                    </span>
                  )}
                  {ageRestrictedBadge && (
                    <span 
                      className="badge"
                      style={{ 
                        backgroundColor: getRoleColors('ageRestricted').bg,
                        color: getRoleColors('ageRestricted').text
                      }}
                    >
                      {ageRestrictedBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Expand/Collapse Icon */}
              <button
                type="button"
                className="flex-shrink-0 p-1 rounded-full transition-colors"
                style={{ color: 'var(--color-heading)' }}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
                onClick={toggleExpanded}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>

            {/* Tagline (Basic Description) */}
            <p 
              className="text-sm font-inter mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {tagline}
            </p>

            {/* Price Display - Basic View */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-coco font-bold" style={{ color: 'var(--color-accent)' }}>
                {formatPrice(currentPrice)}
              </div>
              {currentCalories && (
                <div className="text-xs font-inter" style={{ color: 'var(--color-text-muted)' }}>
                  {currentCalories} cal
                </div>
              )}
            </div>

            {/* Size Options - Clickable in Basic View */}
            {sizes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {sizes.map((size, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(idx);
                    }}
                    className={`text-sm px-3 py-1.5 rounded-lg font-inter font-bold transition-all cursor-pointer hover:scale-105`}
                    style={{ 
                      backgroundColor: idx === selectedSize ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: idx === selectedSize ? 'var(--color-primary)' : 'var(--color-text)',
                      border: `2px solid ${idx === selectedSize ? 'var(--color-accent)' : 'var(--color-border)'}`
                    }}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

          {/* Size Selection (Detailed) */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <h4 
                className="text-sm font-bold font-coco mb-2"
                style={{ color: 'var(--color-heading)' }}
              >
                Select Size:
              </h4>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(idx);
                    }}
                    className="px-4 py-2 rounded-lg font-inter text-sm font-bold transition-all"
                    style={{
                      backgroundColor: idx === selectedSize ? 'var(--color-accent)' : 'var(--color-surface)',
                      color: idx === selectedSize ? 'var(--color-primary)' : 'var(--color-text)',
                      border: `2px solid ${idx === selectedSize ? 'var(--color-accent)' : 'var(--color-border)'}`
                    }}
                  >
                    <div>{size.name}</div>
                    <div className="text-xs">
                      ${size.price.toFixed(2)}
                      {size.calories && <span className="ml-2 text-gray-500">• {size.calories} cal</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options (for Menu Items) */}
          {customizations.length > 0 && (
            <div className="space-y-4 mb-4">
              {customizations.map((customization, custIdx) => (
                <div key={custIdx}>
                  <h4 
                    className="text-sm font-bold font-coco mb-2"
                    style={{ color: 'var(--color-heading)' }}
                  >
                    {customization.type}
                    {customization.required && <span style={{ color: 'var(--color-error)' }}> *</span>}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {customization.options.map((option, optIdx) => {
                      const isSelected = selectedOptions[customization.type] === option.name;
                      return (
                        <button
                          type="button"
                          key={optIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOptions(prev => ({
                              ...prev,
                              [customization.type]: option.name
                            }));
                          }}
                          className="px-3 py-2 rounded-lg font-inter text-xs transition-all hover:scale-105"
                          style={{
                            backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-bg)',
                            color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                            border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                            fontWeight: isSelected ? 'bold' : 'normal'
                          }}
                        >
                          {option.name}
                          {option.price > 0 && <span className="ml-1">+${option.price.toFixed(2)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

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
          <div 
            className="p-3 rounded-lg mb-4"
            style={{ 
              backgroundColor: 'var(--color-bg)',
              borderLeft: `4px solid ${nearestLocation ? 'var(--color-success)' : 'var(--color-warning)'}`
            }}
          >
            {nearestLocation ? (
              <>
                <p 
                  className="text-sm font-inter font-bold mb-1"
                  style={{ color: 'var(--color-success)' }}
                >
                  📍 Available at {nearestLocation.name}
                </p>
                <p 
                  className="text-xs font-inter"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {nearestLocation.address}
                </p>
              </>
            ) : (
              <p 
                className="text-sm font-inter"
                style={{ color: 'var(--color-text-muted)' }}
              >
                📍 Select a location to check availability
              </p>
            )}
          </div>

          {/* Partner Info */}
          {partner && (
            <div 
              className="p-3 rounded-lg mb-4 flex items-center gap-3"
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              {partner.logo && (
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="h-8 w-auto object-contain"
                />
              )}
              <div>
                <p 
                  className="text-xs font-inter font-bold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Partnered with
                </p>
                <a 
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-inter font-bold hover:underline"
                  style={{ color: 'var(--color-accent)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {partner.name}
                </a>
              </div>
            </div>
          )}

          {/* Legal Notice (Age-Restricted Items) */}
          {legalNotice && (
            <div 
              className="p-3 rounded-lg mb-4 border-2"
              style={{ 
                backgroundColor: 'var(--color-error-bg)',
                borderColor: 'var(--color-error)',
              }}
            >
              <p 
                className="text-xs font-inter font-bold mb-1"
                style={{ color: 'var(--color-error)' }}
              >
                ⚠️ Legal Notice
              </p>
              <p 
                className="text-xs font-inter mb-2"
                style={{ color: 'var(--color-error-dark)' }}
              >
                {legalNotice.text}
              </p>
              {legalNotice.url && (
                <a 
                  href={legalNotice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-inter font-bold hover:underline"
                  style={{ color: 'var(--color-error)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn more: {legalNotice.law}
                </a>
              )}
            </div>
          )}

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
          {customizations.length > 0 && nearestLocation && (
            <a
              href={`https://www.ubereats.com/ca/store/roma-mart`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-transform hover:scale-105 mb-2"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                textDecoration: 'none'
              }}
            >
              Order Now • {formatPrice(currentPrice)}
            </a>
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
