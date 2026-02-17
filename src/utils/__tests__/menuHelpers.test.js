import { describe, it, expect } from 'vitest';
import {
  sortSizes,
  formatPrice,
  getLowestPrice,
  calculateItemPrice,
  getDefaultSelections,
  getCaloriesForSize,
  validateSelections,
} from '../menuHelpers';

describe('menuHelpers', () => {
  describe('sortSizes', () => {
    it('should sort S, M, L sizes in correct order', () => {
      const sizes = [
        { name: 'L', price: 7.49 },
        { name: 'S', price: 5.99 },
        { name: 'M', price: 6.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('S');
      expect(sorted[1].name).toBe('M');
      expect(sorted[2].name).toBe('L');
    });

    it('should handle case-insensitive size names', () => {
      const sizes = [
        { name: 'l', price: 7.49 },
        { name: 's', price: 5.99 },
        { name: 'M', price: 6.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('s');
      expect(sorted[1].name).toBe('M');
      expect(sorted[2].name).toBe('l');
    });

    it('should place S, M, L before other size types', () => {
      const sizes = [
        { name: '16 oz', price: 3.99 },
        { name: 'M', price: 6.99 },
        { name: '20 oz', price: 4.49 },
        { name: 'S', price: 5.99 },
        { name: 'L', price: 7.49 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('S');
      expect(sorted[1].name).toBe('M');
      expect(sorted[2].name).toBe('L');
      expect(sorted[3].name).toBe('16 oz');
      expect(sorted[4].name).toBe('20 oz');
    });

    it('should sort non-SML sizes numerically', () => {
      const sizes = [
        { name: '20 oz', price: 4.49 },
        { name: '16 oz', price: 3.99 },
        { name: 'Regular', price: 4.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('16 oz');
      expect(sorted[1].name).toBe('20 oz');
      expect(sorted[2].name).toBe('Regular');
    });

    it('should handle incomplete S, M, L sets', () => {
      const sizes = [
        { name: 'L', price: 7.49 },
        { name: 'S', price: 5.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('S');
      expect(sorted[1].name).toBe('L');
    });

    it('should handle only M size', () => {
      const sizes = [{ name: 'M', price: 6.99 }];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('M');
    });

    it('should handle empty array', () => {
      const sizes = [];
      const sorted = sortSizes(sizes);
      expect(sorted).toEqual([]);
    });

    it('should handle null or undefined', () => {
      expect(sortSizes(null)).toBe(null);
      expect(sortSizes(undefined)).toBe(undefined);
    });

    it('should preserve all size properties during sorting', () => {
      const sizes = [
        { name: 'L', size: '20 oz', price: 7.49, calories: 410 },
        { name: 'S', size: '12 oz', price: 5.99, calories: 320 },
        { name: 'M', size: '16 oz', price: 6.99, calories: 360 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0]).toEqual({ name: 'S', size: '12 oz', price: 5.99, calories: 320 });
      expect(sorted[1]).toEqual({ name: 'M', size: '16 oz', price: 6.99, calories: 360 });
      expect(sorted[2]).toEqual({ name: 'L', size: '20 oz', price: 7.49, calories: 410 });
    });

    it('should handle mixed abbreviated and full names', () => {
      const sizes = [
        { name: 'Regular', price: 4.99 },
        { name: 'L', price: 7.49 },
        { name: 'Small', price: 3.99 },
        { name: 'S', price: 5.99 },
      ];

      const sorted = sortSizes(sizes);

      // Both S and Small are recognized as "small" priority, then L
      expect(sorted[0].name).toBe('Small');
      expect(sorted[1].name).toBe('S');
      expect(sorted[2].name).toBe('L');
      // Non-standard should maintain original order
      expect(sorted[3].name).toBe('Regular');
    });

    it('should sort API full names (Small, Medium, Large)', () => {
      const sizes = [
        { name: 'Large', price: 549 },
        { name: 'Medium', price: 449 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('Medium');
      expect(sorted[1].name).toBe('Large');
    });

    it('should sort API full names with all three sizes', () => {
      const sizes = [
        { name: 'Large', price: 549 },
        { name: 'Small', price: 349 },
        { name: 'Medium', price: 449 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('Small');
      expect(sorted[1].name).toBe('Medium');
      expect(sorted[2].name).toBe('Large');
    });

    it('should sort numeric sizes like ml and oz in ascending order', () => {
      const sizes = [
        { name: '500ml', price: 4.99 },
        { name: '250ml', price: 2.99 },
        { name: '750ml', price: 6.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('250ml');
      expect(sorted[1].name).toBe('500ml');
      expect(sorted[2].name).toBe('750ml');
    });

    it('should sort numeric sizes with spaces and units', () => {
      const sizes = [
        { name: '2 pcs', price: 3.99 },
        { name: '6 pcs', price: 8.99 },
        { name: '1 pc', price: 1.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('1 pc');
      expect(sorted[1].name).toBe('2 pcs');
      expect(sorted[2].name).toBe('6 pcs');
    });

    it('should sort oz sizes numerically', () => {
      const sizes = [
        { name: '16oz', price: 4.99 },
        { name: '8oz', price: 2.99 },
        { name: '12oz', price: 3.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('8oz');
      expect(sorted[1].name).toBe('12oz');
      expect(sorted[2].name).toBe('16oz');
    });

    it('should place standard sizes before numeric sizes', () => {
      const sizes = [
        { name: '500ml', price: 4.99 },
        { name: 'Small', price: 2.99 },
        { name: '250ml', price: 1.99 },
      ];

      const sorted = sortSizes(sizes);

      expect(sorted[0].name).toBe('Small');
      expect(sorted[1].name).toBe('250ml');
      expect(sorted[2].name).toBe('500ml');
    });
  });

  describe('formatPrice', () => {
    it('should format number as price', () => {
      expect(formatPrice(4.99)).toBe('$4.99');
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(0.5)).toBe('$0.50');
    });

    it('should return string as-is', () => {
      expect(formatPrice('$4.99')).toBe('$4.99');
    });
  });

  describe('getLowestPrice', () => {
    it('should return lowest price from sizes', () => {
      const item = {
        sizes: [
          { name: 'S', price: 5.99 },
          { name: 'M', price: 6.99 },
          { name: 'L', price: 7.49 },
        ],
      };

      expect(getLowestPrice(item)).toBe(5.99);
    });
  });

  describe('calculateItemPrice', () => {
    const baseItem = {
      sizes: [
        { name: 'S', price: 5.99 },
        { name: 'M', price: 6.99 },
        { name: 'L', price: 7.49 },
      ],
    };

    it('should return base price for selected size with no customizations', () => {
      expect(calculateItemPrice(baseItem, 0)).toBe(5.99);
      expect(calculateItemPrice(baseItem, 1)).toBe(6.99);
      expect(calculateItemPrice(baseItem, 2)).toBe(7.49);
    });

    it('should default to first size when no index given', () => {
      expect(calculateItemPrice(baseItem)).toBe(5.99);
    });

    it('should return 0 for null or undefined item', () => {
      expect(calculateItemPrice(null)).toBe(0);
      expect(calculateItemPrice(undefined)).toBe(0);
    });

    it('should return 0 when item has no sizes', () => {
      expect(calculateItemPrice({})).toBe(0);
      expect(calculateItemPrice({ sizes: [] }, 0)).toBe(0);
    });

    it('should return 0 for out-of-bounds size index', () => {
      expect(calculateItemPrice(baseItem, 99)).toBe(0);
    });

    it('should add single-selection customization price', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'milk',
            options: [
              { name: 'Whole', price: 0 },
              { name: 'Oat', price: 0.75 },
            ],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { milk: 'Oat' })).toBe(5.99 + 0.75);
    });

    it('should not add price for single-selection with zero price', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'milk',
            options: [
              { name: 'Whole', price: 0 },
              { name: 'Oat', price: 0.75 },
            ],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { milk: 'Whole' })).toBe(5.99);
    });

    it('should add multiple-selection customization prices', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'toppings',
            multiple: true,
            options: [
              { name: 'Whip', price: 0.5 },
              { name: 'Caramel', price: 0.75 },
              { name: 'Mocha', price: 0.75 },
            ],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { toppings: ['Whip', 'Caramel'] })).toBe(5.99 + 0.5 + 0.75);
    });

    it('should handle empty multiple-selection array', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'toppings',
            multiple: true,
            options: [{ name: 'Whip', price: 0.5 }],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { toppings: [] })).toBe(5.99);
    });

    it('should add quantity-based customization prices', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'extras',
            quantity: true,
            options: [
              { name: 'Espresso Shot', price: 1.0 },
              { name: 'Syrup Pump', price: 0.5 },
            ],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { extras: { 'Espresso Shot': 2, 'Syrup Pump': 3 } })).toBe(5.99 + 2.0 + 1.5);
    });

    it('should ignore quantity-based options with quantity 0', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'extras',
            quantity: true,
            options: [{ name: 'Espresso Shot', price: 1.0 }],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { extras: { 'Espresso Shot': 0 } })).toBe(5.99);
    });

    it('should handle multiple customization types together', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'milk',
            options: [{ name: 'Oat', price: 0.75 }],
          },
          {
            type: 'toppings',
            multiple: true,
            options: [{ name: 'Whip', price: 0.5 }],
          },
          {
            type: 'extras',
            quantity: true,
            options: [{ name: 'Shot', price: 1.0 }],
          },
        ],
      };
      expect(
        calculateItemPrice(item, 0, {
          milk: 'Oat',
          toppings: ['Whip'],
          extras: { Shot: 2 },
        })
      ).toBe(5.99 + 0.75 + 0.5 + 2.0);
    });

    it('should ignore unknown option names', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'milk',
            options: [{ name: 'Oat', price: 0.75 }],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, { milk: 'Almond' })).toBe(5.99);
    });

    it('should handle missing selectedOptions gracefully', () => {
      const item = {
        ...baseItem,
        customizations: [
          {
            type: 'milk',
            options: [{ name: 'Oat', price: 0.75 }],
          },
        ],
      };
      expect(calculateItemPrice(item, 0, {})).toBe(5.99);
    });
  });

  describe('getDefaultSelections', () => {
    it('should return empty object for no customizations', () => {
      expect(getDefaultSelections([])).toEqual({});
      expect(getDefaultSelections()).toEqual({});
    });

    it('should pick default for single-selection type', () => {
      const customizations = [
        {
          type: 'milk',
          options: [{ name: 'Whole', default: true }, { name: 'Oat' }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({ milk: 'Whole' });
    });

    it('should return empty string when no single-selection default', () => {
      const customizations = [
        {
          type: 'milk',
          options: [{ name: 'Whole' }, { name: 'Oat' }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({ milk: '' });
    });

    it('should pick defaults for multiple-selection type', () => {
      const customizations = [
        {
          type: 'toppings',
          multiple: true,
          options: [{ name: 'Whip', default: true }, { name: 'Caramel' }, { name: 'Mocha', default: true }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({ toppings: ['Whip', 'Mocha'] });
    });

    it('should return empty array when no multiple-selection defaults', () => {
      const customizations = [
        {
          type: 'toppings',
          multiple: true,
          options: [{ name: 'Whip' }, { name: 'Caramel' }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({ toppings: [] });
    });

    it('should pick default for quantity type', () => {
      const customizations = [
        {
          type: 'extras',
          quantity: true,
          options: [{ name: 'Shot', default: true }, { name: 'Pump' }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({ extras: { Shot: 1 } });
    });

    it('should return empty object when no quantity default', () => {
      const customizations = [
        {
          type: 'extras',
          quantity: true,
          options: [{ name: 'Shot' }, { name: 'Pump' }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({ extras: {} });
    });

    it('should handle mixed customization types', () => {
      const customizations = [
        {
          type: 'milk',
          options: [{ name: 'Whole', default: true }, { name: 'Oat' }],
        },
        {
          type: 'toppings',
          multiple: true,
          options: [{ name: 'Whip', default: true }],
        },
        {
          type: 'extras',
          quantity: true,
          options: [{ name: 'Shot' }],
        },
      ];
      expect(getDefaultSelections(customizations)).toEqual({
        milk: 'Whole',
        toppings: ['Whip'],
        extras: {},
      });
    });
  });

  describe('getCaloriesForSize', () => {
    it('should return size-specific calories', () => {
      const item = {
        sizes: [
          { name: 'S', price: 5.99, calories: 200 },
          { name: 'M', price: 6.99, calories: 300 },
        ],
      };
      expect(getCaloriesForSize(item, 0)).toBe(200);
      expect(getCaloriesForSize(item, 1)).toBe(300);
    });

    it('should fall back to item-level calories when size has none', () => {
      const item = {
        calories: 250,
        sizes: [{ name: 'S', price: 5.99 }],
      };
      expect(getCaloriesForSize(item, 0)).toBe(250);
    });

    it('should return null when no calories anywhere', () => {
      const item = { sizes: [{ name: 'S', price: 5.99 }] };
      expect(getCaloriesForSize(item, 0)).toBeNull();
    });

    it('should return null for null item', () => {
      expect(getCaloriesForSize(null)).toBeNull();
    });

    it('should default to index 0', () => {
      const item = {
        sizes: [{ name: 'S', price: 5.99, calories: 200 }],
      };
      expect(getCaloriesForSize(item)).toBe(200);
    });

    it('should return item-level calories for out-of-bounds index', () => {
      const item = {
        calories: 250,
        sizes: [{ name: 'S', price: 5.99 }],
      };
      expect(getCaloriesForSize(item, 99)).toBe(250);
    });

    it('should return null for out-of-bounds index with no item calories', () => {
      const item = { sizes: [{ name: 'S', price: 5.99 }] };
      expect(getCaloriesForSize(item, 99)).toBeNull();
    });
  });

  describe('validateSelections', () => {
    it('should return valid when no customizations', () => {
      expect(validateSelections([])).toEqual({ isValid: true, errors: [] });
      expect(validateSelections()).toEqual({ isValid: true, errors: [] });
    });

    it('should pass when required single-selection is provided', () => {
      const customizations = [
        {
          type: 'milk',
          required: true,
          options: [{ name: 'Whole' }, { name: 'Oat' }],
        },
      ];
      const result = validateSelections(customizations, { milk: 'Whole' });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when required single-selection is missing', () => {
      const customizations = [
        {
          type: 'milk',
          required: true,
          options: [{ name: 'Whole' }],
        },
      ];
      const result = validateSelections(customizations, {});
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('milk is required');
    });

    it('should fail when required single-selection is empty string', () => {
      const customizations = [
        {
          type: 'milk',
          required: true,
          options: [{ name: 'Whole' }],
        },
      ];
      const result = validateSelections(customizations, { milk: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('milk is required');
    });

    it('should pass when required multiple-selection has items', () => {
      const customizations = [
        {
          type: 'toppings',
          required: true,
          multiple: true,
          options: [{ name: 'Whip' }],
        },
      ];
      const result = validateSelections(customizations, { toppings: ['Whip'] });
      expect(result.isValid).toBe(true);
    });

    it('should fail when required multiple-selection is empty array', () => {
      const customizations = [
        {
          type: 'toppings',
          required: true,
          multiple: true,
          options: [{ name: 'Whip' }],
        },
      ];
      const result = validateSelections(customizations, { toppings: [] });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('toppings is required');
    });

    it('should skip optional customizations', () => {
      const customizations = [
        {
          type: 'milk',
          options: [{ name: 'Whole' }],
        },
      ];
      const result = validateSelections(customizations, {});
      expect(result.isValid).toBe(true);
    });

    it('should collect multiple errors', () => {
      const customizations = [
        {
          type: 'milk',
          required: true,
          options: [{ name: 'Whole' }],
        },
        {
          type: 'toppings',
          required: true,
          multiple: true,
          options: [{ name: 'Whip' }],
        },
      ];
      const result = validateSelections(customizations, {});
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('milk is required');
      expect(result.errors).toContain('toppings is required');
    });
  });
});
