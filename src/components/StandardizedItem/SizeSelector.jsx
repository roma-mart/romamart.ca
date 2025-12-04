import React from 'react';

/**
 * SizeSelector Component
 * 
 * Interactive size selection buttons with pricing
 * Highlights selected size and displays per-size pricing
 * 
 * @param {Object} props
 * @param {Array} props.sizes - Array of size objects [{name, price, calories}]
 * @param {number} props.selectedSize - Index of selected size
 * @param {Function} props.onSizeChange - Callback when size changes
 */
const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h4 
        className="text-sm font-bold var(--font-heading) mb-2"
        style={{ color: 'var(--color-heading)' }}
      >
        Select Size:
      </h4>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size, idx) => (
          <button
            type="button"
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              onSizeChange(idx);
            }}
            className="px-4 py-2 rounded-lg font-inter text-sm font-bold transition-all"
            style={{
              backgroundColor: idx === selectedSize ? 'var(--color-accent)' : 'var(--color-surface)',
              color: idx === selectedSize ? 'var(--color-primary)' : 'var(--color-text)',
              border: `2px solid ${idx === selectedSize ? 'var(--color-accent)' : 'var(--color-border)'}`
            }}
          >
            <div>{size.name}</div>
            <div className="text-xs">${size.price.toFixed(2)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
