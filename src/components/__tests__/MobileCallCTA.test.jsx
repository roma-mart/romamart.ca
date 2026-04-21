import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileCallCTA from '../MobileCallCTA';

vi.mock('../../contexts/CompanyDataContext', () => ({
  useCompanyData: () => ({
    companyData: {
      location: { contact: { phone: '+1 (382) 342-2000' } },
    },
  }),
}));

vi.mock('../../utils/analytics.js', () => ({ trackEvent: vi.fn() }));
vi.mock('../../utils/phone', () => ({ normalizePhoneForTel: (p) => p.replace(/[^+\d]/g, '') }));
vi.mock('framer-motion', () => ({ useReducedMotion: () => false }));

describe('MobileCallCTA', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });
  });

  it('renders a tel: link with the correct phone number', () => {
    render(<MobileCallCTA />);
    const link = screen.getByRole('link', { name: /call roma mart/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('tel:');
  });

  it('returns null on /contact/ route', () => {
    Object.defineProperty(window, 'location', { value: { pathname: '/contact/' }, writable: true });
    const { container } = render(<MobileCallCTA />);
    expect(container.firstChild).toBeNull();
  });
});
