import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileCallCTA from '../MobileCallCTA';
import { trackEvent } from '../../utils/analytics.js';

vi.mock('../../contexts/CompanyDataContext', () => ({
  useCompanyData: () => ({
    companyData: {
      location: { contact: { phone: '+1 (382) 342-2000' } },
    },
  }),
}));

vi.mock('../../utils/analytics.js', () => ({ trackEvent: vi.fn() }));
vi.mock('../../utils/phone', () => ({ normalizePhoneForTel: (p) => p.replace(/[^+\d]/g, '') }));
vi.mock('framer-motion', () => ({
  useReducedMotion: () => false,
  motion: {
    a: ({ children, ...props }) => React.createElement('a', props, children),
  },
}));

describe('MobileCallCTA', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    vi.clearAllMocks();
  });

  it('renders a tel: link with the correct phone number', () => {
    render(<MobileCallCTA />);
    const link = screen.getByRole('link', { name: /call roma mart/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('tel:');
  });

  it('returns null on /contact/ route', () => {
    window.history.pushState({}, '', '/contact/');
    const { container } = render(<MobileCallCTA />);
    expect(container.firstChild).toBeNull();
  });

  it('fires phone_click trackEvent on click', () => {
    render(<MobileCallCTA />);
    const link = screen.getByRole('link', { name: /call roma mart/i });
    fireEvent.click(link);
    expect(trackEvent).toHaveBeenCalledWith('phone_click', {
      location_id: undefined,
      source: 'mobile_sticky',
    });
  });
});
