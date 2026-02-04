/**
 * Custom hook to fetch live opening hours from Google Places API
 * 
 * Uses the Place ID to fetch current hours and status from Google Maps.
 * Results are cached to minimize API calls and respect rate limits.
 * 
 * Includes circuit breaker protection to stop API calls if quota is exceeded,
 * automatically falling back to static hours.
 * 
 * @module hooks/useGooglePlaceHours
 */

import { useState, useEffect, useCallback } from 'react';
import { circuitBreakers } from '../utils/apiCircuitBreaker';

// Extract API key from environment variable
// This key powers: Places API (New), Google Maps Embed API, Maps JavaScript API
// SECURITY: In Google Cloud Console, restrict key to only these APIs
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
  if (import.meta.env.DEV) {
    console.warn('Google Places API key not configured. Set VITE_GOOGLE_PLACES_API_KEY environment variable for live hours integration.');
  }
}

// Cache duration from env or default to 1 hour
// Validate parsed value using !Number.isNaN to allow 0 (disable caching)
const parsedCacheDuration = parseInt(import.meta.env.VITE_PLACES_CACHE_DURATION, 10);
const CACHE_DURATION = !Number.isNaN(parsedCacheDuration) ? parsedCacheDuration : 60 * 60 * 1000;

// In-memory cache to avoid redundant API calls
const hoursCache = new Map();

/**
 * Fetches place details including opening hours from Google Places API
 * 
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Place details with opening hours
 */
async function fetchPlaceDetails(placeId) {
  if (!placeId) {
    throw new Error('Place ID is required');
  }

  // Check circuit breaker first - if quota exceeded, return null immediately
  if (!circuitBreakers.googlePlaces.shouldAttemptCall()) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Circuit breaker is open. API quota likely exceeded. Using fallback hours only.');
    }
    return null;
  }

  // Fail fast if API key not configured
  if (!GOOGLE_API_KEY) {
    throw new Error('Google Places API key not configured (VITE_GOOGLE_PLACES_API_KEY)');
  }

  // Using Places API (New) which supports client-side requests
  // https://developers.google.com/maps/documentation/places/web-service/place-details
  const fields = 'opening_hours,current_opening_hours,business_status,displayName,formattedAddress,utcOffsetMinutes';

  // NOTE: API key in URL is intentional. Google Places API (New) requires key in request.
  // SECURITY: Restrict key in Google Cloud Console to: Places API, Embed API, JavaScript API
  // Set HTTP referrer restrictions to limit abuse. See: https://console.cloud.google.com/
  const url = `https://places.googleapis.com/v1/places/${placeId}?key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': fields
      }
    });
    
    if (!response.ok) {
      // Record the failure for circuit breaker
      circuitBreakers.googlePlaces.recordFailure(response.status);

      if (import.meta.env.DEV) {
        console.warn(`Places API error (${response.status}): ${response.statusText}`);
      }

      // Return null - component will use fallback hours
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching place details:', error);
    }
    return null;
  }
}

/**
 * Parses Google opening hours into simplified format
 * 
 * @param {Object} placeData - Google place data with opening_hours
 * @returns {Object} Parsed hours data
 */
function parseOpeningHours(placeData) {
  if (!placeData) {
    return null;
  }

  // Handle both new API and legacy API formats
  const openingHours = placeData.regularOpeningHours || placeData.currentOpeningHours || placeData.opening_hours || placeData.openingHours;
  
  if (!openingHours) {
    return null;
  }

  // New API format
  const weekdayDescriptions = openingHours.weekdayDescriptions || openingHours.weekday_text;
  const openNow = openingHours.openNow ?? openingHours.open_now;
  const periods = openingHours.periods;

  // Convert weekday_text array to readable format
  const formatted = {
    isOpenNow: openNow ?? false,
    weekdayText: weekdayDescriptions || [],
    periods: periods || [],
    display: formatHoursDisplay(weekdayDescriptions)
  };

  return formatted;
}

/**
 * Formats weekday hours into display-friendly strings
 * 
 * @param {Array<string>} weekdayText - Google's weekday_text array
 * @returns {Object} Formatted hours for weekdays and weekends
 */
function formatHoursDisplay(weekdayText) {
  if (!weekdayText || weekdayText.length === 0) {
    return {
      weekdays: 'Hours not available',
      weekends: 'Hours not available',
      full: 'Hours not available'
    };
  }

  // weekdayText is an array like:
  // ["Monday: 8:00 AM – 9:00 PM", "Tuesday: 8:00 AM – 9:00 PM", ...]
  // Note: Google Places API typically returns days starting with Monday,
  // but we parse day names explicitly for resilience to format variations.
  
  const dayMap = weekdayText.map(text => {
    // Validate split format to handle edge cases (colon may appear multiple times)
    const colonIndex = text.indexOf(': ');
    if (colonIndex === -1) {
      // Fallback for unexpected format
      return { day: text, hours: 'Closed' };
    }
    const day = text.substring(0, colonIndex);
    const hours = text.substring(colonIndex + 2).trim() || 'Closed';
    return { day, hours };
  });

  // Validate we have 7 days (resilience check)
  if (dayMap.length !== 7) {
    if (import.meta.env.DEV) {
      console.warn('Google Places API returned unexpected number of days:', dayMap.length);
    }
  }

  // Extract Monday-Friday by day name (resilient to API format changes)
  const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekdayHours = dayMap
    .filter(d => weekdayNames.includes(d.day))
    .map(d => d.hours);
  
  // Extract Saturday-Sunday by day name
  const weekendNames = ['Saturday', 'Sunday'];
  const weekendHours = dayMap
    .filter(d => weekendNames.includes(d.day))
    .map(d => d.hours);

  // Check if all weekdays have same hours
  const sameWeekdayHours = weekdayHours.every(h => h === weekdayHours[0]);
  const sameWeekendHours = weekendHours.every(h => h === weekendHours[0]);

  // Check if ALL days (Mon–Sun) have identical hours using validated dayMap
  const allSame = dayMap.length > 0 && dayMap.every(entry => entry.hours === dayMap[0].hours);

  return {
    weekdays: sameWeekdayHours ? weekdayHours[0] : 'Varies',
    weekends: sameWeekendHours ? weekendHours[0] : 'Varies',
    full: weekdayText,
    allSame
  };
}

/**
 * Custom hook to fetch and cache Google Place hours
 * 
 * @param {string} placeId - Google Place ID
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable/disable fetching (default: true)
 * @param {number} options.cacheDuration - Cache duration in ms (default: 1 hour)
 * @returns {Object} { hours, isLoading, error, refetch, isOpenNow }
 */
export function useGooglePlaceHours(placeId, options = {}) {
  const { enabled = true, cacheDuration = CACHE_DURATION } = options;

  const [hours, setHours] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenNow, setIsOpenNow] = useState(null);

  const fetchHours = useCallback(async () => {
    if (!placeId || !enabled) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cached = hoursCache.get(placeId);
    if (cached && (Date.now() - cached.timestamp) < cacheDuration) {
      setHours(cached.hours);
      setIsOpenNow(cached.isOpenNow);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const placeDetails = await fetchPlaceDetails(placeId);
      
      if (!placeDetails) {
        // API failed, use fallback
        setIsLoading(false);
        return;
      }
      
      const parsedHours = parseOpeningHours(placeDetails);
      
      if (!parsedHours) {
        // No hours data available
        setIsLoading(false);
        return;
      }
      
      // Cache the result
      hoursCache.set(placeId, {
        hours: parsedHours,
        isOpenNow: parsedHours?.isOpenNow,
        timestamp: Date.now()
      });

      setHours(parsedHours);
      setIsOpenNow(parsedHours?.isOpenNow);
    } catch (err) {
      setError(err.message);
      if (import.meta.env.DEV) {
        console.error('Failed to fetch place hours:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [placeId, enabled, cacheDuration]);

  useEffect(() => {
    fetchHours();
  }, [fetchHours]);

  return {
    hours,
    isLoading,
    error,
    refetch: fetchHours,
    isOpenNow
  };
}

/**
 * Clears the hours cache (useful for testing or manual refresh)
 */
export function clearHoursCache() {
  hoursCache.clear();
}

/**
 * Get circuit breaker status (for monitoring API quota in dev console)
 * Returns: { isOpen, failureCount, quotaExceeded, timeUntilReset, apiName }
 * 
 * Usage in DevTools Console:
 *   import { getPlacesQuotaStatus } from '@/hooks/useGooglePlaceHours'
 *   console.log(getPlacesQuotaStatus())
 */
export function getPlacesQuotaStatus() {
  return circuitBreakers.googlePlaces.getStatus();
}

/**
 * Manually reset circuit breaker (for testing - dev only)
 */
export function resetPlacesCircuitBreaker() {
  circuitBreakers.googlePlaces.reset();
}

export default useGooglePlaceHours;
