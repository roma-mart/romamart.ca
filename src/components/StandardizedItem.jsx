import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  // Destructure item data  
  const {
    name,
    tagline,              // Short description (basic view)
    description,          // Full description (detailed view)
    image,                // Image URL or path
    badge,                // 'bestseller', 'new', 'halal', 'comingSoon', etc.
    sizes = [],           // [{name: 'Small', price: 2.99}, ...]
    defaultSize = 0,      // Index of default selected size
    calories,             // Optional: nutritional info
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

  const [selectedSize, setSelectedSize] = useState(defaultSize);

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
      return '#E4B340'; // Yellow for coming soon
    }
    if (isAvailable === false) {
      return '#9CA3AF'; // Grey for unavailable at this location
    }
    if (locationStatus === 'Open Now') {
      return '#059669'; // Green for open and available
    }
    if (locationStatus === 'Closed') {
      return '#DC2626'; // Red for closed but available
    }
    return 'var(--color-border)'; // Default
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
            color: '#9CA3AF',
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
            color: '#E4B340',
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
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
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
                    <span className="text-xs font-inter font-normal" style={{ color: '#9CA3AF' }}>
                      (Not Available)
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="text-xs font-inter font-bold" style={{ color: '#E4B340' }}>
                      (Coming Soon)
                    </span>
                  )}
                </h3>
                
                {/* Badges */}
                <div className="flex gap-2 mt-1 flex-wrap">
                  {badgeStyle && (
                    <span 
                      className="inline-block text-xs font-bold px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text
                      }}
                    >
                      {badgeStyle.label}
                    </span>
                  )}
                  {ageRestrictedBadge && (
                    <span 
                      className="inline-block text-xs font-bold px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: ageRestrictedBadge.bg,
                        color: ageRestrictedBadge.text
                      }}
                    >
                      {ageRestrictedBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Expand/Collapse Icon */}
              <button
                className="flex-shrink-0 p-1 rounded-full transition-colors"
                style={{ color: 'var(--color-heading)' }}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
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

            {/* Size Options & Price (Basic View) */}
            {sizes.length > 0 && !isExpanded && (
              <div className="flex items-center gap-2 flex-wrap">
                {sizes.map((size, idx) => (
                  <span 
                    key={idx}
                    className={`text-sm px-2 py-1 rounded ${idx === selectedSize ? 'font-bold' : ''}`}
                    style={{ 
                      backgroundColor: idx === selectedSize ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: idx === selectedSize ? 'var(--color-primary)' : 'var(--color-text-muted)'
                    }}
                  >
                    {size.name}: ${size.price.toFixed(2)}
                  </span>
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
                    <div className="text-xs">${size.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
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

          {/* Availability Status (for Services) - 4-State System */}
          {(availability || locationStatus) && (
            <div 
              className="p-3 rounded-lg mb-4"
              style={{ 
                backgroundColor: (isUnavailable || isComingSoon) ? '#F3F4F6' : 'var(--color-bg)',
                borderLeft: `4px solid ${getAvailabilityColor()}`
              }}
            >
              {isComingSoon ? (
                <p 
                  className="text-sm font-inter font-bold"
                  style={{ color: '#E4B340' }}
                >
                  ⏳ Coming Soon to This Location
                </p>
              ) : isUnavailable ? (
                <p 
                  className="text-sm font-inter font-bold"
                  style={{ color: '#9CA3AF' }}
                >
                  ✕ Not Available at This Location
                </p>
              ) : (
                <>
                  {locationStatus && (
                    <p 
                      className="text-sm font-inter font-bold mb-1"
                      style={{ color: locationStatus === 'Open Now' ? '#059669' : '#DC2626' }}
                    >
                      {locationStatus === 'Open Now' ? '● ' : '● '}{locationStatus}
                    </p>
                  )}
                  {availability && (
                    <p 
                      className="text-xs font-inter"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <strong>Availability:</strong> {availability === '24_7' ? '24/7' : availability === 'store_hours' ? 'During Store Hours' : 'Limited Availability'}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

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
                backgroundColor: '#FEF2F2',
                borderColor: '#DC2626'
              }}
            >
              <p 
                className="text-xs font-inter font-bold mb-1"
                style={{ color: '#DC2626' }}
              >
                ⚠️ Legal Notice
              </p>
              <p 
                className="text-xs font-inter mb-2"
                style={{ color: '#7F1D1D' }}
              >
                {legalNotice.text}
              </p>
              {legalNotice.url && (
                <a 
                  href={legalNotice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-inter font-bold hover:underline"
                  style={{ color: '#DC2626' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn more: {legalNotice.law}
                </a>
              )}
            </div>
          )}

          {/* Nutritional Info */}
          {(calories || ingredients) && (
            <div 
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              {calories && (
                <p 
                  className="text-xs font-inter mb-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <strong>Calories:</strong> {calories}
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

          {/* Action Button (Optional CTA) */}
          {action && !isUnavailable && !isComingSoon && (
            <a
              href={action.email ? `mailto:${action.email}?subject=${encodeURIComponent(action.subject || '')}&body=${encodeURIComponent(action.body || '')}` : action.url}
              target={action.url ? "_blank" : undefined}
              rel={action.url ? "noopener noreferrer" : undefined}
              onClick={(e) => e.stopPropagation()}
              className="block w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
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
