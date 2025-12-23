import React from 'react';

/**
 * TrustpilotWidget
 *
 * Renders the Trustpilot TrustBox placeholder markup. The Trustpilot script
 * and initialization are managed by Google Tag Manager (Clickio/consent-aware)
 * to ensure the widget is only loaded after user consent.
 */

const TrustpilotWidget = () => {
  // Use environment variables for Trustpilot widget IDs and token
  const businessUnitId = import.meta.env.VITE_TRUSTPILOT_BUSINESSUNIT_ID;
  const templateId = import.meta.env.VITE_TRUSTPILOT_TEMPLATE_ID;
  const token = import.meta.env.VITE_TRUSTPILOT_TOKEN;
  const reviewUrl = import.meta.env.VITE_TRUSTPILOT_REVIEW_URL || "https://www.trustpilot.com/review/romamart.ca";

  // Inject TrustBox script if not present
  React.useEffect(() => {
    if (typeof window !== 'undefined' && businessUnitId && templateId) {
      if (!document.getElementById('trustbox-script')) {
        const script = document.createElement('script');
        script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
        script.async = true;
        script.id = 'trustbox-script';
        document.body.appendChild(script);
      }
    }
  }, [businessUnitId, templateId]);

  // Fallback if widget fails to render
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector('.trustpilot-widget iframe');
      if (!el) setFailed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!businessUnitId || !templateId) {
    return (
      <div className="text-center text-base font-inter text-[var(--color-on-footer-muted)]">
        <span>Review us on&nbsp;</span>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Trustpilot
        </a>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="text-center text-base font-inter text-[var(--color-on-footer-muted)]">
        <span>Review us on&nbsp;</span>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Trustpilot
        </a>
        .
      </div>
    );
  }
  return (
    <div
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height="52px"
      data-style-width="100%"
      data-token={token}
    >
      {/* TrustBox will render here if script loads */}
      <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
