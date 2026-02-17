import { describe, it, expect } from 'vitest';
import { normalizeEnum, normalizeMenuItem, normalizeLocation, normalizeService } from '../normalize';

describe('normalize utilities', () => {
  describe('normalizeEnum', () => {
    it('should lowercase and snake_case a string', () => {
      expect(normalizeEnum('Hot Coffee')).toBe('hot_coffee');
      expect(normalizeEnum('Coming Soon')).toBe('coming_soon');
    });

    it('should return null for falsy input', () => {
      expect(normalizeEnum(null)).toBeNull();
      expect(normalizeEnum(undefined)).toBeNull();
      expect(normalizeEnum('')).toBeNull();
    });

    it('should pass through already-normalized values', () => {
      expect(normalizeEnum('available')).toBe('available');
      expect(normalizeEnum('store_hours')).toBe('store_hours');
    });

    it('should collapse multiple spaces into a single underscore', () => {
      expect(normalizeEnum('Ad  User  Data')).toBe('ad_user_data');
    });
  });

  describe('normalizeMenuItem', () => {
    it('should convert API prices from cents to dollars', () => {
      const apiItem = {
        id: 'cof-latte-001',
        name: 'Latte',
        sizes: [
          { name: 'Medium', price: 449 },
          { name: 'Large', price: 549 },
        ],
        addOns: [{ id: 1, name: 'Extra Shot', price: 100 }],
        category: 'Hot Coffee',
        availableAt: ['loc-wellington-001'],
      };

      const result = normalizeMenuItem(apiItem, 'api');

      expect(result.sizes[0].price).toBe(4.49);
      expect(result.sizes[1].price).toBe(5.49);
      expect(result.addOns[0].price).toBe(1.0);
    });

    it('should NOT convert static prices (already in dollars)', () => {
      const staticItem = {
        id: 'static-latte',
        name: 'Latte',
        sizes: [
          { name: 'Medium', price: 4.49 },
          { name: 'Large', price: 5.49 },
        ],
        addOns: [{ id: 1, name: 'Extra Shot', price: 1.0 }],
        category: 'hot-coffee',
        availableAt: ['loc-wellington-001'],
      };

      const result = normalizeMenuItem(staticItem, 'static');

      expect(result.sizes[0].price).toBe(4.49);
      expect(result.sizes[1].price).toBe(5.49);
      expect(result.addOns[0].price).toBe(1.0);
    });

    it('should ensure availableAt is always an array', () => {
      const item = { id: 'test', name: 'Test', sizes: [] };
      const result = normalizeMenuItem(item, 'api');
      expect(result.availableAt).toEqual([]);
    });

    it('should preserve existing availableAt array', () => {
      const item = {
        id: 'test',
        name: 'Test',
        sizes: [],
        availableAt: ['loc-wellington-001', 'loc-lakeshore-002'],
      };
      const result = normalizeMenuItem(item, 'api');
      expect(result.availableAt).toEqual(['loc-wellington-001', 'loc-lakeshore-002']);
    });

    it('should ensure category defaults to null', () => {
      const item = { id: 'test', name: 'Test', sizes: [] };
      const result = normalizeMenuItem(item, 'api');
      expect(result.category).toBeNull();
    });

    it('should preserve category string', () => {
      const item = { id: 'test', name: 'Test', sizes: [], category: 'Hot Coffee' };
      const result = normalizeMenuItem(item, 'api');
      expect(result.category).toBe('Hot Coffee');
    });

    it('should handle missing sizes and addOns gracefully', () => {
      const item = { id: 'test', name: 'Test' };
      const result = normalizeMenuItem(item, 'api');
      expect(result.sizes).toEqual([]);
      expect(result.addOns).toEqual([]);
    });

    it('should return null/undefined input unchanged', () => {
      expect(normalizeMenuItem(null, 'api')).toBeNull();
      expect(normalizeMenuItem(undefined, 'api')).toBeUndefined();
    });

    it('should be idempotent (normalizing twice produces same result)', () => {
      const apiItem = {
        id: 'cof-latte-001',
        name: 'Latte',
        sizes: [{ name: 'Medium', price: 449 }],
        addOns: [{ id: 1, name: 'Extra Shot', price: 100 }],
        category: 'Hot Coffee',
        availableAt: ['loc-wellington-001'],
      };

      const firstPass = normalizeMenuItem(apiItem, 'api');
      // After conversion, prices are in dollars (4.49, 1.00) — both < 100
      // Second pass with 'api' source should detect they're already dollars
      const secondPass = normalizeMenuItem(firstPass, 'api');

      expect(secondPass.sizes[0].price).toBe(firstPass.sizes[0].price);
      expect(secondPass.addOns[0].price).toBe(firstPass.addOns[0].price);
    });

    it('should preserve unknown fields (forward-compatible)', () => {
      const item = {
        id: 'test',
        name: 'Test',
        sizes: [],
        customField: 'preserved',
        newApiField: true,
      };
      const result = normalizeMenuItem(item, 'api');
      expect(result.customField).toBe('preserved');
      expect(result.newApiField).toBe(true);
    });
  });

  describe('normalizeLocation', () => {
    it('should map API images to photos format', () => {
      const apiLocation = {
        id: 'loc-wellington-001',
        name: 'Wellington',
        images: {
          storefront: 'https://cdn.example.com/storefront.jpg',
          interior: 'https://cdn.example.com/interior.jpg',
        },
        services: ['svc-atm-001'],
        amenities: [{ name: 'Wi-Fi', value: true }],
      };

      const result = normalizeLocation(apiLocation, 'api');

      expect(result.photos).toBeDefined();
      expect(result.photos.primary).toBe('https://cdn.example.com/storefront.jpg');
      expect(result.photos.exterior).toEqual(['https://cdn.example.com/storefront.jpg']);
      expect(result.photos.interior).toEqual(['https://cdn.example.com/interior.jpg']);
      expect(result.photos.thumbnail).toBe('https://cdn.example.com/storefront.jpg');
    });

    it('should handle API location with no images', () => {
      const apiLocation = {
        id: 'loc-test',
        name: 'Test',
        services: [],
        amenities: [],
      };

      const result = normalizeLocation(apiLocation, 'api');
      expect(result.photos).toBeUndefined(); // No images → no photos mapping
    });

    it('should preserve existing photos for static locations', () => {
      const staticLocation = {
        id: 'loc-wellington-001',
        name: 'Wellington',
        photos: {
          primary: '/images/store.jpg',
          exterior: ['/images/ext1.jpg'],
          interior: ['/images/int1.jpg'],
          thumbnail: '/images/thumb.jpg',
        },
        services: ['svc-atm-001'],
        amenities: [{ name: 'Wi-Fi', value: true }],
      };

      const result = normalizeLocation(staticLocation, 'static');

      // photos should be passed through unchanged
      expect(result.photos).toEqual(staticLocation.photos);
    });

    it('should convert string amenities to {name, value} objects', () => {
      const location = {
        id: 'test',
        name: 'Test',
        amenities: ['Wi-Fi', 'Parking'],
        services: [],
      };

      const result = normalizeLocation(location, 'api');

      expect(result.amenities).toEqual([
        { name: 'Wi-Fi', value: true },
        { name: 'Parking', value: true },
      ]);
    });

    it('should preserve {name, value} amenity objects', () => {
      const location = {
        id: 'test',
        name: 'Test',
        amenities: [
          { name: 'Wi-Fi', value: true },
          { name: 'Drive-through', value: false },
        ],
        services: [],
      };

      const result = normalizeLocation(location, 'api');

      expect(result.amenities).toEqual([
        { name: 'Wi-Fi', value: true },
        { name: 'Drive-through', value: false },
      ]);
    });

    it('should ensure services is always an array', () => {
      const location = { id: 'test', name: 'Test', amenities: [] };
      const result = normalizeLocation(location, 'api');
      expect(result.services).toEqual([]);
    });

    it('should return null/undefined input unchanged', () => {
      expect(normalizeLocation(null, 'api')).toBeNull();
      expect(normalizeLocation(undefined, 'api')).toBeUndefined();
    });
  });

  describe('normalizeService', () => {
    it('should ensure availableAt is always an array', () => {
      const svc = { id: 'svc-atm-001', name: 'ATM' };
      const result = normalizeService(svc, 'api');
      expect(result.availableAt).toEqual([]);
    });

    it('should preserve existing availableAt array', () => {
      const svc = {
        id: 'svc-atm-001',
        name: 'ATM',
        availableAt: ['loc-wellington-001'],
      };
      const result = normalizeService(svc, 'api');
      expect(result.availableAt).toEqual(['loc-wellington-001']);
    });

    it('should ensure features is always an array', () => {
      const svc = { id: 'svc-atm-001', name: 'ATM' };
      const result = normalizeService(svc, 'api');
      expect(result.features).toEqual([]);
    });

    it('should preserve existing features array', () => {
      const svc = {
        id: 'svc-atm-001',
        name: 'ATM',
        features: ['Cash withdrawal', 'Balance check'],
      };
      const result = normalizeService(svc, 'api');
      expect(result.features).toEqual(['Cash withdrawal', 'Balance check']);
    });

    it('should default category to null', () => {
      const svc = { id: 'svc-atm-001', name: 'ATM' };
      const result = normalizeService(svc, 'api');
      expect(result.category).toBeNull();
    });

    it('should preserve category string', () => {
      const svc = { id: 'svc-atm-001', name: 'ATM', category: 'financial_services' };
      const result = normalizeService(svc, 'api');
      expect(result.category).toBe('financial_services');
    });

    it('should return null input unchanged', () => {
      expect(normalizeService(null, 'api')).toBeNull();
    });

    it('should preserve unknown fields', () => {
      const svc = { id: 'svc-test', name: 'Test', partner: { name: 'CIBC' } };
      const result = normalizeService(svc, 'api');
      expect(result.partner).toEqual({ name: 'CIBC' });
    });
  });
});
