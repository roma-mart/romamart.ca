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
      <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
