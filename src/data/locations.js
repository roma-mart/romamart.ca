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

import { getAssetUrl, getEnvVar } from '../utils/getAssetUrl.js';

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
  CONVENIENCE_STORE: 'convenience_store', // Full-service Roma Mart
  MINIMART: 'minimart', // Unattended vending-based mini location
  VENDING_MACHINE: 'vending_machine', // Single vending machine
  ATM_STANDALONE: 'atm_standalone', // Standalone ATM location
  KIOSK: 'kiosk', // Small retail kiosk
  POPUP: 'popup', // Temporary popup location
  COMING_SOON: 'coming_soon', // Announced but not open yet
};

// All locations data
export const LOCATIONS = [
  {
    // === BASIC INFO ===
    id: 'loc-wellington-001',
    type: LOCATION_TYPES.CONVENIENCE_STORE,
    name: 'Roma Mart Convenience',
    shortName: 'Roma Mart 001',
    isPrimary: true, // Featured on homepage, HQ address
    status: 'open', // open | closed | coming_soon | temporarily_closed

    // === ADDRESS ===
    address: {
      street: '3-189 Wellington Street',
      city: 'Sarnia',
      province: 'ON',
      postalCode: 'N7T 1G6',
      country: 'Canada',
      formatted: '3-189 Wellington Street, Sarnia, ON  N7T 1G6',
    },

    // === GOOGLE INTEGRATION ===
    google: {
      placeId: 'ChIJCfo3t6SdJYgRIQVbpCppKmY',
      mapLink: buildGoogleMapsLink('ChIJCfo3t6SdJYgRIQVbpCppKmY', '3-189 Wellington Street, Sarnia, ON N7T 1G6'),
      embedUrl: MAPS_EMBED_KEY
        ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_EMBED_KEY}&q=place_id:ChIJCfo3t6SdJYgRIQVbpCppKmY&zoom=15`
        : null,
      rating: null, // Can be manually updated or fetched
      reviewCount: null,
      coordinates: {
        lat: 42.970389,
        lng: -82.404589,
      },
    },

    // === CONTACT ===
    contact: {
      phone: '+1 (382) 342-2000',
      email: 'contact@romamart.ca',
      whatsapp: null, // Optional
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
        Sunday: '8:30 AM - 9:00 PM',
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
      ],
    },
    // IMPORTANT:
    // - The 'services' array below is the single source of truth (SSOT) for which services are available at this location.
    // === SERVICES AVAILABLE ===
    services: [
      'svc-atm-001',
      'svc-bitcoin-atm-001',
      'svc-rocafe-001',
      'svc-halal-meat-001',
      'svc-printing-services-001',
      'svc-package-pickup-dropoff-001',
      'svc-money-transfer-001',
      'svc-gift-cards-001',
      'svc-perfumes-fragrances-001',
      'svc-tobacco-vape-001',
      'svc-lottery-001',
      'svc-canadian-products-001',
      'svc-international-products-001',
      'svc-pantry-essentials-groceries-001',
      'svc-snacks-confectionery-001',
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
      { name: 'Parking', value: true },
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
      exterior: [getAssetUrl('/images/romamart-opening2.png'), getAssetUrl('/images/romamart-opening3.png')],
      // Array of interior photos
      interior: [
        getAssetUrl('/images/romamart-interior1.png'),
        getAssetUrl('/images/romamart-interior2.png'),
        getAssetUrl('/images/romamart-interior3.png'),
        getAssetUrl('/images/romamart-interior4.png'),
      ],
      // thumbnail
      thumbnail: getAssetUrl('/images/romamart-interior1.png'), // Small version for cards
    },

    // === METADATA ===
    metadata: {
      openedDate: '2025-11-28', // Store opening date YYYY-MM-DD
      squareFootage: 2000,
      employeeCount: 5,
      isHeadquarters: true, // Official business address
      acceptsCrypto: true,
      languages: ['English', 'Hindi', 'Urdu'],
    },
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
  return LOCATIONS.find((loc) => loc.isPrimary) || LOCATIONS[0];
};

// Default export: just the data array and type constants
export default { LOCATIONS, LOCATION_TYPES };
