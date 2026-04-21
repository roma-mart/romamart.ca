import React from 'react';
import { Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCompanyData } from '../contexts/CompanyDataContext';
import { normalizePhoneForTel } from '../utils/phone';
import { trackEvent } from '../utils/analytics.js';
import { shadows } from '../design/tokens.js';
import { getBaseUrl } from '../utils/getAssetUrl';

const BASE_URL = getBaseUrl();

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
    <motion.a
      href={href}
      aria-label={`Call ${companyData.dba}`}
      onClick={() => trackEvent('phone_click', { location_id: companyData?.location?.id, source: 'mobile_sticky' })}
      className="md:hidden fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px)+2rem)] right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)',
        boxShadow: shadows.lg,
      }}
    >
      <Phone size={18} aria-hidden="true" />
      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>
        Call {companyData.dba}
      </span>
    </motion.a>
  );
}
