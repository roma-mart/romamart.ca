
/**
 * Centralized Location Management System
 * 
 * All Roma Mart locations (stores, vending machines, ATMs, minimarts, etc.)
 * are managed here. Add new locations by copying the structure below.
 * 
 * Zero external dependencies - fully self-contained.
 *
 * IMPORTANT:
 * All dynamic location info for non-HQ stores must ONLY be sourced from this file and its helpers.
 * No hardcoded or duplicated location data is allowed in any page or component.
 * This ensures a single source of truth for all location-dependent info and future scalability.
 */

import { getAssetUrl, getEnvVar } from "../utils/getAssetUrl.js";

const MAPS_EMBED_KEY = getEnvVar('VITE_GOOGLE_PLACES_API_KEY');
const buildGoogleMapsLink = (placeId, address) => {
  const query = encodeURIComponent(address || 'Roma Mart');
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};
// Location type constants
export const LOCATION_TYPES = {
  CONVENIENCE_STORE: 'convenience_store',    // Full-service Roma Mart
  MINIMART: 'minimart',                      // Unattended vending-based mini location
  VENDING_MACHINE: 'vending_machine',        // Single vending machine
  ATM_STANDALONE: 'atm_standalone',          // Standalone ATM location
  KIOSK: 'kiosk',                            // Small retail kiosk
  POPUP: 'popup',                            // Temporary popup location
  COMING_SOON: 'coming_soon'                 // Announced but not open yet
};

// All locations data
export const LOCATIONS = [
  {
        // === BASIC INFO ===
    id: 'loc-wellington-001',
    type: LOCATION_TYPES.CONVENIENCE_STORE,
    name: 'Roma Mart Convenience',
    shortName: 'Roma Mart 001',
    isPrimary: true,                         // Featured on homepage, HQ address
    status: 'open',                          // open | closed | coming_soon | temporarily_closed
    
    // === ADDRESS ===
    address: {
      street: '3-189 Wellington Street',
      city: 'Sarnia',
      province: 'ON',
      postalCode: 'N7T 1G6',
      country: 'Canada',
      formatted: '3-189 Wellington Street, Sarnia, ON  N7T 1G6'
    },
    
    // === GOOGLE INTEGRATION ===
    google: {
      placeId: 'ChIJCfo3t6SdJYgRIQVbpCppKmY',
      mapLink: buildGoogleMapsLink('ChIJCfo3t6SdJYgRIQVbpCppKmY', '3-189 Wellington Street, Sarnia, ON N7T 1G6'),
      embedUrl: MAPS_EMBED_KEY
        ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_EMBED_KEY}&q=place_id:ChIJCfo3t6SdJYgRIQVbpCppKmY&zoom=15`
        : null,
      rating: null,                          // Can be manually updated or fetched
      reviewCount: null,
      coordinates: {
        lat: 42.970389,
        lng: -82.404589
      }
    },
    
    // === CONTACT ===
    contact: {
      phone: '+1 (382) 342-2000',
      email: 'contact@romamart.ca',
      whatsapp: null                         // Optional
    },
    
    // === HOURS ===
    hours: {
      timezone: 'America/Toronto',
      // Per-day hours (source of truth for display grouping)
      daily: {
        Monday: '8:30 AM - 9:00 PM',
        Tuesday: '8:30 AM - 9:00 PM',
        Wednesday: '8:30 AM - 9:00 PM',
        Thursday: '8:30 AM - 9:00 PM',
        Friday: '3:00 PM - 9:00 PM',
        Saturday: '8:30 AM - 9:00 PM',
        Sunday: '8:30 AM - 9:00 PM'
      },
      // Backward-compatible fields for helpers still using legacy schema
      weekdays: '8:30 AM - 9:00 PM',
      weekends: '8:30 AM - 9:00 PM',
      display: 'Mon-Thu, Sat-Sun: 8:30 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM',
      is24Hours: false,
      isSeasonal: false,
      // Special hours/exceptions (optional)
      exceptions: [
        // Example: { date: '2025-12-25', hours: 'Closed', reason: 'Christmas Day' }
      ]
    },
    // IMPORTANT:
    // - The 'services' array below is the single source of truth (SSOT) for which services are available at this location.
    // === SERVICES AVAILABLE ===
    services: [
      'atm',
      'bitcoin_atm',
      'rocafe',
      'halal_meat',
      'printing',
      'package_services',
      'money_transfer',
      'gift_cards',
      'perfumes',
      'tobacco',
      'lottery',
      'canadian_products',
      'international_products',
      'groceries',
      'snacks',
    ],
    
    // - Do NOT use serviceOverrides or menuOverrides to add new services/menu items to a location. Only use them to override status/availability of items already present in 'services'.
    // - Always check 'services' first, then apply overrides if present.
    // === OVERRIDES ===
    serviceOverrides: {
      // Example: Override ATM status for this location
      //'atm': {
      //  status: 'temporarily_closed',
      //  availableAt: ['loc-wellington-001'],
      //  availability: 'store_hours'
      //}
      // Add more service overrides as needed
    },
    menuOverrides: {
      // Example: Override Bubble Tea status for this location
      //'signature-bubble-tea': {
      //  status: 'unavailable',
      //  availableAt: ['loc-wellington-001'],
      //  availability: 'store_hours'
      // },
      // Add more menu overrides as needed
    },
    // === AMENITIES ===
    // Google-recognized amenities for LocalBusiness schema
    // These names match Google Business Profile attributes and schema.org LocationFeatureSpecification
    // When locations API is implemented, return this exact structure
    amenities: [
      { name: 'Free Wi-Fi', value: true },
      { name: 'Wheelchair-accessible entrance', value: true },
      { name: 'Wheelchair-accessible parking', value: true },
      { name: 'Restroom', value: true },
      { name: 'Parking', value: true }
      // Other Google Business Profile amenities to consider:
      // { name: 'Gender-neutral restroom', value: true },
      // { name: 'In-store pickup', value: true },
      // { name: 'In-store shopping', value: true },
      // { name: 'Same-day delivery', value: true },
      // { name: 'Debit cards', value: true },
      // { name: 'Credit cards', value: true },
      // { name: 'NFC mobile payments', value: true }
    ],
    // === PHOTOS ===
    photos: {
      // Main exterior shot
      primary: getAssetUrl('/images/romamart-opening1.png'),                         
      
      // Array of exterior photos
      exterior: [
        getAssetUrl('/images/romamart-opening2.png'), 
        getAssetUrl('/images/romamart-opening3.png'), 
      ], 
        // Array of interior photos
      interior: [
        getAssetUrl('/images/romamart-interior1.png'), 
        getAssetUrl('/images/romamart-interior2.png'), 
        getAssetUrl('/images/romamart-interior3.png'),
        getAssetUrl('/images/romamart-interior4.png' )
      ],  
      // thumbnail
      thumbnail: getAssetUrl('/images/romamart-interior1.png') // Small version for cards
    },
    
    
    // === METADATA ===
    metadata: {
      openedDate: '2025-11-28',              // Store opening date YYYY-MM-DD
      squareFootage: 2000,
      employeeCount: 5,
      isHeadquarters: true,                  // Official business address
      acceptsCrypto: true,
      languages: ['English', 'Hindi', 'Urdu'] 
    }
  },
  
  // Add more locations here by copying the structure above
  // Example for second location:
  /*
  {
    id: 'loc-lakeshore-002',
    type: LOCATION_TYPES.CONVENIENCE_STORE,
    name: 'Roma Mart Lakeshore',
    shortName: 'Lakeshore',
    isPrimary: false,
    status: 'coming_soon',
    address: {
      street: '123 Lakeshore Blvd',
      city: 'Sarnia',
      province: 'ON',
      postalCode: 'N7T 2A1',
      country: 'Canada',
      formatted: '123 Lakeshore Blvd, Sarnia, ON N7T 2A1'
    },
    // ... rest of structure
  }
  */
];

// === HELPER FUNCTIONS ===

/**
 * Get the primary (featured) location
 * @returns {Object} Primary location object
 */
export const getPrimaryLocation = () => {
  return LOCATIONS.find(loc => loc.isPrimary) || LOCATIONS[0];
};

/**
 * Get all active (open) locations
 * @returns {Array} Array of open locations
 */
export const getActiveLocations = () => {
  return LOCATIONS.filter(loc => loc.status === 'open');
};

/**
 * Get locations by type
 * @param {string} type - Location type from LOCATION_TYPES
 * @returns {Array} Filtered locations
 */
export const getLocationsByType = (type) => {
  return LOCATIONS.filter(loc => loc.type === type);
};

/**
 * Get location by ID
 * @param {string} id - Location ID
 * @returns {Object|null} Location object or null
 */
export const getLocationById = (id) => {
  return LOCATIONS.find(loc => loc.id === id) || null;
};

/**
 * Get all convenience stores
 * @returns {Array} Array of convenience store locations
 */
export const getConvenienceStores = () => {
  return getLocationsByType(LOCATION_TYPES.CONVENIENCE_STORE);
};

/**
 * Get all vending machines
 * @returns {Array} Array of vending machine locations
 */
export const getVendingMachines = () => {
  return getLocationsByType(LOCATION_TYPES.VENDING_MACHINE);
};

/**
 * Get all standalone ATMs
 * @returns {Array} Array of standalone ATM locations
 */
export const getStandaloneATMs = () => {
  return getLocationsByType(LOCATION_TYPES.ATM_STANDALONE);
};

/**
 * Get locations with specific service
 * @param {string} service - Service name (e.g., 'bitcoin_atm')
 * @returns {Array} Locations offering that service
 */
export const getLocationsByService = (service) => {
  return LOCATIONS.filter(loc => 
    loc.services && loc.services.includes(service)
  );
};

/**
 * Get coming soon locations
 * @returns {Array} Array of upcoming locations
 */
export const getComingSoonLocations = () => {
  return LOCATIONS.filter(loc => loc.status === 'coming_soon');
};

/**
 * Get headquarters location
 * @returns {Object|null} HQ location
 */
export const getHeadquarters = () => {
  return LOCATIONS.find(loc => loc.metadata?.isHeadquarters) || getPrimaryLocation();
};

/**
 * Count total locations
 * @returns {number} Total location count
 */
export const getTotalLocationCount = () => {
  return LOCATIONS.length;
};

/**
 * Count active locations
 * @returns {number} Active location count
 */
export const getActiveLocationCount = () => {
  return getActiveLocations().length;
};

/**
 * Check if location has specific amenity
 * @param {Object} location - Location object
 * @param {string} amenityName - Amenity name (e.g., 'Free Wi-Fi', 'Parking')
 * @returns {boolean} Has amenity
 */
export const hasAmenity = (location, amenityName) => {
  return location.amenities?.some(amenity =>
    amenity.name === amenityName && amenity.value === true
  ) || false;
};

/**
 * Check if location offers specific service
 * @param {Object} location - Location object
 * @param {string} service - Service name
 * @returns {boolean} Offers service
 */
export const hasService = (location, service) => {
  return location.services?.includes(service) || false;
};

/**
 * Get location status display text
 * @param {Object} location - Location object
 * @returns {string} Status text
 */
export const getStatusText = (location) => {
  const statusMap = {
    'open': 'Open Now',
    'closed': 'Closed',
    'coming_soon': 'Coming Soon',
    'temporarily_closed': 'Temporarily Closed'
  };
  return statusMap[location.status] || 'Unknown';
};

/**
 * Get formatted address for display
 * @param {Object} location - Location object
 * @returns {string} Formatted address
 */
export const getFormattedAddress = (location) => {
  return location.address?.formatted || 
         `${location.address?.street}, ${location.address?.city}, ${location.address?.province}`;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Get locations sorted by distance from user's coordinates
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {Array} locations - Array of location objects (optional, defaults to all active)
 * @returns {Array} Locations with distance property, sorted nearest first
 */
export const getLocationsByDistance = (userLat, userLng, locations = null) => {
  const locs = locations || getActiveLocations();
  
  const locationsWithDistance = locs.map(location => {
    const coords = location.google?.coordinates;
    if (!coords) {
      return { ...location, distance: Infinity };
    }
    
    const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
    return { ...location, distance };
  });
  
  // Sort by distance (closest first), with HQ prioritized if distances are equal
  return locationsWithDistance.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) < 0.1) {
      // If distances are very close (within 100m), prioritize HQ
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
    }
    return a.distance - b.distance;
  });
};

/**
 * Get all locations sorted by proximity to user (if coordinates available)
 * Falls back to all active locations if no coordinates provided
 * @param {Object} params - Parameters object
 * @param {Object} params.userCoords - User coordinates {latitude, longitude}
 * @param {Array} params.locations - Array of location objects (optional, defaults to active)
 * @returns {Array} Sorted locations with distance property
 */
export const getPreferredLocations = ({ userCoords, locations = null } = {}) => {
  const locs = locations || getActiveLocations();
  
  // If no user coordinates, return all active locations with HQ first
  if (!userCoords?.latitude || !userCoords?.longitude) {
    return locs.sort((a, b) => {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      return 0;
    });
  }
  
  // Sort by distance from user's location
  return getLocationsByDistance(userCoords.latitude, userCoords.longitude, locs);
};

/**
 * Get the preferred (closest) location for the user
 * @param {Object} params - Parameters object
 * @param {Object} params.userCoords - User coordinates {latitude, longitude}
 * @param {Array} params.locations - Array of location objects (optional, defaults to active)
 * @returns {Object|null} Preferred location object or null if no locations available
 */
export const getPreferredLocation = ({ userCoords, locations = null } = {}) => {
  const preferred = getPreferredLocations({ userCoords, locations });
  return preferred.length > 0 ? preferred[0] : null;
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === Infinity || distance === null || distance === undefined) {
    return '';
  }
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  
  return `${distance.toFixed(1)}km away`;
};

/**
 * Check if a location is currently open based on hours
 * @param {Object} location - Location object with hours property
 * @returns {boolean} True if currently open, false if closed
 */
export const isLocationOpenNow = (location) => {
  // If location status is not 'open', it's definitely closed
  if (location.status !== 'open') {
    return false;
  }

  // If 24 hours, always open
  if (location.hours?.is24Hours) {
    return true;
  }

  // Get current time in location's timezone
  const now = new Date();
  const timeString = location.hours?.timezone 
    ? now.toLocaleTimeString('en-US', { 
        timeZone: location.hours.timezone, 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : now.toTimeString().slice(0, 5);

  const [currentHour, currentMinute] = timeString.split(':').map(Number);
  const currentMinutes = currentHour * 60 + currentMinute;

  // Parse hours (e.g., "7:00 AM - 10:00 PM")
  // Use daily schedule as source of truth, fallback to legacy weekdays/weekends
  const dayName = now.toLocaleString('en-US', { weekday: 'long', timeZone: location.hours?.timezone });
  const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
  let hoursString = location.hours?.daily?.[dayName];
  if (!hoursString) {
    hoursString = isWeekend ? location.hours?.weekends : location.hours?.weekdays;
  }

  if (!hoursString) {
    return false; // No hours defined, assume closed
  }

  // Parse time range (e.g., "7:00 AM - 10:00 PM")
  const match = hoursString.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    return false; // Can't parse hours
  }

  let [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = match; // eslint-disable-line prefer-const
  openHour = parseInt(openHour);
  closeHour = parseInt(closeHour);
  openMin = parseInt(openMin);
  closeMin = parseInt(closeMin);

  // Convert to 24-hour format
  if (openPeriod.toUpperCase() === 'PM' && openHour !== 12) openHour += 12;
  if (openPeriod.toUpperCase() === 'AM' && openHour === 12) openHour = 0;
  if (closePeriod.toUpperCase() === 'PM' && closeHour !== 12) closeHour += 12;
  if (closePeriod.toUpperCase() === 'AM' && closeHour === 12) closeHour = 0;

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

// Export all for easy importing
export default {
  LOCATIONS,
  LOCATION_TYPES,
  getPrimaryLocation,
  getActiveLocations,
  getLocationsByType,
  getLocationById,
  getConvenienceStores,
  getVendingMachines,
  getStandaloneATMs,
  getLocationsByService,
  getComingSoonLocations,
  getHeadquarters,
  getTotalLocationCount,
  getActiveLocationCount,
  hasAmenity,
  hasService,
  getStatusText,
  getFormattedAddress,
  calculateDistance,
  getLocationsByDistance,
  getPreferredLocations,
  getPreferredLocation,
  formatDistance,
  isLocationOpenNow
};
