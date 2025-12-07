import React from 'react';

/**
 * AvailabilityIndicator Component
 * 
 * Shows location availability status for items/services.
 * Displays nearest location with address, or prompts to select location.
 * 
 * @param {Object} props
 * @param {Object} [props.nearestLocation] - Nearest location object (computed from userLocation)
 * @param {string} props.nearestLocation.name - Location name
 * @param {Object} props.nearestLocation.address - Location address object
 */
export default function AvailabilityIndicator({ nearestLocation }) {
  return (
    <div 
      className="p-3 rounded-lg mb-4"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        borderLeft: `4px solid ${nearestLocation ? 'var(--color-success)' : 'var(--color-warning)'}`
      }}
    >
      {nearestLocation ? (
        <>
          <p 
            className="text-sm font-inter font-bold mb-1"
            style={{ color: 'var(--color-success)' }}
          >
            📍 Available at {nearestLocation.name}
          </p>
          <p 
            className="text-xs font-inter"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {nearestLocation.address?.formatted}
          </p>
        </>
      ) : (
        <p 
          className="text-sm font-inter"
          style={{ color: 'var(--color-text-muted)' }}
        >
          📍 Select a location to check availability
        </p>
      )}
    </div>
  );
}
