import React from 'react';

/**
 * TrustpilotWidget
 *
 * Renders the Trustpilot TrustBox placeholder markup. The Trustpilot script
 * and initialization are managed by Google Tag Manager (Clickio/consent-aware)
 * to ensure the widget is only loaded after user consent.
 */

const TrustpilotWidget = () => {
  return (
    <div
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="56278e9abfbbba0bdcd568bc"
      data-businessunit-id="682725e77d7d518b035c1d50"
      data-style-height="52px"
      data-style-width="100%"
    >
      <a href="https://www.trustpilot.com/review/romamart.ca" target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
