import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Mail, Phone, MapPin, CheckCircle, ChevronRight } from 'lucide-react';

const AccessibilityPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
    black: '#151515',
  };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <Helmet>
        <title>Accessibility Statement | Roma Mart Convenience</title>
        <meta name="description" content="Roma Mart Convenience is committed to digital accessibility. WCAG 2.2 Level AA compliant. Learn about our accessibility features and report issues." />
        <link rel="canonical" href="https://romamart.ca/accessibility" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a 
              href={`${BASE_URL}`} 
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} className="text-gray-400" /></li>
          <li aria-current="page" className="text-gray-900 font-semibold">Accessibility</li>
        </ol>
      </nav>
      {/* Skip link target */}
      <a id="accessibility-content" className="sr-only" href="#accessibility-content">
        Skip to accessibility content
      </a>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h1 
          className="text-4xl md:text-5xl font-coco uppercase mb-6"
          style={{ color: COLORS.navy }}
        >
          Accessibility Statement
        </h1>
        <p className="text-lg font-inter text-gray-900 leading-relaxed mb-4">
          Roma Mart Convenience is committed to ensuring digital accessibility for people with disabilities. 
          We strive to maintain and continually improve the accessibility of our website to conform to the 
          Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
        </p>
        <p className="text-lg font-inter text-gray-900 leading-relaxed">
          This page outlines our accessibility compliance, standards met, and how to report accessibility issues.
        </p>
      </section>

      {/* Compliance Standards */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-12"
          style={{ color: COLORS.navy }}
        >
          Standards & Certifications
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* WCAG 2.2 AA */}
          <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle size={32} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: COLORS.navy }}>WCAG 2.2 Level AA</h3>
                <p className="text-sm text-gray-600">Web Content Accessibility Guidelines</p>
              </div>
            </div>
            <p className="text-gray-900 mb-4 leading-relaxed">
              Our website fully conforms to WCAG 2.2 Level AA, the latest international standard for web accessibility 
              published by the World Wide Web Consortium (W3C).
            </p>
            <a 
              href="https://www.w3.org/WAI/WCAG22/quickref/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              Learn more <ExternalLink size={16} />
            </a>
          </div>

          {/* AODA */}
          <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle size={32} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: COLORS.navy }}>AODA Compliant</h3>
                <p className="text-sm text-gray-600">Ontario Accessibility Requirements</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We exceed the Accessibility for Ontarians with Disabilities Act (AODA) requirement of WCAG 2.0 AA 
              by implementing WCAG 2.2 AA.
            </p>
            <a 
              href="https://www.ontario.ca/laws/regulation/070191" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              View AODA regulations <ExternalLink size={16} />
            </a>
          </div>

          {/* ISO/IEC 40500:2025 */}
          <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle size={32} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: COLORS.navy }}>ISO/IEC 40500:2025</h3>
                <p className="text-sm text-gray-600">International Standard</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our website complies with the ISO/IEC 40500:2025 international standard for web accessibility, 
              which aligns with WCAG 2.2 Level AA.
            </p>
            <a 
              href="https://www.iso.org/standard/80369.html" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              Learn about ISO 40500 <ExternalLink size={16} />
            </a>
          </div>

          {/* EN 301 549 */}
          <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle size={32} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: COLORS.navy }}>EN 301 549 (EAA)</h3>
                <p className="text-sm text-gray-600">European Accessibility Act</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We exceed EN 301 549 requirements for the European Accessibility Act by implementing WCAG 2.2 AA 
              instead of the required WCAG 2.1 AA.
            </p>
            <a 
              href="https://www.etsi.org/deliver/etsi_en/301500_301599/301549/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              View EN 301 549 <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* WCAG 3.0 Ready */}
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.navy }}>🚀 WCAG 3.0 Ready</h3>
          <p className="text-gray-700">
            Our website is designed with outcome-based accessibility principles, ensuring readiness for WCAG 3.0 
            as it becomes the official standard.
          </p>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: COLORS.navy }}
        >
          Accessibility Features
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Keyboard Navigation</h3>
              <p className="text-gray-900">
                All functionality is accessible via keyboard. Navigate with Tab, activate with Enter/Space, 
                and close menus with Escape.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Visible Focus Indicators</h3>
              <p className="text-gray-900">
                High-contrast yellow outline (3px, 13.8:1 contrast ratio) shows keyboard focus on all interactive elements.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Screen Reader Support</h3>
              <p className="text-gray-900">
                Semantic HTML, ARIA labels, and descriptive link text make our site fully compatible with 
                NVDA, JAWS, and VoiceOver screen readers.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Skip Navigation</h3>
              <p className="text-gray-900">
                Press Tab to see the "Skip to main content" link, allowing you to bypass repetitive navigation elements.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Enhanced Color Contrast</h3>
              <p className="text-gray-900">
                All text and UI components meet or exceed WCAG AA contrast requirements. Our brand colors 
                exceed AAA standards (12.6:1 navy, 8.4:1 yellow).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Reduced Motion Support</h3>
              <p className="text-gray-900">
                If you enable "Reduce motion" in your operating system preferences, animations and transitions 
                on our site will be disabled.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Resizable Text & Zoom</h3>
              <p className="text-gray-900">
                Text can be resized up to 200% without loss of content or functionality. Content reflows properly 
                on all zoom levels.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Touch-Friendly Targets</h3>
              <p className="text-gray-700">
                All buttons, links, and form inputs are at least 44×44 CSS pixels, meeting mobile accessibility standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Accessibility Issues */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: COLORS.navy }}
        >
          Report an Accessibility Issue
        </h2>

        <p className="text-gray-700 mb-8 leading-relaxed">
          If you encounter any accessibility barriers or have suggestions for improvement, we'd like to hear from you. 
          Please contact us using any of the methods below:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <Mail size={32} className="mb-4" style={{ color: COLORS.navy }} />
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <a 
              href="mailto:accessibility@romamart.ca" 
              className="text-blue-600 hover:underline break-all"
            >
              accessibility@romamart.ca
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <Phone size={32} className="mb-4" style={{ color: COLORS.navy }} />
            <h3 className="font-bold text-lg mb-2">Phone</h3>
            <a 
              href="tel:+13823422000" 
              className="text-blue-600 hover:underline"
            >
              +1 (382) 342-2000
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <MapPin size={32} className="mb-4" style={{ color: COLORS.navy }} />
            <h3 className="font-bold text-lg mb-2">Visit Us</h3>
            <p className="text-gray-700 text-sm">
              189-3 Wellington Street<br />
              Sarnia, ON N7T 1G6
            </p>
          </div>
        </div>

        <p className="mt-8 text-gray-700 leading-relaxed">
          We will make reasonable efforts to provide accommodations and respond to accessibility inquiries 
          within 5 business days.
        </p>
      </section>

      {/* Technical Details & Documentation */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: COLORS.navy }}
        >
          Documentation & Testing
        </h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Our accessibility compliance is verified through automated testing and manual review:
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
            <h3 className="font-bold mb-2">ESLint jsx-a11y</h3>
            <p className="text-gray-700 text-sm">
              20+ automated accessibility linting rules run on every code change to catch violations early.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded border-l-4 border-green-600">
            <h3 className="font-bold mb-2">Manual Testing</h3>
            <p className="text-gray-700 text-sm">
              Keyboard navigation, screen reader compatibility (NVDA, VoiceOver), zoom, contrast, and color blindness testing.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-600">
            <h3 className="font-bold mb-2">W3C Validation</h3>
            <p className="text-gray-700 text-sm">
              HTML markup validated against W3C standards with 0 errors and 0 warnings.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-600">
            <h3 className="font-bold mb-2">Color Contrast Verification</h3>
            <p className="text-gray-700 text-sm">
              All text and UI components tested with TPGI Color Contrast Analyzer to exceed WCAG standards.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
          <p className="text-gray-700">
            <strong>Want to review our full accessibility audit?</strong><br />
            Technical details are available in our repository:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span><code className="bg-white px-2 py-1 rounded">ACCESSIBILITY_AUDIT.md</code> – Complete audit report</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span><code className="bg-white px-2 py-1 rounded">ACCESSIBILITY_COMPLIANCE.md</code> – Framework & standards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span><code className="bg-white px-2 py-1 rounded">WCAG_CERTIFICATION.md</code> – Certification details</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Continuous Improvement */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: COLORS.navy }}
        >
          Our Commitment to Accessibility
        </h2>

        <div className="bg-navy-900 rounded-lg p-8" style={{ backgroundColor: COLORS.navy }}>
          <p className="text-white text-lg leading-relaxed mb-6">
            Accessibility is not a feature—it's a fundamental right. We are committed to:
          </p>

          <ul className="text-white space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold mt-1">✓</span>
              <span>Maintaining WCAG 2.2 Level AA compliance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold mt-1">✓</span>
              <span>Regular accessibility audits (quarterly reviews)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold mt-1">✓</span>
              <span>Rapid response to accessibility issues (5 business days)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold mt-1">✓</span>
              <span>Training our team on accessibility best practices</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold mt-1">✓</span>
              <span>Monitoring and adopting WCAG 3.0 standards as they evolve</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-700 mb-4">
            <strong>Last Accessibility Audit:</strong> November 30, 2025
          </p>
          <p className="text-gray-700">
            <strong>Next Review Scheduled:</strong> June 30, 2026
          </p>
        </div>
      </section>
    </div>
  );
};

export default AccessibilityPage;
