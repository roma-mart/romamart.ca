/**
 * LocationButton Component
 * Geolocation button that integrates with LocationContext for a single
 * source of truth. Extracted from Button.jsx (R7).
 * Used exclusively by Footer.jsx for "Detect Nearest Store" functionality.
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLocationContext } from '../hooks/useLocationContext';
import { useToast } from './ToastContainer';
import { MapPin, Loader } from 'lucide-react';

const LOCATION_STYLE = {
  backgroundColor: 'var(--color-location-bg, var(--color-accent))',
  color: 'var(--color-location-text, var(--color-primary))',
  fontWeight: 700,
  fontFamily: 'var(--font-heading)',
  border: '2px solid var(--color-primary)',
  boxShadow: '0 2px 8px var(--color-accent-shadow, rgba(228,179,64,0.10))',
};

const LOCATION_ANIMATION = {
  whileHover: { scale: 1.05, boxShadow: '0 8px 24px var(--color-location-shadow, rgba(64,179,228,0.18))' },
  whileTap: { scale: 0.97, boxShadow: '0 2px 8px var(--color-location-shadow, rgba(64,179,228,0.10))' },
  transition: { duration: 0.18 },
};

const LocationButton = React.forwardRef(({
  onLocationFound,
  onClick,
  className = '',
  style = {},
  children,
  disabled = false,
  ariaLabel,
  ...props
}, ref) => {
  const { forceRequestLocation, userLocation, loading, error, canUseGeolocation } = useLocationContext();
  const { showSuccess, showError } = useToast();
  const clickPending = useRef(false);
  const lastError = useRef(null);

  // Toast + callback only after user-initiated click (not on mount with cached data)
  useEffect(() => {
    const hasValidCoords =
      userLocation !== null && userLocation !== undefined &&
      Number.isFinite(userLocation.latitude) &&
      Number.isFinite(userLocation.longitude);

    if (hasValidCoords && clickPending.current) {
      clickPending.current = false;
      if (onLocationFound) {
        onLocationFound({
          coords: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        });
      }
      showSuccess('Location found! Sorting stores by distance...');
    }
  }, [userLocation, onLocationFound, showSuccess]);

  useEffect(() => {
    if (error && error !== lastError.current) {
      lastError.current = error;
      showError(`Location error: ${error}`);
    }
  }, [error, showError]);

  if (!canUseGeolocation) return null;

  const mergedStyle = {
    minHeight: 44,
    minWidth: 44,
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
    borderRadius: 12,
    padding: '12px 28px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    WebkitTapHighlightColor: 'transparent',
    ...LOCATION_STYLE,
    ...style,
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    clickPending.current = true;
    forceRequestLocation();
    if (onClick) onClick(e);
  };

  const ariaProps = {};
  if (ariaLabel) {
    ariaProps['aria-label'] = ariaLabel;
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      {...props}
      className={`button location ${className}`.trim()}
      style={mergedStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      {...ariaProps}
      {...LOCATION_ANIMATION}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Loader size={20} className="animate-spin" />
          Looking for you...
        </span>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={20} />
          {children || 'Update location'}
        </span>
      )}
    </motion.button>
  );
});

LocationButton.displayName = 'LocationButton';

LocationButton.propTypes = {
  onLocationFound: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

export default LocationButton;
