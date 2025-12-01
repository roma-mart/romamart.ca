import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Mail, Phone, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import ShareButton from './ShareButton';

const AccessibilityPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
    black: '#151515',
  };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };
  
  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
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
              className="hover:text-yellow-500 transition-colors"
              style={mutedTextColor}
            >
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Accessibility</li>
        </ol>
      </nav>
      {/* Skip link target */}
      <a id="accessibility-content" className="sr-only" href="#accessibility-content">
        Skip to accessibility content
      </a>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 
            className="text-4xl md:text-5xl font-coco uppercase"
            style={{ color: 'var(--color-heading)' }}
          >
            Accessibility Statement
          </h1>
          <ShareButton 
            title="Roma Mart Accessibility"
            text="Learn about Roma Mart's accessibility commitment"
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          />
        </div>
        <p className="text-lg font-inter leading-relaxed mb-4" style={textColor}>
          Roma Mart Convenience is committed to ensuring digital accessibility for people with disabilities. 
          We strive to maintain and continually improve the accessibility of our website to conform to the 
          Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
        </p>
        <p className="text-lg font-inter leading-relaxed" style={textColor}>
          This page outlines our accessibility compliance, standards met, and how to report accessibility issues.
        </p>
      </section>

      {/* Compliance Standards */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-12"
          style={{ color: 'var(--color-heading)' }}
        >
          Standards & Certifications
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* WCAG 2.2 AA */}
          <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle size={32} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>WCAG 2.2 Level AA</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Web Content Accessibility Guidelines</p>
              </div>
            </div>
            <p className="mb-4 leading-relaxed" style={textColor}>
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
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>AODA Compliant</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Ontario Accessibility Requirements</p>
              </div>
            </div>
            <p className="mb-4 leading-relaxed" style={textColor}>
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
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>ISO/IEC 40500:2025</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>International Accessibility Standard</p>
              </div>
            </div>
            <p className="mb-4 leading-relaxed" style={textColor}>
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
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>EN 301 549 (EAA)</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>European Accessibility Act</p>
              </div>
            </div>
            <p className="mb-4 leading-relaxed" style={textColor}>
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
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-heading)' }}>🚀 WCAG 3.0 Ready</h3>
          <p style={textColor}>
            Our website is designed with outcome-based accessibility principles, ensuring readiness for WCAG 3.0 
            as it becomes the official standard.
          </p>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: 'var(--color-heading)' }}
        >
          Accessibility Features
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Keyboard Navigation</h3>
              <p style={textColor}>
                All functionality is accessible via keyboard. Navigate with Tab, activate with Enter/Space, 
                and close menus with Escape.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Visible Focus Indicators</h3>
              <p style={textColor}>
                High-contrast yellow outline (3px, 13.8:1 contrast ratio) shows keyboard focus on all interactive elements.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Screen Reader Support</h3>
              <p style={textColor}>
                Semantic HTML, ARIA labels, and descriptive link text make our site fully compatible with 
                NVDA, JAWS, and VoiceOver screen readers.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Skip Navigation</h3>
              <p style={textColor}>
                Press Tab to see the "Skip to main content" link, allowing you to bypass repetitive navigation elements.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Enhanced Color Contrast</h3>
              <p style={textColor}>
                All text and UI components meet or exceed WCAG AA contrast requirements. Our brand colors 
                exceed AAA standards (12.6:1 navy, 8.4:1 yellow).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Reduced Motion Support</h3>
              <p style={textColor}>
                If you enable "Reduce motion" in your operating system preferences, animations and transitions 
                on our site will be disabled.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Resizable Text & Zoom</h3>
              <p style={textColor}>
                Text can be resized up to 200% without loss of content or functionality. Content reflows properly 
                on all zoom levels.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle size={24} style={{ color: COLORS.yellow }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1" style={textColor}>Touch-Friendly Targets</h3>
              <p style={textColor}>
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
          style={{ color: 'var(--color-heading)' }}
        >
          Report an Accessibility Issue
        </h2>

        <p className="mb-8 leading-relaxed" style={textColor}>
          If you encounter any accessibility barriers or have suggestions for improvement, we'd like to hear from you. 
          Please contact us using any of the methods below:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <Mail size={32} className="mb-4" style={{ color: 'var(--color-icon)' }} />
            <h3 className="font-bold text-lg mb-2" style={textColor}>Email</h3>
            <a 
              href="mailto:accessibility@romamart.ca" 
              className="text-blue-600 hover:underline break-all"
            >
              accessibility@romamart.ca
            </a>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <Phone size={32} className="mb-4" style={{ color: 'var(--color-icon)' }} />
            <h3 className="font-bold text-lg mb-2" style={textColor}>Phone</h3>
            <a 
              href="tel:+13823422000" 
              className="text-blue-600 hover:underline"
            >
              +1 (382) 342-2000
            </a>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <MapPin size={32} className="mb-4" style={{ color: 'var(--color-icon)' }} />
            <h3 className="font-bold text-lg mb-2" style={textColor}>Visit Us</h3>
            <p className="text-sm" style={textColor}>
              189-3 Wellington Street<br />
              Sarnia, ON N7T 1G6
            </p>
          </div>
        </div>

        <p className="mt-8 leading-relaxed" style={textColor}>
          We will make reasonable efforts to provide accommodations and respond to accessibility inquiries 
          within 5 business days.
        </p>
      </section>

      {/* Technical Details & Documentation */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: 'var(--color-heading)' }}
        >
          Documentation & Testing
        </h2>

        <p className="mb-6 leading-relaxed" style={textColor}>
          Our accessibility compliance is verified through automated testing and manual review:
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded border-l-4 border-blue-600" style={{ backgroundColor: 'var(--color-surface)' }}>
            <h3 className="font-bold mb-2" style={textColor}>ESLint jsx-a11y</h3>
            <p className="text-sm" style={textColor}>
              20+ automated accessibility linting rules run on every code change to catch violations early.
            </p>
          </div>

          <div className="p-4 rounded border-l-4 border-green-600" style={{ backgroundColor: 'var(--color-surface)' }}>
            <h3 className="font-bold mb-2" style={textColor}>Manual Testing</h3>
            <p className="text-sm" style={textColor}>
              Keyboard navigation, screen reader compatibility (NVDA, VoiceOver), zoom, contrast, and color blindness testing.
            </p>
          </div>

          <div className="p-4 rounded border-l-4 border-purple-600" style={{ backgroundColor: 'var(--color-surface)' }}>
            <h3 className="font-bold mb-2" style={textColor}>W3C Validation</h3>
            <p className="text-sm" style={textColor}>
              HTML markup validated against W3C standards with 0 errors and 0 warnings.
            </p>
          </div>

          <div className="p-4 rounded border-l-4 border-orange-600" style={{ backgroundColor: 'var(--color-surface)' }}>
            <h3 className="font-bold mb-2" style={textColor}>Color Contrast Verification</h3>
            <p className="text-sm" style={textColor}>
              All text and UI components tested with TPGI Color Contrast Analyzer to exceed WCAG standards.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
          <p style={textColor}>
            <strong>Want to review our full accessibility audit?</strong><br />
            Technical details are available in our repository:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span style={textColor}><code className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-bg)' }}>ACCESSIBILITY_AUDIT.md</code> – Complete audit report</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span style={textColor}><code className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-bg)' }}>ACCESSIBILITY_COMPLIANCE.md</code> – Framework & standards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span style={textColor}><code className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-bg)' }}>WCAG_CERTIFICATION.md</code> – Certification details</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Continuous Improvement */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-3xl font-coco uppercase mb-8"
          style={{ color: 'var(--color-heading)' }}
        >
          Our Commitment to Accessibility
        </h2>

        <div className="bg-navy-900 rounded-lg p-8" style={{ backgroundColor: '#020178' }}>
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

        <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
          <p className="mb-4" style={textColor}>
            <strong>Last Accessibility Audit:</strong> November 30, 2025
          </p>
          <p style={textColor}>
            <strong>Next Review Scheduled:</strong> June 30, 2026
          </p>
        </div>
      </section>
    </div>
  );
};

export default AccessibilityPage;
