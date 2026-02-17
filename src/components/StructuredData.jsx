/**
 * Structured Data (Schema.org) Component
 * Provides rich search results via JSON-LD
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCompanyData } from '../contexts/CompanyDataContext';
import { buildMenuItemSchema } from '../schemas/menuItemSchema';
import { buildReturnPolicySchema } from '../schemas/returnPolicySchema';
import { buildBreadcrumbSchema } from '../schemas/breadcrumbSchema';
import { buildWebApplicationSchema } from '../schemas/webApplicationSchema';
import { buildServiceListSchema } from '../schemas/serviceSchema';
import { buildLocationListSchema } from '../schemas/locationSchema';

const StructuredData = ({ type = 'LocalBusiness', data = {} }) => {
  const { companyData } = useCompanyData();
  const schemaOptions = { companyData };

  const generateSchema = () => {
    switch (type) {
      case 'ProductList': {
        // Build ItemList containing all Product schemas
        // More efficient than multiple <script> tags
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[StructuredData] ProductList rendering - Input:', {
            hasProducts: !!data.products,
            isArray: Array.isArray(data.products),
            productCount: data.products?.length || 0,
          });
        }

        if (!data.products || !Array.isArray(data.products)) {
          console.warn('[StructuredData] ProductList - No valid products array');
          return null;
        }

        const productSchemas = data.products
          .map((productData) =>
            buildMenuItemSchema(productData.menuItem, productData.itemUrl, {
              currency: productData.currency || 'CAD',
              priceInCents: productData.priceInCents,
              companyData,
            })
          )
          .filter(Boolean); // Remove null schemas

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[StructuredData] ProductList - Generated schemas:', {
            inputCount: data.products.length,
            outputCount: productSchemas.length,
            sampleProduct: productSchemas[0] ? productSchemas[0].name : 'N/A',
          });
        }

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
            item: product,
          })),
        };

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[StructuredData] ProductList - Final schema:', {
            type: schema['@type'],
            itemCount: schema.itemListElement.length,
          });
        }

        return schema;
      }

      case 'ServiceList': {
        // Build ItemList containing all Service schemas
        if (!data.services || !Array.isArray(data.services)) {
          return null;
        }

        // Merge page-specific options with schemaOptions (companyData)
        return buildServiceListSchema(data.services, { ...schemaOptions, ...(data.options || {}) });
      }

      case 'LocationList': {
        // Build ItemList containing all LocalBusiness (location) schemas
        if (!data.locations || !Array.isArray(data.locations)) {
          return null;
        }

        // Merge page-specific options with schemaOptions (companyData)
        return buildLocationListSchema(data.locations, { ...schemaOptions, ...(data.options || {}) });
      }

      case 'BreadcrumbList':
        // Use centralized breadcrumb schema builder
        return buildBreadcrumbSchema(data.breadcrumbs || data.items);

      case 'LocalBusiness': {
        // Dynamic LocalBusiness pulled from companyData (SSOT)
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
          '@id': `${companyData.baseUrl}/#business`,
          name: data.name || companyData.dba || companyData.legalName,
          legalName: companyData.legalName || undefined,
          alternateName: data.alternateName || companyData.dba,
          description:
            data.description ||
            'Your daily stop & go convenience store. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
          url: companyData.baseUrl,
          telephone: data.telephone || companyData.contact.phone || companyData.location.contact.phone,
          email: data.email || companyData.contact.email || companyData.location.contact.email,
          priceRange: companyData.defaults.priceRange,
          image: data.image || `${companyData.baseUrl}/images/store-front.jpg`,
          logo: companyData.logoUrl,
          brand: {
            '@type': 'Brand',
            name: companyData.dba,
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || companyData.address.street || companyData.location.address.street,
            addressLocality: data.address?.city || companyData.address.city || companyData.location.address.city,
            addressRegion:
              data.address?.province || companyData.address.province || companyData.location.address.province,
            postalCode:
              data.address?.postalCode || companyData.address.postalCode || companyData.location.address.postalCode,
            addressCountry: companyData.defaults.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo?.latitude || companyData.location.google.coordinates.lat,
            longitude: data.geo?.longitude || companyData.location.google.coordinates.lng,
          },
          hasMap: companyData.location?.google?.mapLink || undefined,
          currenciesAccepted: companyData.defaults.currency,
          areaServed: {
            '@type': 'City',
            name: data.address?.city || companyData.address?.city || companyData.location.address.city,
          },
          openingHoursSpecification:
            data.hours ||
            (companyData.location?.hours?.daily
              ? [
                  // Convert daily hours to Schema.org format (24-hour times)
                  ...Object.entries(companyData.location.hours.daily)
                    .filter(([, hours]) => hours && hours !== 'Closed' && hours.includes('-'))
                    .map(([day, hours]) => {
                      const parts = hours.split('-').map((t) => t.trim());
                      if (parts.length !== 2) return null;
                      const opens = parse12hTo24h(parts[0]);
                      const closes = parse12hTo24h(parts[1]);
                      return opens && closes
                        ? {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: [day],
                            opens,
                            closes,
                          }
                        : null;
                    })
                    .filter(Boolean),
                  // Add exceptions if present
                  ...(companyData.location.hours.exceptions
                    ?.map((ex) => {
                      if (!ex.hours || ex.hours === 'Closed' || !ex.hours.includes('-')) return null;
                      const parts = ex.hours.split('-').map((t) => t.trim());
                      if (parts.length !== 2) return null;
                      const opens = parse12hTo24h(parts[0]);
                      const closes = parse12hTo24h(parts[1]);
                      return opens && closes
                        ? {
                            '@type': 'OpeningHoursSpecification',
                            opens,
                            closes,
                            validFrom: ex.date,
                            validThrough: ex.date,
                            description: ex.reason || undefined,
                          }
                        : null;
                    })
                    .filter(Boolean) || []),
                ]
              : []),
          sameAs: data.socialLinks || Object.values(companyData.socialLinks),
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: companyData.contact.phone || companyData.location.contact.phone,
            email: companyData.contact.email || companyData.location.contact.email,
          },
          // Amenities from location data (Google-recognized names, API-ready structure)
          amenityFeature: (companyData.location.amenities || []).map((amenity) => ({
            '@type': 'LocationFeatureSpecification',
            name: amenity.name,
            value: amenity.value,
          })),
          // Payment methods from companyData (business-wide)
          paymentAccepted: companyData.paymentMethods,
        };
      }

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${companyData.baseUrl}/#website`,
          url: companyData.baseUrl,
          name: companyData.dba,
          description: data.description || 'Your daily stop & go convenience store',
          inLanguage: 'en-CA',
          copyrightYear: new Date().getFullYear(),
          copyrightHolder: {
            '@id': `${companyData.baseUrl}/#organization`,
          },
          publisher: {
            '@id': `${companyData.baseUrl}/#business`,
          },
        };

      case 'Product': {
        const menuItem = data.menuItem || data.item || data;
        const itemUrl = data.itemUrl || data.url || companyData.baseUrl;
        const options = {
          priceInCents: data.priceInCents,
          currency: data.currency,
          companyData,
        };

        return buildMenuItemSchema(menuItem, itemUrl, options);
      }

      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${companyData.baseUrl}/#organization`,
          name: companyData.legalName,
          alternateName: companyData.dba,
          url: companyData.baseUrl,
          logo: companyData.logoUrl,
          description: `${companyData.legalName} is a community-first convenience store offering essentials, RoCafé beverages, and local services.`,
          email: companyData.contact.email,
          telephone: companyData.contact.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: companyData.address.street || companyData.location.address.street,
            addressLocality: companyData.address.city || companyData.location.address.city,
            addressRegion: companyData.address.province || companyData.location.address.province,
            postalCode: companyData.address.postalCode || companyData.location.address.postalCode,
            addressCountry: companyData.defaults.country,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: companyData.contact.phone,
            email: companyData.contact.email,
          },
          sameAs: Object.values(companyData.socialLinks || {}),
          taxID: companyData.gstNumber || undefined,
          areaServed: {
            '@type': 'City',
            name: companyData.address?.city || companyData.location.address.city,
          },
          numberOfEmployees: companyData.location?.metadata?.employeeCount
            ? {
                '@type': 'QuantitativeValue',
                value: companyData.location.metadata.employeeCount,
              }
            : undefined,
          // Link to main LocalBusiness location
          location: {
            '@id': `${companyData.baseUrl}/#business`,
          },
        };

      case 'ReturnPolicy':
        return buildReturnPolicySchema(data, schemaOptions);
      case 'WebApplication':
        return buildWebApplicationSchema(data, schemaOptions);

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
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default StructuredData;
