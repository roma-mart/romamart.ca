/**
 * Service Schema Builder
 * Converts service data into schema.org Service JSON-LD
 *
 * Supports both static data (services.jsx) and future API-driven services
 *
 * @since February 5, 2026
 */

import { safeString } from '../utils/schemaHelpers.js';
import COMPANY_DATA from '../config/company_data.js';

/**
 * Build a Service schema object
 * @param {Object} service - Service object from SERVICES array or API
 * @param {string} service.id - Unique service identifier
 * @param {string} service.name - Service name
 * @param {string} service.description - Service description
 * @param {string} service.category - Service category (e.g., 'financial', 'food_beverage')
 * @param {string} service.tagline - Short tagline (optional)
 * @param {Array<string>} service.features - Array of service features (optional)
 * @param {boolean} service.ageRestricted - Whether service requires age verification (optional)
 * @param {Array<string>} service.availableAt - Array of location IDs where service is available (optional)
 * @param {Object} options - Optional overrides
 * @param {string} options.serviceUrl - Canonical URL for the service (defaults to /services)
 * @param {string} options.providerUrl - Provider business URL
 * @returns {Object|null} Service schema object
 */
export const buildServiceSchema = (service, options = {}) => {
  if (!service || typeof service !== 'object') {
    return null;
  }

  const name = safeString(service.name);
  if (!name) {
    return null;
  }

  const description = safeString(service.description || service.tagline || '');
  const serviceType = safeString(service.category || 'Service');
  const serviceUrl = options.serviceUrl || `${COMPANY_DATA.baseUrl}${COMPANY_DATA.endpoints.services}`;
  const providerUrl = options.providerUrl || COMPANY_DATA.baseUrl;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    ...(service.id ? { '@id': `${COMPANY_DATA.baseUrl}${COMPANY_DATA.endpoints.services}#${safeString(service.id)}` } : {}),
    name,
    ...(description ? { description } : {}),
    ...(serviceType ? { serviceType } : {}),
    ...(service.id ? { identifier: safeString(service.id) } : {}),
    url: serviceUrl,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${providerUrl}/#business`,
      name: COMPANY_DATA.dba,
      url: providerUrl
    },
    areaServed: {
      '@type': 'City',
      name: COMPANY_DATA.location.address.city,
      addressRegion: COMPANY_DATA.location.address.province,
      addressCountry: COMPANY_DATA.defaults.country
    },
    brand: {
      '@type': 'Brand',
      name: COMPANY_DATA.dba
    }
  };

  // Add service features as aggregateRating-like structure if available
  if (service.features && Array.isArray(service.features) && service.features.length > 0) {
    const features = service.features
      .map(feature => safeString(feature))
      .filter(Boolean);

    if (features.length > 0) {
      schema.additionalProperty = features.map((feature, index) => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature,
        propertyID: `feature-${index + 1}`
      }));
    }
  }

  // Add age restriction if applicable
  if (service.ageRestricted === true) {
    schema.typicalAgeRange = '19-';
  }

  // Add availability if specified
  if (service.availability) {
    schema.hoursAvailable = {
      '@type': 'OpeningHoursSpecification',
      name: safeString(service.availability)
    };
  }

  // Add location availability if specified
  if (service.availableAt && Array.isArray(service.availableAt) && service.availableAt.length > 0) {
    schema.availableAtOrFrom = service.availableAt.map(locationId => ({
      '@type': 'Place',
      identifier: safeString(locationId)
    }));
  }

  // Add broker if service is provided through an intermediary
  if (service.broker) {
    schema.broker = {
      '@type': 'Organization',
      name: safeString(service.broker)
    };
  }

  return schema;
};

/**
 * Build multiple service schemas as ItemList
 * @param {Array<Object>} services - Array of service objects
 * @param {Object} options - Optional overrides for all services
 * @returns {Object|null} ItemList schema with Service items
 */
export const buildServiceListSchema = (services, options = {}) => {
  if (!services || !Array.isArray(services) || services.length === 0) {
    return null;
  }

  const serviceSchemas = services
    .map(service => buildServiceSchema(service, options))
    .filter(Boolean);

  if (serviceSchemas.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: serviceSchemas.length,
    itemListElement: serviceSchemas.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: service
    }))
  };
};
