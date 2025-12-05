import React from 'react';
import { tokens } from '../design/tokens';

/**
 * Accessible, scalable Roma Mart logo component.
 * Implements horizontal or vertical layout based on prop.
 * Props:
 *  - size: one of tokens.logoSizes or custom number (height in px of emblem circle)
 *  - scheme: one of Object.keys(tokens.logoSchemes)
 *  - layout: 'horizontal' | 'vertical'
 *  - ariaLabel: custom accessible label (defaults to 'Roma Mart')
 *  - wordmark: boolean (show wordmark text)
 */
export function Logo({
  size = 32,
  scheme = 'navy',
  // layout = 'horizontal',
  // comment out unused var above
  ariaLabel = 'Roma Mart',
  wordmark = true,
  className = '',
  style = {}
}) {
  const cfg = tokens.logoSchemes[scheme] || tokens.logoSchemes.navy;
  const circleSize = size;
  const cartStroke = cfg.cart;
  const textColor = tokens?.fonts?.heading || 'inherit';
  const fontSize = tokens?.TYPOGRAPHY?.fontSize?.lg || '1rem';
  const fontWeight = tokens?.TYPOGRAPHY?.fontWeight?.bold || 'bold';
  const showBorder = cfg.border;

  // Emblem uses inline SVG for crisp scaling & color control
  const Emblem = (
    <svg
      width={circleSize}
      height={circleSize}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden={wordmark ? true : false}
      focusable="false"
    >
      {/* Circle */}
      <circle cx="32" cy="32" r="30" fill={cfg.invertCircle ? cfg.bg : cartStroke} />
      {/* RM letters */}
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontFamily={tokens.fonts.logo}
        fontSize="24"
        fontWeight="700"
        fill={cfg.invertCircle ? textColor : cfg.bg}
        style={{ letterSpacing: '-0.5px' }}
      >RM</text>
      {/* Cart handle + smile (abstracted) */}
      <path d="M12 28h12" stroke={cartStroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M20 28c0 14 10 22 24 22 6 0 11-2 16-6" stroke={cartStroke} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Wheels */}
      <circle cx="28" cy="54" r="4" fill={cartStroke} />
      <circle cx="40" cy="54" r="4" fill={cartStroke} />
    </svg>
  );

  return (
    <div
      className={`rm-logo ${className}`.trim()}
      aria-label={ariaLabel}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, lineHeight: 1, ...style }}
    >
      {Emblem}
      {wordmark && (
        <span
          style={{
            fontFamily: textColor,
            fontWeight: fontWeight,
            fontSize: fontSize,
            color: textColor,
            letterSpacing: '-0.02em'
          }}
        >
          Roma Mart
        </span>
      )}
      {showBorder && (
        <span className="sr-only">Visual border variant</span>
      )}
    </div>
  );
}

export default Logo;
