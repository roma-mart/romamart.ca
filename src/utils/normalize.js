/**
 * API Data Normalization Utilities
 * Pure functions that normalize API responses to the internal format
 * expected by components and utilities.
 *
 * Key responsibilities:
 * - Menu prices: cents (API) → dollars (internal)
 * - Location images: { storefront, interior } (API) → photos format (internal)
 * - Defense-in-depth enum normalization
 *
 * @since February 2026
 */

/**
 * Normalizes any enum string to lowercase snake_case.
 * Backend already returns normalized values; this is defense-in-depth.
 * @param {string} s
 * @returns {string|null}
 */
export const normalizeEnum = (s) => (s ? s.toLowerCase().replace(/\s+/g, '_') : null);

/**
 * Converts a price from cents (integer) to dollars (decimal).
 * @param {number} cents
 * @returns {number}
 */
const centsToDollars = (cents) => (typeof cents === 'number' ? cents / 100 : 0);

/**
 * Detects whether prices in a sizes array are likely in cents.
 * Prices >= 100 that are integers are treated as cents.
 * @param {Array<{price: number}>} sizes
 * @returns {boolean}
 */
const isLikelyCents = (sizes) => {
  if (!Array.isArray(sizes) || sizes.length === 0) return false;
  return sizes.some((s) => typeof s.price === 'number' && Number.isInteger(s.price) && s.price >= 100);
};

/**
 * Normalizes a menu item from API or static format to internal format.
 *
 * API source: converts prices from cents to dollars.
 * Static source: passes through unchanged.
 *
 * @param {Object} item - Menu item from API or static data
 * @param {'api'|'static'} source - Data source
 * @returns {Object} Normalized menu item with prices in dollars
 */
export const normalizeMenuItem = (item, source) => {
  if (!item) return item;

  const needsPriceConversion = source === 'api' && isLikelyCents(item.sizes);

  const sizes = Array.isArray(item.sizes)
    ? item.sizes.map((size) => ({
        ...size,
        price: needsPriceConversion ? centsToDollars(size.price) : size.price,
      }))
    : [];

  const addOns = Array.isArray(item.addOns)
    ? item.addOns.map((addon) => ({
        ...addon,
        price: needsPriceConversion ? centsToDollars(addon.price) : addon.price,
      }))
    : [];

  return {
    ...item,
    sizes,
    addOns,
    // Ensure availableAt is always an array
    availableAt: Array.isArray(item.availableAt) ? item.availableAt : [],
    // Ensure category is a string (API returns singular, static also singular)
    category: item.category || null,
  };
};

/**
 * Normalizes a location from API or static format to internal format.
 *
 * API source: maps `images` field to `photos` format for backward compatibility.
 * Static source: passes through unchanged (already has `photos`).
 *
 * @param {Object} loc - Location object from API or static data
 * @param {'api'|'static'} source - Data source
 * @returns {Object} Normalized location
 */
export const normalizeLocation = (loc, source) => {
  if (!loc) return loc;

  const normalized = { ...loc };

  // Map API `images` to internal `photos` format if not already present
  if (source === 'api' && loc.images && !loc.photos) {
    normalized.photos = {
      primary: loc.images.storefront || null,
      exterior: loc.images.storefront ? [loc.images.storefront] : [],
      interior: loc.images.interior ? [loc.images.interior] : [],
      thumbnail: loc.images.storefront || null,
    };
  }

  // Ensure amenities is always an array of { name, value } objects
  if (Array.isArray(normalized.amenities)) {
    normalized.amenities = normalized.amenities.map((a) => (typeof a === 'string' ? { name: a, value: true } : a));
  }

  // Ensure services is always an array
  normalized.services = Array.isArray(normalized.services) ? normalized.services : [];

  return normalized;
};

/**
 * Normalizes a service from API or static format to internal format.
 *
 * Minimal normalization — ensures arrays are present and enum values are clean.
 *
 * @param {Object} svc - Service object from API or static data
 * @param {'api'|'static'} source - Data source
 * @returns {Object} Normalized service
 */
export const normalizeService = (svc, _source) => {
  if (!svc) return svc;

  return {
    ...svc,
    availableAt: Array.isArray(svc.availableAt) ? svc.availableAt : [],
    features: Array.isArray(svc.features) ? svc.features : [],
    category: svc.category || null,
  };
};
