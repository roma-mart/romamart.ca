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
   * NRS Plus Online Ordering System (PRIMARY)
   * All delivery platforms integrated on this page
   * Single source of truth for all ordering CTAs site-wide
   * @production Update to actual NRS store URL when available
   */
  nrs: 'https://nrsplus.com/orders/your-store-link',
  
  /**
   * UberEats ordering URL
   * - For production: Use restaurant-specific UberEats link
   * - For staging/testing: Generic UberEats homepage
   * @deprecated Use NRS system instead (integrates all platforms)
   */
  uberEats: 'https://www.ubereats.com/',
  
  /**
   * Skip the Dishes ordering URL
   * @placeholder Update with actual restaurant link
   * @deprecated Use NRS system instead (integrates all platforms)
   */
  skipTheDishes: 'https://www.skipthedishes.com/',
  
  /**
   * DoorDash ordering URL
   * @placeholder Update with actual restaurant link
   * @deprecated Use NRS system instead (integrates all platforms)
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
 * 
 * @param {string} service - Service type ('nrs', 'ubereats', 'skipthedishes', 'doordash', 'phone')
 * @param {Object} location - Location object (optional, for future use)
 * @returns {string} Ordering URL
 * 
 * @note NRS is now the default - it integrates all delivery platforms
 */
export const getOrderingUrl = (service = 'nrs', _location = null) => {
  const serviceLower = service.toLowerCase().replace(/\s+/g, '');
  
  // Future: Add location-specific URL logic
  // if (_location && _location.orderingUrls && _location.orderingUrls[serviceLower]) {
  //   return _location.orderingUrls[serviceLower];
  // }
  
  return ORDERING_CONFIG[serviceLower] || ORDERING_CONFIG.nrs;
};

/**
 * Default ordering service
 * Used when user hasn't selected a preferred service
 */
export const DEFAULT_ORDERING_SERVICE = 'nrs';
