import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

/**
 * HCaptchaWidget
 *
 * Reusable hCaptcha component for Web3Forms integration.
 * Usage: <HCaptchaWidget onVerify={setCaptchaToken} />
 */
export default function HCaptchaWidget({ onVerify, theme, scriptHost }) {
  return (
    <div className="mb-4">
      <HCaptcha
        sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
        reCaptchaCompat={false}
        onVerify={onVerify}
        theme={theme}
        scriptHost={scriptHost}
        // size="compact" // Uncomment to enable compact mode for hCaptcha
      />
    </div>
  );
}
