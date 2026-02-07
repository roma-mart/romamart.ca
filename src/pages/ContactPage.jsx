import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, Phone, Clock, Mail } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import StructuredData from '../components/StructuredData';
import { buildBreadcrumbArray } from '../schemas/breadcrumbSchema';
import LiveHoursDisplay from '../components/LiveHoursDisplay';
import ContactForm from '../components/ContactForm';
import COMPANY_DATA from '../config/company_data';
import { normalizePhoneForTel } from '../utils/phone';

const ContactPage = () => {
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };
  const BASE_URL = import.meta.env.BASE_URL || '/';

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
            <h1 className="text-4xl md:text-5xl uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
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
            <h2 className="text-2xl mb-8" style={{ color: 'var(--color-heading)' }}>
              Get In Touch
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <MapPin aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Visit Us</h3>
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
                  <Phone aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Call Us</h3>
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
                  <Mail aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Email Us</h3>
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
                  <Clock aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Hours</h3>
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
            <h3 className="text-heading text-2xl mb-6" style={{ color: 'var(--color-heading)' }}>
              Send a Message
            </h3>
            <ContactForm idPrefix="page-contact" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
