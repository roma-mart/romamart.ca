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

import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// Per-variant vibration strength (ms or array)
const VARIANT_VIBRATION = {
  order: 50,
  nav: 30,
  action: 40,
  navlink: 30,
  icon: 20,
  secondary: 20,
  custom: 35,
};

// Per-variant analytics event (default, can be overridden)
const VARIANT_ANALYTICS = {
  order: 'order_cta',
  nav: 'nav_click',
  action: 'action_cta',
  navlink: 'navlink_click',
  icon: 'icon_click',
  secondary: 'secondary_cta',
  custom: 'custom_cta',
};

// Per-variant Framer Motion animation props
const VARIANT_ANIMATION = {
  order: {
    whileHover: { scale: 1.07, boxShadow: '0 10px 32px var(--color-accent-shadow, rgba(228,179,64,0.22))' },
    whileTap: { scale: 0.96, boxShadow: '0 2px 8px var(--color-accent-shadow, rgba(228,179,64,0.10))' },
    transition: { type: 'spring', stiffness: 400, damping: 30, duration: 0.18 },
  },
  nav: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15 },
  },
  action: {
    whileHover: { backgroundColor: 'var(--color-accent-hover, #f7d774)', boxShadow: '0 8px 28px var(--color-accent-shadow, rgba(228,179,64,0.22))' },
    whileTap: { backgroundColor: 'var(--color-accent)', boxShadow: '0 2px 8px var(--color-accent-shadow, rgba(228,179,64,0.10))' },
    transition: { duration: 0.18 },
  },
  navlink: {
    whileHover: { scale: 1.015 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.15 },
  },
  icon: {
    whileHover: { scale: 1.15 },
    whileTap: { scale: 0.9 },
    transition: { duration: 0.12 },
  },
  secondary: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.13 },
  },
  custom: {},
};

const VARIANT_STYLES = {
  order: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    border: 'none',
    boxShadow: '0 4px 16px var(--color-accent-shadow, rgba(228,179,64,0.15))',
  },
  nav: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-accent)',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    border: '2px solid var(--color-accent)',
    boxShadow: 'none',
  },
  action: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
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
    fontFamily: 'var(--font-heading)',
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
  vibrationPattern = 10,
  className = '',
  style = {},
  tabIndex,
  ...props
}, ref) => {
  // useVibration removed (unused)
  const isNavlink = variant === 'navlink';

  const mergedStyle = {
    minHeight: 44,
    minWidth: 44,
    outline: 'none',
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
    borderRadius: 12,
    padding: variant === 'icon' ? 8 : '12px 28px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    WebkitTapHighlightColor: 'transparent',
    ...VARIANT_STYLES[variant],
    ...style,
  };

  // Add default hover and active effect for 'order' and 'navlink' variants
  // Only retain manual handlers for variants that require custom logic (e.g., location)
  const handleMouseEnter = (e) => {
    if (props.onMouseEnter) props.onMouseEnter(e);
  };
  const handleMouseLeave = (e) => {
    if (props.onMouseLeave) props.onMouseLeave(e);
  };
  const handleMouseDown = (e) => {
    if (props.onMouseDown) props.onMouseDown(e);
  };
  const handleMouseUp = (e) => {
    if (props.onMouseUp) props.onMouseUp(e);
  };

  // Helper to render button content
  function renderContent() {
    // If icon only (no children), center icon with no margin
    if (icon && !children) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{icon}</span>
      );
    }
    return (
      <>
        {icon && iconPosition === 'left' && !isNavlink && <span style={{ marginRight: children ? 10 : 0, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        {icon && iconPosition === 'left' && isNavlink && <span style={{ marginRight: children ? 10 : 0, display: 'inline-flex', alignItems: 'center', position: "relative", top: "2px" }}>{icon}</span>}
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


  // Framer Motion animation props per variant
  const motionProps = VARIANT_ANIMATION[variant] || {};
  const hasAnimation = motionProps && Object.keys(motionProps).length > 0;

  // Accessibility: If rendering as <a>, keep native link semantics
  if (href) {
    const handleLinkClick = (e) => {
      if (disabled || loadingProp) {
        e.preventDefault();
        return;
      }
      handleClick(e);
    };
    const linkProps = {
      ref,
      href: disabled ? undefined : href,
      tabIndex: disabled ? -1 : tabIndex,
      className: allClasses,
      style: mergedStyle,
      onClick: handleLinkClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      'aria-disabled': disabled || loadingProp || undefined,
      ...ariaProps,
      ...props,
    };
    if (hasAnimation) {
      return (<motion.a {...linkProps} {...motionProps}>{renderContent()}</motion.a>);
    }
    return (<a {...linkProps}>{renderContent()}</a>);
  }

  // Unified click handler for all variants
  function handleClick(e) {
    if (disabled) return;
    // Vibration per variant
    const vibrateStrength = typeof vibrationPattern !== 'undefined' ? vibrationPattern : VARIANT_VIBRATION[variant];
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate && vibrateStrength) {
      window.navigator.vibrate(vibrateStrength);
    }
    // Analytics per variant
    const eventToFire = analyticsEvent || VARIANT_ANALYTICS[variant];
    if (eventToFire && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(typeof eventToFire === 'string' ? { event: eventToFire } : eventToFire);
    }
    if (onClick) onClick(e);
  }

  if (hasAnimation) {
    return (
      <motion.button
        ref={ref}
        type={type}
        tabIndex={tabIndex}
        className={allClasses}
        style={mergedStyle}
        onClick={handleClick}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loadingProp) {
            e.preventDefault();
            handleClick(e);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={disabled || loadingProp}
        {...ariaProps}
        {...props}
        {...motionProps}
      >
        {renderContent()}
      </motion.button>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      tabIndex={tabIndex}
      className={allClasses}
      style={mergedStyle}
      onClick={handleClick}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loadingProp) {
          e.preventDefault();
          handleClick(e);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loadingProp}
      {...ariaProps}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.propTypes = {
  variant: PropTypes.oneOf(['order', 'nav', 'navlink', 'action', 'secondary', 'icon', 'custom']),
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
};

export default Button;
