import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import StructuredData from '../components/StructuredData';
import COMPANY_DATA, { getContextualEmail } from '../config/company_data';
import { normalizePhoneForTel } from '../utils/phone';
import { buildBreadcrumbArray } from '../schemas/breadcrumbSchema';

const ReturnPolicyPage = () => {
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <StructuredData
        type="ReturnPolicy"
        data={{
          url: 'https://romamart.ca/return-policy'
        }}
      />
      <Helmet>
        <title>Return Policy | Roma Mart Convenience</title>
        <meta
          name="description"
          content="Review Roma Mart's returns and refund policy. All sales are final except for faulty products reported within 24 hours."
        />
        <link rel="canonical" href="https://romamart.ca/return-policy" />
      </Helmet>

      {/* Breadcrumb Schema */}
      <StructuredData type="BreadcrumbList" data={{ breadcrumbs: buildBreadcrumbArray('Return Policy', 'https://romamart.ca/return-policy') }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-accent transition-colors" style={mutedTextColor}>
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Return Policy</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <h1 className="text-4xl var(--font-heading) uppercase" style={{ color: 'var(--color-heading)' }}>
            Return Policy
          </h1>
          <ShareButton
            title="Roma Mart Return Policy"
            text="Read Roma Mart's returns and refund policy"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
          />
        </div>

        <div className="prose max-w-none font-inter">
          <p className="mb-6" style={textColor}>
            <strong>Effective Date:</strong> July 27, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              1. All Sales Final
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              All Roma Mart Corp. sales are final. Returns and refunds are accepted only for faulty products confirmed to be faulty due to an issue that existed prior to purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              2. Faulty Products Only
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              A product is considered faulty if it was damaged, expired, or had a manufacturing defect at the time of purchase. The fault must be clearly attributable to Roma Mart Corp. or the manufacturer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              3. 24-Hour Reporting Window
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Faulty products must be reported within 24 hours of purchase. Claims made after this window may be declined.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              4. Receipt & Packaging Required
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              Original receipt is required for all return requests. Products must be returned in original packaging (if applicable) and show no signs of use or tampering.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              5. Non-Returnable Items
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              The following items are not eligible for return or refund under any circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4" style={textColor}>
              <li>Food and beverages (unless expired at time of purchase)</li>
              <li>Tobacco or vape products</li>
              <li>Lottery tickets or scratch cards</li>
              <li>Phone cards or gift cards</li>
              <li>Personal hygiene or health products</li>
              <li>Items marked final sale, clearance, or discontinued</li>
              <li>Products that have been opened, used, or damaged after sale</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              6. Contact Us
            </h2>
            <p className="leading-relaxed mb-4" style={textColor}>
              If you believe a product is faulty, contact us with your receipt details as soon as possible:
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <p style={textColor}><strong>{COMPANY_DATA.legalName}</strong></p>
              <p style={textColor}>{COMPANY_DATA.location.address.street}</p>
              <p style={textColor}>{COMPANY_DATA.location.address.city}, {COMPANY_DATA.location.address.province} {COMPANY_DATA.location.address.postalCode}</p>
              <p style={textColor}>Email: <a href={`mailto:${getContextualEmail('support')}`} style={{ color: 'var(--color-accent)' }}>{getContextualEmail('support')}</a></p>
              <p style={textColor}>Phone: <a href={`tel:${normalizePhoneForTel(COMPANY_DATA.location.contact.phone)}`} style={{ color: 'var(--color-accent)' }}>{COMPANY_DATA.location.contact.phone}</a></p>
              <p className="text-sm mt-4" style={mutedTextColor}>GST/HST#: {COMPANY_DATA.gstNumber}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
