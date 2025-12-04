import React from 'react';

/**
 * LegalNoticeBox Component
 * 
 * Displays legal notices for age-restricted items (19+).
 * Shows warning icon, notice text, and optional link to regulations.
 * 
 * @param {Object} props
 * @param {Object} props.legalNotice - Legal notice object
 * @param {string} props.legalNotice.text - Notice text content
 * @param {string} [props.legalNotice.law] - Name of applicable law/regulation
 * @param {string} [props.legalNotice.url] - URL to more information
 */
export default function LegalNoticeBox({ legalNotice }) {
  if (!legalNotice) {
    return null;
  }

  return (
    <div 
      className="p-3 rounded-lg mb-4 border-2"
      style={{ 
        backgroundColor: 'var(--color-error-bg)',
        borderColor: 'var(--color-error)',
      }}
    >
      <p 
        className="text-xs font-inter font-bold mb-1"
        style={{ color: 'var(--color-error)' }}
      >
        ⚠️ Legal Notice
      </p>
      <p 
        className="text-xs font-inter mb-2"
        style={{ color: 'var(--color-error-dark)' }}
      >
        {legalNotice.text}
      </p>
      {legalNotice.url && (
        <a 
          href={legalNotice.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-inter font-bold hover:underline"
          style={{ color: 'var(--color-error)' }}
          onClick={(e) => e.stopPropagation()}
        >
          Learn more: {legalNotice.law}
        </a>
      )}
    </div>
  );
}
