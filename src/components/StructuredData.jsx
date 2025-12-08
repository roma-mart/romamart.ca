/**
 * Structured Data (Schema.org) Component
 * Provides rich search results via JSON-LD
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import COMPANY_DATA from '../config/company_data';

const StructuredData = ({ type = 'LocalBusiness', data = {} }) => {
  const generateSchema = () => {
    switch (type) {
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://romamart.ca/#business',
          name: data.name || COMPANY_DATA.legalName || 'Roma Mart Convenience',
          alternateName: data.alternateName || COMPANY_DATA.dba || 'Roma Mart',
          description: data.description || 'Your daily stop & go convenience store in Sarnia, Ontario. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
          url: 'https://romamart.ca',
          telephone: data.telephone || COMPANY_DATA.location.contact.phone || '+1-382-342-2000',
          email: data.email || COMPANY_DATA.location.contact.email || 'contact@romamart.ca',
          priceRange: '$$',
          image: data.image || 'https://romamart.ca/images/store-front.jpg',
          logo: 'https://romamart.ca/icon-512.svg',
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street || COMPANY_DATA.location.address.street || '189-3 Wellington Street',
            addressLocality: data.address?.city || COMPANY_DATA.location.address.city || 'Sarnia',
            addressRegion: data.address?.province || 'ON',
            postalCode: data.address?.postalCode || COMPANY_DATA.location.address.postalCode || 'N7T 1G6',
            addressCountry: COMPANY_DATA.location.address.country || 'CA'
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
          sameAs: data.socialLinks || Object.values(COMPANY_DATA.socialLinks),
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services & Products',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'RoCafé Coffee & Bubble Tea',
                  description: 'Fresh brewed coffee, signature bubble tea, matcha lattes, and fruit slushes'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'ATM Services',
                  description: 'Cash withdrawal and banking services available 24/7'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Bitcoin ATM',
                  description: 'Cryptocurrency buying and selling services'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Grocery Essentials',
                  description: 'Daily staples, milk, bread, and pantry needs'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Halal Meat',
                  description: 'Certified Zabiha Halal meats'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Global Snacks',
                  description: 'Imported flavors and unique treats from around the world'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Tobacco & Vape Products',
                  description: 'Wide selection for adult customers (19+)'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'OLG Lottery',
                  description: 'Lottery tickets and scratch cards'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Package Services',
                  description: 'Shipping and package handling'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Printing Services',
                  description: 'Document printing and copying'
                }
              }
            ]
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
