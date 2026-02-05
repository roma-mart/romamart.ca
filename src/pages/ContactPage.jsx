/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, Phone, Clock, Mail, Send } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import { useBackgroundSync } from '../hooks/useServiceWorker';
import { useToast } from '../components/ToastContainer';
// import { queueFormSubmission, getPendingCount } from '../utils/indexedDB'; // Disabled offline queue
import Button from '../components/Button';
import StructuredData from '../components/StructuredData';
import { buildBreadcrumbArray } from '../schemas/breadcrumbSchema';
import LiveHoursDisplay from '../components/LiveHoursDisplay';
import COMPANY_DATA from '../config/company_data';
import HCaptchaWidget from '../components/HCaptchaWidget';
import { getHCaptchaTheme } from '../design/hcaptchaTheme';
import { useColorScheme } from '../hooks/useColorScheme';
import { normalizePhoneForTel } from '../utils/phone';

const ContactPage = () => {
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };
  const BASE_URL = import.meta.env.BASE_URL || '/';

  const [formStatus, setFormStatus] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const { syncSupported } = useBackgroundSync();
  const { showInfo, showSuccess, showError } = useToast();
  const colorScheme = useColorScheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (!captchaToken) {
      setFormStatus('error');
      showError('Please complete the captcha.');
      return;
    }
    formData.append('h-captcha-response', captchaToken);
    // Check if online
    const isOnline = navigator.onLine;
    // Online - submit immediately
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        setFormStatus('success');
        showSuccess('Message sent successfully!');
        e.target.reset();
        setCaptchaToken('');
      } else {
        setFormStatus('error');
        showError('Failed to send message. Please try again.');
      }
    } catch {
      setFormStatus('error');
      showError('Failed to send message. Please try again.');
    }
  };

  const formAccessKey = COMPANY_DATA.contact.web3FormsAccessKey || '';

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Contact Us | Roma Mart Convenience</title>
        <meta name="description" content="Get in touch with Roma Mart. Visit us, call, or send a message. We're here to help!" />
        <link rel="canonical" href="https://romamart.ca/contact" />
      </Helmet>

      {/* Breadcrumb Schema */}
      <StructuredData type="BreadcrumbList" data={{ breadcrumbs: buildBreadcrumbArray('Contact', 'https://romamart.ca/contact') }} />

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-accent transition-colors" style={mutedTextColor}>Home</a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Contact</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Contact <span style={{ color: 'var(--color-accent)' }}>Us</span>
            </h1>
            <p className="text-lg font-inter leading-relaxed max-w-3xl" style={textColor}>
              Have a question or feedback? We'd love to hear from you! Reach out through any of the methods below.
            </p>
          </div>
          <ShareButton 
            title="Contact Roma Mart"
            text="Get in touch with Roma Mart - Sarnia's premier convenience store!"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl var(--font-heading) mb-8" style={{ color: 'var(--color-heading)' }}>
              Get In Touch
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <MapPin style={{ color: 'var(--color-icon)' }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Visit Us</h4>
                  <p style={textColor}>{COMPANY_DATA.location.address.formatted}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_DATA.location.address.formatted)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get directions to Roma Mart"
                    className="inline-block mt-2 font-inter text-sm font-semibold hover:underline"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Get Directions →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Phone style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Call Us</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`tel:${normalizePhoneForTel(COMPANY_DATA.location.contact.phone)}`} className="hover:underline" style={{ color: 'var(--color-accent)' }}>
                      {COMPANY_DATA.location.contact.phone}
                    </a>
                    <CopyButton 
                      text={COMPANY_DATA.location.contact.phone}
                      label="Phone number"
                      style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Mail style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Email Us</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${COMPANY_DATA.location.contact.email}`} className="hover:underline" style={{ color: 'var(--color-accent)' }}>
                      {COMPANY_DATA.location.contact.email}
                    </a>
                    <CopyButton 
                      text={COMPANY_DATA.location.contact.email}
                      label="Email address"
                      style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Clock style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Hours</h4>
                  <LiveHoursDisplay 
                    placeId={COMPANY_DATA.location.google.placeId}
                    fallbackHours={{
                      daily: COMPANY_DATA.location.hours.daily,
                      exceptions: COMPANY_DATA.location.hours.exceptions
                    }}
                    showStatus={true}
                    compact={true}
                    showIcon={false}
                    showRefreshOnError={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-2xl shadow-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="var(--font-heading) text-2xl mb-6" style={{ color: 'var(--color-heading)' }}>
              Send a Message
            </h3>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-success)' }}>
                <p className="font-inter" style={{ color: 'var(--color-success)' }}>✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {formStatus === 'queued' && (
              <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-accent-bg, rgba(228, 179, 64, 0.1))', borderColor: 'var(--color-accent)' }}>
                <p className="font-inter" style={{ color: 'var(--color-accent)' }}>📥 Message saved! Will be sent automatically when connection is restored.</p>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error)' }}>
                <p className="font-inter" style={{ color: 'var(--color-error)' }}>✗ Something went wrong. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="access_key" value={formAccessKey} />
              <input type="hidden" name="subject" value="New Contact Form Submission from romamart.ca" />
              <input type="hidden" name="h-captcha-response" value={captchaToken} />

              <div>
                <label htmlFor="name" className="block font-inter font-semibold mb-2" style={textColor}>Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border font-inter"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-inter font-semibold mb-2" style={textColor}>Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border font-inter"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-inter font-semibold mb-2" style={textColor}>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg border font-inter"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-inter font-semibold mb-2" style={textColor}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border font-inter resize-none"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="How can we help you?"
                />
              </div>

              {/* hCaptcha Widget */}
              <React.Suspense fallback={<div>Loading captcha...</div>}>
                {typeof window !== 'undefined' && (
                  <HCaptchaWidget 
                    onVerify={setCaptchaToken}
                    // On free tier, only string 'dark' or 'light' is supported. For custom themes, see hcaptchaTheme.js
                    theme={colorScheme}
                    scriptHost="https://js.hcaptcha.com/1/api.js?custom=true"
                  />
                )}
              </React.Suspense>

              <Button
                type="submit"
                variant="action"
                icon={<Send size={20} />}
                className="w-full py-4 rounded-lg font-bold font-inter flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
                aria-label="Send Message"
                disabled={!captchaToken}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
