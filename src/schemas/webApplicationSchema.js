/**
 * WebApplication Schema Builder
 * 
 * Generates Schema.org WebApplication JSON-LD for PWA discovery
 * 
 * @module schemas/webApplicationSchema
 * @since February 4, 2026
 */

import { safeString } from '../utils/schemaHelpers';

/**
 * Build WebApplication schema for PWA
 * 
 * @param {Object} data - Application data
 * @param {string} data.name - Application name
 * @param {string} data.url - Application URL
 * @param {string} [data.description] - Application description
 * @param {string} [data.applicationCategory] - Category (Lifestyle, Shopping, etc.)
 * @param {string} [data.operatingSystem] - Operating system compatibility
 * @param {Object} [data.offers] - Pricing information
 * @param {string} [data.browserRequirements] - Browser requirements
 * @param {string[]} [data.permissions] - Permissions required
 * @param {Object[]} [data.screenshots] - App screenshots
 * @returns {Object} WebApplication schema
 * 
 * @example
 * buildWebApplicationSchema({
 *   name: 'Roma Mart Convenience',
 *   url: 'https://romamart.ca',
 *   description: 'Shop Roma Mart online',
 *   applicationCategory: 'Lifestyle'
 * })
 */
export function buildWebApplicationSchema(data = {}) {
  // Validate required fields
  if (!data.name || !data.url) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: safeString(data.name),
    url: safeString(data.url),
  };

  // Optional fields
  if (data.description) {
    schema.description = safeString(data.description);
  }

  if (data.applicationCategory) {
    schema.applicationCategory = safeString(data.applicationCategory);
  }

  if (data.operatingSystem) {
    schema.operatingSystem = safeString(data.operatingSystem);
  }

  // Offers (pricing) - typically free for PWAs
  if (data.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: data.offers.price || '0',
      priceCurrency: data.offers.priceCurrency || 'CAD'
    };
  }

  if (data.browserRequirements) {
    schema.browserRequirements = safeString(data.browserRequirements);
  }

  if (data.permissions && Array.isArray(data.permissions) && data.permissions.length > 0) {
    schema.permissions = data.permissions.map(p => safeString(p));
  }

  // Screenshots (optional, for rich results)
  if (data.screenshots && Array.isArray(data.screenshots) && data.screenshots.length > 0) {
    schema.screenshot = data.screenshots
      .filter(s => s && s.url)
      .map(screenshot => ({
        '@type': 'ImageObject',
        url: safeString(screenshot.url),
        caption: screenshot.caption ? safeString(screenshot.caption) : undefined
      }));
  }

  // Author/Publisher (organization)
  if (data.author) {
    schema.author = {
      '@type': 'Organization',
      name: safeString(data.author.name || 'Roma Mart Corp.'),
      url: safeString(data.author.url || 'https://romamart.ca')
    };
  }

  return schema;
}
