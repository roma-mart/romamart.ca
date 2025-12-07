/**
 * Unified Button Component for Roma Mart 2.0
 * Supports: variants, haptic feedback, analytics, accessibility, icon, design tokens, responsive styles
 * Usage: <Button variant="order" icon={<Icon />} analyticsEvent="order_cta" onClick={...}>Order Now</Button>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useVibration } from '../hooks/useBrowserFeatures';
import { CSS_VARS } from '../utils/theme';

const VARIANT_STYLES = {
  order: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontFamily: CSS_VARS.heading,
    border: 'none',
    boxShadow: '0 4px 16px rgba(228,179,64,0.15)',
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
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-accent)',
    fontWeight: 600,
    fontFamily: CSS_VARS.body,
    border: '2px solid var(--color-accent)',
    boxShadow: 'none',
  },
  secondary: {
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontWeight: 500,
    fontFamily: CSS_VARS.body,
    border: '1px solid var(--color-border)',
    boxShadow: 'none',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'var(--color-icon)',
    border: 'none',
    padding: 0,
    fontSize: '1.25rem',
  },
  location: {
    backgroundColor: 'var(--color-location-bg, #E4B340)',
    color: 'var(--color-location-text, #020178)',
    fontWeight: 700,
    fontFamily: CSS_VARS.heading,
    border: '2px solid var(--color-primary)',
    boxShadow: '0 2px 8px rgba(228,179,64,0.10)',
  },
};

function fireAnalytics(event) {
  if (window && window.dataLayer && event) {
    window.dataLayer.push(typeof event === 'string' ? { event } : event);
  }
}

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
  loading = false,
  analyticsEvent,
  vibrationPattern = 10,
  className = '',
  style = {},
  tabIndex,
  ...props
}, ref) => {
  const { vibrate, canVibrate } = useVibration();

  const handleClick = e => {
    if (!disabled && canVibrate) vibrate(vibrationPattern);
    if (analyticsEvent) fireAnalytics(analyticsEvent);
    if (onClick) onClick(e);
  };

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

  // Add default hover effect for 'order' variant
  const handleMouseEnter = (e) => {
    if (variant === 'order' && !disabled) {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(228,179,64,0.18)';
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };
  const handleMouseLeave = (e) => {
    if (variant === 'order' && !disabled) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = mergedStyle.boxShadow || '0 4px 16px rgba(228,179,64,0.15)';
    }
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  const content = (
    <>
      {icon && iconPosition === 'left' && <span style={{ marginRight: 10, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {loading && <span className="inline-block ml-2 animate-spin" style={{ width: 18, height: 18, border: '2px solid var(--color-accent)', borderTop: '2px solid transparent', borderRadius: '50%' }} aria-hidden="true"></span>}
    </>
  );

  // Icon-only buttons must have aria-label
  const ariaProps = {};
  if (variant === 'icon' && !children && ariaLabel) {
    ariaProps['aria-label'] = ariaLabel;
  }

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        tabIndex={tabIndex}
        className={`button ${className}`}
        style={mergedStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...ariaProps}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      tabIndex={tabIndex}
      className={`button ${className}`}
      style={mergedStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...ariaProps}
      {...props}
    >
      {content}
    </button>
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
};

export default Button;
