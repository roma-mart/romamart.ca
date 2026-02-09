/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { buildBreadcrumbSchema, buildBreadcrumbArray, quickBreadcrumb } from '../../schemas/breadcrumbSchema.js';

describe('breadcrumbSchema', () => {
  describe('buildBreadcrumbSchema', () => {
    it('should build valid BreadcrumbList schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://romamart.ca/' },
        { name: 'Services', url: 'https://romamart.ca/services/' },
      ];

      const schema = buildBreadcrumbSchema(breadcrumbs);

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://romamart.ca/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://romamart.ca/services/',
          },
        ],
      });
    });

    it('should return null for empty array', () => {
      expect(buildBreadcrumbSchema([])).toBeNull();
    });

    it('should return null for non-array input', () => {
      expect(buildBreadcrumbSchema(null)).toBeNull();
      expect(buildBreadcrumbSchema(undefined)).toBeNull();
      expect(buildBreadcrumbSchema('string')).toBeNull();
    });

    it('should filter invalid breadcrumb items', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://romamart.ca/' },
        { name: 'Invalid' }, // Missing url
        { url: 'https://romamart.ca/test/' }, // Missing name
        null,
        undefined,
        { name: 'Services', url: 'https://romamart.ca/services/' },
      ];

      const schema = buildBreadcrumbSchema(breadcrumbs);

      expect(schema).toBeTruthy();
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[1].name).toBe('Services');
    });

    it('should handle single breadcrumb', () => {
      const breadcrumbs = [{ name: 'Home', url: 'https://romamart.ca/' }];

      const schema = buildBreadcrumbSchema(breadcrumbs);

      expect(schema).toBeTruthy();
      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0].position).toBe(1);
    });

    it('should correctly number positions', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://romamart.ca/' },
        { name: 'Products', url: 'https://romamart.ca/products/' },
        { name: 'RoCafé', url: 'https://romamart.ca/rocafe/' },
      ];

      const schema = buildBreadcrumbSchema(breadcrumbs);

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it('should preserve URL formatting', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://romamart.ca/' },
        { name: 'Services', url: 'https://romamart.ca/services/#atm' },
      ];

      const schema = buildBreadcrumbSchema(breadcrumbs);

      expect(schema.itemListElement[1].item).toBe('https://romamart.ca/services/#atm');
    });
  });

  describe('buildBreadcrumbArray', () => {
    it('should build breadcrumb array with home and current page', () => {
      const breadcrumbs = buildBreadcrumbArray('Services', 'https://romamart.ca/services/');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({
        name: 'Home',
        url: 'https://romamart.ca/',
      });
      expect(breadcrumbs[1]).toEqual({
        name: 'Services',
        url: 'https://romamart.ca/services/',
      });
    });

    it('should include parent pages', () => {
      const parentPages = [{ name: 'Products', url: 'https://romamart.ca/products/' }];

      const breadcrumbs = buildBreadcrumbArray('RoCafé', 'https://romamart.ca/rocafe/', parentPages);

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[1].name).toBe('Products');
      expect(breadcrumbs[2].name).toBe('RoCafé');
    });

    it('should handle empty parent pages', () => {
      const breadcrumbs = buildBreadcrumbArray('Contact', 'https://romamart.ca/contact/', []);

      expect(breadcrumbs).toHaveLength(2);
    });

    it('should handle undefined parent pages', () => {
      const breadcrumbs = buildBreadcrumbArray('About', 'https://romamart.ca/about/');

      expect(breadcrumbs).toHaveLength(2);
    });
  });

  describe('quickBreadcrumb', () => {
    it('should generate schema for simple page', () => {
      const schema = quickBreadcrumb('Services', 'services');

      expect(schema).toBeTruthy();
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[1].name).toBe('Services');
      expect(schema.itemListElement[1].item).toBe('https://romamart.ca/services/');
    });

    it('should produce trailing-slash URLs', () => {
      const schema = quickBreadcrumb('Contact', 'contact');

      expect(schema.itemListElement[1].item).toBe('https://romamart.ca/contact/');
    });

    it('should handle nested paths', () => {
      const schema = quickBreadcrumb('Privacy Policy', 'privacy');

      expect(schema.itemListElement[1].item).toBe('https://romamart.ca/privacy/');
    });
  });

  describe('Schema.org compliance', () => {
    it('should include required @context', () => {
      const schema = quickBreadcrumb('Test', 'test');
      expect(schema['@context']).toBe('https://schema.org');
    });

    it('should include required @type', () => {
      const schema = quickBreadcrumb('Test', 'test');
      expect(schema['@type']).toBe('BreadcrumbList');
    });

    it('should have ListItem @type for all items', () => {
      const schema = quickBreadcrumb('Test', 'test');
      schema.itemListElement.forEach((item) => {
        expect(item['@type']).toBe('ListItem');
      });
    });

    it('should have required properties for ListItem', () => {
      const schema = quickBreadcrumb('Test', 'test');
      schema.itemListElement.forEach((item) => {
        expect(item).toHaveProperty('position');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('item');
        expect(typeof item.position).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.item).toBe('string');
      });
    });
  });
});
