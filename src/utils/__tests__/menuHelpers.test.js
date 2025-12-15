import { describe, it, expect } from 'vitest';
import { sortSizes, formatPrice, getLowestPrice } from '../menuHelpers';

describe('menuHelpers', () => {
  describe('sortSizes', () => {
    it('should sort S, M, L sizes in correct order', () => {
      const sizes = [
        { name: 'L', price: 7.49 },
        { name: 'S', price: 5.99 },
        { name: 'M', price: 6.99 }
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
        { name: 'M', price: 6.99 }
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
        { name: 'L', price: 7.49 }
      ];
      
      const sorted = sortSizes(sizes);
      
      expect(sorted[0].name).toBe('S');
      expect(sorted[1].name).toBe('M');
      expect(sorted[2].name).toBe('L');
      expect(sorted[3].name).toBe('16 oz');
      expect(sorted[4].name).toBe('20 oz');
    });

    it('should preserve original order for non-SML sizes', () => {
      const sizes = [
        { name: '20 oz', price: 4.49 },
        { name: '16 oz', price: 3.99 },
        { name: 'Regular', price: 4.99 }
      ];
      
      const sorted = sortSizes(sizes);
      
      expect(sorted[0].name).toBe('20 oz');
      expect(sorted[1].name).toBe('16 oz');
      expect(sorted[2].name).toBe('Regular');
    });

    it('should handle incomplete S, M, L sets', () => {
      const sizes = [
        { name: 'L', price: 7.49 },
        { name: 'S', price: 5.99 }
      ];
      
      const sorted = sortSizes(sizes);
      
      expect(sorted[0].name).toBe('S');
      expect(sorted[1].name).toBe('L');
    });

    it('should handle only M size', () => {
      const sizes = [
        { name: 'M', price: 6.99 }
      ];
      
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
        { name: 'M', size: '16 oz', price: 6.99, calories: 360 }
      ];
      
      const sorted = sortSizes(sizes);
      
      expect(sorted[0]).toEqual({ name: 'S', size: '12 oz', price: 5.99, calories: 320 });
      expect(sorted[1]).toEqual({ name: 'M', size: '16 oz', price: 6.99, calories: 360 });
      expect(sorted[2]).toEqual({ name: 'L', size: '20 oz', price: 7.49, calories: 410 });
    });

    it('should handle mixed S/M/L and descriptive names', () => {
      const sizes = [
        { name: 'Regular', price: 4.99 },
        { name: 'L', price: 7.49 },
        { name: 'Small', price: 3.99 },
        { name: 'S', price: 5.99 }
      ];
      
      const sorted = sortSizes(sizes);
      
      // S and L should come first
      expect(sorted[0].name).toBe('S');
      expect(sorted[1].name).toBe('L');
      // Non-SML should maintain original order
      expect(sorted[2].name).toBe('Regular');
      expect(sorted[3].name).toBe('Small');
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
          { name: 'L', price: 7.49 }
        ]
      };
      
      expect(getLowestPrice(item)).toBe(5.99);
    });
  });
});
