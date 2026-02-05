/**
 * Amenity Feature Mapping Configuration
 *
 * Centralized mapping between location.features keys and schema.org LocationFeatureSpecification names.
 * This ensures consistent amenity representation across all schemas and enables fully dynamic feature handling.
 *
 * SSOT for amenity schema generation - when adding new features to locations.js,
 * simply add the mapping here and all schemas will automatically include it.
 *
 * @since February 5, 2026
 */

/**
 * Maps location.features keys to human-readable schema.org amenity names
 *
 * Schema.org and Google don't prescribe specific amenity names, so we use
 * clear, descriptive names that align with common industry standards.
 *
 * Add new mappings here when adding features to locations.js.
 */
export const AMENITY_FEATURE_MAP = {
  // Connectivity
  wifi: 'Free WiFi',

  // Accessibility
  wheelchairAccessible: 'Wheelchair Accessible',

  // Parking
  parking: 'Parking Available',

  // Facilities
  restroom: 'Public Restroom',
  seating: 'Indoor Seating',
  outdoorSeating: 'Outdoor Seating',

  // Service Options
  driveThrough: 'Drive-Through',
  deliveryAvailable: 'Delivery Available',

  // Add more as needed when extending location.features
  // airConditioning: 'Air Conditioning',
  // petFriendly: 'Pet Friendly',
  // smokingArea: 'Smoking Area',
  // atm: 'ATM On-Site',
  // etc.
};

/**
 * Build schema.org amenityFeature array from location.features object
 *
 * Dynamically generates LocationFeatureSpecification entries for all
 * enabled features in the location data.
 *
 * @param {Object} features - location.features object from locations.js
 * @param {boolean} features.wifi - WiFi availability
 * @param {boolean} features.parking - Parking availability
 * @param {boolean} features.wheelchairAccessible - Wheelchair accessibility
 * @param {boolean} features.restroom - Public restroom availability
 * @param {boolean} features.seating - Indoor seating availability
 * @param {boolean} features.outdoorSeating - Outdoor seating availability
 * @param {boolean} features.driveThrough - Drive-through availability
 * @param {boolean} features.deliveryAvailable - Delivery service availability
 * @returns {Array<Object>} Array of LocationFeatureSpecification objects
 *
 * @example
 * const features = { wifi: true, parking: true, restroom: false };
 * const amenities = buildAmenityFeatures(features);
 * // Returns:
 * // [
 * //   { @type: 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
 * //   { @type: 'LocationFeatureSpecification', name: 'Parking Available', value: true }
 * // ]
 */
export function buildAmenityFeatures(features) {
  if (!features || typeof features !== 'object') {
    return [];
  }

  const amenities = [];

  // Iterate through all features and build LocationFeatureSpecification for enabled ones
  for (const [featureKey, featureValue] of Object.entries(features)) {
    // Only include features that:
    // 1. Have a mapping in AMENITY_FEATURE_MAP
    // 2. Have a boolean value of true
    if (AMENITY_FEATURE_MAP[featureKey] && featureValue === true) {
      amenities.push({
        '@type': 'LocationFeatureSpecification',
        name: AMENITY_FEATURE_MAP[featureKey],
        value: true
      });
    }
  }

  return amenities;
}

/**
 * Get human-readable amenity name for a feature key
 *
 * @param {string} featureKey - Feature key from location.features
 * @returns {string|null} Human-readable amenity name or null if not mapped
 *
 * @example
 * getAmenityName('wifi') // Returns: 'Free WiFi'
 * getAmenityName('unknownFeature') // Returns: null
 */
export function getAmenityName(featureKey) {
  return AMENITY_FEATURE_MAP[featureKey] || null;
}

/**
 * Check if a feature key is recognized/mapped
 *
 * @param {string} featureKey - Feature key to check
 * @returns {boolean} True if feature is in AMENITY_FEATURE_MAP
 *
 * @example
 * isRecognizedFeature('wifi') // Returns: true
 * isRecognizedFeature('customFeature') // Returns: false
 */
export function isRecognizedFeature(featureKey) {
  return featureKey in AMENITY_FEATURE_MAP;
}

/**
 * Get all supported amenity feature keys
 *
 * @returns {Array<string>} Array of all feature keys with mappings
 *
 * @example
 * getSupportedFeatures()
 * // Returns: ['wifi', 'wheelchairAccessible', 'parking', 'restroom', ...]
 */
export function getSupportedFeatures() {
  return Object.keys(AMENITY_FEATURE_MAP);
}
