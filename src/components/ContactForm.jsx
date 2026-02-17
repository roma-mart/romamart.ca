/**
 * ContactForm.jsx
 * Unified contact form used by both homepage and /contact page.
 * Handles Web3Forms submission, hCaptcha, and field validation.
 */
import React, { useState, useCallback, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from './Button';
import HCaptchaWidget from './HCaptchaWidget';
import { useToast } from './ToastContainer';
import { useColorScheme } from '../hooks/useColorScheme';
import { useCompanyData } from '../contexts/CompanyDataContext';

const ContactForm = ({
  formSubject = 'New Contact Form Submission from romamart.ca',
  className = '',
  idPrefix = 'contact',
}) => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const captchaRef = useRef(null);
  const { showSuccess, showError } = useToast();
  const colorScheme = useColorScheme();
  const { companyData } = useCompanyData();
  const formAccessKey = companyData.contact.web3FormsAccessKey || '';

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken('');
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken('');
    showError('Captcha failed to load. Please try again.');
  }, [showError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting) return;

      const form = e.target;
      const name = form.elements.name?.value?.trim();
      const email = form.elements.email?.value?.trim();
      const message = form.elements.message?.value?.trim();

      const errors = {};
      if (!name) errors.name = 'Name is required.';
      if (!email) {
        errors.email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address (e.g., name@example.com).';
      }
      if (!message) errors.message = 'Message is required.';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});

      if (!captchaToken) {
        showError('Please complete the captcha.');
        return;
      }

      if (!formAccessKey) {
        showError('Contact form is not configured. Please try again later.');
        if (import.meta.env.DEV) console.warn('[ContactForm] Missing web3FormsAccessKey in companyData');
        return;
      }

      setSubmitting(true);
      const formData = new FormData(form);
      formData.set('h-captcha-response', captchaToken);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          showSuccess('Message sent successfully!');
          setFieldErrors({});
          form.reset();
          window.dataLayer?.push({
            event: 'contact_form_submit',
            form_location: idPrefix,
          });
        } else {
          showError(data.message || 'Failed to send message. Please try again.');
        }
      } catch {
        showError('Failed to send message. Please try again.');
      } finally {
        setCaptchaToken('');
        captchaRef.current?.resetCaptcha();
        setSubmitting(false);
      }
    },
    [captchaToken, submitting, showSuccess, showError, idPrefix, formAccessKey]
  );

  const inputStyle = (hasError) => ({
    backgroundColor: 'var(--color-surface)',
    borderColor: hasError ? 'var(--color-error)' : 'var(--color-border)',
    color: 'var(--color-text)',
  });

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <input type="hidden" name="access_key" value={formAccessKey} />
      <input type="hidden" name="subject" value={formSubject} />
      <input type="hidden" name="from_name" value="Roma Mart Website" />

      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="block font-inter font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Name *
        </label>
        <input
          type="text"
          id={`${idPrefix}-name`}
          name="name"
          required
          autoComplete="name"
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? `${idPrefix}-name-error` : undefined}
          className="w-full px-4 py-3 rounded-lg border font-inter"
          style={inputStyle(fieldErrors.name)}
          placeholder="Your name"
        />
        {fieldErrors.name && (
          <p id={`${idPrefix}-name-error`} className="text-sm mt-1" style={{ color: 'var(--color-error)' }}>
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-email`}
          className="block font-inter font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Email *
        </label>
        <input
          type="email"
          id={`${idPrefix}-email`}
          name="email"
          required
          autoComplete="email"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? `${idPrefix}-email-error` : undefined}
          className="w-full px-4 py-3 rounded-lg border font-inter"
          style={inputStyle(fieldErrors.email)}
          placeholder="your@email.com"
        />
        {fieldErrors.email && (
          <p id={`${idPrefix}-email-error`} className="text-sm mt-1" style={{ color: 'var(--color-error)' }}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="block font-inter font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Phone
        </label>
        <input
          type="tel"
          id={`${idPrefix}-phone`}
          name="phone"
          autoComplete="tel"
          className="w-full px-4 py-3 rounded-lg border font-inter"
          style={inputStyle(false)}
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-message`}
          className="block font-inter font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Message *
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          required
          rows={5}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? `${idPrefix}-message-error` : undefined}
          className="w-full px-4 py-3 rounded-lg border font-inter resize-none"
          style={inputStyle(fieldErrors.message)}
          placeholder="How can we help you?"
        />
        {fieldErrors.message && (
          <p id={`${idPrefix}-message-error`} className="text-sm mt-1" style={{ color: 'var(--color-error)' }}>
            {fieldErrors.message}
          </p>
        )}
      </div>

      <React.Suspense fallback={<div>Loading captcha...</div>}>
        {typeof window !== 'undefined' && (
          <HCaptchaWidget
            ref={captchaRef}
            onVerify={setCaptchaToken}
            onExpire={handleCaptchaExpire}
            onError={handleCaptchaError}
            theme={colorScheme}
            scriptHost="https://js.hcaptcha.com/1/api.js?custom=true"
          />
        )}
      </React.Suspense>

      <Button
        type="submit"
        variant="action"
        size="lg"
        icon={<Send size={20} />}
        className="w-full"
        aria-label="Send Message"
        disabled={!captchaToken || submitting}
        loading={submitting}
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
