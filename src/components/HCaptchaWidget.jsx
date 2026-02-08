import React, { forwardRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

/**
 * HCaptchaWidget
 *
 * Reusable hCaptcha component for Web3Forms integration.
 * Accepts a ref so the parent can call ref.current.resetCaptcha() after submission.
 * Usage: <HCaptchaWidget ref={captchaRef} onVerify={setCaptchaToken} onExpire={handleExpire} />
 */
const HCaptchaWidget = forwardRef(function HCaptchaWidget({ onVerify, onExpire, onError, theme, scriptHost }, ref) {
  return (
    <div className="mb-4 flex justify-center">
      <HCaptcha
        ref={ref}
        sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
        reCaptchaCompat={false}
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
        theme={theme}
        scriptHost={scriptHost}
      />
    </div>
  );
});

export default HCaptchaWidget;
