import { describe, it, expect, beforeEach } from 'vitest';
import { trackEvent } from '../analytics.js';

describe('trackEvent', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it('pushes event name to dataLayer', () => {
    trackEvent('page_view');
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0].event).toBe('page_view');
  });

  it('merges params into the push', () => {
    trackEvent('phone_click', { source: 'footer', location_id: 'loc-001' });
    expect(window.dataLayer[0]).toEqual({
      event: 'phone_click',
      source: 'footer',
      location_id: 'loc-001',
    });
  });

  it('initializes dataLayer if absent', () => {
    delete window.dataLayer;
    trackEvent('test_event');
    expect(window.dataLayer).toHaveLength(1);
  });

  it('works with no params', () => {
    trackEvent('order_cta_click');
    expect(window.dataLayer[0]).toEqual({ event: 'order_cta_click' });
  });
});
