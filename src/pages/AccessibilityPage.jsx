import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Mail, Phone, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import { tokens } from '../design/tokens';
import COMPANY_DATA from '../config/company_data';
import StructuredData from '../components/StructuredData';
import { buildBreadcrumbArray } from '../schemas/breadcrumbSchema';

const AccessibilityPage = () => {
  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Accessibility Statement | Roma Mart Convenience</title>
        <meta name="description" content="Roma Mart Convenience is committed to digital accessibility. WCAG 2.2 Level AA compliant. Learn about our accessibility features and report issues." />
        <link rel="canonical" href="https://romamart.ca/accessibility" />
      </Helmet>

      {/* Breadcrumb Schema */}
      <StructuredData type="BreadcrumbList" data={{ breadcrumbs: buildBreadcrumbArray('Accessibility', 'https://romamart.ca/accessibility') }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-accent transition-colors" style={mutedTextColor}>Home</a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Accessibility</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 className="text-4xl md:text-5xl uppercase" style={{ color: 'var(--color-heading)' }}>Accessibility Statement</h1>
          <ShareButton
            title="Roma Mart Accessibility"
            text="Learn about Roma Mart's accessibility commitment"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
            className="hover:opacity-90"
          />
        </div>
        <p className="text-lg font-inter leading-relaxed mb-4" style={textColor}>
          Roma Mart Convenience is committed to ensuring digital accessibility for people with disabilities. We strive to maintain and continually improve the accessibility of our website to conform to WCAG 2.2 Level AA.
        </p>
        <p className="text-lg font-inter leading-relaxed" style={textColor}>
          This page outlines our accessibility compliance, standards met, and how to report accessibility issues.
        </p>
      </section>

      {/* Standards */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-3xl uppercase mb-12" style={{ color: 'var(--color-heading)' }}>Standards & Certifications</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: 'WCAG 2.2 Level AA', link: 'https://www.w3.org/WAI/WCAG22/quickref/' },
            { title: 'AODA Compliant', link: 'https://www.ontario.ca/laws/regulation/070191' },
            { title: 'ISO/IEC 40500', link: 'https://www.w3.org/WAI/standards-guidelines/wcag/faq/#iso' },
            { title: 'EN 301 549 (EAA)', link: 'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/' }
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg p-8 transition-colors" style={{ border: '2px solid var(--color-border)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle size={32} aria-hidden="true" style={{ color: 'var(--color-accent)' }} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Web accessibility standard</p>
                </div>
              </div>
              <p className="mb-4 leading-relaxed" style={textColor}>Our website conforms to internationally recognized accessibility standards and practices.</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline font-medium" style={{ color: 'var(--color-accent)' }} aria-label={`Learn more about ${item.title}`}>
                Learn more <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 rounded-lg border-2" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-accent)' }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-heading)' }}>Continuous Improvement</h3>
          <p style={textColor}>We regularly audit our site to maintain conformance and are monitoring the development of WCAG 3.0 to adopt improvements as the standard evolves.</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-3xl uppercase mb-8" style={{ color: 'var(--color-heading)' }}>Accessibility Features</h2>
        <div className="space-y-6">
          {['Keyboard Navigation','Visible Focus Indicators','Screen Reader Support','Skip Navigation','Enhanced Color Contrast','Reduced Motion Support','Resizable Text & Zoom','Touch-Friendly Targets'].map((title, i) => (
            <div className="flex gap-4" key={i}>
              <CheckCircle size={24} aria-hidden="true" style={{ color: 'var(--color-accent)' }} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1" style={textColor}>{title}</h3>
                <p style={textColor}>
                  {title === 'Keyboard Navigation' && 'All functionality is accessible via keyboard. Navigate with Tab, activate with Enter/Space, and close dialogs with Escape. Modal dialogs and menus trap focus to prevent keyboard users from getting lost.'}
                  {title === 'Visible Focus Indicators' && 'High-contrast focus outline shows keyboard focus on all interactive elements, ensuring you always know where you are on the page.'}
                  {title === 'Screen Reader Support' && 'Semantic HTML, ARIA labels, live regions for form errors and status messages, and descriptive link text ensure compatibility with NVDA, JAWS, and VoiceOver screen readers.'}
                  {title === 'Skip Navigation' && 'Press Tab to see the "Skip to main content" link, allowing you to bypass repetitive navigation elements.'}
                  {title === 'Enhanced Color Contrast' && 'Text and UI components are designed to meet WCAG AA contrast requirements across both light and dark themes.'}
                  {title === 'Reduced Motion Support' && 'If you enable "Reduce motion" in your operating system preferences, animations and transitions on our site are minimized or disabled.'}
                  {title === 'Resizable Text & Zoom' && 'Text can be resized up to 200% without loss of content or functionality. Content reflows properly on all zoom levels.'}
                  {title === 'Touch-Friendly Targets' && 'Buttons, links, and form inputs are sized for comfortable touch interaction, meeting mobile accessibility standards.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Report issue */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl uppercase mb-8"
          style={{ 
            color: 'var(--color-heading)',
            fontFamily: tokens?.fonts?.heading || 'inherit',
            fontSize: tokens?.fontSize?.['3xl'] || '1.875rem',
            fontWeight: tokens?.fontWeight?.bold || 'bold',
          }}
        >
          Report an Accessibility Issue
        </h2>
        <p className="mb-8 leading-relaxed" style={textColor}>If you encounter any accessibility barriers or have suggestions for improvement, we'd like to hear from you. Please contact us using any of the methods below:</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <Mail size={32} aria-hidden="true" className="mb-4" style={{ color: 'var(--color-icon)' }} />
            <h3 className="font-bold text-lg mb-2" style={textColor}>Email</h3>
            <a href={`mailto:${COMPANY_DATA.location.contact.email}`} className="hover:underline break-all" style={{ color: 'var(--color-accent)' }}>{COMPANY_DATA.location.contact.email}</a>
          </div>
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <Phone size={32} aria-hidden="true" className="mb-4" style={{ color: 'var(--color-icon)' }} />
            <h3 className="font-bold text-lg mb-2" style={textColor}>Phone</h3>
            <a href={`tel:${COMPANY_DATA.location.contact.phone}`} className="hover:underline" style={{ color: 'var(--color-accent)' }}>{COMPANY_DATA.location.contact.phone}</a>
          </div>
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <MapPin size={32} aria-hidden="true" className="mb-4" style={{ color: 'var(--color-icon)' }} />
            <h3 className="font-bold text-lg mb-2" style={textColor}>Visit Us</h3>
            <p className="text-sm" style={textColor}>{COMPANY_DATA.location.address.formatted}</p>
          </div>
        </div>
        <p className="mt-8 leading-relaxed" style={textColor}>We will make reasonable efforts to provide accommodations and respond to accessibility inquiries within 5 business days.</p>
      </section>

      {/* Commitment */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl uppercase mb-8" style={{ color: 'var(--color-heading)' }}>Our Commitment to Accessibility</h2>
        <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-primary)' }}>
          <p className="text-lg leading-relaxed mb-6" style={{ color: 'white' }}>Accessibility is not a feature—it's a fundamental right. We are committed to:</p>
          <ul className="space-y-3" style={{ color: 'white' }}>
            {['Maintaining WCAG 2.2 Level AA conformance','Regular accessibility audits and remediation','Rapid response to accessibility issues (5 business days)','Training our team on accessibility best practices','Monitoring evolving standards including WCAG 3.0'].map((item, idx) => (
              <li className="flex items-start gap-3" key={idx}>
                <span className="font-bold mt-1" style={{ color: 'var(--color-accent)' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
          <p className="mb-4" style={textColor}><strong>Last Accessibility Audit:</strong> February 7, 2026</p>
          <p style={textColor}><strong>Next Review Scheduled:</strong> May 2026</p>
        </div>
      </section>
    </div>
  );
};

export default AccessibilityPage;
