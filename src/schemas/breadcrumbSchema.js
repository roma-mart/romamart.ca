/**
 * Breadcrumb Schema Builder
 *
 * Generates Schema.org BreadcrumbList JSON-LD for SEO-enhanced navigation
 *
 * @module schemas/breadcrumbSchema
 * @since February 4, 2026
 */

import COMPANY_DATA from '../config/company_data';

/**
 * Build BreadcrumbList schema for Google Rich Results
 *
 * @param {Array<Object>} breadcrumbs - Array of breadcrumb items
 * @param {string} breadcrumbs[].name - Display name
 * @param {string} breadcrumbs[].url - Full URL (must be absolute)
 * @returns {Object} BreadcrumbList schema
 *
 * @example
 * buildBreadcrumbSchema([
 *   { name: 'Home', url: 'https://romamart.ca/' },
 *   { name: 'Services', url: 'https://romamart.ca/services/' }
 * ])
 */
export function buildBreadcrumbSchema(breadcrumbs = []) {
  // Validate input
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
    return null;
  }

  // Filter invalid items
  const validBreadcrumbs = breadcrumbs.filter(
    (item) => item && typeof item.name === 'string' && typeof item.url === 'string'
  );

  if (validBreadcrumbs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: validBreadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to build breadcrumb array from page metadata
 *
 * @param {string} currentPageName - Current page name
 * @param {string} currentPageUrl - Current page URL (absolute)
 * @param {Array<Object>} [parentPages] - Optional parent page(s)
 * @returns {Array<Object>} Breadcrumb items array
 *
 * @example
 * buildBreadcrumbArray('Services', 'https://romamart.ca/services/')
 * // Returns: [{ name: 'Home', url: '...' }, { name: 'Services', url: '...' }]
 */
export function buildBreadcrumbArray(currentPageName, currentPageUrl, parentPages = [], options = {}) {
  const cd = options.companyData || COMPANY_DATA;
  const breadcrumbs = [
    {
      name: 'Home',
      url: `${cd.baseUrl}/`,
    },
  ];

  // Add any parent pages
  if (Array.isArray(parentPages) && parentPages.length > 0) {
    breadcrumbs.push(...parentPages);
  }

  // Add current page
  breadcrumbs.push({
    name: currentPageName,
    url: currentPageUrl,
  });

  return breadcrumbs;
}

/**
 * Quick helper for simple page breadcrumbs (Home > Current Page)
 *
 * @param {string} pageName - Page name
 * @param {string} pageSlug - Page slug (e.g., 'services')
 * @returns {Object} BreadcrumbList schema
 *
 * @example
 * quickBreadcrumb('Services', 'services')
 */
export function quickBreadcrumb(pageName, pageSlug, options = {}) {
  const baseUrl = (options.companyData || COMPANY_DATA).baseUrl;
  const breadcrumbs = buildBreadcrumbArray(pageName, `${baseUrl}/${pageSlug}/`, [], options);

  return buildBreadcrumbSchema(breadcrumbs);
}
