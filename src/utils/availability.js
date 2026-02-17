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
  const service = servicesData.find((s) => s.id === serviceId);
  if (!service) return { status: 'unavailable' };
  return {
    status: service.status,
    availableAt: service.availableAt,
    availability: service.availability,
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
  const item = menuItem || (menuData && menuData.find((i) => i.id === menuItemId));
  if (!item) return { status: 'unavailable' };

  // Check availableAt first — works for both new API and static data.
  // After normalization, items have availableAt as an array of location IDs.
  if (Array.isArray(item.availableAt) && item.availableAt.length > 0) {
    const isAvailableAtLocation = item.availableAt.includes(location.id);
    if (isAvailableAtLocation) {
      return {
        status: item.status || 'available',
        availableAt: item.availableAt,
        availability: item.availability || 'store_hours',
      };
    } else {
      return { status: 'unavailable' };
    }
  }

  // Legacy: Check old API locations array (shortName matching) — kept as fallback
  if (Array.isArray(item.locations) && item.locations.length > 0) {
    const isAvailableAtLocation = item.locations.some((apiLocation) => {
      const locationName = typeof apiLocation === 'string' ? apiLocation : apiLocation.name;
      return locationName === location.shortName;
    });

    if (isAvailableAtLocation) {
      return {
        status: item.status || 'available',
        availableAt: [location.id],
        availability: item.availability || 'store_hours',
      };
    } else {
      return { status: 'unavailable' };
    }
  }

  // No location data — return item's own status with safe defaults
  return {
    status: item.status || 'available',
    availableAt: item.availableAt,
    availability: item.availability || 'store_hours',
  };
}

/**
 * Checks if a location is open based on live data (preferred) or static status (fallback).
 * Uses live Google Places API data when available, falls back to hardcoded location.status.
 * @param {object} location - The location object.
 * @param {boolean} [isOpenNow] - Live open/closed status from Google Places API (optional).
 * @returns {boolean} True if location is open (live) or marked as open (fallback).
 */
export function isLocationOpen(location, isOpenNow = undefined) {
  // Prefer live data from Google Places API (only if it's explicitly true or false, not null/undefined)
  if (isOpenNow !== undefined && isOpenNow !== null) {
    return isOpenNow;
  }
  // Fallback to static location status
  return location.status === 'open';
}
