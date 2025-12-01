/**
 * Centralized Location Management System
 * 
 * All Roma Mart locations (stores, vending machines, ATMs, minimarts, etc.)
 * are managed here. Add new locations by copying the structure below.
 * 
 * Zero external dependencies - fully self-contained.
 */

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
    name: 'Roma Mart Wellington',
    shortName: 'Wellington St.',
    isPrimary: true,                         // Featured on homepage, HQ address
    status: 'open',                          // open | closed | coming_soon | temporarily_closed
    
    // === ADDRESS ===
    address: {
      street: '189-3 Wellington Street',
      city: 'Sarnia',
      province: 'ON',
      postalCode: 'N7T 1G6',
      country: 'Canada',
      formatted: '189-3 Wellington Street, Sarnia, ON N7T 1G6'
    },
    
    // === GOOGLE INTEGRATION ===
    google: {
      placeId: 'ChIJCfo3t6SdJYgRIQVbpCppKmY',
      mapLink: 'https://maps.google.com/?q=place_id:ChIJCfo3t6SdJYgRIQVbpCppKmY',
      embedUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:ChIJCfo3t6SdJYgRIQVbpCppKmY&zoom=15',
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
      weekdays: '7:00 AM - 10:00 PM',
      weekends: '7:00 AM - 10:00 PM',
      display: 'Open Daily 7:00 AM - 10:00 PM',
      is24Hours: false,
      isSeasonal: false,
      // Special hours/exceptions (optional)
      exceptions: [
        // Example: { date: '2025-12-25', hours: 'Closed', reason: 'Christmas Day' }
      ]
    },
    
    // === SERVICES AVAILABLE ===
    services: [
      'atm',
      'bitcoin_atm',
      'rocafe',
      'halal_meat',
      'printing',
      'package_pickup',
      'money_transfer',
      'gift_cards',
      'perfumes',
      'tobacco',
      'lottery'
    ],
    
    // === FEATURES & AMENITIES ===
    features: {
      parking: true,
      parkingSpots: 15,
      wheelchairAccessible: true,
      wifi: false,
      wifiPassword: null,
      restroom: true,
      seating: true,
      seatingCapacity: 8,
      outdoorSeating: false,
      driveThrough: false,
      deliveryAvailable: false
    },
    
    // === PHOTOS ===
    // Use local paths: /romamart.ca/images/locations/wellington/
    photos: {
      primary: null,                         // Main exterior shot
      exterior: [],                          // Array of exterior photos
      interior: [],                          // Array of interior photos
      thumbnail: null                        // Small version for cards
    },
    
    // === METADATA ===
    metadata: {
      openedDate: '2024-01-15',              // Store opening date
      squareFootage: 2500,
      employeeCount: 8,
      isHeadquarters: true,                  // Official business address
      acceptsCrypto: true,
      languages: ['English', 'French', 'Urdu', 'Arabic']
    }
  }
  
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
 * Check if location has specific feature
 * @param {Object} location - Location object
 * @param {string} feature - Feature name
 * @returns {boolean} Has feature
 */
export const hasFeature = (location, feature) => {
  return location.features?.[feature] === true;
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
  hasFeature,
  hasService,
  getStatusText,
  getFormattedAddress,
  calculateDistance,
  getLocationsByDistance,
  formatDistance
};
