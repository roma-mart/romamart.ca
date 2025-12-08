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
 * @param {string} props.availabilityState - Explicit availability state ('available', 'available_but_closed', 'coming_soon', 'unavailable')
 */
export default function AvailabilityIndicator({ nearestLocation, availabilityState }) {
  // Smart color and label logic
  let borderColor = 'var(--color-warning)';
  let statusText = 'Select a location to check availability';
  let statusColor = 'var(--color-text-muted)';
  if (nearestLocation) {
    switch (availabilityState) {
      case 'available':
        borderColor = 'var(--color-success)';
        statusText = `Available now at ${nearestLocation.name}`;
        statusColor = 'var(--color-success)';
        break;
      case 'available_but_closed':
        borderColor = 'var(--color-warning)';
        statusText = `Available (Closed) at ${nearestLocation.name}`;
        statusColor = 'var(--color-warning)';
        break;
      case 'coming_soon':
        borderColor = 'var(--color-accent)';
        statusText = `Coming soon at ${nearestLocation.name}`;
        statusColor = 'var(--color-accent)';
        break;
      case 'unavailable':
      default:
        borderColor = 'var(--color-text-muted)';
        statusText = `Not available at ${nearestLocation.name}`;
        statusColor = 'var(--color-text-muted)';
        break;
    }
  }
  return (
    <div 
      className="p-3 rounded-lg mb-4"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        borderLeft: `4px solid ${borderColor}`
      }}
    >
      <p 
        className="text-sm font-inter font-bold mb-1"
        style={{ color: statusColor }}
      >
        📍 {statusText}
      </p>
      {nearestLocation && (
        <p 
          className="text-xs font-inter"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {nearestLocation.address?.formatted}
        </p>
      )}
    </div>
  );
}
