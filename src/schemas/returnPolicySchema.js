/**
 * Return Policy Schema Builder
 * Generates schema.org ReturnPolicy JSON-LD
 *
 * @since February 4, 2026
 */

import COMPANY_DATA from '../config/company_data.js';
import { safeString } from '../utils/schemaHelpers.js';

export const buildReturnPolicySchema = (data = {}, options = {}) => {
  const cd = options.companyData || COMPANY_DATA;
  const name = safeString(data.name || `${cd.dba} Returns & Refund Policy`);
  const url = data.url || `${cd.baseUrl}${cd.endpoints.returnPolicy}`;
  const description = safeString(
    data.description ||
      `All ${cd.legalName} sales are final. Returns accepted only for faulty products confirmed to be faulty due to an issue that existed prior to purchase.`
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'MerchantReturnPolicy',
    '@id': `${url}#policy`,
    name,
    url,
    description,
    applicableCountry: cd.defaults.country,
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 1,
    itemCondition: 'https://schema.org/DamagedCondition',
    returnMethod: 'https://schema.org/ReturnInStore',
    returnFees: 'https://schema.org/FreeReturn',
    returnShippingFeesAmount: {
      '@type': 'MonetaryAmount',
      currency: cd.defaults.currency,
      value: '0',
    },
    restockingFee: {
      '@type': 'MonetaryAmount',
      currency: cd.defaults.currency,
      value: '0',
    },
    returnPolicySeasonalOverride: [],
    customerRemorseReturnFees: 'https://schema.org/ReturnFeesCustomerResponsibility', // Customer can't return just because they changed mind
    customerRemorseReturnLabelSource: 'https://schema.org/ReturnLabelCustomerResponsibility',
    refundType: 'https://schema.org/FullRefund', // Full refund for faulty items
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Acceptance Conditions',
        value: safeString(
          data.acceptanceConditions ||
            'Product must be reported as faulty within 24 hours of purchase. Original receipt required. Product must be in original packaging (if applicable) with no signs of use or tampering. Fault must be clearly attributable to Roma Mart Corp. or manufacturer.'
        ),
      },
      {
        '@type': 'PropertyValue',
        name: 'Non-Accepted Returns',
        value: safeString(
          data.nonAcceptedReturns ||
            'Food and beverages (unless expired at time of purchase), tobacco or vape products, lottery tickets or scratch cards, phone cards or gift cards, personal hygiene or health products, items marked as final sale/clearance/discontinued, or any product that has been opened, used, or damaged after sale.'
        ),
      },
    ],
  };
};
