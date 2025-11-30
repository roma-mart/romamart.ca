import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';

const PrivacyPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Privacy Policy | Roma Mart Convenience</title>
        <meta name="description" content="Learn how Roma Mart Convenience collects, uses, and protects your personal information. PIPEDA compliant privacy policy." />
        <link rel="canonical" href="https://romamart.ca/privacy" />
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-yellow-500 transition-colors" style={mutedTextColor}>
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Privacy Policy</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-coco uppercase mb-8" style={{ color: COLORS.navy }}>
          Privacy Policy
        </h1>

        <div className="prose max-w-none font-inter">
          <p className="mb-6" style={textColor}>
            <strong>Effective Date:</strong> November 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              1. Introduction
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Roma Mart Corp. ("we," "us," or "our") operates the website romamart.ca and the retail store at 189-3 Wellington Street, Sarnia, ON N7T 1G6. We are committed to protecting your personal information and your right to privacy in accordance with Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              2. Information We Collect
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Name and contact information (email, phone number)</li>
              <li>Messages sent via our contact form</li>
              <li>Payment information (processed securely by our payment processor)</li>
              <li>Store visit data (if you use in-store services like ATM or BTM)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              3. How We Use Your Information
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Process transactions and orders</li>
              <li>Respond to customer inquiries and provide support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              4. Cookies and Tracking
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              We use cookies and similar tracking technologies to enhance your experience. For detailed information, please see our{' '}
              <a href={`${BASE_URL}cookies`} className="text-yellow-500 hover:text-yellow-600 underline">
                Cookie Policy
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              5. Data Retention
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              6. Your Rights
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Under PIPEDA, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Withdraw consent for marketing communications</li>
              <li>File a complaint with the Privacy Commissioner of Canada</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              7. Contact Us
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <p style={textColor}><strong>Roma Mart Corp.</strong></p>
              <p style={textColor}>189-3 Wellington Street</p>
              <p style={textColor}>Sarnia, ON N7T 1G6</p>
              <p style={textColor}>Email: <a href="mailto:contact@romamart.ca" className="text-yellow-500 hover:text-yellow-600">contact@romamart.ca</a></p>
              <p style={textColor}>Phone: <a href="tel:+13823422000" className="text-yellow-500 hover:text-yellow-600">+1 (382) 342-2000</a></p>
              <p className="text-sm mt-4" style={mutedTextColor}>GST/HST#: 780971768</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
