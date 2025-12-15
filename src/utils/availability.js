/**
 * Availability Utilities
 * Centralized logic for checking service/menu item availability at a location,
 * including support for overrides and location open status.
 */

/**
 * Checks the effective status of a service at a given location, applying overrides if present.
 * @param {string} serviceId - The service ID to check.
 * @param {object} location - The location object.
 * @param {object} servicesData - The global SERVICES array.
 * @returns {object} { status, availableAt, availability }
 */
export function getServiceStatusAtLocation(serviceId, location, servicesData) {
  // Check if service is available at this location
  if (!location.services.includes(serviceId)) {
    return { status: 'unavailable' };
  }
  // Check for override
  const override = location.serviceOverrides?.[serviceId];
  if (override) return { ...override };
  // Fallback to global service data
  const service = servicesData.find(s => s.id === serviceId);
  if (!service) return { status: 'unavailable' };
  return {
    status: service.status,
    availableAt: service.availableAt,
    availability: service.availability
  };
}

/**
 * Checks the effective status of a menu item at a given location, applying overrides if present.
 * @param {string} menuItemId - The menu item ID to check.
 * @param {object} location - The location object.
 * @param {object} menuData - The global ROCAFE_FULL_MENU array (optional, for legacy support).
 * @param {object} menuItem - The actual menu item object (optional, preferred for API items).
 * @returns {object} { status, availableAt, availability }
 */
export function getMenuItemStatusAtLocation(menuItemId, location, menuData, menuItem = null) {
  // Check if menu item is available at this location (if you have a menuItems array per location)
  // If not, skip this check
  const override = location.menuOverrides?.[menuItemId];
  if (override) return { ...override };
  
  // Use provided menuItem or look it up in menuData
  const item = menuItem || (menuData && menuData.find(i => i.id === menuItemId));
  if (!item) return { status: 'unavailable' };
  
  // Check if item has locations array from API (for items loaded from public-menu API)
  // Map location.shortName to API's locations[].name field
  if (Array.isArray(item.locations) && item.locations.length > 0) {
    const isAvailableAtLocation = item.locations.some(apiLocation => {
      // API location can be a string (location name) or object with name property
      const locationName = typeof apiLocation === 'string' ? apiLocation : apiLocation.name;
      return locationName === location.shortName;
    });
    
    if (isAvailableAtLocation) {
      return {
        status: item.status || 'available',
        availableAt: [location.id],
        availability: item.availability || 'store_hours'
      };
    } else {
      return { status: 'unavailable' };
    }
  }
  
  // Fallback to legacy availableAt check for static menu items
  return {
    status: item.status,
    availableAt: item.availableAt,
    availability: item.availability
  };
}

/**
 * Checks if a location is open based on its status and hours.
 * @param {object} location - The location object.
 * @returns {boolean}
 */
export function isLocationOpen(location) {
  return location.status === 'open';
  // For more advanced logic, check current time against location.hours
}
