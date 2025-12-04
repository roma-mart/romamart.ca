/**
 * Ordering Configuration
 * Centralized ordering service URLs and API endpoints
 * 
 * @since December 4, 2025
 */

/**
 * Ordering service URLs
 * Update these when switching between staging/production
 */
export const ORDERING_CONFIG = {
  /**
   * UberEats ordering URL
   * - For production: Use restaurant-specific UberEats link
   * - For staging/testing: Generic UberEats homepage
   */
  uberEats: 'https://www.ubereats.com/',
  
  /**
   * Skip the Dishes ordering URL
   * @placeholder Update with actual restaurant link
   */
  skipTheDishes: 'https://www.skipthedishes.com/',
  
  /**
   * DoorDash ordering URL
   * @placeholder Update with actual restaurant link
   */
  doorDash: 'https://www.doordash.com/',
  
  /**
   * Direct phone ordering
   * @placeholder Update with primary location phone
   */
  phone: 'tel:+1234567890',
};

/**
 * Get ordering URL based on service type and location
 * Future enhancement: Support location-specific URLs
 * 
 * @param {string} service - Service type ('ubereats', 'skipthedishes', 'doordash', 'phone')
 * @param {Object} location - Location object (optional, for future use)
 * @returns {string} Ordering URL
 */
export const getOrderingUrl = (service = 'ubereats', _location = null) => {
  const serviceLower = service.toLowerCase().replace(/\s+/g, '');
  
  // Future: Add location-specific URL logic
  // if (_location && _location.orderingUrls && _location.orderingUrls[serviceLower]) {
  //   return _location.orderingUrls[serviceLower];
  // }
  
  return ORDERING_CONFIG[serviceLower] || ORDERING_CONFIG.uberEats;
};

/**
 * Default ordering service
 * Used when user hasn't selected a preferred service
 */
export const DEFAULT_ORDERING_SERVICE = 'ubereats';
