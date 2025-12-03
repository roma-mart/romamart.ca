import React from 'react';

export default function BrandPatternBackground({ className = '', style = {}, density = 140, stroke = 'var(--color-accent)', opacity = 0.2 }) {
  return (
    <div aria-hidden="true" className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <pattern id="rm-swoosh" width={density} height={density} patternUnits="userSpaceOnUse">
            <path d="M20 70c25 25 55 25 80 0" stroke={stroke} strokeWidth="12" strokeLinecap="round" fill="none" opacity={opacity} />
            <path d="M10 20l12-4c8 35 42 57 77 45" stroke={stroke} strokeWidth="12" strokeLinecap="round" fill="none" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rm-swoosh)" />
      </svg>
    </div>
  );
}
