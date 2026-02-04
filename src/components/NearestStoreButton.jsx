/**
 * Find Nearest Store Button
 * Uses Geolocation API and centralized location data
 */

import React, { useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';

const NearestStoreButton = ({ onLocationFound, className = '', style: customStyle = {}, disabled: customDisabled = false }) => {
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();
  const { showSuccess, showError } = useToast();
  const disabled = customDisabled || loading;

  useEffect(() => {
    if (location) {
      // Pass the position object back to parent for geo-sorting
      if (onLocationFound) {
        onLocationFound({
          coords: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        });
      }
      
      showSuccess(`Location found! Sorting stores by distance...`);
    }
  }, [location, onLocationFound, showSuccess]);

  useEffect(() => {
    if (error) {
      showError(`Location error: ${error}`);
    }
  }, [error, showError]);

  if (!canUseGeolocation) {
    return null; // Don't show button if geolocation not supported
  }

  return (
    <button
      type="button"
      onClick={getCurrentLocation}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold font-inter transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent', transform: 'translateZ(0)', backgroundColor: 'var(--color-primary)', color: 'var(--color-accent)', ...customStyle }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1.05) translateZ(0)')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1) translateZ(0)')}
    >
      {loading ? (
        <>
          <Loader size={20} className="animate-spin" />
          Looking for you...
        </>
      ) : (
        <>
          <MapPin size={20} />
          Update location
        </>
      )}
    </button>
  );
};

export default NearestStoreButton;
