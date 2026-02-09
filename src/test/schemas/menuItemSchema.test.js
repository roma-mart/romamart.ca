import { describe, it, expect } from 'vitest';
import { buildMenuItemSchema } from '../../schemas/menuItemSchema';
import menuItems from '../fixtures/menu-items';

describe('buildMenuItemSchema', () => {
  const baseUrl = 'https://romamart.ca/rocafe/';

  it('builds a Product schema with a single Offer', () => {
    const schema = buildMenuItemSchema(menuItems.singleSizeCents, baseUrl);

    expect(schema).toBeTruthy();
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe('Espresso');
    expect(schema.offers['@type']).toBe('Offer');
    expect(schema.offers.price).toBe('2.49');
    expect(schema.offers.priceCurrency).toBe('CAD');
    expect(schema.keywords).toEqual(['coffee', 'hot-drinks']);
  });

  it('builds an AggregateOffer for multiple sizes', () => {
    const schema = buildMenuItemSchema(menuItems.multiSizeCents, baseUrl);

    expect(schema.offers['@type']).toBe('AggregateOffer');
    expect(schema.offers.offers).toHaveLength(2);
    expect(schema.offers.lowPrice).toBe('2.49');
    expect(schema.offers.highPrice).toBe('3.49');
  });

  it('returns null when required fields are missing', () => {
    const schema = buildMenuItemSchema(menuItems.missingName, baseUrl);

    expect(schema).toBeNull();
  });

  it('maps dietary tags to schema.org URLs', () => {
    const schema = buildMenuItemSchema(menuItems.singleSizeCents, baseUrl);

    expect(schema.dietarySuitability).toContain('https://schema.org/VeganDiet');
    expect(schema.dietarySuitability).toContain('https://schema.org/GlutenFreeDiet');
  });

  it('supports dollar pricing when priceInCents is false', () => {
    const schema = buildMenuItemSchema(menuItems.singleSizeDollars, baseUrl, { priceInCents: false });

    expect(schema.offers.price).toBe('4.50');
  });

  it('sanitizes descriptions and omits empty image fields', () => {
    const schema = buildMenuItemSchema(menuItems.htmlDescription, baseUrl);

    expect(schema.description).toBe('Fresh berries blended');
    expect(schema.image).toBeUndefined();
  });
});
