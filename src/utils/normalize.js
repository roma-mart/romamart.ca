/**
 * API Data Normalization Utilities
 * Pure functions that normalize API responses to the internal format
 * expected by components and utilities.
 *
 * Key responsibilities:
 * - Menu prices: cents (API) → dollars (internal)
 * - Size ordering: standardized S → M → L display order
 * - Location images: { storefront, interior } (API) → photos format (internal)
 * - Defense-in-depth enum normalization
 *
 * @since February 2026
 */

import { sortSizes } from './menuHelpers';

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
 * Extracts a single category string from the API's `categories` array.
 * Strips the "RoCafe " prefix to produce canonical names (e.g. "Hot Coffee").
 * @param {Array<string>|undefined} categories
 * @returns {string|null}
 */
const extractCategory = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) return null;
  const raw = categories[0];
  return typeof raw === 'string' ? raw.replace(/^RoCafe\s+/i, '') : null;
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

  const needsPriceConversion = source === 'api' && (isLikelyCents(item.sizes) || isLikelyCents(item.addOns));

  const rawSizes = Array.isArray(item.sizes)
    ? item.sizes.map((size) => ({
        ...size,
        price: needsPriceConversion ? centsToDollars(size.price) : size.price,
      }))
    : [];

  // Sort sizes to consistent S → M → L order and remap defaultSize to match
  const sizes = sortSizes(rawSizes) || rawSizes;
  let defaultSize = Number(item.defaultSize) || 0;
  if (defaultSize < 0 || defaultSize >= rawSizes.length) defaultSize = 0;
  if (sizes.length > 0 && rawSizes.length > 0 && rawSizes[defaultSize]) {
    const defaultName = rawSizes[defaultSize].name;
    const newIndex = sizes.findIndex((s) => s.name === defaultName);
    if (newIndex !== -1) defaultSize = newIndex;
  }
  if (defaultSize < 0 || defaultSize >= sizes.length) defaultSize = 0;

  const addOns = Array.isArray(item.addOns)
    ? item.addOns.map((addon) => ({
        ...addon,
        price: needsPriceConversion ? centsToDollars(addon.price) : addon.price,
      }))
    : [];

  return {
    ...item,
    // Enrichment defaults (hybrid: common defaults in normalizer, complex domain fields null)
    itemType: item.itemType || 'menu',
    slug: item.slug || item.id || null,
    status: normalizeEnum(item.status) || 'available',
    availability: normalizeEnum(item.availability) || 'store_hours',
    defaultSize,
    // Complex domain-specific fields: null = "data not available" (food safety)
    customizations: item.customizations ?? null,
    allergens: item.allergens ?? null,
    dietary: item.dietary ?? null,
    temperature: item.temperature ?? null,
    flavorProfile: item.flavorProfile ?? null,
    prepTime: item.prepTime ?? null,
    caffeineLevel: item.caffeineLevel ?? null,
    image: item.image ?? null,
    sizes,
    addOns,
    // Ensure availableAt is always an array
    availableAt: Array.isArray(item.availableAt) ? item.availableAt : [],
    // API sends `categories` (array), internal format uses `category` (string).
    // Extract first category from array; strip "RoCafe " prefix for canonical form.
    category: item.category || extractCategory(item.categories) || null,
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

  // Defense-in-depth enum normalization
  if (loc.status) normalized.status = normalizeEnum(loc.status);

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
  } else {
    normalized.amenities = [];
  }

  // Ensure services is always an array
  normalized.services = Array.isArray(normalized.services) ? normalized.services : [];

  return normalized;
};

/**
 * Normalizes a service from API or static format to internal format.
 *
 * Ensures arrays are present, enum values are normalized (defense-in-depth),
 * and slug is populated.
 *
 * Note on icons: Static data has JSX elements (e.g., <Banknote />), API returns
 * string identifiers (e.g., "banknote"). Icon rendering components must handle
 * both types — check `typeof svc.icon === 'string'` and resolve accordingly.
 *
 * @param {Object} svc - Service object from API or static data
 * @param {'api'|'static'} source - Data source
 * @returns {Object} Normalized service
 */
export const normalizeService = (svc, _source) => {
  if (!svc) return svc;

  return {
    ...svc,
    slug: svc.slug || svc.id || null,
    status: normalizeEnum(svc.status) || 'available',
    availability: normalizeEnum(svc.availability) || 'store_hours',
    availableAt: Array.isArray(svc.availableAt) ? svc.availableAt : [],
    features: Array.isArray(svc.features) ? svc.features : [],
    category: svc.category || null,
  };
};
