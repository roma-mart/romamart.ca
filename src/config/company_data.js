// src/config/company_data.js

// Centralized company data for Roma Mart 2.0
// Single source of truth for brand info, social links, order platform, etc.

// IMPORTANT:
// All headquarters (HQ) info (address, hours, contact, GST, etc.) sourced from this file (COMPANY_DATA).
// No hardcoded or duplicated HQ info is allowed in any page or component.
// All overrides and fallbacks for HQ data must be handled here for maintainability and resilience.

// import { getOrderingUrl } from './ordering';
import { getPrimaryLocation } from '../data/locations.js';
import { getEnvVar } from '../utils/getAssetUrl.js';

const COMPANY_DATA = {
  legalName: 'Roma Mart Corp.',
  dba: 'Roma Mart Convenience',
  heroBadge: 'New In Town',
  gstNumber: '780971768',
  naicsCode: '4541', // Grocery stores (North American Industry Classification System)
  naicsDescription: 'Grocery Stores',
  // Base URLs (SSOT for all schema URLs)
  baseUrl: 'https://romamart.ca',
  logoUrl: 'https://romamart.ca/logo.png',
  onlineStoreUrl: null,
  // Schema-specific endpoints (trailing slashes match canonical URLs)
  endpoints: {
    returnPolicy: '/return-policy/',
    privacy: '/privacy/',
    services: '/services/',
    locations: '/locations/',
    menu: '/menu/',
  },
  // Default values for schemas
  defaults: {
    productCategory: 'Food & Beverage',
    priceRange: '$$',
    country: 'CA',
    currency: 'CAD',
    timezone: 'America/Toronto',
    ageRestriction: '19-', // Minimum age for age-restricted products/services (Ontario law)
  },
  // Accepted payment methods (business-wide, for LocalBusiness schema)
  paymentMethods: ['Cash', 'Credit Card', 'Debit Card', 'Interac', 'Visa', 'Mastercard', 'American Express', 'Bitcoin'],
  // Return policy defaults (business-wide, for MerchantReturnPolicy schema)
  returnPolicy: {
    merchantReturnDays: 1,
    returnMethod: 'https://schema.org/ReturnInStore',
    returnFees: 'https://schema.org/FreeReturn',
    itemCondition: 'https://schema.org/DamagedCondition',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  },
  socialLinks: {
    facebook: 'https://www.facebook.com/romamartca',
    instagram: 'https://www.instagram.com/romamartca/',
    tiktok: 'https://www.tiktok.com/@romamartca/',
    snapchat: 'https://www.snapchat.com/@romamartca/',
    x: 'https://www.x.com/romamartca/',
  },
  // HQ info — sourced from the primary location in LOCATIONS.
  // Live data comes from /api/public-company-data via CompanyDataContext.
  address: getPrimaryLocation().address,
  hours: getPrimaryLocation().hours,
  contact: {
    phone: getPrimaryLocation().contact.phone,
    email: getPrimaryLocation().contact.email,
    web3FormsAccessKey: getEnvVar('VITE_WEB3FORMS_KEY', 'YOUR_WEB3FORMS_KEY'),
  },
  // Contextual email addresses for specialized pages
  contextualEmails: {
    general: 'contact@romamart.ca',
    privacy: 'privacy@romamart.ca',
    accessibility: 'accessibility@romamart.ca',
    technology: 'technology@romamart.ca',
    legal: 'legal@romamart.ca',
    support: 'support@romamart.ca',
  },
  // HQ location — sourced from the primary location in LOCATIONS.
  // Live location data comes from /api/public-locations via LocationsContext.
  location: getPrimaryLocation(),
  trustpilotReviewUrl: 'https://www.trustpilot.com/review/romamart.ca',
  // PWA configuration (SSOT for WebApplication schema)
  pwa: {
    webApplication: {
      name: 'Roma Mart Convenience',
      url: 'https://romamart.ca',
      description:
        'Shop Roma Mart online - groceries, global snacks, halal meat, RoCafé coffee, and more. Available 24/7 from any device with offline support.',
      applicationCategory: 'Shopping',
      operatingSystem: 'Any (Web Browser)',
      offers: {
        price: '0',
        priceCurrency: 'CAD',
      },
      browserRequirements: 'Requires JavaScript. Modern browsers (Chrome, Firefox, Safari, Edge) recommended.',
      permissions: ['Location (optional, for nearest store)'],
    },
  },
  // Add other brand data as needed
};

/**
 * Get the appropriate email address for a given page context
 * @param {'general' | 'privacy' | 'accessibility' | 'technology' | 'legal' | 'support'} context - Page context
 * @returns {string} Contextual email address
 */
export function getContextualEmail(context = 'general') {
  return COMPANY_DATA.contextualEmails[context] || COMPANY_DATA.contextualEmails.general;
}

export default COMPANY_DATA;
