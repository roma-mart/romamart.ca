import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getRoleColors } from '../design/tokens';
import { formatPrice } from '../utils/menuHelpers';
import { getOrderingUrl } from '../config/ordering';
import { useLocationContext } from '../hooks/useLocationContext';

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
                  onError={(e) => {
                    // Fallback to placeholder on image load failure
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect fill="%23e5e7eb" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                    e.target.onerror = null; // Prevent infinite loop
                  }}
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

            {/* Price Display */}
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

            {/* Universal Size Selector - Adapts to Collapsed/Expanded State */}
            {sizes.length > 0 && (
              <div className="mb-2">
                {!isExpanded && (
                  <h4 className="sr-only">Select Size</h4>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {sizes.map((size, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(idx);
                      }}
                      className={`font-inter font-bold transition-all cursor-pointer hover:scale-105 ${
                        isExpanded 
                          ? 'px-4 py-2 rounded-lg text-sm' 
                          : 'px-2 py-1 rounded text-xs'
                      }`}
                      style={{ 
                        backgroundColor: idx === selectedSize ? 'var(--color-accent)' : (isExpanded ? 'var(--color-surface)' : 'var(--color-bg)'),
                        color: idx === selectedSize ? 'var(--color-primary)' : 'var(--color-text)',
                        border: `${isExpanded ? '2px' : '1px'} solid ${idx === selectedSize ? 'var(--color-accent)' : 'var(--color-border)'}`
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <div>{size.name}</div>
                          <div className="text-xs">
                            ${size.price.toFixed(2)}
                            {size.calories && <span className="ml-2 opacity-70">• {size.calories} cal</span>}
                          </div>
                        </>
                      ) : (
                        <span>{size.name}</span>
                      )}
                    </button>
                  ))}
                </div>
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
                    {customization.multiple && <span className="text-xs font-normal font-inter ml-2" style={{ color: 'var(--color-text-muted)' }}>(Select all that apply)</span>}
                    {customization.quantity && <span className="text-xs font-normal font-inter ml-2" style={{ color: 'var(--color-text-muted)' }}>(Adjust quantity)</span>}
                  </h4>
                  
                  {customization.multiple ? (
                    // Multiple selection: Checkboxes with optional maxSelections limit
                    <div className="space-y-2">
                      {customization.maxSelections && (
                        <p 
                          className="text-xs font-inter mb-2"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Select up to {customization.maxSelections} option{customization.maxSelections > 1 ? 's' : ''}
                        </p>
                      )}
                      {customization.options.map((option, optIdx) => {
                        const currentSelections = Array.isArray(selectedOptions[customization.type]) ? selectedOptions[customization.type] : [];
                        const isSelected = currentSelections.includes(option.name);
                        const isMaxReached = customization.maxSelections && currentSelections.length >= customization.maxSelections && !isSelected;
                        
                        return (
                          <label
                            key={optIdx}
                            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
                            style={{ 
                              backgroundColor: isSelected ? 'var(--color-accent-light)' : 'transparent',
                              opacity: isMaxReached ? 0.5 : 1,
                              cursor: isMaxReached ? 'not-allowed' : 'pointer'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isMaxReached}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedOptions(prev => {
                                  const currentSelections = Array.isArray(prev[customization.type]) ? prev[customization.type] : [];
                                  const newSelections = e.target.checked
                                    ? [...currentSelections, option.name]
                                    : currentSelections.filter(name => name !== option.name);
                                  return { ...prev, [customization.type]: newSelections };
                                });
                              }}
                              className="w-4 h-4"
                              style={{ accentColor: 'var(--color-accent)' }}
                            />
                            <span className="text-sm font-inter" style={{ color: 'var(--color-text)' }}>
                              {option.name}
                              {option.price > 0 && <span className="ml-2 font-bold" style={{ color: 'var(--color-accent)' }}>+${option.price.toFixed(2)}</span>}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : customization.quantity ? (
                    // Quantity support: Number input
                    <div className="space-y-2">
                      {customization.options.map((option, optIdx) => {
                        const currentQty = (selectedOptions[customization.type] && selectedOptions[customization.type][option.name]) || 0;
                        return (
                          <div
                            key={optIdx}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-sm font-inter" style={{ color: 'var(--color-text)' }}>
                              {option.name}
                              {option.price > 0 && <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>${option.price.toFixed(2)} each</span>}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOptions(prev => {
                                    const currentOptions = prev[customization.type] || {};
                                    const newQty = Math.max(0, (currentOptions[option.name] || 0) - 1);
                                    return {
                                      ...prev,
                                      [customization.type]: { ...currentOptions, [option.name]: newQty }
                                    };
                                  });
                                }}
                                className="w-8 h-8 rounded-full font-bold transition-all hover:scale-110"
                                style={{ 
                                  backgroundColor: 'var(--color-surface)',
                                  color: 'var(--color-text)',
                                  border: '1px solid var(--color-border)'
                                }}
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold font-inter" style={{ color: 'var(--color-text)' }}>
                                {currentQty}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOptions(prev => {
                                    const currentOptions = prev[customization.type] || {};
                                    const newQty = (currentOptions[option.name] || 0) + 1;
                                    return {
                                      ...prev,
                                      [customization.type]: { ...currentOptions, [option.name]: newQty }
                                    };
                                  });
                                }}
                                className="w-8 h-8 rounded-full font-bold transition-all hover:scale-110"
                                style={{ 
                                  backgroundColor: 'var(--color-accent)',
                                  color: 'var(--color-primary)',
                                  border: 'none'
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Single selection: Radio buttons
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
                  )}
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
              href={getOrderingUrl('ubereats', nearestLocation)}
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
