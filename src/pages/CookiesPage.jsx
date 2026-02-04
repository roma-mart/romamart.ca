import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import COMPANY_DATA, { getContextualEmail } from '../config/company_data';

const CookiesPage = () => {

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Cookie Policy | Roma Mart Convenience</title>
        <meta name="description" content="Learn about how Roma Mart Convenience uses cookies and similar technologies. Manage your cookie preferences." />
        <link rel="canonical" href="https://romamart.ca/cookies" />
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-accent transition-colors" style={mutedTextColor}>
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Cookie Policy</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <h1 className="text-4xl var(--font-heading) uppercase" style={{ color: 'var(--color-heading)' }}>
            Cookie Policy
          </h1>
          <ShareButton 
            title="Roma Mart Cookie Policy"
            text="Learn about Roma Mart's cookie policy"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
          />
        </div>

        <div className="prose max-w-none font-inter">
          <p className="mb-6" style={textColor}>
            <strong>Last Updated:</strong> November 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              What Are Cookies?
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Types of Cookies We Use
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 pl-4" style={{ borderLeftColor: 'var(--color-accent)' }}>
                <h3 className="text-xl var(--font-heading) uppercase mb-2" style={{ color: 'var(--color-heading)' }}>
                  Necessary Cookies
                </h3>
                <p className="leading-relaxed" style={textColor}>
                  These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.
                </p>
              </div>

              <div className="border-l-4 pl-4" style={{ borderLeftColor: 'var(--color-accent)' }}>
                <h3 className="text-xl var(--font-heading) uppercase mb-2" style={{ color: 'var(--color-heading)' }}>
                  Analytics Cookies
                </h3>
                <p className="leading-relaxed mb-2" style={textColor}>
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use Google Analytics to:
                </p>
                <ul className="list-disc pl-6 space-y-1" style={textColor}>
                  <li>Track page views and user sessions</li>
                  <li>Analyze traffic sources</li>
                  <li>Understand which pages are most popular</li>
                  <li>Improve our website based on user behavior</li>
                </ul>
              </div>

              <div className="border-l-4 pl-4" style={{ borderLeftColor: 'var(--color-accent)' }}>
                <h3 className="text-xl var(--font-heading) uppercase mb-2" style={{ color: 'var(--color-heading)' }}>
                  Marketing Cookies
                </h3>
                <p className="leading-relaxed mb-2" style={textColor}>
                  These cookies are used to deliver personalized ads and measure advertising effectiveness. We use:
                </p>
                <ul className="list-disc pl-6 space-y-1" style={textColor}>
                  <li><strong>Snap Pixel:</strong> Tracks conversions from Snapchat ads</li>
                  <li><strong>Trustpilot:</strong> Collects reviews and displays social proof</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Managing Your Cookie Preferences
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              You can manage your cookie preferences through our consent banner when you first visit the site. You can also:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Accept all cookies for a personalized experience</li>
              <li>Reject optional cookies (analytics and marketing)</li>
              <li>Customize which categories you want to allow</li>
              <li>Change your preferences at any time by clearing your browser cookies</li>
            </ul>
            <p className="leading-relaxed" style={textColor}>
              Note: Blocking necessary cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Third-Party Cookies
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Some cookies are placed by third-party services that appear on our pages. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li><strong>Google Tag Manager:</strong> Manages tracking tags</li>
              <li><strong>Google Analytics:</strong> Website analytics (GA4)</li>
              <li><strong>Snap Pixel:</strong> Snapchat advertising</li>
              <li><strong>Trustpilot:</strong> Review collection and display</li>
            </ul>
            <p className="leading-relaxed" style={textColor}>
              These services are governed by their respective privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Browser Settings
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete cookies after each session</li>
              <li>Be notified when cookies are being sent</li>
            </ul>
            <p className="leading-relaxed" style={textColor}>
              Please note that disabling cookies may affect your experience on our website and limit certain features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Contact Us
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <p style={textColor}><strong>{COMPANY_DATA.legalName}</strong></p>
              <p style={textColor}>{COMPANY_DATA.location.address.streetAddress}</p>
              <p style={textColor}>{COMPANY_DATA.location.address.addressLocality}, {COMPANY_DATA.location.address.addressRegion} {COMPANY_DATA.location.address.postalCode}</p>
              <p style={textColor}>Email: <a href={`mailto:${getContextualEmail('privacy')}`} style={{ color: 'var(--color-accent)' }}>{getContextualEmail('privacy')}</a></p>
              <p style={textColor}>Phone: <a href={`tel:${COMPANY_DATA.location.contact.phone}`} style={{ color: 'var(--color-accent)' }}>{COMPANY_DATA.location.contact.phoneDisplay || COMPANY_DATA.location.contact.phone}</a></p>
              <p className="text-sm mt-4" style={mutedTextColor}>GST/HST#: {COMPANY_DATA.gstNumber}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
