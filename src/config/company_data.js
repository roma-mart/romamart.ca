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
  gstNumber: '780971768',
  naicsCode: '4541',  // Grocery stores (North American Industry Classification System)
  naicsDescription: 'Grocery Stores',
  onlineStoreUrl: null,
  socialLinks: {
    facebook: 'https://www.facebook.com/romamartca',
    instagram: 'https://www.instagram.com/romamartca/',
    tiktok: 'https://www.tiktok.com/@romamartca/',
    snapchat: 'https://www.snapchat.com/@romamartca/',
    x: 'https://www.x.com/romamartca/'
  },
  // Fallback HQ info for resilience
  // HQ info is now sourced directly from the (primary) location in LOCATIONS
  address: getPrimaryLocation().address,
  
  hours: getPrimaryLocation().hours,
  contact: {
    phone: getPrimaryLocation().contact.phone,
    email: getPrimaryLocation().email,
    web3FormsAccessKey: getEnvVar('VITE_WEB3FORMS_KEY', 'YOUR_WEB3FORMS_KEY')
  },
  // Contextual email addresses for specialized pages
  contextualEmails: {
    general: 'contact@romamart.ca',
    privacy: 'privacy@romamart.ca',
    accessibility: 'accessibility@romamart.ca',
    technology: 'technology@romamart.ca',
    legal: 'legal@romamart.ca',
    support: 'support@romamart.ca'
  },
  // Location-dependent info is mapped from the primary location object
  location: getPrimaryLocation(),
  trustpilotReviewUrl: 'https://www.trustpilot.com/review/romamart.ca'
  // Add other brand data as needed
};

/**
 * Get the appropriate email address for a given page context
 * @param {'general' | 'privacy' | 'accessibility' | 'technology' | 'legal'} context - Page context
 * @returns {string} Contextual email address
 */
export function getContextualEmail(context = 'general') {
  return COMPANY_DATA.contextualEmails[context] || COMPANY_DATA.contextualEmails.general;
}

export default COMPANY_DATA;
