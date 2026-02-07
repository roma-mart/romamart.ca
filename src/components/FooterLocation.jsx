/**
 * FooterLocation.jsx
 * Location selector, nearest store detection, and local time display for the Footer.
 */
import { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import COMPANY_DATA from '../config/company_data';
import LocationButton from './LocationButton';
import CurrentLocalTime from './CurrentLocalTime';

export default function FooterLocation({ locations, nearestLocationId }) {
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    return localStorage.getItem('roma_mart_selected_location') || 'auto';
  });

  const activeLocations = useMemo(
    () => locations.filter((loc) => loc.status === 'open'),
    [locations]
  );

  const handleLocationChange = (e) => {
    const newLocationId = e.target.value;
    setSelectedLocationId(newLocationId);
    if (newLocationId === 'auto') {
      localStorage.removeItem('roma_mart_selected_location');
    } else {
      localStorage.setItem('roma_mart_selected_location', newLocationId);
    }
  };

  const getCurrentLocation = () => {
    let location = null;
    if (selectedLocationId === 'auto') {
      if (nearestLocationId) {
        location = locations.find((loc) => loc.id === nearestLocationId);
      } else {
        location = COMPANY_DATA.location;
      }
    } else {
      location = locations.find((loc) => loc.id === selectedLocationId);
      if (!location) {
        location = COMPANY_DATA.location;
      }
    }
    if (location) {
      return {
        ...location,
        address: location.address || COMPANY_DATA.hq?.address,
        contact: location.contact || COMPANY_DATA.hq?.contact,
        hours: location.hours || COMPANY_DATA.hq?.hours,
      };
    }
    return COMPANY_DATA.hq;
  };

  const currentLocation = getCurrentLocation();
  const isAutoMode = selectedLocationId === 'auto';

  return (
    <div className="mb-8 max-w-md mx-auto">
      <div
        className="rounded-lg p-4 flex flex-col items-center"
        style={{
          backgroundColor: 'var(--color-footer)',
          border: '.5px solid var(--color-border)',
          position: 'relative',
        }}
      >
        <label
          htmlFor="location-selector"
          className="font-heading text-base mb-2 flex items-center gap-2 justify-center text-center"
          style={{ color: 'var(--color-accent)', fontWeight: 600, width: '100%' }}
        >
          <MapPin className="inline-block" size={18} aria-hidden="true" />
          <span>Your Store Location</span>
        </label>
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            id="location-selector"
            value={selectedLocationId}
            onChange={handleLocationChange}
            className="w-full px-4 py-3 rounded-xl font-inter shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent hover:border-accent focus-visible:z-10 border border-[var(--color-border)] pr-10 text-center"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 var(--color-footer-shadow, rgba(21,21,21,0.06))',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              fontSize: '1.08rem',
              fontWeight: 600,
              minHeight: '48px',
              letterSpacing: '0.01em',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            aria-describedby="footer-location-helper"
          >
            <option value="auto">
              {isAutoMode && nearestLocationId
                ? `\uD83C\uDFAF Auto-Detected: ${currentLocation.name}`
                : '\uD83C\uDFE2 Auto (HQ - Wellington St.)'}
            </option>
            {activeLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.isPrimary ? '(HQ)' : ''}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            focusable="false"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--color-on-surface-muted)',
            }}
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p id="footer-location-helper" className="sr-only">
          Select your preferred Roma Mart location to see relevant contact information
        </p>

        <div
          className="mt-2 text-xs font-inter text-center"
          style={{ color: 'var(--color-on-footer-subtle)', width: '100%' }}
        >
          {isAutoMode ? (
            nearestLocationId ? (
              <span>
                {'\u2713'} Nearest store: <strong>{currentLocation.name}</strong>
              </span>
            ) : (
              <span>Defaulting to headquarters. Enable location for nearest store.</span>
            )
          ) : (
            <span>
              {'\u2713'} Selected: <strong>{currentLocation.name}</strong>
            </span>
          )}
          <div className="mt-8 flex justify-center">
            <LocationButton
              ariaLabel="Detect Nearest Store"
              onClick={() => {
                setSelectedLocationId('auto');
              }}
            >
              Detect Nearest Store
            </LocationButton>
          </div>
        </div>

        <div className="mt-6">
          <CurrentLocalTime location={currentLocation} />
        </div>
      </div>
    </div>
  );
}
