import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';

const TermsPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <Helmet>
        <title>Terms of Service | Roma Mart Convenience</title>
        <meta name="description" content="Terms and conditions for using Roma Mart Convenience services. Understand your rights and obligations." />
        <link rel="canonical" href="https://romamart.ca/terms" />
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="text-gray-600 hover:text-yellow-500 transition-colors">
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} className="text-gray-400" /></li>
          <li aria-current="page" className="text-gray-900 font-semibold">Terms of Service</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-coco uppercase mb-8" style={{ color: COLORS.navy }}>
          Terms of Service
        </h1>

        <div className="prose max-w-none font-inter">
          <p className="text-gray-700 mb-6">
            <strong>Effective Date:</strong> November 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing or using the Roma Mart Convenience website (romamart.ca) or visiting our physical store, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              2. Products and Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate product descriptions and pricing. However, we reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Modify prices without prior notice</li>
              <li>Limit quantities available for purchase</li>
              <li>Discontinue products at any time</li>
              <li>Refuse service to anyone for any lawful reason</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              3. Age Restrictions
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Certain products (tobacco, vape products, lottery tickets, and alcohol where applicable) are restricted to customers 19 years of age or older in Ontario. Valid government-issued photo ID is required for purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              4. Payment Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We accept cash, debit, and credit card payments. A 2.5% discount is applied to all cash purchases. All prices include applicable taxes unless otherwise stated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              5. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on this website, including text, graphics, logos, and images, is the property of Roma Mart Corp. or its content suppliers and is protected by Canadian and international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, Roma Mart Corp. shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              7. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              8. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Roma Mart Corp.</strong></p>
              <p className="text-gray-700">189-3 Wellington Street</p>
              <p className="text-gray-700">Sarnia, ON N7T 1G6</p>
              <p className="text-gray-700">Email: <a href="mailto:contact@romamart.ca" className="text-yellow-500 hover:text-yellow-600">contact@romamart.ca</a></p>
              <p className="text-gray-700">Phone: <a href="tel:+13823422000" className="text-yellow-500 hover:text-yellow-600">+1 (382) 342-2000</a></p>
              <p className="text-gray-600 text-sm mt-4">GST/HST#: 780971768</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
