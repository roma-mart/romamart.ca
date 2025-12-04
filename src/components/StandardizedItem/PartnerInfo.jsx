import React from 'react';

/**
 * PartnerInfo Component
 * 
 * Displays partner branding for items/services provided through partnerships.
 * Shows partner logo and clickable link to partner website.
 * 
 * @param {Object} props
 * @param {Object} [props.partner] - Partner object
 * @param {string} props.partner.name - Partner company name
 * @param {string} props.partner.url - Partner website URL
 * @param {string} [props.partner.logo] - Partner logo image URL
 */
export default function PartnerInfo({ partner }) {
  if (!partner) {
    return null;
  }

  return (
    <div 
      className="p-3 rounded-lg mb-4 flex items-center gap-3"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {partner.logo && (
        <img 
          src={partner.logo} 
          alt={`${partner.name} logo`}
          className="h-8 w-auto object-contain"
        />
      )}
      <div>
        <p 
          className="text-xs font-inter font-bold"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Partnered with
        </p>
        <a 
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-inter font-bold hover:underline"
          style={{ color: 'var(--color-accent)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {partner.name}
        </a>
      </div>
    </div>
  );
}
