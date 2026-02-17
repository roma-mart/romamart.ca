/**
 * Privacy Policy Schema Builder
 * Generates schema.org PrivacyPolicy JSON-LD
 *
 * @since February 4, 2026
 */

import COMPANY_DATA from '../config/company_data.js';
import { safeString } from '../utils/schemaHelpers.js';

export const buildPrivacyPolicySchema = (data = {}, options = {}) => {
  const cd = options.companyData || COMPANY_DATA;
  const name = safeString(data.name || `${cd.dba} Privacy Policy`);
  const url = data.url || `${cd.baseUrl}${cd.endpoints.privacy}`;
  const effectiveDate = data.effectiveDate || '2025-07-28';
  const description = safeString(
    data.description ||
      `${cd.legalName} values your privacy and collects personal information in compliance with Canadian privacy laws (PIPEDA).`
  );

  const contactEmail = data.contactEmail || cd.contextualEmails?.privacy || cd.contact.email;
  const contactPhone = data.contactPhone || cd.contact.phone;

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
      name: cd.legalName,
      url: cd.baseUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: contactEmail,
        telephone: contactPhone,
      },
    },
  };
};
