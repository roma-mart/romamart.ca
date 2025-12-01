/**
 * Find Nearest Store Button
 * Uses Geolocation API to calculate distance to stores
 */

import React, { useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { useGeolocation } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // Returns distance in kilometers
};

// Helper function to get store coordinates
// In production, these would be in your STORE_DATA
const getStoreCoordinates = (store) => {
  // Wellington Street, Sarnia coordinates
  if (store.name?.includes('Wellington')) {
    return { lat: 42.970389, lng: -82.404589 };
  }
  return null;
};

const NearestStoreButton = ({ locations, onNearestFound, className = '' }) => {
  const { getCurrentLocation, location, loading, error, canUseGeolocation } = useGeolocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (location && locations) {
      // Calculate distances for all locations
      const locationsWithDistance = locations.map(store => {
        // Assuming store has coordinates (you'll need to add these)
        const storeCoords = getStoreCoordinates(store);
        if (!storeCoords) return { ...store, distance: Infinity };

        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          storeCoords.lat,
          storeCoords.lng
        );

        return { ...store, distance };
      });

      // Find nearest
      const nearest = locationsWithDistance.reduce((prev, curr) => 
        curr.distance < prev.distance ? curr : prev
      );
      
      if (onNearestFound) {
        onNearestFound(nearest);
      }

      showToast(`Nearest store: ${nearest.name} (${nearest.distance.toFixed(1)} km away)`, 'success');
    }
  }, [location, locations, onNearestFound, showToast]);

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
