import React from 'react';

/**
 * CustomizationSection Component
 * 
 * Renders customization options with three distinct modes:
 * 1. Multiple selection (checkboxes with optional maxSelections limit)
 * 2. Quantity mode (increment/decrement counters)
 * 3. Single selection (radio-style buttons)
 * 
 * @param {Object} props
 * @param {Array} props.customizations - Array of customization groups
 * @param {Object} props.selectedOptions - Current selection state (managed by parent)
 * @param {Function} props.onOptionsChange - Callback when selections change
 */
export default function CustomizationSection({ 
  customizations = [], 
  selectedOptions = {}, 
  onOptionsChange 
}) {
  if (!customizations || customizations.length === 0) {
    return null;
  }

  const handleOptionsChange = (newOptions) => {
    if (onOptionsChange) {
      onOptionsChange(newOptions);
    }
  };

  return (
    <div className="space-y-4 mb-4">
      {customizations.map((customization, custIdx) => (
        <div key={custIdx}>
          <h4 
            className="text-sm font-bold var(--font-heading) mb-2"
            style={{ color: 'var(--color-heading)' }}
          >
            {customization.type}
            {customization.required && (
              <span style={{ color: 'var(--color-error)' }}> *</span>
            )}
            {customization.multiple && (
              <span 
                className="text-xs font-normal font-inter ml-2" 
                style={{ color: 'var(--color-text-muted)' }}
              >
                (Select all that apply)
              </span>
            )}
            {customization.quantity && (
              <span 
                className="text-xs font-normal font-inter ml-2" 
                style={{ color: 'var(--color-text-muted)' }}
              >
                (Adjust quantity)
              </span>
            )}
          </h4>
          
          {customization.multiple ? (
            // Multiple selection mode: Checkboxes with optional maxSelections limit
            <MultipleSelectionMode 
              customization={customization}
              selectedOptions={selectedOptions}
              onOptionsChange={handleOptionsChange}
            />
          ) : customization.quantity ? (
            // Quantity mode: Increment/decrement counters
            <QuantityMode 
              customization={customization}
              selectedOptions={selectedOptions}
              onOptionsChange={handleOptionsChange}
            />
          ) : (
            // Single selection mode: Radio-style buttons
            <SingleSelectionMode 
              customization={customization}
              selectedOptions={selectedOptions}
              onOptionsChange={handleOptionsChange}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Multiple Selection Mode: Checkboxes with maxSelections limit
 */
function MultipleSelectionMode({ customization, selectedOptions, onOptionsChange }) {
  const currentSelections = Array.isArray(selectedOptions[customization.type]) 
    ? selectedOptions[customization.type] 
    : [];

  const handleToggle = (optionName, isSelected) => {
    const newSelections = isSelected
      ? [...currentSelections, optionName]
      : currentSelections.filter(name => name !== optionName);
    
    onOptionsChange({ 
      ...selectedOptions, 
      [customization.type]: newSelections 
    });
  };

  return (
    <div className="space-y-2">
      {customization.maxSelections && (
        <p 
          className="text-xs font-inter mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Select up to {customization.maxSelections} option{customization.maxSelections > 1 ? 's' : ''}
        </p>
      )}
      {customization.options.map((option, optIdx) => {
        const isSelected = currentSelections.includes(option.name);
        const isMaxReached = customization.maxSelections 
          && currentSelections.length >= customization.maxSelections 
          && !isSelected;
        
        return (
          <label
            key={optIdx}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
            style={{ 
              backgroundColor: isSelected ? 'var(--color-accent-light)' : 'transparent',
              opacity: isMaxReached ? 0.5 : 1,
              cursor: isMaxReached ? 'not-allowed' : 'pointer'
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              disabled={isMaxReached}
              onChange={(e) => {
                e.stopPropagation();
                handleToggle(option.name, e.target.checked);
              }}
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-accent)' }}
            />
            <span className="text-sm font-inter" style={{ color: 'var(--color-text)' }}>
              {option.name}
              {option.price > 0 && (
                <span 
                  className="ml-2 font-bold" 
                  style={{ color: 'var(--color-accent)' }}
                >
                  +${option.price.toFixed(2)}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * Quantity Mode: Increment/decrement counters
 */
function QuantityMode({ customization, selectedOptions, onOptionsChange }) {
  const handleQuantityChange = (optionName, delta) => {
    const currentOptions = selectedOptions[customization.type] || {};
    const currentQty = currentOptions[optionName] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    onOptionsChange({
      ...selectedOptions,
      [customization.type]: { 
        ...currentOptions, 
        [optionName]: newQty 
      }
    });
  };

  return (
    <div className="space-y-2">
      {customization.options.map((option, optIdx) => {
        const currentQty = (selectedOptions[customization.type] && selectedOptions[customization.type][option.name]) || 0;
        
        return (
          <div
            key={optIdx}
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <span className="text-sm font-inter" style={{ color: 'var(--color-text)' }}>
              {option.name}
              {option.price > 0 && (
                <span 
                  className="ml-2 text-xs" 
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  ${option.price.toFixed(2)} each
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(option.name, -1);
                }}
                className="w-8 h-8 rounded-full font-bold transition-all hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)'
                }}
                aria-label={`Decrease ${option.name} quantity`}
              >
                −
              </button>
              <span 
                className="w-8 text-center font-bold font-inter" 
                style={{ color: 'var(--color-text)' }}
                aria-live="polite"
              >
                {currentQty}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(option.name, 1);
                }}
                className="w-8 h-8 rounded-full font-bold transition-all hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  border: 'none'
                }}
                aria-label={`Increase ${option.name} quantity`}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Single Selection Mode: Radio-style buttons
 */
function SingleSelectionMode({ customization, selectedOptions, onOptionsChange }) {
  const handleSelect = (optionName) => {
    onOptionsChange({
      ...selectedOptions,
      [customization.type]: optionName
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {customization.options.map((option, optIdx) => {
        const isSelected = selectedOptions[customization.type] === option.name;
        
        return (
          <button
            type="button"
            key={optIdx}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(option.name);
            }}
            className="px-3 py-2 rounded-lg font-inter text-xs transition-all hover:scale-105"
            style={{
              backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-bg)',
              color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
              border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
              fontWeight: isSelected ? 'bold' : 'normal'
            }}
            role="radio"
            aria-checked={isSelected}
          >
            {option.name}
            {option.price > 0 && (
              <span className="ml-1">+${option.price.toFixed(2)}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
