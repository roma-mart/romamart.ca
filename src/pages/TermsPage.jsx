import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import COMPANY_DATA, { getContextualEmail } from '../config/company_data';
import { normalizePhoneForTel } from '../utils/phone';
import StructuredData from '../components/StructuredData';
import { buildBreadcrumbArray } from '../schemas/breadcrumbSchema';

const TermsPage = () => {
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };

  const BASE_URL =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Terms of Service | Roma Mart Convenience</title>
        <meta
          name="description"
          content="Terms and conditions for using Roma Mart Convenience services. Understand your rights and obligations."
        />
        <link rel="canonical" href="https://romamart.ca/terms/" />
      </Helmet>

      {/* Breadcrumb Schema */}
      <StructuredData
        type="BreadcrumbList"
        data={{ breadcrumbs: buildBreadcrumbArray('Terms', 'https://romamart.ca/terms/') }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-accent transition-colors" style={mutedTextColor}>
              Home
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={16} style={mutedTextColor} />
          </li>
          <li aria-current="page" className="font-semibold" style={textColor}>
            Terms of Service
          </li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <h1 className="text-4xl uppercase" style={{ color: 'var(--color-heading)' }}>
            Terms of Service
          </h1>
          <ShareButton
            title="Roma Mart Terms of Service"
            text="Read Roma Mart's terms of service"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
          />
        </div>

        <div className="prose max-w-none font-inter">
          <p className="mb-6" style={textColor}>
            <strong>Effective Date:</strong> November 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              By accessing or using the Roma Mart Convenience website (romamart.ca) or visiting our physical store, you
              agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              2. Products and Services
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              We strive to provide accurate product descriptions and pricing. However, we reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Modify prices without prior notice</li>
              <li>Limit quantities available for purchase</li>
              <li>Discontinue products at any time</li>
              <li>Refuse service to anyone for any lawful reason</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              3. Age Restrictions
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Certain products (tobacco, vape products, lottery tickets, etc. where applicable) are restricted to
              customers 19 years of age or older in Ontario. Valid government-issued photo ID is required for purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              4. Payment Terms
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              We accept cash, debit, and credit card payments. All prices exclude applicable taxes unless otherwise
              stated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              5. Intellectual Property
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              All content on this website, including text, graphics, logos, and images, is the property of Roma Mart
              Corp. or its content suppliers and is protected by Canadian and international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              To the fullest extent permitted by law, Roma Mart Corp. shall not be liable for any indirect, incidental,
              special, or consequential damages arising out of or related to your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              7. Governing Law
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable
              therein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              8. Contact Information
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              For questions about these Terms, please contact us:
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <p style={textColor}>
                <strong>{COMPANY_DATA.legalName}</strong>
              </p>
              <p style={textColor}>{COMPANY_DATA.location.address.street}</p>
              <p style={textColor}>
                {COMPANY_DATA.location.address.city}, {COMPANY_DATA.location.address.province}{' '}
                {COMPANY_DATA.location.address.postalCode}
              </p>
              <p style={textColor}>
                Email:{' '}
                <a href={`mailto:${getContextualEmail('legal')}`} style={{ color: 'var(--color-accent)' }}>
                  {getContextualEmail('legal')}
                </a>
              </p>
              <p style={textColor}>
                Phone:{' '}
                <a
                  href={`tel:${normalizePhoneForTel(COMPANY_DATA.location.contact.phone)}`}
                  style={{ color: 'var(--color-accent)' }}
                >
                  {COMPANY_DATA.location.contact.phone}
                </a>
              </p>
              <p className="text-sm mt-4" style={mutedTextColor}>
                GST/HST#: {COMPANY_DATA.gstNumber}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
