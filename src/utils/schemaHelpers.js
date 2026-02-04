/**
 * Schema Helpers
 * Shared utilities for schema.org JSON-LD generation
 *
 * @since February 4, 2026
 */

/**
 * Convert cents to dollar string for schema.org
 * @param {number} cents - Price in cents (e.g., 499)
 * @returns {string} Price as dollar string (e.g., "4.99")
 */
export const convertCentsToDollars = (cents) => {
  if (typeof cents !== 'number' || Number.isNaN(cents)) {
    return '0.00';
  }

  return (cents / 100).toFixed(2);
};

/**
 * Sanitize and normalize strings for schema output
 * @param {string} value - Raw string input
 * @returns {string} Safe, trimmed string
 */
export const safeString = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Format a PostalAddress object into a single line string
 * @param {Object} address - Address object
 * @param {string} address.formatted - Preformatted address
 * @param {string} address.street - Street address
 * @param {string} address.city - City
 * @param {string} address.province - Province/Region
 * @param {string} address.postalCode - Postal code
 * @param {string} address.country - Country
 * @returns {string} Formatted address string
 */
export const formatAddress = (address = {}) => {
  if (address.formatted) {
    return safeString(address.formatted);
  }

  const parts = [
    safeString(address.street),
    safeString(address.city),
    safeString(address.province),
    safeString(address.postalCode),
    safeString(address.country)
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Build AggregateRating from a list of review objects
 * @param {Array} reviews - Review objects containing rating values
 * @returns {Object|null} AggregateRating schema or null
 */
export const buildAggregateRating = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  const ratingValues = reviews
    .map(review => Number(review?.rating))
    .filter(value => Number.isFinite(value));

  if (ratingValues.length === 0) {
    return null;
  }

  const total = ratingValues.reduce((sum, value) => sum + value, 0);
  const average = total / ratingValues.length;

  return {
    '@type': 'AggregateRating',
    ratingValue: Number(average.toFixed(2)),
    reviewCount: ratingValues.length
  };
};
