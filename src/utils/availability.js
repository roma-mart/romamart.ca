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
 * @param {object} menuData - The global ROCAFE_FULL_MENU array.
 * @returns {object} { status, availableAt, availability }
 */
export function getMenuItemStatusAtLocation(menuItemId, location, menuData) {
  // Check if menu item is available at this location (if you have a menuItems array per location)
  // If not, skip this check
  const override = location.menuOverrides?.[menuItemId];
  if (override) return { ...override };
  // Fallback to global menu data
  const item = menuData.find(i => i.id === menuItemId);
  if (!item) return { status: 'unavailable' };
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
