/**
 * Location Schema Builder
 * Converts location data into schema.org LocalBusiness/Place JSON-LD
 *
 * Supports both static data (locations.js) and future API-driven locations
 *
 * @since February 5, 2026
 */

import { safeString } from '../utils/schemaHelpers.js';
import COMPANY_DATA from '../config/company_data.js';
import { parse12hTo24h } from '../utils/dateHelpers.js';

/**
 * Build opening hours specification from location hours data
 * @param {Object} hours - Hours object from location data
 * @returns {Array<Object>|null} Array of OpeningHoursSpecification objects
 */
const buildOpeningHours = (hours) => {
  if (!hours || typeof hours !== 'object') {
    return null;
  }

  const specifications = [];

  // Handle daily hours format (e.g., { Monday: "8:30 AM - 9:00 PM", ... })
  if (hours.daily && typeof hours.daily === 'object') {
    Object.entries(hours.daily).forEach(([day, timeRange]) => {
      if (!timeRange || timeRange === 'Closed' || !timeRange.includes('-')) {
        return;
      }

      const parts = timeRange.split('-').map(t => t.trim());
      if (parts.length !== 2) return;

      const opens = parse12hTo24h(parts[0]);
      const closes = parse12hTo24h(parts[1]);

      if (opens && closes) {
        specifications.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [day],
          opens,
          closes
        });
      }
    });
  }

  // Handle weekdays/weekends format
  if (hours.weekdays && hours.weekends) {
    const weekdaysParts = hours.weekdays.split('-').map(t => t.trim());
    const weekendsParts = hours.weekends.split('-').map(t => t.trim());

    if (weekdaysParts.length === 2) {
      const opens = parse12hTo24h(weekdaysParts[0]);
      const closes = parse12hTo24h(weekdaysParts[1]);
      if (opens && closes) {
        specifications.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens,
          closes
        });
      }
    }

    if (weekendsParts.length === 2) {
      const opens = parse12hTo24h(weekendsParts[0]);
      const closes = parse12hTo24h(weekendsParts[1]);
      if (opens && closes) {
        specifications.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens,
          closes
        });
      }
    }
  }

  return specifications.length > 0 ? specifications : null;
};

/**
 * Build a Location schema object as LocalBusiness
 * @param {Object} location - Location object from locations.js or API
 * @param {string} location.id - Unique location identifier
 * @param {string} location.name - Location name
 * @param {string} location.type - Location type (e.g., 'convenience_store')
 * @param {Object} location.address - Address object
 * @param {Object} location.contact - Contact object
 * @param {Object} location.hours - Hours object
 * @param {Object} location.google - Google Maps data
 * @param {Array<string>} location.services - Array of service IDs available at location
 * @param {Array<Object>} location.amenities - Array of amenity objects with name and value
 * @param {Object} options - Optional overrides
 * @returns {Object|null} LocalBusiness schema object
 */
export const buildLocationSchema = (location, _options = {}) => {
  if (!location || typeof location !== 'object') {
    return null;
  }

  const name = safeString(location.name);
  if (!name) {
    return null;
  }

  const address = location.address || {};
  const contact = location.contact || {};
  const coords = location.google?.coordinates || {};
  const hours = location.hours || {};
  const id = location.id ? safeString(location.id) : '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    ...(id ? { '@id': `${COMPANY_DATA.baseUrl}/#location-${id}` } : {}),
    name,
    ...(location.shortName ? { alternateName: safeString(location.shortName) } : {}),
    ...(location.description ? { description: safeString(location.description) } : {}),
    url: `${COMPANY_DATA.baseUrl}${COMPANY_DATA.endpoints.locations}`,
    telephone: safeString(contact.phone || COMPANY_DATA.contact.phone),
    email: safeString(contact.email || COMPANY_DATA.contact.email),
    address: {
      '@type': 'PostalAddress',
      streetAddress: safeString(address.street),
      addressLocality: safeString(address.city),
      addressRegion: safeString(address.province),
      postalCode: safeString(address.postalCode),
      addressCountry: address.country || COMPANY_DATA.defaults.country
    }
  };

  // Add geo coordinates if available
  if (coords.lat && coords.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: coords.lat,
      longitude: coords.lng
    };
  }

  // Add Google Maps link if available
  if (location.google?.mapLink) {
    schema.hasMap = safeString(location.google.mapLink);
  }

  // Add opening hours
  const openingHours = buildOpeningHours(hours);
  if (openingHours) {
    schema.openingHoursSpecification = openingHours;
  }

  // Add primary photo if available
  if (location.photos?.primary) {
    schema.image = safeString(location.photos.primary);
  }

  // Add logo
  schema.logo = COMPANY_DATA.logoUrl;

  // Add amenities from location data (Google-recognized names, API-ready structure)
  if (location.amenities && Array.isArray(location.amenities) && location.amenities.length > 0) {
    schema.amenityFeature = location.amenities.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: safeString(amenity.name),
      value: amenity.value
    }));
  }

  // Add services available at location (as keywords for now, will link to Service schemas later)
  if (location.services && Array.isArray(location.services) && location.services.length > 0) {
    schema.additionalProperty = location.services.map((serviceId, index) => ({
      '@type': 'PropertyValue',
      name: 'Available Service',
      value: safeString(serviceId),
      propertyID: `service-${index + 1}`
    }));
  }

  // Add price range if this is headquarters (primary location)
  if (location.isPrimary || location.metadata?.isHeadquarters) {
    schema.priceRange = COMPANY_DATA.defaults.priceRange;
  }

  // Add currencies accepted
  schema.currenciesAccepted = COMPANY_DATA.defaults.currency;

  // Add area served (city/region where location operates)
  if (address.city) {
    schema.areaServed = {
      '@type': 'City',
      name: safeString(address.city)
    };
  }

  // Add brand
  schema.brand = {
    '@type': 'Brand',
    name: COMPANY_DATA.dba
  };

  // Link to parent organization
  schema.parentOrganization = {
    '@id': `${COMPANY_DATA.baseUrl}/#organization`
  };

  return schema;
};

/**
 * Build multiple location schemas as ItemList
 * @param {Array<Object>} locations - Array of location objects
 * @param {Object} options - Optional overrides for all locations
 * @returns {Object|null} ItemList schema with LocalBusiness items
 */
export const buildLocationListSchema = (locations, _options = {}) => {
  if (!locations || !Array.isArray(locations) || locations.length === 0) {
    return null;
  }

  const locationSchemas = locations
    .map(location => buildLocationSchema(location, _options))
    .filter(Boolean);

  if (locationSchemas.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: locationSchemas.length,
    itemListElement: locationSchemas.map((location, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: location
    }))
  };
};
