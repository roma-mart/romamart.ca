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

  // Hide on /contact/ route — user is already on the contact page.
  // Strip a non-root BASE_URL prefix (e.g. '/romamart.ca/') so route matching works on GH Pages.
  const rawPathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const basePath = BASE_URL === '/' ? '' : BASE_URL.replace(/\/$/, '');
  const pathname =
    basePath && rawPathname.startsWith(basePath) ? rawPathname.slice(basePath.length) || '/' : rawPathname;
  if (pathname.replace(/\/$/, '') === '/contact') return null;

  const href = `tel:${normalizePhoneForTel(phone)}`;

  return (
    <motion.a
      href={href}
      aria-label={`Call ${companyData.dba}`}
      onClick={() => trackEvent('phone_click', { location_id: companyData?.location?.id, source: 'mobile_sticky' })}
      className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] right-4 z-50 flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)',
        boxShadow: shadows.lg,
        minWidth: 56,
        minHeight: 56,
        padding: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Phone size={18} aria-hidden="true" />
    </motion.a>
  );
}
