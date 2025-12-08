
import React, { useState, useEffect } from 'react';
// import { tokens } from '../design/tokens';

/**
 * Roma Mart Logo Component
 * Props:
 *  - size: height in px (default 32)
 *  - variant: 'brand' | 'white' | 'black' (default 'brand')
 *  - layout: 'horizontal' | 'vertical' (default 'vertical')
 *  - ariaLabel: accessible label (default 'Roma Mart')
 *  - className, style: for custom styling
 */
export function Logo({
  size = 32,
  variant = 'brand',
  layout = 'vertical',
  ariaLabel = 'Roma Mart',
  className = '',
  style = {},
  responsive = false
}) {
  // Responsive layout switching
  const [currentLayout, setCurrentLayout] = useState(layout);

  useEffect(() => {
    if (!responsive) return;
    // Use matchMedia for SSR-safe detection
    const mq = window.matchMedia('(min-width: 768px)');
    const updateLayout = () => setCurrentLayout(mq.matches ? 'horizontal' : 'vertical');
    updateLayout();
    mq.addEventListener('change', updateLayout);
    return () => mq.removeEventListener('change', updateLayout);
  }, [responsive, layout]);
  // Asset mapping
  const assetBase = '/romamart.ca/';
  const assets = {
    vertical: {
      brand: assetBase + 'logo.svg',
      white: assetBase + 'logo-white.svg',
      black: assetBase + 'logo-black.svg',
    },
    horizontal: {
      brand: assetBase + 'Logo-horizontal.svg',
      white: assetBase + 'Logo-horizontal-white.svg',
      black: assetBase + 'Logo-horizontal-black.svg',
    }
  };

  // Select asset
  const src = assets[currentLayout]?.[variant] || assets[currentLayout]?.brand;
  const altText = ariaLabel || 'Roma Mart';

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={altText}
      aria-label={altText}
      className={`rm-logo ${className}`.trim()}
      style={{
        display: 'inline-block',
        height: size,
        width: 'auto',
        objectFit: 'contain',
        ...style
      }}
    />
  );
}

export default Logo;
