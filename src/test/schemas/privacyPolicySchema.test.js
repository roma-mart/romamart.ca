/**
 * Unit Tests for Privacy Policy Schema Builder
 * Validates schema generation, defaults, and sanitization
 * 
 * @since February 4, 2026
 */

import { buildPrivacyPolicySchema } from '../../schemas/privacyPolicySchema';
import COMPANY_DATA from '../../config/company_data';

describe('buildPrivacyPolicySchema', () => {
  describe('Default Values', () => {
    it('should generate schema with all default values when no data provided', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'PrivacyPolicy',
        name: 'Roma Mart Privacy Policy',
        url: 'https://romamart.ca/privacy',
        inLanguage: 'en-CA',
        datePublished: '2025-07-28',
        dateModified: '2025-07-28'
      });

      expect(schema.description).toContain('Roma Mart Corp. values your privacy');
    });

    it('should use COMPANY_DATA for organization name', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher.name).toBe(COMPANY_DATA.legalName);
    });

    it('should have correct publisher structure', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher).toMatchObject({
        '@type': 'Organization',
        name: 'Roma Mart Corp.',
        url: 'https://romamart.ca'
      });
    });

    it('should have contact point with default privacy email', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher.contactPoint).toMatchObject({
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: 'privacy@romamart.ca'
      });
    });

    it('should fallback to COMPANY_DATA phone if no override', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher.contactPoint.telephone).toBeDefined();
      expect(typeof schema.publisher.contactPoint.telephone).toBe('string');
    });
  });

  describe('Data Overrides', () => {
    it('should override name when provided', () => {
      const schema = buildPrivacyPolicySchema({
        name: 'Custom Privacy Policy'
      });

      expect(schema.name).toBe('Custom Privacy Policy');
    });

    it('should override url when provided', () => {
      const schema = buildPrivacyPolicySchema({
        url: 'https://example.com/privacy'
      });

      expect(schema.url).toBe('https://example.com/privacy');
    });

    it('should override effectiveDate when provided', () => {
      const schema = buildPrivacyPolicySchema({
        effectiveDate: '2026-01-01'
      });

      expect(schema.datePublished).toBe('2026-01-01');
      expect(schema.dateModified).toBe('2026-01-01');
    });

    it('should override description when provided', () => {
      const customDescription = 'Custom privacy policy description';
      const schema = buildPrivacyPolicySchema({
        description: customDescription
      });

      expect(schema.description).toBe(customDescription);
    });

    it('should override contactEmail when provided', () => {
      const schema = buildPrivacyPolicySchema({
        contactEmail: 'custom@example.com'
      });

      expect(schema.publisher.contactPoint.email).toBe('custom@example.com');
    });

    it('should override contactPhone when provided', () => {
      const schema = buildPrivacyPolicySchema({
        contactPhone: '+1-555-0123'
      });

      expect(schema.publisher.contactPoint.telephone).toBe('+1-555-0123');
    });
  });

  describe('Effective Date Handling', () => {
    it('should use same date for published and modified by default', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.datePublished).toBe(schema.dateModified);
    });

    it('should use custom date for both published and modified', () => {
      const customDate = '2026-12-31';
      const schema = buildPrivacyPolicySchema({
        effectiveDate: customDate
      });

      expect(schema.datePublished).toBe(customDate);
      expect(schema.dateModified).toBe(customDate);
    });
  });

  describe('Language and Region', () => {
    it('should specify en-CA language', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.inLanguage).toBe('en-CA');
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML in name', () => {
      const schema = buildPrivacyPolicySchema({
        name: '<script>alert("xss")</script>Clean Name'
      });

      expect(schema.name).not.toContain('<script>');
      expect(schema.name).toContain('Clean Name');
    });

    it('should sanitize HTML in description', () => {
      const schema = buildPrivacyPolicySchema({
        description: '<img src=x onerror=alert(1)>Safe Description'
      });

      expect(schema.description).not.toContain('<img');
      expect(schema.description).toContain('Safe Description');
    });
  });

  describe('Schema Structure', () => {
    it('should include required schema.org fields', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema).toHaveProperty('@context');
      expect(schema).toHaveProperty('@type');
      expect(schema).toHaveProperty('name');
      expect(schema).toHaveProperty('url');
      expect(schema).toHaveProperty('description');
      expect(schema).toHaveProperty('publisher');
    });

    it('should have correct @context', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema['@context']).toBe('https://schema.org');
    });

    it('should have correct @type', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema['@type']).toBe('PrivacyPolicy');
    });

    it('should have nested publisher organization', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher['@type']).toBe('Organization');
      expect(schema.publisher.contactPoint['@type']).toBe('ContactPoint');
    });
  });

  describe('ContactPoint Details', () => {
    it('should specify privacy contact type', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher.contactPoint.contactType).toBe('privacy');
    });

    it('should include email in contact point', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher.contactPoint.email).toBeDefined();
      expect(typeof schema.publisher.contactPoint.email).toBe('string');
    });

    it('should include telephone in contact point', () => {
      const schema = buildPrivacyPolicySchema();

      expect(schema.publisher.contactPoint.telephone).toBeDefined();
      expect(typeof schema.publisher.contactPoint.telephone).toBe('string');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object as input', () => {
      const schema = buildPrivacyPolicySchema({});

      expect(schema).toBeDefined();
      expect(schema['@type']).toBe('PrivacyPolicy');
      expect(schema.name).toBe('Roma Mart Privacy Policy');
    });

    it('should handle null values in data object', () => {
      const schema = buildPrivacyPolicySchema({
        name: null,
        description: null
      });

      expect(schema.name).toBe('Roma Mart Privacy Policy');
      expect(schema.description).toContain('Roma Mart Corp. values your privacy');
    });

    it('should handle undefined values in data object', () => {
      const schema = buildPrivacyPolicySchema({
        name: undefined,
        url: undefined
      });

      expect(schema.name).toBe('Roma Mart Privacy Policy');
      expect(schema.url).toBe('https://romamart.ca/privacy');
    });
  });
});
