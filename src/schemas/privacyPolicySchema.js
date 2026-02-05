/**
 * Privacy Policy Schema Builder
 * Generates schema.org PrivacyPolicy JSON-LD
 *
 * @since February 4, 2026
 */

import COMPANY_DATA from '../config/company_data.js';
import { safeString } from '../utils/schemaHelpers.js';

export const buildPrivacyPolicySchema = (data = {}) => {
  const name = safeString(data.name || `${COMPANY_DATA.dba} Privacy Policy`);
  const url = data.url || `${COMPANY_DATA.baseUrl}${COMPANY_DATA.endpoints.privacy}`;
  const effectiveDate = data.effectiveDate || '2025-07-28';
  const description = safeString(
    data.description ||
    `${COMPANY_DATA.legalName} values your privacy and collects personal information in compliance with Canadian privacy laws (PIPEDA).`
  );

  const contactEmail = data.contactEmail || COMPANY_DATA.contextualEmails.privacy || COMPANY_DATA.contact.email;
  const contactPhone = data.contactPhone || COMPANY_DATA.contact.phone;

  return {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    '@id': `${url}#policy`,
    name,
    url,
    inLanguage: 'en-CA',
    datePublished: effectiveDate,
    dateModified: effectiveDate,
    description,
    publisher: {
      '@type': 'Organization',
      name: COMPANY_DATA.legalName,
      url: COMPANY_DATA.baseUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: contactEmail,
        telephone: contactPhone
      }
    }
  };
};