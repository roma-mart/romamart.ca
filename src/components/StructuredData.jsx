/**
 * Structured Data (Schema.org) Component
 * Provides rich search results via JSON-LD
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = ({ type = 'LocalBusiness', data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://romamart.ca/#business',
          name: data.name || 'Roma Mart Convenience',
          alternateName: data.alternateName || 'Roma Mart',
          description: data.description || 'Your daily stop & go convenience store in Sarnia, Ontario. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
          url: 'https://romamart.ca',
          telephone: data.telephone || '+1-382-342-2000',
          email: data.email || 'contact@romamart.ca',
          priceRange: '$$',
          image: data.image || 'https://romamart.ca/images/store-front.jpg',
          logo: 'https://romamart.ca/icon-512.svg',
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || '189-3 Wellington Street',
            addressLocality: data.address?.city || 'Sarnia',
            addressRegion: data.address?.region || 'ON',
            postalCode: data.address?.postal || 'N7T 1G6',
            addressCountry: 'CA'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo?.latitude || 42.970389,
            longitude: data.geo?.longitude || -82.404589
          },
          openingHoursSpecification: data.hours || [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '07:00',
              closes: '23:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday', 'Sunday'],
              opens: '08:00',
              closes: '23:00'
            }
          ],
          sameAs: data.socialLinks || [
            'https://www.facebook.com/romamartca',
            'https://www.instagram.com/romamartca/',
            'https://www.tiktok.com/@romamartca/',
            'https://www.snapchat.com/@romamartca/',
            'https://www.x.com/romamartca/'
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'ATM Services'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Bitcoin ATM'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'RoCafé Coffee Shop'
                }
              }
            ]
          }
        };

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          })) || []
        };

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

      default:
        return data;
    }
  };

  const schema = generateSchema();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
