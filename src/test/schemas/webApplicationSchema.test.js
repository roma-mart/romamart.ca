/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { buildWebApplicationSchema } from '../../schemas/webApplicationSchema';

describe('buildWebApplicationSchema', () => {
  it('should build valid WebApplication schema', () => {
    const data = {
      name: 'Roma Mart Convenience',
      url: 'https://romamart.ca',
      description: 'Shop Roma Mart online - groceries, global snacks, halal meat, RoCafé coffee, and more.',
      applicationCategory: 'Lifestyle',
      operatingSystem: 'Any (Web Browser)',
      offers: {
        price: '0',
        priceCurrency: 'CAD'
      },
      browserRequirements: 'Requires JavaScript. Modern browsers recommended.',
      permissions: ['Location (optional, for nearest store)']
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema).toBeDefined();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebApplication');
    expect(schema.name).toBe('Roma Mart Convenience');
    expect(schema.url).toBe('https://romamart.ca');
    expect(schema.description).toBe('Shop Roma Mart online - groceries, global snacks, halal meat, RoCafé coffee, and more.');
    expect(schema.applicationCategory).toBe('Lifestyle');
    expect(schema.operatingSystem).toBe('Any (Web Browser)');
    expect(schema.offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD'
    });
    expect(schema.browserRequirements).toBe('Requires JavaScript. Modern browsers recommended.');
    expect(schema.permissions).toEqual(['Location (optional, for nearest store)']);
  });

  it('should return null for missing required fields', () => {
    expect(buildWebApplicationSchema({})).toBeNull();
    expect(buildWebApplicationSchema({ name: 'Test' })).toBeNull();
    expect(buildWebApplicationSchema({ url: 'https://example.com' })).toBeNull();
  });

  it('should handle minimal data', () => {
    const data = {
      name: 'Roma Mart',
      url: 'https://romamart.ca'
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema).toBeDefined();
    expect(schema['@type']).toBe('WebApplication');
    expect(schema.name).toBe('Roma Mart');
    expect(schema.url).toBe('https://romamart.ca');
    expect(schema.description).toBeUndefined();
    expect(schema.applicationCategory).toBeUndefined();
  });

  it('should handle screenshots array', () => {
    const data = {
      name: 'Roma Mart',
      url: 'https://romamart.ca',
      screenshots: [
        { url: 'https://romamart.ca/screenshot1.png', caption: 'Homepage' },
        { url: 'https://romamart.ca/screenshot2.png', caption: 'Menu' }
      ]
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema.screenshot).toBeDefined();
    expect(schema.screenshot).toHaveLength(2);
    expect(schema.screenshot[0]['@type']).toBe('ImageObject');
    expect(schema.screenshot[0].url).toBe('https://romamart.ca/screenshot1.png');
    expect(schema.screenshot[0].caption).toBe('Homepage');
  });

  it('should filter invalid screenshots', () => {
    const data = {
      name: 'Roma Mart',
      url: 'https://romamart.ca',
      screenshots: [
        { url: 'https://romamart.ca/screenshot1.png' },
        null,
        { url: '' },
        { caption: 'No URL' }
      ]
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema.screenshot).toBeDefined();
    expect(schema.screenshot).toHaveLength(1);
  });

  it('should handle author/publisher', () => {
    const data = {
      name: 'Roma Mart',
      url: 'https://romamart.ca',
      author: {
        name: 'Roma Mart Corp.',
        url: 'https://romamart.ca'
      }
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema.author).toBeDefined();
    expect(schema.author['@type']).toBe('Organization');
    expect(schema.author.name).toBe('Roma Mart Corp.');
    expect(schema.author.url).toBe('https://romamart.ca');
  });

  it('should use default offer values if not provided', () => {
    const data = {
      name: 'Roma Mart',
      url: 'https://romamart.ca',
      offers: {}
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema.offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD'
    });
  });

  it('should handle empty arrays gracefully', () => {
    const data = {
      name: 'Roma Mart',
      url: 'https://romamart.ca',
      screenshots: [],
      permissions: []
    };

    const schema = buildWebApplicationSchema(data);

    expect(schema.screenshot).toBeUndefined();
    expect(schema.permissions).toBeUndefined();
  });

  describe('Schema.org compliance', () => {
    it('should include required @context', () => {
      const schema = buildWebApplicationSchema({
        name: 'Test',
        url: 'https://example.com'
      });

      expect(schema['@context']).toBe('https://schema.org');
    });

    it('should include required @type', () => {
      const schema = buildWebApplicationSchema({
        name: 'Test',
        url: 'https://example.com'
      });

      expect(schema['@type']).toBe('WebApplication');
    });

    it('should have required properties', () => {
      const schema = buildWebApplicationSchema({
        name: 'Test',
        url: 'https://example.com'
      });

      expect(schema).toHaveProperty('name');
      expect(schema).toHaveProperty('url');
    });
  });
});
