/**
 * Unified Button Component for Roma Mart 2.0
 * Supports: variants, haptic feedback, analytics, accessibility, icon, design tokens, responsive styles
 * Accessibility: All variants support keyboard activation (Enter/Space) and focus-visible styles.
 * Usage Example:
 * <Button
 *   variant="order"
 *   icon={<Icon />}
 *   analyticsEvent="order_cta"
 *   onClick={handleOrderClick}
 *   onKeyDown={e => {
 *     if (e.key === 'Enter' || e.key === ' ') {
 *       e.preventDefault();
 *       handleOrderClick(e);
 *     }
 *   }}
 *   aria-label="Order Now"
 * >
 *   Order Now
 * </Button>
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';
import { MapPin, Loader } from 'lucide-react';
import { CSS_VARS } from '../utils/theme';

const VARIANT_STYLES = {
  order: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontFamily: CSS_VARS.heading,
    border: 'none',
    boxShadow: '0 4px 16px var(--color-accent-shadow, rgba(228,179,64,0.15))',
  },
  nav: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-accent)',
    fontWeight: 600,
    fontFamily: CSS_VARS.heading,
    border: '2px solid var(--color-accent)',
    boxShadow: 'none',
  },
  action: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontFamily: CSS_VARS.heading,
    border: 'none',
    borderRadius: '9999px', // fully rounded
    boxShadow: '0 4px 16px var(--color-accent-shadow, rgba(228,179,64,0.15))',
    transition: 'all 0.2s',
    padding: '12px 28px',
    minHeight: 44,
    minWidth: 44,
  },
  navlink: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontFamily: CSS_VARS.heading,
    border: 'none',
    borderRadius: '9999px', // fully rounded
    boxShadow: '0 4px 16px var(--color-accent-shadow, rgba(228,179,64,0.15))',
    transition: 'all 0.2s',
    padding: '12px 28px',
    minHeight: 44,
    minWidth: 44,
    // Exactly matches order button, minus scaling
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'var(--color-icon)',
    border: 'none',
    padding: 0,
    fontSize: '1.25rem',
  },
  location: {
    backgroundColor: 'var(--color-location-bg, var(--color-accent))',
    color: 'var(--color-location-text, var(--color-primary))',
    fontWeight: 700,
    fontFamily: CSS_VARS.heading,
    border: '2px solid var(--color-primary)',
    boxShadow: '0 2px 8px var(--color-accent-shadow, rgba(228,179,64,0.10))',
  },
};

// fireAnalytics removed (unused)

const Button = React.forwardRef(({
  variant = 'order',
  children,
  icon,
  iconPosition = 'left',
  onClick,
  href,
  type = 'button',
  ariaLabel,
  disabled = false,
  loading: loadingProp = false,
  analyticsEvent,
  // vibrationPattern removed (unused)
  className = '',
  style = {},
  tabIndex,
  onLocationFound,
  ...props
}, ref) => {
  // useVibration removed (unused)

  // Location variant logic
  const isLocation = variant === 'location';
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isLocation && location) {
      if (onLocationFound) {
        onLocationFound({
          coords: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        });
      }
      showSuccess('Location found! Sorting stores by distance...');
    }
  }, [isLocation, location, onLocationFound, showSuccess]);

  useEffect(() => {
    if (isLocation && error) {
      showError(`Location error: ${error}`);
    }
  }, [isLocation, error, showError]);

  const mergedStyle = {
    minHeight: 44,
    minWidth: 44,
    outline: 'none',
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
    borderRadius: 12,
    padding: variant === 'icon' ? 8 : '12px 28px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...VARIANT_STYLES[variant],
    ...style,
  };

  // Add default hover and active effect for 'order' and 'navlink' variants
  const handleMouseEnter = (e) => {
    if (variant === 'order' && !disabled) {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 8px 24px var(--color-accent-shadow, rgba(228,179,64,0.18))';
    } else if (variant === 'navlink' && !disabled) {
      e.currentTarget.style.transform = 'scale(1.0125)';
      e.currentTarget.style.boxShadow = '0 4px 12px var(--color-accent-shadow, rgba(228,179,64,0.10))';
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };
  const handleMouseLeave = (e) => {
    if (variant === 'order' && !disabled) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = mergedStyle.boxShadow || '0 4px 16px var(--color-accent-shadow, rgba(228,179,64,0.15))';
    } else if (variant === 'navlink' && !disabled) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = mergedStyle.boxShadow || '0 4px 16px var(--color-accent-shadow, rgba(228,179,64,0.15))';
    }
    if (props.onMouseLeave) props.onMouseLeave(e);
  };
  // Add click/active feedback for navlink
  const handleMouseDown = (e) => {
    if (variant === 'navlink' && !disabled) {
      e.currentTarget.style.transform = 'scale(0.99)';
      e.currentTarget.style.boxShadow = '0 2px 6px var(--color-accent-shadow, rgba(228,179,64,0.07))';
    }
    if (props.onMouseDown) props.onMouseDown(e);
  };
  const handleMouseUp = (e) => {
    if (variant === 'navlink' && !disabled) {
      e.currentTarget.style.transform = 'scale(1.0125)';
      e.currentTarget.style.boxShadow = '0 4px 12px var(--color-accent-shadow, rgba(228,179,64,0.10))';
    }
    if (props.onMouseUp) props.onMouseUp(e);
  };

  let content;
  if (isLocation) {
    if (!canUseGeolocation) return null;
    content = loading ? (
      <>
        <Loader size={20} className="animate-spin" />
        Looking for you...
      </>
    ) : (
      <>
        <MapPin size={20} />
        Update location
      </>
    );
  } else {
    content = (
      <>
        {icon && iconPosition === 'left' && <span style={{ marginRight: 10, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        {loadingProp && <span className="inline-block ml-2 animate-spin" style={{ width: 18, height: 18, border: '2px solid var(--color-accent)', borderTop: '2px solid transparent', borderRadius: '50%' }} aria-hidden="true"></span>}
      </>
    );
  }

  // Icon-only buttons must have aria-label
  const ariaProps = {};
  if (variant === 'icon' && !children && ariaLabel) {
    ariaProps['aria-label'] = ariaLabel;
  }

  const variantClass = variant ? variant : '';
  const allClasses = `button ${variantClass} ${className}`.trim();


  // Framer Motion animation props for navlink/order/action variants
  let motionProps = {};
  if (variant === 'navlink' || variant === 'order') {
    motionProps = {
      whileHover: {
        scale: variant === 'order' ? 1.05 : 1.0125,
        boxShadow:
          variant === 'order'
            ? '0 8px 24px var(--color-accent-shadow, rgba(228,179,64,0.18))'
            : '0 4px 12px var(--color-accent-shadow, rgba(228,179,64,0.10))',
      },
      whileTap: {
        scale: variant === 'order' ? 0.97 : 0.99,
        boxShadow:
          variant === 'order'
            ? '0 2px 8px var(--color-accent-shadow, rgba(228,179,64,0.10))'
            : '0 2px 6px var(--color-accent-shadow, rgba(228,179,64,0.07))',
      },
      transition: { type: 'spring', stiffness: 400, damping: 30, duration: 0.18 },
    };
  } else if (variant === 'action') {
    motionProps = {
      whileHover: {
        backgroundColor: 'var(--color-accent-hover, #f7d774)',
        boxShadow: '0 6px 20px var(--color-accent-shadow, rgba(228,179,64,0.18))',
      },
      whileFocus: {
        backgroundColor: 'var(--color-accent-hover, #f7d774)',
        boxShadow: '0 6px 20px var(--color-accent-shadow, rgba(228,179,64,0.18))',
      },
      whileTap: {
        backgroundColor: 'var(--color-accent)',
        boxShadow: '0 2px 8px var(--color-accent-shadow, rgba(228,179,64,0.10))',
      },
      transition: { duration: 0.18 },
    };
  }

  // Accessibility: If rendering as <a>, ensure role and keyboard support for non-standard cases
  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        tabIndex={tabIndex}
        className={allClasses}
        style={mergedStyle}
        onClick={onClick}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        role="button"
        {...ariaProps}
        {...props}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  // Location variant: override click handler
  const buttonClick = isLocation ? getCurrentLocation : onClick;

  return (
    <motion.button
      ref={ref}
      type={type}
      tabIndex={tabIndex}
      className={allClasses}
      style={mergedStyle}
      onClick={buttonClick}
      onKeyDown={
        variant === 'icon'
          ? (e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !disabled && !(isLocation ? loading : loadingProp)) {
                e.preventDefault();
                buttonClick && buttonClick(e);
              }
            }
          : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || (isLocation ? loading : loadingProp)}
      {...ariaProps}
      {...props}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
});

Button.propTypes = {
  variant: PropTypes.oneOf(['order', 'nav', 'action', 'secondary', 'icon', 'location', 'custom']),
  children: PropTypes.node,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  href: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  analyticsEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  vibrationPattern: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  className: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  onLocationFound: PropTypes.func,
};

export default Button;
