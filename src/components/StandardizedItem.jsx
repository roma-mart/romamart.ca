import React, { useState, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getRoleColors } from '../design/tokens';
import { formatPrice, calculateItemPrice, getDefaultSelections, getCaloriesForSize } from '../utils/menuHelpers';
import { getOrderingUrl } from '../config/ordering';
// ...existing imports...
import { getServiceStatusAtLocation, getMenuItemStatusAtLocation, isLocationOpen } from '../utils/availability';
import { ROCAFE_FULL_MENU } from '../data/rocafe-menu';
import { useLocationContext } from '../hooks/useLocationContext';
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';
import { useServices } from '../contexts/ServicesContext';
import BasicView from './StandardizedItem/BasicView';
import CustomizationSection from './StandardizedItem/CustomizationSection';
import AvailabilityIndicator from './StandardizedItem/AvailabilityIndicator';
import PartnerInfo from './StandardizedItem/PartnerInfo';
import LegalNoticeBox from './StandardizedItem/LegalNoticeBox';
import tokens from '../design/tokens';

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
 * @param {'service'|'menu'} props.itemType - Type of item ('service' or 'menu')
 * @param {boolean} [props.defaultExpanded=false] - Start in expanded state
 */

const StandardizedItem = ({ item, itemType, defaultExpanded = false }) => {
  // ...existing code...
  const { nearestLocation } = useLocationContext();
  const { services } = useServices();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Get live open/closed status from Google Places API if available
  const { isOpenNow: liveOpenStatus } = useGooglePlaceHours(nearestLocation?.google?.placeId || null);

  // Compute effective status for item at nearest location
  let effectiveStatus = item.status;
  let locationIsOpen;

  let availabilityState = 'unavailable';
  if (!nearestLocation) {
    availabilityState = 'select_location';
  } else {
    if (itemType === 'menu') {
      const result = getMenuItemStatusAtLocation(item.id, nearestLocation, ROCAFE_FULL_MENU, item);
      effectiveStatus = result.status;
    } else if (itemType === 'service') {
      const result = getServiceStatusAtLocation(item.id, nearestLocation, services);
      effectiveStatus = result.status;
    }
    locationIsOpen = isLocationOpen(nearestLocation, liveOpenStatus);
    if (effectiveStatus === 'available' && locationIsOpen) {
      availabilityState = 'available';
    } else if (effectiveStatus === 'available' && !locationIsOpen) {
      availabilityState = 'available_but_closed';
    } else if (effectiveStatus === 'coming_soon') {
      availabilityState = 'coming_soon';
    } else {
      availabilityState = 'unavailable';
    }
  }

  // Destructure item data
  const {
    description, // Full description (detailed view)
    defaultSize = 0, // Index of default selected size
    customizations = [], // [{type: 'Milk Choice', options: [{name: 'Whole Milk', price: 0}]}]
    ingredients, // Optional: ingredient list
    action, // Optional: CTA button config {text, email, url, subject, body}
    features = [], // Optional: List of features (for services)
    legalNotice, // Optional: {text, law, url} for age-restricted items
    partner, // Optional: {name, url, logo} for partner services
  } = item;

  // State for size selection and customization options
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedOptions, setSelectedOptions] = useState(() => getDefaultSelections(customizations));

  // Calculate current price based on selections
  const currentPrice = useMemo(
    () => calculateItemPrice(item, selectedSize, selectedOptions),
    [item, selectedSize, selectedOptions]
  );

  // Get calories for selected size
  const currentCalories = useMemo(() => getCaloriesForSize(item, selectedSize), [item, selectedSize]);

  // Toggle handler
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // 4-state availability system for services
  const getAvailabilityColor = () => {
    switch (availabilityState) {
      case 'available':
        return getRoleColors('open').bg;
      case 'available_but_closed':
        return getRoleColors('closed').bg;
      case 'coming_soon':
        return 'var(--color-accent)';
      case 'unavailable':
      default:
        return 'var(--color-text-muted)';
    }
  };

  // Defensive checks for tokens properties
  const fontFamily = tokens?.TYPOGRAPHY?.fontFamily?.body || 'inherit';
  const fontSize = tokens?.TYPOGRAPHY?.fontSize?.base || '1rem';
  const lineHeight = tokens?.TYPOGRAPHY?.lineHeight?.relaxed || 1.5;

  {
    /* Apply typography tokens explicitly */
    const bodyFont = tokens?.fonts?.body || 'var(--font-body)';
    const headingFont = tokens?.fonts?.heading || 'var(--font-heading)';

    {
      /* Example usage in JSX */
    }
    <>
      <div style={{ fontFamily: bodyFont }}>Body Text Example</div>
      <h1 style={{ fontFamily: headingFont }}>Heading Example</h1>
    </>;
  }

  return (
    <div
      className="rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: isExpanded ? 'var(--color-accent)' : getAvailabilityColor(),
        borderWidth: isExpanded ? '2px' : '2px',
        opacity: availabilityState === 'unavailable' ? 0.6 : availabilityState === 'coming_soon' ? 0.85 : 1,
        position: 'relative',
      }}
    >
      {/* Unavailable Overlay - Large X */}
      {availabilityState === 'unavailable' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '6rem',
            color: 'var(--color-accent-bg)',
            fontWeight: 'bold',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          ✕
        </div>
      )}

      {/* Coming Soon Overlay */}
      {availabilityState === 'coming_soon' && (
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
            zIndex: 1,
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
        availabilityState={availabilityState}
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
            style={{
              color: 'var(--color-text)',
              fontFamily: fontFamily,
              fontSize: fontSize,
              lineHeight: lineHeight,
            }}
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
                className="text-sm font-bold text-heading mb-2"
                style={{
                  color: 'var(--color-heading)',
                  fontFamily: tokens?.fonts?.heading || 'inherit',
                  fontSize: tokens?.fontSize?.sm || '1rem',
                  fontWeight: tokens?.fontWeight?.bold || 'bold',
                }}
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
          <AvailabilityIndicator nearestLocation={nearestLocation} availabilityState={availabilityState} />
          {/* Pass explicit availabilityState for smart display */}

          {/* Partner Info */}
          <PartnerInfo partner={partner} />

          {/* Legal Notice (Age-Restricted Items) */}
          <LegalNoticeBox legalNotice={legalNotice} />

          {/* Nutritional Info */}
          {(currentCalories || ingredients) && (
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-bg)' }}>
              {currentCalories && (
                <p className="text-xs font-inter mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  <strong>Calories:</strong> {currentCalories} cal
                </p>
              )}
              {ingredients && (
                <p className="text-xs font-inter" style={{ color: 'var(--color-text-muted)' }}>
                  <strong>Ingredients:</strong> {ingredients}
                </p>
              )}
            </div>
          )}

          {/* Order Now Button (for Menu Items) */}
          {customizations.length > 0 && availabilityState === 'available' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.dataLayer) {
                  window.dataLayer.push({
                    event: 'order_cta_click',
                    cta_location: 'menu_item_button',
                    cta_text: 'Order Now',
                    item_price: currentPrice,
                  });
                }
                window.open(getOrderingUrl(), '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-all mb-2 flex items-center justify-center gap-2 transform hover:scale-105"
              style={{
                WebkitTapHighlightColor: 'transparent',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
              }}
              aria-label={`Order this item for ${formatPrice(currentPrice)}`}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              <span>Order Now • {formatPrice(currentPrice)}</span>
            </button>
          )}

          {/* Action Button (for Services) */}
          {action && availabilityState === 'available' && (
            <a
              href={
                action.email
                  ? `mailto:${action.email}?subject=${encodeURIComponent(action.subject || '')}&body=${encodeURIComponent(action.body || '')}`
                  : action.url
              }
              target={action.url ? '_blank' : undefined}
              rel={action.url ? 'noopener noreferrer' : undefined}
              onClick={(e) => e.stopPropagation()}
              className="block w-full py-3 px-4 rounded-lg font-bold font-inter text-center transition-all transform hover:scale-105"
              style={{
                WebkitTapHighlightColor: 'transparent',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
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
