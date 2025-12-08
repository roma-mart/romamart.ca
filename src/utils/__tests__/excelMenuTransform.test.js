import { describe, it, expect } from 'vitest';
import {
  transformExcelToMenuItem,
  groupExcelItemsByCategory,
  mergeCategoriesWithFallback,
  EXCEL_CATEGORY_MAP
} from '../excelMenuTransform';

describe('excelMenuTransform', () => {
  describe('transformExcelToMenuItem', () => {
    it('should transform Excel row to StandardizedItem format', () => {
      const excelRow = {
        Name: 'Espresso',
        size: '1 ea',
        cents: 350,
        oc_page: 'RoCafe Hot Coffee',
        Upc: '12345'
      };

      const result = transformExcelToMenuItem(excelRow, 0);

      expect(result).toHaveProperty('id', 'excel-12345');
      expect(result).toHaveProperty('name', 'Espresso');
      expect(result).toHaveProperty('tagline', '1 ea');
      expect(result).toHaveProperty('category', 'RoCafe Hot Coffee');
      expect(result.sizes).toHaveLength(1);
      expect(result.sizes[0].price).toBe(3.50);
    });

    it('should handle missing fields gracefully', () => {
      const excelRow = {
        cents: 299
      };

      const result = transformExcelToMenuItem(excelRow, 5);

      expect(result).toHaveProperty('name', 'Unnamed Item');
      expect(result).toHaveProperty('category', 'Other');
      expect(result.sizes[0].price).toBe(2.99);
    });

    it('should convert cents to dollars correctly', () => {
      const testCases = [
        { cents: 100, expected: 1.00 },
        { cents: 499, expected: 4.99 },
        { cents: 1250, expected: 12.50 },
        { cents: 0, expected: 0.00 }
      ];

      testCases.forEach(({ cents, expected }) => {
        const result = transformExcelToMenuItem({ cents }, 0);
        expect(result.sizes[0].price).toBe(expected);
      });
    });
  });

  describe('groupExcelItemsByCategory', () => {
    it('should group items by oc_page category', () => {
      const excelItems = [
        { Name: 'Espresso', size: '1 ea', cents: 350, oc_page: 'RoCafe Hot Coffee', Upc: '1' },
        { Name: 'Latte', size: '1 ea', cents: 450, oc_page: 'RoCafe Hot Coffee', Upc: '2' },
        { Name: 'Iced Latte', size: '1 ea', cents: 500, oc_page: 'RoCafe Iced Coffee', Upc: '3' }
      ];

      const result = groupExcelItemsByCategory(excelItems);

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
      const excelItems = [
        { Name: 'Unknown Item', size: '1 ea', cents: 299, oc_page: 'Unknown Category', Upc: '1' }
      ];

      const result = groupExcelItemsByCategory(excelItems);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Unknown Category');
      expect(result[0].description).toContain('Unknown Category');
    });

    it('should filter out empty categories', () => {
      const excelItems = [
        { Name: 'Coffee', size: '1 ea', cents: 299, oc_page: 'RoCafe Hot Coffee', Upc: '1' }
      ];

      const result = groupExcelItemsByCategory(excelItems);

      // Should only have 1 category (Hot Coffee), not all possible categories
      expect(result).toHaveLength(1);
      expect(result[0].items.length).toBeGreaterThan(0);
    });

    it('should sort categories in predefined order', () => {
      const excelItems = [
        { Name: 'Smoothie', size: '1 ea', cents: 599, oc_page: 'RoCafe Smoothies', Upc: '1' },
        { Name: 'Coffee', size: '1 ea', cents: 299, oc_page: 'RoCafe Hot Coffee', Upc: '2' },
        { Name: 'Tea', size: '1 ea', cents: 399, oc_page: 'RoCafe Tea', Upc: '3' }
      ];

      const result = groupExcelItemsByCategory(excelItems);

      // Hot Coffee should come before Tea, and Tea before Smoothies
      expect(result[0].name).toBe('Hot Coffee');
      expect(result[1].name).toBe('Tea & Matcha');
      expect(result[2].name).toBe('Smoothies');
    });
  });

  describe('mergeCategoriesWithFallback', () => {
    it('should use Excel categories when available', () => {
      const excelCategories = [
        { id: 'excel-cat', name: 'Excel Category', items: [{ id: '1' }] }
      ];
      const staticCategories = [
        { id: 'static-cat', name: 'Static Category', items: [{ id: '2' }] }
      ];

      const result = mergeCategoriesWithFallback(excelCategories, staticCategories);

      expect(result).toEqual(excelCategories);
      expect(result).not.toEqual(staticCategories);
    });

    it('should fallback to static categories when Excel is empty', () => {
      const excelCategories = [];
      const staticCategories = [
        { id: 'static-cat', name: 'Static Category', items: [{ id: '1' }] }
      ];

      const result = mergeCategoriesWithFallback(excelCategories, staticCategories);

      expect(result).toEqual(staticCategories);
    });

    it('should fallback to static when Excel is null/undefined', () => {
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
