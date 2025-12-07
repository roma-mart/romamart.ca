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
  scheme = 'white',
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
  const showBorder = false;

  // Emblem uses inline SVG for crisp scaling & color control
  const Emblem = (
    <img
    src="/romamart.ca/white-logo.svg" // Update this path as needed
    width={circleSize}
    height={circleSize}
    alt=""
    aria-hidden={wordmark ? "true" : "false"}
    style={{
      // borderRadius: "50%",
      border: showBorder ? `2px solid ${cartStroke}` : undefined,
      objectFit: "cover",
      background: "transparent"
    }}
  />
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
