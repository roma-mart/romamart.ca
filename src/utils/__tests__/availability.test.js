import { describe, it, expect } from 'vitest';
import { getMenuItemStatusAtLocation, isLocationOpen } from '../availability';

describe('availability utilities', () => {
  describe('getMenuItemStatusAtLocation', () => {
    it('should map API locations array to location shortName correctly', () => {
      // Mock location with shortName
      const location = {
        id: 'loc-wellington-001',
        shortName: 'Roma Mart 001',
        status: 'open'
      };

      // Mock menu item from API with locations array
      const apiMenuItem = {
        id: 'api-1',
        name: 'Iced Latte',
        status: 'available',
        locations: [
          { name: 'Roma Mart 001', id: 1 },
          { name: 'Roma Mart 002', id: 2 }
        ]
      };

      const result = getMenuItemStatusAtLocation(
        apiMenuItem.id,
        location,
        null, // No static menu data
        apiMenuItem // Pass the API item directly
      );

      expect(result.status).toBe('available');
      expect(result.availableAt).toContain(location.id);
    });

    it('should return unavailable when location shortName not in API locations array', () => {
      const location = {
        id: 'loc-lakeshore-003',
        shortName: 'Roma Mart 003',
        status: 'open'
      };

      const apiMenuItem = {
        id: 'api-1',
        name: 'Iced Latte',
        status: 'available',
        locations: [
          { name: 'Roma Mart 001', id: 1 },
          { name: 'Roma Mart 002', id: 2 }
        ]
      };

      const result = getMenuItemStatusAtLocation(
        apiMenuItem.id,
        location,
        null,
        apiMenuItem
      );

      expect(result.status).toBe('unavailable');
    });

    it('should handle locations as simple strings', () => {
      const location = {
        id: 'loc-wellington-001',
        shortName: 'Roma Mart 001',
        status: 'open'
      };

      const apiMenuItem = {
        id: 'api-2',
        name: 'Cappuccino',
        status: 'available',
        locations: ['Roma Mart 001', 'Roma Mart 002'] // String array
      };

      const result = getMenuItemStatusAtLocation(
        apiMenuItem.id,
        location,
        null,
        apiMenuItem
      );

      expect(result.status).toBe('available');
      expect(result.availableAt).toContain(location.id);
    });

    it('should use location overrides when present', () => {
      const location = {
        id: 'loc-wellington-001',
        shortName: 'Roma Mart 001',
        status: 'open',
        menuOverrides: {
          'api-1': {
            status: 'temporarily_unavailable',
            reason: 'Equipment maintenance'
          }
        }
      };

      const apiMenuItem = {
        id: 'api-1',
        name: 'Espresso',
        status: 'available',
        locations: ['Roma Mart 001']
      };

      const result = getMenuItemStatusAtLocation(
        apiMenuItem.id,
        location,
        null,
        apiMenuItem
      );

      expect(result.status).toBe('temporarily_unavailable');
    });

    it('should fallback to legacy availableAt for static menu items', () => {
      const location = {
        id: 'loc-wellington-001',
        shortName: 'Roma Mart 001',
        status: 'open'
      };

      const staticMenuItem = {
        id: 'signature-bubble-tea',
        name: 'Signature Bubble Tea',
        status: 'available',
        availableAt: ['loc-wellington-001'],
        availability: 'store_hours'
        // No locations array - uses legacy format
      };

      const result = getMenuItemStatusAtLocation(
        staticMenuItem.id,
        location,
        null,
        staticMenuItem
      );

      expect(result.status).toBe('available');
      expect(result.availableAt).toContain('loc-wellington-001');
    });

    it('should return unavailable when item is not found', () => {
      const location = {
        id: 'loc-wellington-001',
        shortName: 'Roma Mart 001',
        status: 'open'
      };

      const result = getMenuItemStatusAtLocation(
        'non-existent-item',
        location,
        [],
        null
      );

      expect(result.status).toBe('unavailable');
    });

    it('should handle empty locations array', () => {
      const location = {
        id: 'loc-wellington-001',
        shortName: 'Roma Mart 001',
        status: 'open'
      };

      const apiMenuItem = {
        id: 'api-3',
        name: 'Test Item',
        status: 'available',
        locations: [] // Empty array
      };

      const result = getMenuItemStatusAtLocation(
        apiMenuItem.id,
        location,
        null,
        apiMenuItem
      );

      // Should fallback to legacy behavior when locations array is empty
      expect(result.status).toBe('available');
    });
  });

  describe('isLocationOpen', () => {
    it('should return true when location status is open', () => {
      const location = {
        id: 'loc-wellington-001',
        status: 'open'
      };

      expect(isLocationOpen(location)).toBe(true);
    });

    it('should return false when location status is closed', () => {
      const location = {
        id: 'loc-wellington-001',
        status: 'closed'
      };

      expect(isLocationOpen(location)).toBe(false);
    });

    it('should return false when location status is coming_soon', () => {
      const location = {
        id: 'loc-lakeshore-002',
        status: 'coming_soon'
      };

      expect(isLocationOpen(location)).toBe(false);
    });
  });
});
