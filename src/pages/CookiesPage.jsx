import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';

const CookiesPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <Helmet>
        <title>Cookie Policy | Roma Mart Convenience</title>
        <meta name="description" content="Learn about how Roma Mart Convenience uses cookies and similar technologies. Manage your cookie preferences." />
        <link rel="canonical" href="https://romamart.ca/cookies" />
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
          <li aria-current="page" className="text-gray-900 font-semibold">Cookie Policy</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-coco uppercase mb-8" style={{ color: COLORS.navy }}>
          Cookie Policy
        </h1>

        <div className="prose max-w-none font-inter">
          <p className="text-gray-700 mb-6">
            <strong>Last Updated:</strong> November 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              Types of Cookies We Use
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-4">
                <h3 className="text-xl font-coco uppercase mb-2" style={{ color: COLORS.navy }}>
                  Necessary Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-xl font-coco uppercase mb-2" style={{ color: COLORS.navy }}>
                  Analytics Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use Google Analytics to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Track page views and user sessions</li>
                  <li>Analyze traffic sources</li>
                  <li>Understand which pages are most popular</li>
                  <li>Improve our website based on user behavior</li>
                </ul>
              </div>

              <div className="border-l-4 border-pink-400 pl-4">
                <h3 className="text-xl font-coco uppercase mb-2" style={{ color: COLORS.navy }}>
                  Marketing Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are used to deliver personalized ads and measure advertising effectiveness. We use:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Snap Pixel:</strong> Tracks conversions from Snapchat ads</li>
                  <li><strong>Trustpilot:</strong> Collects reviews and displays social proof</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              Managing Your Cookie Preferences
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can manage your cookie preferences through our consent banner when you first visit the site. You can also:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Accept all cookies for a personalized experience</li>
              <li>Reject optional cookies (analytics and marketing)</li>
              <li>Customize which categories you want to allow</li>
              <li>Change your preferences at any time by clearing your browser cookies</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Note: Blocking necessary cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              Third-Party Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Google Tag Manager:</strong> Manages tracking tags</li>
              <li><strong>Google Analytics:</strong> Website analytics (GA4)</li>
              <li><strong>Snap Pixel:</strong> Snapchat advertising</li>
              <li><strong>Trustpilot:</strong> Review collection and display</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              These services are governed by their respective privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              Browser Settings
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete cookies after each session</li>
              <li>Be notified when cookies are being sent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Please note that disabling cookies may affect your experience on our website and limit certain features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-coco uppercase mb-4" style={{ color: COLORS.navy }}>
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
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

export default CookiesPage;
