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
  inverted: 40,
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
  inverted: 'inverted_cta',
  custom: 'custom_cta',
};

// Shared spring config — consistent snappy feel across all variants
const SPRING = { type: 'spring', stiffness: 400, damping: 30 };

// Per-variant Framer Motion animation props
// Scale tiers: primary CTAs 1.04, standard 1.03, icon 1.1
// Only scale + boxShadow (GPU-accelerated); no backgroundColor animation
const VARIANT_ANIMATION = {
  order: {
    whileHover: { scale: 1.04, boxShadow: '0 10px 32px var(--color-accent-shadow, rgba(228,179,64,0.22))' },
    whileTap: { scale: 0.97 },
    transition: SPRING,
  },
  nav: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: SPRING,
  },
  action: {
    whileHover: { scale: 1.03, boxShadow: '0 8px 28px var(--color-accent-shadow, rgba(228,179,64,0.22))' },
    whileTap: { scale: 0.97 },
    transition: SPRING,
  },
  navlink: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: SPRING,
  },
  icon: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.93 },
    transition: SPRING,
  },
  secondary: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: SPRING,
  },
  inverted: {
    whileHover: { scale: 1.04, boxShadow: '0 8px 28px rgba(2,1,120,0.22)' },
    whileTap: { scale: 0.97 },
    transition: SPRING,
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
    borderRadius: 'var(--radius-full)',
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
    borderRadius: 'var(--radius-full)',
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
  secondary: {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    boxShadow: 'none',
    transition: 'all 0.2s',
    padding: '12px 28px',
    minHeight: 44,
    minWidth: 44,
  },
  inverted: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-accent)',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    boxShadow: '0 4px 16px rgba(2,1,120,0.15)',
    transition: 'all 0.2s',
    padding: '12px 28px',
    minHeight: 44,
    minWidth: 44,
  },
};

// Size presets — applied after variant styles, before user style prop
const SIZE_STYLES = {
  sm: { padding: '8px 16px', fontSize: '0.875rem' },
  md: {},
  lg: { padding: '16px 32px', fontSize: '1.125rem' },
};

// fireAnalytics removed (unused)

const Button = React.forwardRef(({
  variant = 'order',
  size = 'md',
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
  vibrationPattern,
  className = '',
  style = {},
  tabIndex,
  ...props
}, ref) => {
  // useVibration removed (unused)
  const isNavlink = variant === 'navlink';

  const sizeStyle = (size && variant !== 'icon') ? (SIZE_STYLES[size] || {}) : {};
  const mergedStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    minWidth: 44,
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
    borderRadius: 'var(--radius-xl)',
    padding: variant === 'icon' ? 8 : '12px 28px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    WebkitTapHighlightColor: 'transparent',
    ...VARIANT_STYLES[variant],
    ...sizeStyle,
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
        {icon && iconPosition === 'left' && !isNavlink && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        {icon && iconPosition === 'left' && isNavlink && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        {loadingProp && <span className="inline-block ml-2 animate-spin" style={{ width: 18, height: 18, border: '2px solid var(--color-accent)', borderTop: '2px solid transparent', borderRadius: 'var(--radius-full)' }} aria-hidden="true"></span>}
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
    const vibrateStrength = vibrationPattern ?? VARIANT_VIBRATION[variant];
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
  variant: PropTypes.oneOf(['order', 'nav', 'navlink', 'action', 'secondary', 'inverted', 'icon', 'custom']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
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
