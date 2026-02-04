/**
 * Privacy Policy Schema Builder
 * Generates schema.org PrivacyPolicy JSON-LD
 *
 * @since February 4, 2026
 */

import COMPANY_DATA from '../config/company_data.js';
import { safeString } from '../utils/schemaHelpers.js';

const BASE_URL = 'https://romamart.ca';

export const buildPrivacyPolicySchema = (data = {}) => {
  const name = safeString(data.name || 'Roma Mart Privacy Policy');
  const url = data.url || `${BASE_URL}/privacy`;
  const effectiveDate = data.effectiveDate || '2025-07-28';
  const description = safeString(
    data.description ||
    'Roma Mart Corp. values your privacy and collects personal information in compliance with Canadian privacy laws (PIPEDA).'
  );

  const contactEmail = data.contactEmail || COMPANY_DATA.contextualEmails?.privacy || COMPANY_DATA.contact?.email || 'privacy@romamart.ca';
  const contactPhone = data.contactPhone || COMPANY_DATA.contact?.phone || '+1-382-342-2000';

  return {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    name,
    url,
    inLanguage: 'en-CA',
    datePublished: effectiveDate,
    dateModified: effectiveDate,
    description,
    publisher: {
      '@type': 'Organization',
      name: COMPANY_DATA.legalName || 'Roma Mart Corp.',
      url: BASE_URL,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: contactEmail,
        telephone: contactPhone
      }
    }
  };
};