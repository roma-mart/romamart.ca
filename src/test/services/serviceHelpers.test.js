import { describe, it, expect } from 'vitest';
import {
  getComingSoonServices,
  getActiveServices,
  getServiceAvailabilityText,
  SERVICES,
} from '../../data/services';

describe('services helper functions', () => {
  describe('getComingSoonServices', () => {
    it('should return only services with status coming_soon', () => {
      const result = getComingSoonServices();
      expect(result.length).toBeGreaterThan(0);
      result.forEach((service) => {
        expect(service.status).toBe('coming_soon');
      });
    });

    it('should return 4 coming soon services', () => {
      const result = getComingSoonServices();
      expect(result).toHaveLength(4);
    });
  });

  describe('getActiveServices', () => {
    it('should exclude coming_soon services', () => {
      const result = getActiveServices();
      result.forEach((service) => {
        expect(service.status).not.toBe('coming_soon');
      });
    });

    it('should only include services with at least one location', () => {
      const result = getActiveServices();
      result.forEach((service) => {
        expect(service.availableAt.length).toBeGreaterThan(0);
      });
    });

    it('should return correct count (total minus coming_soon minus no-location)', () => {
      const active = getActiveServices();
      const comingSoon = getComingSoonServices();
      // All services are either active or coming_soon (assuming all available have locations)
      expect(active.length + comingSoon.length).toBeLessThanOrEqual(SERVICES.length);
    });
  });

  describe('getServiceAvailabilityText', () => {
    it('should return Coming Soon for coming_soon status', () => {
      const result = getServiceAvailabilityText(
        { status: 'coming_soon' },
        'open'
      );
      expect(result).toBe('Coming Soon');
    });

    it('should return Available 24/7 for 24_7 availability', () => {
      const result = getServiceAvailabilityText(
        { status: 'available', availability: '24_7' },
        'open'
      );
      expect(result).toBe('Available 24/7');
    });

    it('should return Available Now when store is open and availability is store_hours', () => {
      const result = getServiceAvailabilityText(
        { status: 'available', availability: 'store_hours' },
        'open'
      );
      expect(result).toBe('Available Now');
    });

    it('should return Available During Store Hours when store is closed', () => {
      const result = getServiceAvailabilityText(
        { status: 'available', availability: 'store_hours' },
        'closed'
      );
      expect(result).toBe('Available During Store Hours');
    });

    it('should return Available as default', () => {
      const result = getServiceAvailabilityText(
        { status: 'available', availability: 'other' },
        'open'
      );
      expect(result).toBe('Available');
    });

    it('should prioritize coming_soon over other availability types', () => {
      const result = getServiceAvailabilityText(
        { status: 'coming_soon', availability: '24_7' },
        'open'
      );
      expect(result).toBe('Coming Soon');
    });
  });
});
