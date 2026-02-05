/**
 * WebApplication Schema Builder
 *
 * Generates Schema.org WebApplication JSON-LD for PWA discovery
 *
 * @module schemas/webApplicationSchema
 * @since February 4, 2026
 */

import COMPANY_DATA from '../config/company_data.js';
import { safeString } from '../utils/schemaHelpers';

/**
 * Build WebApplication schema for PWA
 *
 * @param {Object} data - Application data overrides (optional, defaults to COMPANY_DATA.pwa.webApplication)
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
 * buildWebApplicationSchema() // Uses COMPANY_DATA.pwa.webApplication
 * buildWebApplicationSchema({ name: 'Custom Name' }) // Override specific fields
 */
export function buildWebApplicationSchema(data = {}) {
  // Merge with COMPANY_DATA.pwa.webApplication as defaults (SSOT)
  const pwaData = COMPANY_DATA.pwa.webApplication;
  const mergedData = {
    name: data.name || pwaData.name,
    url: data.url || pwaData.url,
    description: data.description || pwaData.description,
    applicationCategory: data.applicationCategory || pwaData.applicationCategory,
    operatingSystem: data.operatingSystem || pwaData.operatingSystem,
    offers: data.offers || pwaData.offers,
    browserRequirements: data.browserRequirements || pwaData.browserRequirements,
    permissions: data.permissions || pwaData.permissions
  };

  // Validate required fields
  if (!mergedData.name || !mergedData.url) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${COMPANY_DATA.baseUrl}/#webapp`,
    name: safeString(mergedData.name),
    url: safeString(mergedData.url),
  };

  // Optional fields
  if (mergedData.description) {
    schema.description = safeString(mergedData.description);
  }

  if (mergedData.applicationCategory) {
    schema.applicationCategory = safeString(mergedData.applicationCategory);
  }

  if (mergedData.operatingSystem) {
    schema.operatingSystem = safeString(mergedData.operatingSystem);
  }

  // Offers (pricing) - typically free for PWAs
  if (mergedData.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: mergedData.offers.price || '0',
      priceCurrency: mergedData.offers.priceCurrency || COMPANY_DATA.defaults.currency
    };
  }

  if (mergedData.browserRequirements) {
    schema.browserRequirements = safeString(mergedData.browserRequirements);
  }

  if (mergedData.permissions && Array.isArray(mergedData.permissions) && mergedData.permissions.length > 0) {
    schema.permissions = mergedData.permissions.map(p => safeString(p));
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
  schema.author = {
    '@type': 'Organization',
    name: COMPANY_DATA.legalName,
    url: COMPANY_DATA.baseUrl
  };

  return schema;
}
