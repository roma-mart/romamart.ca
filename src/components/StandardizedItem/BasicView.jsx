import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getRoleColors } from '../../design/tokens';
import { formatPrice } from '../../utils/menuHelpers';

/**
 * BasicView Component
 * 
 * Displays the collapsed/basic view of an item (always visible).
 * Shows image, title, badges, tagline, price, and compact size selector.
 * Expandable/collapsible via click/keyboard interaction.
 * 
 * @param {Object} props
 * @param {Object} props.item - Item data object
 * @param {boolean} props.isExpanded - Whether detailed view is shown
 * @param {Function} props.onToggleExpand - Toggle expand/collapse callback
 * @param {number} props.selectedSize - Currently selected size index
 * @param {Function} props.onSizeChange - Size selection callback
 * @param {number} props.currentPrice - Calculated current price
 * @param {number} [props.currentCalories] - Calculated current calories
 * @param {boolean} props.isUnavailable - Whether item is unavailable
 * @param {boolean} props.isComingSoon - Whether item is coming soon
 */
export default function BasicView({
  item,
  isExpanded,
  onToggleExpand,
  selectedSize,
  onSizeChange,
  currentPrice,
  currentCalories,
  isUnavailable,
  isComingSoon
}) {
  const {
    name,
    icon,
    image,
    tagline,
    sizes = [],
    badges = {}
  } = item;

  // Parse badges
  const badgeStyle = badges.bestseller ? { name: 'bestseller', label: 'BEST SELLER' }
    : badges.new ? { name: 'new', label: 'NEW' }
    : badges.halal ? { name: 'halal', label: 'HALAL' }
    : null;

  const ageRestrictedBadge = badges.ageRestricted ? { label: '19+' } : null;

  return (
    <div 
      className="p-4 cursor-pointer"
      onClick={onToggleExpand}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleExpand();
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
              onClick={onToggleExpand}
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
                      onSizeChange(idx);
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
  );
}
