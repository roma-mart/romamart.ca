/**
 * Unit Tests for Return Policy Schema Builder
 * Validates schema generation, defaults, and sanitization
 * 
 * @since February 4, 2026
 */

import { buildReturnPolicySchema } from '../../schemas/returnPolicySchema';

describe('buildReturnPolicySchema', () => {
  describe('Default Values', () => {
    it('should generate schema with all default values when no data provided', () => {
      const schema = buildReturnPolicySchema();

      expect(schema).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'ReturnPolicy',
        name: 'Roma Mart Returns & Refund Policy',
        url: 'https://romamart.ca/return-policy',
        itemCondition: 'https://schema.org/Faulty',
        returnMethod: 'https://schema.org/ReturnInStore',
        returnFees: 'Free',
        returnPeriodDays: 1
      });

      expect(schema.description).toContain('All Roma Mart Corp. sales are final');
      expect(schema.acceptanceConditions).toContain('24 hours of purchase');
      expect(schema.nonAcceptedReturns).toContain('Food and beverages');
    });

    it('should have correct price specifications for fees', () => {
      const schema = buildReturnPolicySchema();

      expect(schema.returnShippingFeesAmount).toEqual({
        '@type': 'PriceSpecification',
        priceCurrency: 'CAD',
        price: '0'
      });

      expect(schema.restockingFee).toEqual({
        '@type': 'PriceSpecification',
        priceCurrency: 'CAD',
        price: '0'
      });
    });
  });

  describe('Data Overrides', () => {
    it('should override name when provided', () => {
      const schema = buildReturnPolicySchema({
        name: 'Custom Return Policy'
      });

      expect(schema.name).toBe('Custom Return Policy');
    });

    it('should override url when provided', () => {
      const schema = buildReturnPolicySchema({
        url: 'https://example.com/returns'
      });

      expect(schema.url).toBe('https://example.com/returns');
    });

    it('should override description when provided', () => {
      const customDescription = 'Custom return policy description';
      const schema = buildReturnPolicySchema({
        description: customDescription
      });

      expect(schema.description).toBe(customDescription);
    });

    it('should override acceptanceConditions when provided', () => {
      const customConditions = 'Custom acceptance conditions';
      const schema = buildReturnPolicySchema({
        acceptanceConditions: customConditions
      });

      expect(schema.acceptanceConditions).toBe(customConditions);
    });

    it('should override nonAcceptedReturns when provided', () => {
      const customNonAccepted = 'Custom non-accepted items list';
      const schema = buildReturnPolicySchema({
        nonAcceptedReturns: customNonAccepted
      });

      expect(schema.nonAcceptedReturns).toBe(customNonAccepted);
    });
  });

  describe('Return Period', () => {
    it('should have 1-day return period by default', () => {
      const schema = buildReturnPolicySchema();

      expect(schema.returnPeriodDays).toBe(1);
    });

    it('should represent 24-hour policy correctly', () => {
      const schema = buildReturnPolicySchema();

      expect(schema.returnPeriodDays).toBe(1);
      expect(schema.acceptanceConditions).toContain('24 hours');
    });
  });

  describe('Return Method and Conditions', () => {
    it('should specify in-store return method', () => {
      const schema = buildReturnPolicySchema();

      expect(schema.returnMethod).toBe('https://schema.org/ReturnInStore');
    });

    it('should specify faulty item condition only', () => {
      const schema = buildReturnPolicySchema();

      expect(schema.itemCondition).toBe('https://schema.org/Faulty');
    });

    it('should specify free return fees', () => {
      const schema = buildReturnPolicySchema();

      expect(schema.returnFees).toBe('Free');
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML in name', () => {
      const schema = buildReturnPolicySchema({
        name: '<script>alert("xss")</script>Clean Name'
      });

      expect(schema.name).not.toContain('<script>');
      expect(schema.name).toContain('Clean Name');
    });

    it('should sanitize HTML in description', () => {
      const schema = buildReturnPolicySchema({
        description: '<img src=x onerror=alert(1)>Safe Description'
      });

      expect(schema.description).not.toContain('<img');
      expect(schema.description).toContain('Safe Description');
    });

    it('should sanitize HTML in acceptanceConditions', () => {
      const schema = buildReturnPolicySchema({
        acceptanceConditions: '<a href="javascript:void(0)">Click</a> Valid conditions'
      });

      expect(schema.acceptanceConditions).not.toContain('javascript:');
      expect(schema.acceptanceConditions).toContain('Valid conditions');
    });

    it('should sanitize HTML in nonAcceptedReturns', () => {
      const schema = buildReturnPolicySchema({
        nonAcceptedReturns: '<b onmouseover=alert(1)>Items</b> list'
      });

      expect(schema.nonAcceptedReturns).not.toContain('onmouseover');
      expect(schema.nonAcceptedReturns).toContain('list');
    });
  });

  describe('Schema Structure', () => {
    it('should include required schema.org fields', () => {
      const schema = buildReturnPolicySchema();

      expect(schema).toHaveProperty('@context');
      expect(schema).toHaveProperty('@type');
      expect(schema).toHaveProperty('name');
      expect(schema).toHaveProperty('url');
      expect(schema).toHaveProperty('description');
    });

    it('should have correct @context', () => {
      const schema = buildReturnPolicySchema();

      expect(schema['@context']).toBe('https://schema.org');
    });

    it('should have correct @type', () => {
      const schema = buildReturnPolicySchema();

      expect(schema['@type']).toBe('ReturnPolicy');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object as input', () => {
      const schema = buildReturnPolicySchema({});

      expect(schema).toBeDefined();
      expect(schema['@type']).toBe('ReturnPolicy');
      expect(schema.name).toBe('Roma Mart Returns & Refund Policy');
    });

    it('should handle null values in data object', () => {
      const schema = buildReturnPolicySchema({
        name: null,
        description: null
      });

      expect(schema.name).toBe('Roma Mart Returns & Refund Policy');
      expect(schema.description).toContain('All Roma Mart Corp. sales are final');
    });

    it('should handle undefined values in data object', () => {
      const schema = buildReturnPolicySchema({
        name: undefined,
        url: undefined
      });

      expect(schema.name).toBe('Roma Mart Returns & Refund Policy');
      expect(schema.url).toBe('https://romamart.ca/return-policy');
    });
  });
});
