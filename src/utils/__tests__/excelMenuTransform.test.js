import { describe, it, expect } from 'vitest';
import {
  transformExcelToMenuItem,
  groupExcelItemsByCategory,
  mergeCategoriesWithFallback,
  EXCEL_CATEGORY_MAP
} from '../excelMenuTransform';

describe('excelMenuTransform', () => {
  describe('transformExcelToMenuItem', () => {
    it('should transform API item to StandardizedItem format', () => {
      const apiItem = {
        id: 1,
        name: 'Iced Peppermint Mocha',
        tagline: null,
        description: null,
        badge: null,
        featured: false,
        calories: null,
        categories: ['RoCafe Iced Coffee'],
        sizes: [
          { name: 'S', size: '12 oz', price: 599 },
          { name: 'M', size: '16 oz', price: 699 },
          { name: 'L', size: '20 oz', price: 749 }
        ]
      };

      const result = transformExcelToMenuItem(apiItem, 0);

      expect(result).toHaveProperty('id', 'api-1');
      expect(result).toHaveProperty('name', 'Iced Peppermint Mocha');
      expect(result).toHaveProperty('category', 'RoCafe Iced Coffee');
      expect(result.sizes).toHaveLength(3);
      expect(result.sizes[0].price).toBe(5.99); // 599 cents = $5.99
      expect(result.sizes[1].price).toBe(6.99); // 699 cents = $6.99
      expect(result.sizes[2].price).toBe(7.49); // 749 cents = $7.49
    });

    it('should handle missing fields gracefully', () => {
      const apiItem = {
        id: 2,
        name: 'Simple Item',
        sizes: [
          { name: 'One Size', size: '16 oz', price: 299 }
        ]
      };

      const result = transformExcelToMenuItem(apiItem, 5);

      expect(result).toHaveProperty('name', 'Simple Item');
      expect(result).toHaveProperty('category', 'Other');
      expect(result.sizes[0].price).toBe(2.99); // 299 cents = $2.99
    });

    it('should convert cents to dollars correctly', () => {
      const testCases = [
        { price: 100, expected: 1.00 },
        { price: 499, expected: 4.99 },
        { price: 1250, expected: 12.50 },
        { price: 0, expected: 0.00 }
      ];

      testCases.forEach(({ price, expected }) => {
        const apiItem = {
          id: 1,
          name: 'Test',
          sizes: [{ name: 'M', size: '16 oz', price }]
        };
        const result = transformExcelToMenuItem(apiItem, 0);
        expect(result.sizes[0].price).toBe(expected);
      });
    });
  });

  describe('groupExcelItemsByCategory', () => {
    it('should group items by category', () => {
      const apiItems = [
        {
          id: 1,
          name: 'Espresso',
          categories: ['RoCafe Hot Coffee'],
          sizes: [{ name: 'M', size: '12 oz', price: 350 }]
        },
        {
          id: 2,
          name: 'Latte',
          categories: ['RoCafe Hot Coffee'],
          sizes: [{ name: 'L', size: '16 oz', price: 450 }]
        },
        {
          id: 3,
          name: 'Iced Latte',
          categories: ['RoCafe Iced Coffee'],
          sizes: [{ name: 'L', size: '20 oz', price: 500 }]
        }
      ];

      const result = groupExcelItemsByCategory(apiItems);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Hot Coffee');
      expect(result[0].items).toHaveLength(2);
      expect(result[1].name).toBe('Iced Coffee');
      expect(result[1].items).toHaveLength(1);
    });

    it('should return empty array for empty input', () => {
      expect(groupExcelItemsByCategory([])).toEqual([]);
      expect(groupExcelItemsByCategory(null)).toEqual([]);
      expect(groupExcelItemsByCategory(undefined)).toEqual([]);
    });

    it('should handle unknown categories gracefully', () => {
      const apiItems = [
        {
          id: 1,
          name: 'Unknown Item',
          categories: ['Unknown Category'],
          sizes: [{ name: 'M', size: '16 oz', price: 299 }]
        }
      ];

      const result = groupExcelItemsByCategory(apiItems);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Unknown Category');
      expect(result[0].description).toContain('Unknown Category');
    });

    it('should filter out empty categories', () => {
      const apiItems = [
        {
          id: 1,
          name: 'Coffee',
          categories: ['RoCafe Hot Coffee'],
          sizes: [{ name: 'M', size: '12 oz', price: 299 }]
        }
      ];

      const result = groupExcelItemsByCategory(apiItems);

      // Should only have 1 category (Hot Coffee), not all possible categories
      expect(result).toHaveLength(1);
      expect(result[0].items.length).toBeGreaterThan(0);
    });

    it('should sort categories in predefined order', () => {
      const apiItems = [
        {
          id: 1,
          name: 'Smoothie',
          categories: ['RoCafe Smoothies'],
          sizes: [{ name: 'M', size: '16 oz', price: 599 }]
        },
        {
          id: 2,
          name: 'Coffee',
          categories: ['RoCafe Hot Coffee'],
          sizes: [{ name: 'M', size: '12 oz', price: 299 }]
        },
        {
          id: 3,
          name: 'Tea',
          categories: ['RoCafe Tea'],
          sizes: [{ name: 'M', size: '12 oz', price: 399 }]
        }
      ];

      const result = groupExcelItemsByCategory(apiItems);

      // Hot Coffee should come before Tea, and Tea before Smoothies
      expect(result[0].name).toBe('Hot Coffee');
      expect(result[1].name).toBe('Tea & Matcha');
      expect(result[2].name).toBe('Smoothies');
    });
  });

  describe('mergeCategoriesWithFallback', () => {
    it('should use API categories when available', () => {
      const apiCategories = [
        { id: 'api-cat', name: 'API Category', items: [{ id: '1' }] }
      ];
      const staticCategories = [
        { id: 'static-cat', name: 'Static Category', items: [{ id: '2' }] }
      ];

      const result = mergeCategoriesWithFallback(apiCategories, staticCategories);

      expect(result).toEqual(apiCategories);
      expect(result).not.toEqual(staticCategories);
    });

    it('should fallback to static categories when API is empty', () => {
      const apiCategories = [];
      const staticCategories = [
        { id: 'static-cat', name: 'Static Category', items: [{ id: '1' }] }
      ];

      const result = mergeCategoriesWithFallback(apiCategories, staticCategories);

      expect(result).toEqual(staticCategories);
    });

    it('should fallback to static when API is null/undefined', () => {
      const staticCategories = [
        { id: 'static-cat', name: 'Static Category', items: [{ id: '1' }] }
      ];

      expect(mergeCategoriesWithFallback(null, staticCategories)).toEqual(staticCategories);
      expect(mergeCategoriesWithFallback(undefined, staticCategories)).toEqual(staticCategories);
    });
  });

  describe('EXCEL_CATEGORY_MAP', () => {
    it('should have entries for all expected categories', () => {
      const expectedCategories = [
        'RoCafe Hot Coffee',
        'RoCafe Iced Coffee',
        'RoCafe Tea',
        'RoCafe Fresh Juice',
        'RoCafe Smoothies',
        'RoCafe Frappe',
        'RoCafe Food',
        'RoCafe Ready2Eat'
      ];

      expectedCategories.forEach(category => {
        expect(EXCEL_CATEGORY_MAP).toHaveProperty(category);
        expect(EXCEL_CATEGORY_MAP[category]).toHaveProperty('name');
        expect(EXCEL_CATEGORY_MAP[category]).toHaveProperty('description');
        expect(EXCEL_CATEGORY_MAP[category]).toHaveProperty('icon');
      });
    });
  });
});
