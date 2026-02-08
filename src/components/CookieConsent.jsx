import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from './Button';

const CONSENT_KEY = 'roma_mart_cookie_consent';
const SHOW_DELAY_MS = 1500;

const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

/**
 * CookieConsent banner for PIPEDA / CASL compliance.
 *
 * Google Consent Mode v2 defaults are set to 'denied' in main.jsx.
 * This component upgrades consent when the user clicks "Accept All".
 * "Necessary Only" keeps the defaults (denied) and dismisses the banner.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    // If consent already recorded, don't show
    try {
      if (localStorage.getItem(CONSENT_KEY)) return;
    } catch {
      // localStorage unavailable (private browsing, etc.) — show banner
    }

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Focus the banner when it appears for screen reader users
  useEffect(() => {
    if (visible && bannerRef.current) {
      bannerRef.current.focus();
    }
  }, [visible]);

  const persist = useCallback((value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Silently fail if localStorage unavailable
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    persist('all');
    setVisible(false);

    // Upgrade Google Consent Mode
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }

    // Track consent event
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'cookie_consent', consent_action: 'accept_all' });
    }
  }, [persist]);

  const handleNecessaryOnly = useCallback(() => {
    persist('necessary');
    setVisible(false);

    // Track consent event (consent stays denied — no gtag update needed)
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'cookie_consent', consent_action: 'necessary_only' });
    }
  }, [persist]);

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
      tabIndex={-1}
      className="fixed bottom-0 inset-x-0 z-[9998] p-4 sm:p-6"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div
        className="max-w-3xl mx-auto rounded-xl shadow-lg border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        <p id="cookie-consent-description" className="text-sm leading-relaxed flex-1">
          We use cookies to improve your experience and analyze site traffic. See our{' '}
          <a href={`${BASE_URL}cookies`} className="underline font-semibold" style={{ color: 'var(--color-accent)' }}>
            Cookie Policy
          </a>{' '}
          for details.
        </p>

        <div className="flex gap-3 shrink-0">
          <Button type="button" variant="inverted" onClick={handleAcceptAll} aria-label="Accept all cookies">
            Accept All
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleNecessaryOnly}
            aria-label="Accept necessary cookies only"
          >
            Necessary Only
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
