/**
 * Return Policy Schema Builder
 * Generates schema.org ReturnPolicy JSON-LD
 *
 * @since February 4, 2026
 */

import { safeString } from '../utils/schemaHelpers.js';

const BASE_URL = 'https://romamart.ca';

export const buildReturnPolicySchema = (data = {}) => {
  const name = safeString(data.name || 'Roma Mart Returns & Refund Policy');
  const url = data.url || `${BASE_URL}/return-policy`;
  const description = safeString(
    data.description ||
    'All Roma Mart Corp. sales are final. Returns accepted only for faulty products confirmed to be faulty due to an issue that existed prior to purchase.'
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'ReturnPolicy',
    name,
    url,
    description,
    itemCondition: 'https://schema.org/Faulty',
    returnMethod: 'https://schema.org/ReturnInStore',
    returnFees: 'Free',
    returnShippingFeesAmount: {
      '@type': 'PriceSpecification',
      priceCurrency: 'CAD',
      price: '0'
    },
    restockingFee: {
      '@type': 'PriceSpecification',
      priceCurrency: 'CAD',
      price: '0'
    },
    returnPeriodDays: 1,
    acceptanceConditions: safeString(
      data.acceptanceConditions ||
      'Product must be reported as faulty within 24 hours of purchase. Original receipt required. Product must be in original packaging (if applicable) with no signs of use or tampering. Fault must be clearly attributable to Roma Mart Corp. or manufacturer.'
    ),
    nonAcceptedReturns: safeString(
      data.nonAcceptedReturns ||
      'Food and beverages (unless expired at time of purchase), tobacco or vape products, lottery tickets or scratch cards, phone cards or gift cards, personal hygiene or health products, items marked as final sale/clearance/discontinued, or any product that has been opened, used, or damaged after sale.'
    )
  };
};