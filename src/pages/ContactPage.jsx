import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, Phone, Clock, Mail, Send } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import { useBackgroundSync } from '../hooks/useServiceWorker';
import { useToast } from '../components/ToastContainer';
import { queueFormSubmission, getPendingCount } from '../utils/indexedDB';

const ContactPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const STORE_DATA = {
    contact: {
      phone: '+1 (382) 342-2000',
      email: 'info@romamart.ca'
    },
    locations: [{
      address: '189-3 Wellington Street, Sarnia, ON N7T 1G6',
      hours: {
        weekdays: '7:00 AM - 11:00 PM',
        weekends: '8:00 AM - 11:00 PM'
      }
    }]
  };

  const [formStatus, setFormStatus] = useState('');
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const { syncSupported, queueSync } = useBackgroundSync();
  const { showToast } = useToast();

  // Check for pending submissions on mount
  useEffect(() => {
    const checkPending = async () => {
      try {
        const count = await getPendingCount();
        setPendingSubmissions(count);
        if (count > 0) {
          showToast(`You have ${count} pending form submission(s) that will sync when online`, 'info');
        }
      } catch (error) {
        console.error('Error checking pending submissions:', error);
      }
    };
    checkPending();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    
    // Check if online
    const isOnline = navigator.onLine;
    
    if (!isOnline && syncSupported) {
      // Queue for background sync
      try {
        await queueFormSubmission(formObject);
        await queueSync('contact-form-sync');
        setFormStatus('queued');
        showToast('Form saved! Will submit when connection restored.', 'info');
        e.target.reset();
        setPendingSubmissions(prev => prev + 1);
      } catch (error) {
        console.error('Error queuing form:', error);
        setFormStatus('error');
        showToast('Failed to save form. Please try again when online.', 'error');
      }
      return;
    }
    
    // Online - submit immediately
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setFormStatus('success');
        showToast('Message sent successfully!', 'success');
        e.target.reset();
      } else {
        setFormStatus('error');
        showToast('Failed to send message. Please try again.', 'error');
      }
    } catch {
      // If fetch fails while "online", try to queue
      if (syncSupported) {
        try {
          await queueFormSubmission(formObject);
          await queueSync('contact-form-sync');
          setFormStatus('queued');
          showToast('Connection issue. Form saved and will submit when restored.', 'info');
          e.target.reset();
          setPendingSubmissions(prev => prev + 1);
        } catch {
          setFormStatus('error');
          showToast('Failed to send message. Please try again.', 'error');
        }
      } else {
        setFormStatus('error');
        showToast('Failed to send message. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Contact Us | Roma Mart Convenience</title>
        <meta name="description" content="Get in touch with Roma Mart. Visit us, call, or send a message. We're here to help!" />
        <link rel="canonical" href="https://romamart.ca/contact" />
      </Helmet>

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-yellow-500 transition-colors" style={mutedTextColor}>Home</a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Contact</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-coco uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Contact <span style={{ color: COLORS.yellow }}>Us</span>
            </h1>
            <p className="text-lg font-inter leading-relaxed max-w-3xl" style={textColor}>
              Have a question or feedback? We'd love to hear from you! Reach out through any of the methods below.
            </p>
          </div>
          <ShareButton 
            title="Contact Roma Mart"
            text="Get in touch with Roma Mart - Sarnia's premier convenience store!"
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-coco mb-8" style={{ color: 'var(--color-heading)' }}>
              Get In Touch
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <MapPin style={{ color: 'var(--color-icon)' }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Visit Us</h4>
                  <p style={textColor}>{STORE_DATA.locations[0].address}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_DATA.locations[0].address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-inter text-sm font-semibold hover:underline"
                    style={{ color: COLORS.yellow }}
                  >
                    Get Directions →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Phone style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Call Us</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`tel:${STORE_DATA.contact.phone}`} className="hover:underline" style={{ color: COLORS.yellow }}>
                      {STORE_DATA.contact.phone}
                    </a>
                    <CopyButton 
                      text={STORE_DATA.contact.phone}
                      label="Phone number"
                      style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Mail style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Email Us</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${STORE_DATA.contact.email}`} className="hover:underline" style={{ color: COLORS.yellow }}>
                      {STORE_DATA.contact.email}
                    </a>
                    <CopyButton 
                      text={STORE_DATA.contact.email}
                      label="Email address"
                      style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Clock style={{ color: 'var(--color-icon)' }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>Hours</h4>
                  <p style={textColor}>Mon-Fri: {STORE_DATA.locations[0].hours.weekdays}</p>
                  <p style={textColor}>Sat-Sun: {STORE_DATA.locations[0].hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-2xl shadow-lg border" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-coco text-2xl mb-6" style={{ color: 'var(--color-heading)' }}>
              Send a Message
            </h3>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-700 font-inter">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {formStatus === 'queued' && (
              <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-blue-700 font-inter">📥 Message saved! Will be sent automatically when connection is restored.</p>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700 font-inter">✗ Something went wrong. Please try again.</p>
              </div>
            )}

            {pendingSubmissions > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-yellow-800 font-inter">⏳ You have {pendingSubmissions} pending submission(s) waiting to sync.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
              <input type="hidden" name="subject" value="New Contact Form Submission from romamart.ca" />

              <div>
                <label htmlFor="name" className="block font-inter font-semibold mb-2" style={textColor}>Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border font-inter"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-inter font-semibold mb-2" style={textColor}>Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border font-inter"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-inter font-semibold mb-2" style={textColor}>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg border font-inter"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-inter font-semibold mb-2" style={textColor}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border font-inter resize-none"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-bold font-inter flex items-center justify-center gap-2 transition-transform hover:scale-105"
                style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
