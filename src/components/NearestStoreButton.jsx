/**
 * Find Nearest Store Button
 * Uses Geolocation API and centralized location data
 */

import React, { useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';

const NearestStoreButton = ({ onLocationFound, className = '' }) => {
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();
  const { showToast } = useToast();

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
      
      showToast(`Location found! Sorting stores by distance...`, 'success');
    }
  }, [location, onLocationFound, showToast]);

  useEffect(() => {
    if (error) {
      showToast(`Location error: ${error}`, 'error');
    }
  }, [error, showToast]);

  if (!canUseGeolocation) {
    return null; // Don't show button if geolocation not supported
  }

  return (
    <button
      onClick={getCurrentLocation}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold font-inter transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ backgroundColor: '#E4B340', color: '#020178' }}
    >
      {loading ? (
        <>
          <Loader size={20} className="animate-spin" />
          Finding...
        </>
      ) : (
        <>
          <MapPin size={20} />
          Find Nearest Store
        </>
      )}
    </button>
  );
};

export default NearestStoreButton;
