import React from 'react';
import COMPANY_DATA from '../config/company_data';

/**
 * TrustpilotWidget
 *
 * Renders the Trustpilot TrustBox widget using the official SPA integration
 * pattern: inject bootstrap script, then call loadFromElement() on the widget
 * div after mount.
 *
 * Falls back to a plain review link when env vars are not configured.
 */

const TRUSTBOX_SCRIPT_ID = 'trustbox-script';
const TRUSTBOX_SCRIPT_SRC =
  'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

const FallbackLink = ({ reviewUrl }) => (
  <div
    className="text-center text-base font-inter"
    style={{ color: 'var(--color-on-footer-muted)' }}
  >
    <span>Review us on&nbsp;</span>
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
      style={{ color: 'var(--color-accent)' }}
    >
      Trustpilot
    </a>
  </div>
);

const TrustpilotWidget = () => {
  const widgetRef = React.useRef(null);
  const businessUnitId = import.meta.env.VITE_TRUSTPILOT_BUSINESSUNIT_ID;
  const templateId = import.meta.env.VITE_TRUSTPILOT_TEMPLATE_ID;
  const token = import.meta.env.VITE_TRUSTPILOT_TOKEN;
  const reviewUrl = COMPANY_DATA.trustpilotReviewUrl;

  React.useEffect(() => {
    if (!businessUnitId || !templateId || !token) return;

    const loadWidget = () => {
      if (window.Trustpilot && widgetRef.current) {
        window.Trustpilot.loadFromElement(widgetRef.current, true);
      }
    };

    // If Trustpilot bootstrap already loaded, just initialize
    if (window.Trustpilot) {
      loadWidget();
      return;
    }

    // Load bootstrap script, then initialize widget
    const existing = document.getElementById(TRUSTBOX_SCRIPT_ID);
    if (existing) {
      // Script tag exists but hasn't finished loading (e.g., component remount)
      existing.addEventListener('load', loadWidget);
      return () => existing.removeEventListener('load', loadWidget);
    }

    const script = document.createElement('script');
    script.src = TRUSTBOX_SCRIPT_SRC;
    script.async = true;
    script.id = TRUSTBOX_SCRIPT_ID;
    script.onload = loadWidget;
    document.body.appendChild(script);
  }, [businessUnitId, templateId, token]);

  // Fallback when env vars are not configured
  if (!businessUnitId || !templateId || !token) {
    return <FallbackLink reviewUrl={reviewUrl} />;
  }

  return (
    <div
      ref={widgetRef}
      className="trustpilot-widget"
      data-locale="en-CA"
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height="52px"
      data-style-width="100%"
      data-token={token}
    >
      <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
