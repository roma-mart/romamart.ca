/**
 * Structured Data (Schema.org) Component
 * Provides rich search results via JSON-LD
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import COMPANY_DATA from '../config/company_data';
import { buildMenuItemSchema } from '../schemas/menuItemSchema';
import { buildPrivacyPolicySchema } from '../schemas/privacyPolicySchema';
import { buildReturnPolicySchema } from '../schemas/returnPolicySchema';
import { buildBreadcrumbSchema } from '../schemas/breadcrumbSchema';
import { buildWebApplicationSchema } from '../schemas/webApplicationSchema';
import { buildServiceListSchema } from '../schemas/serviceSchema';
import { buildLocationListSchema } from '../schemas/locationSchema';
import { parse12hTo24h } from '../utils/dateHelpers';

const StructuredData = ({ type = 'LocalBusiness', data = {} }) => {
  const generateSchema = () => {
    switch (type) {
      case 'ProductList': {
        // Build ItemList containing all Product schemas
        // More efficient than multiple <script> tags
        if (!data.products || !Array.isArray(data.products)) {
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

        if (productSchemas.length === 0) {
          return null;
        }

        return {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: productSchemas.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: product
          }))
        };
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

      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://romamart.ca/#business',
          name: data.name || COMPANY_DATA.dba || COMPANY_DATA.legalName || 'Roma Mart Convenience',
          legalName: COMPANY_DATA.legalName || undefined,
          alternateName: data.alternateName || COMPANY_DATA.dba || 'Roma Mart',
          description: data.description || 'Your daily stop & go convenience store in Sarnia, Ontario. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
          url: 'https://romamart.ca',
          telephone: data.telephone || COMPANY_DATA.contact?.phone || COMPANY_DATA.location.contact.phone || '+1-382-342-2000',
          email: data.email || COMPANY_DATA.contact?.email || COMPANY_DATA.location.contact.email || 'contact@romamart.ca',
          priceRange: '$$',
          image: data.image || 'https://romamart.ca/images/store-front.jpg',
          logo: 'https://romamart.ca/logo.png',
          brand: {
            '@type': 'Brand',
            name: COMPANY_DATA.dba || 'Roma Mart Convenience'
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || COMPANY_DATA.address?.street || COMPANY_DATA.location.address.street || '189-3 Wellington Street',
            addressLocality: data.address?.city || COMPANY_DATA.address?.city || COMPANY_DATA.location.address.city || 'Sarnia',
            addressRegion: data.address?.province || COMPANY_DATA.address?.province || COMPANY_DATA.location.address.province || 'ON',
            postalCode: data.address?.postalCode || COMPANY_DATA.address?.postalCode || COMPANY_DATA.location.address.postalCode || 'N7T 1G6',
            addressCountry: COMPANY_DATA.address?.country || COMPANY_DATA.location.address.country || 'CA'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo?.latitude || COMPANY_DATA.location?.google?.coordinates?.lat || 42.970389,
            longitude: data.geo?.longitude || COMPANY_DATA.location?.google?.coordinates?.lng || -82.404589
          },
          hasMap: COMPANY_DATA.location?.google?.mapLink || undefined,
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
          timeZone: COMPANY_DATA.location?.hours?.timezone || 'America/Toronto',
          sameAs: data.socialLinks || Object.values(COMPANY_DATA.socialLinks),
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: COMPANY_DATA.contact?.phone || COMPANY_DATA.location?.contact?.phone || '+1-382-342-2000',
            email: COMPANY_DATA.contact?.email || COMPANY_DATA.location?.contact?.email || 'contact@romamart.ca'
          },
          areaServed: {
            '@type': 'City',
            name: COMPANY_DATA.location?.address?.city || 'Sarnia'
          },
          amenityFeature: [
            {
              '@type': 'LocationFeatureSpecification',
              name: 'Free WiFi',
              value: true
            },
            {
              '@type': 'LocationFeatureSpecification',
              name: 'Parking',
              value: true
            },
            {
              '@type': 'LocationFeatureSpecification',
              name: 'Wheelchair Accessible',
              value: true
            }
          ],
          paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Interac', 'Visa', 'Mastercard', 'American Express', 'Bitcoin']
        };

      case 'BreadcrumbList':
        // Use centralized breadcrumb schema builder
        return buildBreadcrumbSchema(data.breadcrumbs || data.items);

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://romamart.ca/#website',
          url: 'https://romamart.ca',
          name: 'Roma Mart Convenience',
          description: data.description || 'Your daily stop & go convenience store in Sarnia, Ontario.',
          publisher: {
            '@id': 'https://romamart.ca/#business'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://romamart.ca/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        };

      case 'Product': {
        const menuItem = data.menuItem || data.item || data;
        const itemUrl = data.itemUrl || data.url || 'https://romamart.ca';
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
          '@id': 'https://romamart.ca/#organization',
          name: COMPANY_DATA.legalName || 'Roma Mart Corp.',
          alternateName: COMPANY_DATA.dba || 'Roma Mart Convenience',
          url: 'https://romamart.ca',
          logo: 'https://romamart.ca/logo.png',
          description: 'Roma Mart Corp. is a community-first convenience store in Sarnia, Ontario, offering essentials, RoCafé beverages, and local services.',
          email: COMPANY_DATA.contact?.email || 'contact@romamart.ca',
          telephone: COMPANY_DATA.contact?.phone || '+1-382-342-2000',
          address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_DATA.address?.street || COMPANY_DATA.location?.address?.street || '189-3 Wellington Street',
            addressLocality: COMPANY_DATA.address?.city || COMPANY_DATA.location?.address?.city || 'Sarnia',
            addressRegion: COMPANY_DATA.address?.province || COMPANY_DATA.location?.address?.province || 'ON',
            postalCode: COMPANY_DATA.address?.postalCode || COMPANY_DATA.location?.address?.postalCode || 'N7T 1G6',
            addressCountry: COMPANY_DATA.address?.country === 'Canada' ? 'CA' : (COMPANY_DATA.address?.country || 'CA')
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: COMPANY_DATA.contact?.phone || '+1-382-342-2000',
            email: COMPANY_DATA.contact?.email || 'contact@romamart.ca'
          },
          sameAs: Object.values(COMPANY_DATA.socialLinks || {}),
          taxID: COMPANY_DATA.gstNumber || undefined,
          naicsCode: COMPANY_DATA.naicsCode || '4541',
          numberOfEmployees: COMPANY_DATA.location?.metadata?.employeeCount
            ? {
                '@type': 'QuantitativeValue',
                value: COMPANY_DATA.location.metadata.employeeCount
              }
            : undefined
        };

      case 'PrivacyPolicy':
        return buildPrivacyPolicySchema(data);

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
