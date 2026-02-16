import { describe, it, expect } from 'vitest';
import { resolveCategory, groupMenuItemsByCategory, MENU_CATEGORY_MAP } from '../menuCategoryMap';

describe('menuCategoryMap', () => {
  describe('MENU_CATEGORY_MAP', () => {
    it('should have entries for all core categories', () => {
      const expectedCategories = [
        'Hot Coffee',
        'Iced Coffee',
        'Tea',
        'Fresh Juice',
        'Smoothies',
        'Frappe',
        'Food',
        'Ready2Eat',
      ];

      expectedCategories.forEach((category) => {
        expect(MENU_CATEGORY_MAP).toHaveProperty(category);
        expect(MENU_CATEGORY_MAP[category]).toHaveProperty('name');
        expect(MENU_CATEGORY_MAP[category]).toHaveProperty('description');
        expect(MENU_CATEGORY_MAP[category]).toHaveProperty('icon');
      });
    });
  });

  describe('resolveCategory', () => {
    it('should return canonical name for direct match', () => {
      expect(resolveCategory('Hot Coffee')).toBe('Hot Coffee');
      expect(resolveCategory('Tea')).toBe('Tea');
      expect(resolveCategory('Smoothies')).toBe('Smoothies');
    });

    it('should resolve legacy "RoCafe" prefixed names', () => {
      expect(resolveCategory('RoCafe Hot Coffee')).toBe('Hot Coffee');
      expect(resolveCategory('RoCafe Iced Coffee')).toBe('Iced Coffee');
      expect(resolveCategory('RoCafe Tea')).toBe('Tea');
      expect(resolveCategory('RoCafe Fresh Juice')).toBe('Fresh Juice');
      expect(resolveCategory('RoCafe Smoothies')).toBe('Smoothies');
      expect(resolveCategory('RoCafe Frappe')).toBe('Frappe');
      expect(resolveCategory('RoCafe Food')).toBe('Food');
      expect(resolveCategory('RoCafe Ready2Eat')).toBe('Ready2Eat');
    });

    it('should resolve static slug-style names', () => {
      expect(resolveCategory('hot-coffee')).toBe('Hot Coffee');
      expect(resolveCategory('iced-coffee')).toBe('Iced Coffee');
      expect(resolveCategory('tea')).toBe('Tea');
      expect(resolveCategory('smoothies')).toBe('Smoothies');
      expect(resolveCategory('frappes')).toBe('Frappe');
    });

    it('should return "Other" for null/undefined/empty', () => {
      expect(resolveCategory(null)).toBe('Other');
      expect(resolveCategory(undefined)).toBe('Other');
      expect(resolveCategory('')).toBe('Other');
    });

    it('should return raw string for unknown categories', () => {
      expect(resolveCategory('Custom Category')).toBe('Custom Category');
      expect(resolveCategory('New Beverages')).toBe('New Beverages');
    });
  });

  describe('groupMenuItemsByCategory', () => {
    it('should group items by resolved category', () => {
      const menuItems = [
        { id: '1', name: 'Espresso', category: 'Hot Coffee' },
        { id: '2', name: 'Latte', category: 'Hot Coffee' },
        { id: '3', name: 'Iced Latte', category: 'Iced Coffee' },
      ];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Hot Coffee');
      expect(result[0].items).toHaveLength(2);
      expect(result[1].name).toBe('Iced Coffee');
      expect(result[1].items).toHaveLength(1);
    });

    it('should handle legacy "RoCafe" prefixed categories', () => {
      const menuItems = [
        { id: '1', name: 'Espresso', category: 'RoCafe Hot Coffee' },
        { id: '2', name: 'Green Tea', category: 'RoCafe Tea' },
      ];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result).toHaveLength(2);
      // Hot Coffee comes before Tea in display order
      expect(result[0].name).toBe('Hot Coffee');
      expect(result[1].name).toBe('Tea & Matcha');
    });

    it('should handle static slug-style categories', () => {
      const menuItems = [
        { id: '1', name: 'Smoothie', category: 'smoothies' },
        { id: '2', name: 'Frappe', category: 'frappes' },
      ];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result).toHaveLength(2);
    });

    it('should sort categories in predefined display order', () => {
      const menuItems = [
        { id: '1', name: 'Smoothie', category: 'Smoothies' },
        { id: '2', name: 'Coffee', category: 'Hot Coffee' },
        { id: '3', name: 'Tea', category: 'Tea' },
      ];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result[0].name).toBe('Hot Coffee');
      expect(result[1].name).toBe('Tea & Matcha');
      expect(result[2].name).toBe('Smoothies');
    });

    it('should return empty array for empty/null/undefined input', () => {
      expect(groupMenuItemsByCategory([])).toEqual([]);
      expect(groupMenuItemsByCategory(null)).toEqual([]);
      expect(groupMenuItemsByCategory(undefined)).toEqual([]);
    });

    it('should handle unknown categories gracefully', () => {
      const menuItems = [{ id: '1', name: 'Mystery Item', category: 'Unknown Category' }];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Unknown Category');
      expect(result[0].items).toHaveLength(1);
    });

    it('should include id, name, icon, description, items in each category group', () => {
      const menuItems = [{ id: '1', name: 'Espresso', category: 'Hot Coffee' }];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('icon');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('items');
    });

    it('should handle items with null category', () => {
      const menuItems = [{ id: '1', name: 'Misc Item', category: null }];

      const result = groupMenuItemsByCategory(menuItems);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Other');
    });
  });
});
