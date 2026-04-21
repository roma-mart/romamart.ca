import React from 'react';
import { Phone } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useCompanyData } from '../contexts/CompanyDataContext';
import { normalizePhoneForTel } from '../utils/phone';
import { trackEvent } from '../utils/analytics.js';

const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

export default function MobileCallCTA() {
  const { companyData } = useCompanyData();
  const shouldReduceMotion = useReducedMotion();

  const phone = companyData?.location?.contact?.phone;
  if (!phone) return null;

  // Hide on /contact/ route — user is already on the contact page
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(BASE_URL, '/') : '/';
  if (pathname === '/contact/' || pathname === '/contact') return null;

  const href = `tel:${normalizePhoneForTel(phone)}`;

  return (
    <a
      href={href}
      aria-label="Call Roma Mart"
      onClick={() => trackEvent('phone_click', { source: 'mobile_sticky' })}
      className="md:hidden fixed bottom-5 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)',
        transition: shouldReduceMotion ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={(e) => {
        if (!shouldReduceMotion) e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Phone size={18} aria-hidden="true" />
      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>
        Call Roma Mart
      </span>
    </a>
  );
}
