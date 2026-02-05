/**
 * Menu Item Schema Builder (Product)
 * Converts RoCafe menu item data into schema.org Product JSON-LD
 *
 * @since February 4, 2026
 */

import { convertCentsToDollars, safeString } from '../utils/schemaHelpers.js';
import COMPANY_DATA from '../config/company_data.js';

const DIETARY_SCHEMA_MAP = {
  vegan: 'https://schema.org/VeganDiet',
  vegetarian: 'https://schema.org/VegetarianDiet',
  'gluten-free': 'https://schema.org/GlutenFreeDiet',
  gluten_free: 'https://schema.org/GlutenFreeDiet',
  'dairy-free': 'https://schema.org/LowLactoseDiet',
  dairy_free: 'https://schema.org/LowLactoseDiet',
  halal: 'https://schema.org/HalalDiet'
};

const normalizeDietarySuitability = (dietary = []) => {
  if (!Array.isArray(dietary)) return [];

  const mapped = dietary
    .map(tag => DIETARY_SCHEMA_MAP[String(tag || '').toLowerCase().trim()])
    .filter(Boolean);

  return Array.from(new Set(mapped));
};

const normalizeKeywords = (categories = []) => {
  if (!Array.isArray(categories)) return [];

  return categories
    .map(category => safeString(category))
    .filter(Boolean);
};

const normalizePrice = (price, priceInCents) => {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return null;
  }

  return priceInCents ? convertCentsToDollars(value) : value.toFixed(2);
};

const inferPriceInCents = (sizes = []) => {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return false;
  }

  const numericPrices = sizes
    .map(size => Number(size?.price))
    .filter(value => Number.isFinite(value));

  if (numericPrices.length === 0) {
    return false;
  }

  const maxPrice = Math.max(...numericPrices);
  const hasLargeInteger = numericPrices.some(value => Number.isInteger(value) && value >= 100);

  return maxPrice >= 100 && hasLargeInteger;
};

const buildOffer = (size, options) => {
  if (!size) return null;

  const price = normalizePrice(size.price, options.priceInCents);

  if (!price) {
    return null;
  }

  return {
    '@type': 'Offer',
    name: safeString(size.name || size.size || ''),
    price,
    priceCurrency: options.currency,
    availability: 'https://schema.org/InStock'
  };
};

const buildOffers = (sizes = [], options) => {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return null;
  }

  const offers = sizes
    .map(size => buildOffer(size, options))
    .filter(Boolean);

  if (offers.length === 0) {
    return null;
  }

  if (offers.length === 1) {
    return offers[0];
  }

  const prices = offers
    .map(offer => Number(offer.price))
    .filter(value => Number.isFinite(value));

  const lowPrice = prices.length ? Math.min(...prices).toFixed(2) : undefined;
  const highPrice = prices.length ? Math.max(...prices).toFixed(2) : undefined;

  return {
    '@type': 'AggregateOffer',
    priceCurrency: options.currency,
    ...(lowPrice ? { lowPrice } : {}),
    ...(highPrice ? { highPrice } : {}),
    offers
  };
};

/**
 * Build a Product schema object for a menu item
 * @param {Object} menuItem - Menu item object
 * @param {string} itemUrl - Canonical URL for the menu item or page
 * @param {Object} options - Optional overrides
 * @param {boolean} options.priceInCents - Whether size prices are in cents
 * @param {string} options.currency - ISO currency code (default CAD)
 * @returns {Object|null} Product schema object
 */
export const buildMenuItemSchema = (menuItem, itemUrl, options = {}) => {
  if (!menuItem || typeof menuItem !== 'object') {
    return null;
  }

  const resolvedOptions = {
    priceInCents: options.priceInCents ?? inferPriceInCents(menuItem.sizes || []),
    currency: options.currency || COMPANY_DATA.defaults.currency
  };

  const name = safeString(menuItem.name);

  if (!name) {
    return null;
  }

  const description = safeString(menuItem.description || menuItem.tagline || '');
  const categories = Array.isArray(menuItem.categories)
    ? menuItem.categories
    : (menuItem.category ? [menuItem.category] : []);
  const keywords = normalizeKeywords(categories);
  const dietarySuitability = normalizeDietarySuitability(menuItem.dietary || []);
  const allergyWarning = Array.isArray(menuItem.allergens)
    ? menuItem.allergens.map(allergen => safeString(allergen)).filter(Boolean)
    : [];

  const offers = buildOffers(menuItem.sizes || [], resolvedOptions);
  const image = safeString(menuItem.image || '');
  const id = menuItem.id ? safeString(menuItem.id) : '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    ...(id ? { '@id': `${itemUrl}#${id}` } : {}),
    name,
    ...(description ? { description } : {}),
    ...(keywords.length ? { keywords } : {}),
    ...(dietarySuitability.length ? { dietarySuitability } : {}),
    ...(allergyWarning.length ? { allergyWarning } : {}),
    ...(offers ? { offers } : {}),
    ...(image ? { image } : {}),
    ...(id ? { sku: id } : {}),
    ...(itemUrl ? { url: itemUrl } : {}),
    // Category for better product classification
    ...(categories.length ? { category: safeString(categories[0]) } : { category: COMPANY_DATA.defaults.productCategory }),
    brand: {
      '@type': 'Brand',
      name: COMPANY_DATA.dba
    },
    // Manufacturer (if provided in menuItem data, otherwise Roma Mart for house products)
    ...(menuItem.manufacturer ? {
      manufacturer: {
        '@type': 'Organization',
        name: safeString(menuItem.manufacturer)
      }
    } : {}),
    // Link to merchant return policy (recommended by Google for products)
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      '@id': `${COMPANY_DATA.baseUrl}${COMPANY_DATA.endpoints.returnPolicy}#policy`,
      applicableCountry: COMPANY_DATA.defaults.country,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 1,
      returnMethod: 'https://schema.org/ReturnInStore',
      returnFees: 'https://schema.org/FreeReturn',
      itemCondition: 'https://schema.org/DamagedCondition' // Only faulty/damaged items
    }
  };

  return schema;
};
