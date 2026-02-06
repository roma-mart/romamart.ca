/**
 * Structured Data (Schema.org) Component
 * Provides rich search results via JSON-LD
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import COMPANY_DATA from '../config/company_data';
import { buildMenuItemSchema } from '../schemas/menuItemSchema';
import { buildReturnPolicySchema } from '../schemas/returnPolicySchema';
import { buildBreadcrumbSchema } from '../schemas/breadcrumbSchema';
import { buildWebApplicationSchema } from '../schemas/webApplicationSchema';
import { buildServiceListSchema } from '../schemas/serviceSchema';
import { buildLocationListSchema } from '../schemas/locationSchema';

const StructuredData = ({ type = 'LocalBusiness', data = {} }) => {
  const generateSchema = () => {
    switch (type) {
      case 'ProductList': {
        // Build ItemList containing all Product schemas
        // More efficient than multiple <script> tags
        console.info('[StructuredData] ProductList rendering - Input:', {
          hasProducts: !!data.products,
          isArray: Array.isArray(data.products),
          productCount: data.products?.length || 0
        });

        if (!data.products || !Array.isArray(data.products)) {
          console.warn('[StructuredData] ProductList - No valid products array');
          return null;
        }

        const productSchemas = data.products
          .map(productData => buildMenuItemSchema(
            productData.menuItem,
            productData.itemUrl,
            {
              currency: productData.currency || 'CAD',
              priceInCents: productData.priceInCents
            }
          ))
          .filter(Boolean); // Remove null schemas

        console.info('[StructuredData] ProductList - Generated schemas:', {
          inputCount: data.products.length,
          outputCount: productSchemas.length,
          sampleProduct: productSchemas[0] ? productSchemas[0].name : 'N/A'
        });

        if (productSchemas.length === 0) {
          console.warn('[StructuredData] ProductList - All schemas filtered out (returned null)');
          return null;
        }

        const schema = {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: productSchemas.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: product
          }))
        };

        console.info('[StructuredData] ProductList - Final schema:', {
          type: schema['@type'],
          itemCount: schema.itemListElement.length
        });

        return schema;
      }

      case 'ServiceList': {
        // Build ItemList containing all Service schemas
        if (!data.services || !Array.isArray(data.services)) {
          return null;
        }

        // Use the centralized schema builder
        return buildServiceListSchema(data.services, data.options || {});
      }

      case 'LocationList': {
        // Build ItemList containing all LocalBusiness (location) schemas
        if (!data.locations || !Array.isArray(data.locations)) {
          return null;
        }

        // Use the centralized schema builder
        return buildLocationListSchema(data.locations, data.options || {});
      }

      case 'BreadcrumbList':
        // Use centralized breadcrumb schema builder
        return buildBreadcrumbSchema(data.breadcrumbs || data.items);

      case 'LocalBusiness': {
        // Dynamic LocalBusiness pulled from COMPANY_DATA (SSOT)
        // Helper to parse 12h time to 24h format
        const parse12hTo24h = (time) => {
          if (!time || typeof time !== 'string') return null;
          const match = time.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
          if (!match) return null;
          const [, hoursStr, minutesStr, meridiem] = match;
          let hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          if (meridiem.toLowerCase() === 'pm' && hours !== 12) hours += 12;
          if (meridiem.toLowerCase() === 'am' && hours === 12) hours = 0;
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${COMPANY_DATA.baseUrl}/#business`,
          name: data.name || COMPANY_DATA.dba || COMPANY_DATA.legalName,
          legalName: COMPANY_DATA.legalName || undefined,
          alternateName: data.alternateName || COMPANY_DATA.dba,
          description: data.description || 'Your daily stop & go convenience store. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
          url: COMPANY_DATA.baseUrl,
          telephone: data.telephone || COMPANY_DATA.contact.phone || COMPANY_DATA.location.contact.phone,
          email: data.email || COMPANY_DATA.contact.email || COMPANY_DATA.location.contact.email,
          priceRange: COMPANY_DATA.defaults.priceRange,
          image: data.image || `${COMPANY_DATA.baseUrl}/images/store-front.jpg`,
          logo: COMPANY_DATA.logoUrl,
          brand: {
            '@type': 'Brand',
            name: COMPANY_DATA.dba
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || COMPANY_DATA.address.street || COMPANY_DATA.location.address.street,
            addressLocality: data.address?.city || COMPANY_DATA.address.city || COMPANY_DATA.location.address.city,
            addressRegion: data.address?.province || COMPANY_DATA.address.province || COMPANY_DATA.location.address.province,
            postalCode: data.address?.postalCode || COMPANY_DATA.address.postalCode || COMPANY_DATA.location.address.postalCode,
            addressCountry: COMPANY_DATA.defaults.country
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo?.latitude || COMPANY_DATA.location.google.coordinates.lat,
            longitude: data.geo?.longitude || COMPANY_DATA.location.google.coordinates.lng
          },
          hasMap: COMPANY_DATA.location?.google?.mapLink || undefined,
          currenciesAccepted: COMPANY_DATA.defaults.currency,
          areaServed: {
            '@type': 'City',
            name: data.address?.city || COMPANY_DATA.address?.city || COMPANY_DATA.location.address.city
          },
          openingHoursSpecification: data.hours || (
            COMPANY_DATA.location?.hours?.daily
              ? [
                  // Convert daily hours to Schema.org format (24-hour times)
                  ...Object.entries(COMPANY_DATA.location.hours.daily)
                    .filter(([, hours]) => hours && hours !== 'Closed' && hours.includes('-'))
                    .map(([day, hours]) => {
                      const parts = hours.split('-').map(t => t.trim());
                      if (parts.length !== 2) return null;
                      const opens = parse12hTo24h(parts[0]);
                      const closes = parse12hTo24h(parts[1]);
                      return opens && closes ? {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: [day],
                        opens,
                        closes
                      } : null;
                    })
                    .filter(Boolean),
                  // Add exceptions if present
                  ...(COMPANY_DATA.location.hours.exceptions?.map(ex => {
                    if (!ex.hours || ex.hours === 'Closed' || !ex.hours.includes('-')) return null;
                    const parts = ex.hours.split('-').map(t => t.trim());
                    if (parts.length !== 2) return null;
                    const opens = parse12hTo24h(parts[0]);
                    const closes = parse12hTo24h(parts[1]);
                    return opens && closes ? {
                      '@type': 'OpeningHoursSpecification',
                      opens,
                      closes,
                      validFrom: ex.date,
                      validThrough: ex.date,
                      description: ex.reason || undefined
                    } : null;
                  }).filter(Boolean) || [])
                ]
              : []
          ),
          sameAs: data.socialLinks || Object.values(COMPANY_DATA.socialLinks),
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: COMPANY_DATA.contact.phone || COMPANY_DATA.location.contact.phone,
            email: COMPANY_DATA.contact.email || COMPANY_DATA.location.contact.email
          },
          // Amenities from location data (Google-recognized names, API-ready structure)
          amenityFeature: (COMPANY_DATA.location.amenities || []).map(amenity => ({
            '@type': 'LocationFeatureSpecification',
            name: amenity.name,
            value: amenity.value
          })),
          // Payment methods from COMPANY_DATA (business-wide)
          paymentAccepted: COMPANY_DATA.paymentMethods
        };
      }

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${COMPANY_DATA.baseUrl}/#website`,
          url: COMPANY_DATA.baseUrl,
          name: COMPANY_DATA.dba,
          description: data.description || 'Your daily stop & go convenience store',
          inLanguage: 'en-CA',
          copyrightYear: new Date().getFullYear(),
          copyrightHolder: {
            '@id': `${COMPANY_DATA.baseUrl}/#organization`
          },
          publisher: {
            '@id': `${COMPANY_DATA.baseUrl}/#business`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${COMPANY_DATA.baseUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        };

      case 'Product': {
        const menuItem = data.menuItem || data.item || data;
        const itemUrl = data.itemUrl || data.url || COMPANY_DATA.baseUrl;
        const options = {
          priceInCents: data.priceInCents,
          currency: data.currency
        };

        return buildMenuItemSchema(menuItem, itemUrl, options);
      }

      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${COMPANY_DATA.baseUrl}/#organization`,
          name: COMPANY_DATA.legalName,
          alternateName: COMPANY_DATA.dba,
          url: COMPANY_DATA.baseUrl,
          logo: COMPANY_DATA.logoUrl,
          description: `${COMPANY_DATA.legalName} is a community-first convenience store offering essentials, RoCafé beverages, and local services.`,
          email: COMPANY_DATA.contact.email,
          telephone: COMPANY_DATA.contact.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_DATA.address.street || COMPANY_DATA.location.address.street,
            addressLocality: COMPANY_DATA.address.city || COMPANY_DATA.location.address.city,
            addressRegion: COMPANY_DATA.address.province || COMPANY_DATA.location.address.province,
            postalCode: COMPANY_DATA.address.postalCode || COMPANY_DATA.location.address.postalCode,
            addressCountry: COMPANY_DATA.defaults.country
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: COMPANY_DATA.contact.phone,
            email: COMPANY_DATA.contact.email
          },
          sameAs: Object.values(COMPANY_DATA.socialLinks || {}),
          taxID: COMPANY_DATA.gstNumber || undefined,
          areaServed: {
            '@type': 'City',
            name: COMPANY_DATA.address?.city || COMPANY_DATA.location.address.city
          },
          numberOfEmployees: COMPANY_DATA.location?.metadata?.employeeCount
            ? {
                '@type': 'QuantitativeValue',
                value: COMPANY_DATA.location.metadata.employeeCount
              }
            : undefined,
          // Link to main LocalBusiness location
          location: {
            '@id': `${COMPANY_DATA.baseUrl}/#business`
          }
        };

      case 'ReturnPolicy':
        return buildReturnPolicySchema(data);
      case 'WebApplication':
        return buildWebApplicationSchema(data);


      default:
        return data;
    }
  };

  const schema = generateSchema();

  if (!schema) {
    return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
