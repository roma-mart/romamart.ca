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
          logo: 'https://romamart.ca/logo.png',
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
          openingHoursSpecification: data.hours || (
            COMPANY_DATA.location?.hours
              ? [
                  {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: [
                      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
                    ],
                    opens: COMPANY_DATA.location.hours.weekdays?.split('-')[0]?.trim() || '07:00',
                    closes: COMPANY_DATA.location.hours.weekdays?.split('-')[1]?.trim() || '22:00',
                    validFrom: undefined,
                    validThrough: undefined
                  },
                  // Add exceptions if present
                  ...(COMPANY_DATA.location.hours.exceptions?.map(ex => ({
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: undefined,
                    opens: ex.hours === 'Closed' ? undefined : ex.hours?.split('-')[0]?.trim(),
                    closes: ex.hours === 'Closed' ? undefined : ex.hours?.split('-')[1]?.trim(),
                    validFrom: ex.date,
                    validThrough: ex.date,
                    description: ex.reason || undefined
                  })) || [])
                ]
              : []
          ),
          timeZone: COMPANY_DATA.location?.hours?.timezone || 'America/Toronto',
          sameAs: data.socialLinks || Object.values(COMPANY_DATA.socialLinks),
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services & Products',
            itemListElement: (COMPANY_DATA.location?.services || []).map(service => {
              // Map known service keys to human-friendly names and types
              const serviceMap = {
                atm: { name: 'ATM Services', type: 'Service', description: 'Cash withdrawal and banking services available 24/7' },
                bitcoin_atm: { name: 'Bitcoin ATM', type: 'Service', description: 'Cryptocurrency buying and selling services' },
                rocafe: { name: 'RoCafé Coffee & Bubble Tea', type: 'Service', description: 'Fresh brewed coffee, signature bubble tea, matcha lattes, and fruit slushes' },
                halal_meat: { name: 'Halal Meat', type: 'Product', description: 'Certified Zabiha Halal meats' },
                printing: { name: 'Printing Services', type: 'Service', description: 'Document printing and copying' },
                package_pickup: { name: 'Package Services', type: 'Service', description: 'Shipping and package handling' },
                money_transfer: { name: 'Money Transfer', type: 'Service', description: 'Send and receive money worldwide' },
                gift_cards: { name: 'Gift Cards', type: 'Product', description: 'Prepaid and gift cards for major brands' },
                perfumes: { name: 'Perfumes', type: 'Product', description: 'Imported and local fragrances' },
                tobacco: { name: 'Tobacco & Vape Products', type: 'Product', description: 'Wide selection for adult customers (19+)' },
                lottery: { name: 'OLG Lottery', type: 'Service', description: 'Lottery tickets and scratch cards' }
              };
              const mapped = serviceMap[service] || { name: service, type: 'Service', description: '' };
              return {
                '@type': 'Offer',
                itemOffered: {
                  '@type': mapped.type,
                  name: mapped.name,
                  description: mapped.description
                }
              };
            })
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
