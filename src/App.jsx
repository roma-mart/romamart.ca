import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
// ...existing code...
import { getPreferredLocation } from './utils/locationMath';
import { isLocationOpen } from './utils/availability';
import { useCompanyData } from './contexts/CompanyDataContext';
import { Logo } from './components/Logo';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrandPatternBackground from './components/BrandPatternBackground';
import ShareButton from './components/ShareButton';
import Button from './components/Button';
import StandardizedItem from './components/StandardizedItem';
import LiveHoursDisplay from './components/LiveHoursDisplay';
import { useLocationAware } from './hooks/useLocationContext';
import Phone from 'lucide-react/dist/esm/icons/phone.js';
import Clock from 'lucide-react/dist/esm/icons/clock.js';
import { useMenu } from './contexts/MenuContext';
import { useServices } from './contexts/ServicesContext';
import { useLocations } from './contexts/LocationsContext';
import ContactForm from './components/ContactForm';
import StructuredData from './components/StructuredData';
import { useAutoLocation } from './hooks/useAutoLocation';

// PWA Hooks
import { useServiceWorker } from './hooks/useServiceWorker';
import { usePageVisibility } from './hooks/useBrowserFeatures';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';

// dynamically resolve domain for assets
import { getAssetUrl } from './utils/getAssetUrl';

// Code splitting: Lazy load page components
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const RoCafePage = lazy(() => import('./pages/RoCafePage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// component imports
import NetworkStatus from './components/NetworkStatus';
import CopyButton from './components/CopyButton';
import { normalizePhoneForTel } from './utils/phone';

const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

// --- CUSTOM COMPONENTS ---

function Hero({ onTrackOrder }) {
  const { companyData } = useCompanyData();
  const shouldReduceMotion = useReducedMotion();
  const handleOrderClick = useCallback(() => {
    if (onTrackOrder) onTrackOrder('hero_section');
  }, [onTrackOrder]);

  return (
    <div
      id="hero-section"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <img
        src={getAssetUrl('/images/pattern.png')}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-transparent opacity-90 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            <div
              className="inline-block px-4 py-1 mb-6 rounded-full border"
              style={{
                borderColor: 'var(--color-accent-bg)',
                backgroundColor: 'var(--color-accent-bg)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span
                className="text-sm font-inter font-semibold tracking-widest uppercase"
                style={{ color: 'var(--color-accent)' }}
              >
                {companyData.heroBadge}
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl uppercase leading-none"
              style={{ color: 'var(--color-text-on-primary)', marginBottom: '1.5rem' }}
            >
              Your Daily <br />
              <span style={{ color: 'var(--color-accent)' }}>Stop & Go</span>
            </h1>
            <p
              className="text-lg md:text-xl font-inter mb-6 max-w-lg leading-relaxed"
              style={{ color: 'var(--color-text-on-primary)' }}
            >
              Experience Sarnia's newest convenience destination. From daily essentials to premium coffee, we have what
              you need.
            </p>
            <div className="mb-6">
              <ShareButton
                title="Roma Mart"
                text="Check out Roma Mart - Sarnia's newest convenience store!"
                className="bg-white/10 text-white hover:bg-white/20 border border-white/30"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href={companyData.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="order"
                size="lg"
                icon={<ExternalLink size={20} />}
                analyticsEvent="order_cta_hero"
                aria-label="Order online from Roma Mart"
                onClick={handleOrderClick}
              >
                ORDER ONLINE
              </Button>
              <Button
                href={`${BASE_URL}locations`}
                variant="navlink"
                size="lg"
                icon={<ArrowRight size={20} />}
                aria-label="Visit In Store Location"
              >
                Visit In Store
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src={getAssetUrl('/images/comeinwereopensign.png')}
                alt="Come in! We're Open Sign"
                className="w-full h-[500px] object-cover"
                fetchpriority="high"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const ServicesSection = ({ featuredServices = [], loading, error, refetch }) => {
  useLocationAware();
  return (
    <section id="services" className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl uppercase text-center mb-12" style={{ color: 'var(--color-heading)' }}>
          Our <span style={{ color: 'var(--color-accent)' }}>Services</span>
        </h2>

        {loading ? (
          <output className="block text-center py-8" aria-live="polite">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-3"
              aria-hidden="true"
              style={{ borderColor: 'var(--color-accent)' }}
            ></div>
            <p className="text-sm font-inter" style={{ color: 'var(--color-text)' }}>
              Loading services...
            </p>
          </output>
        ) : (
          <>
            {error && (
              <div
                className="flex items-center justify-center gap-3 py-2 px-4 rounded-lg mb-6 text-sm font-inter"
                style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}
                role="alert"
              >
                <span>Using cached data.</span>
                <button
                  type="button"
                  onClick={refetch}
                  className="underline font-semibold hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  style={{ '--tw-ring-color': 'var(--color-accent)' }}
                >
                  Update
                </button>
              </div>
            )}
            {/* Featured Services with StandardizedItem */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredServices.map((service) => (
                <StandardizedItem key={service.id} item={service} itemType="service" defaultExpanded={false} />
              ))}
            </div>
          </>
        )}

        <div className="text-center">
          <Button
            href={`${BASE_URL}services`}
            variant="navlink"
            size="lg"
            icon={<ArrowRight size={20} />}
            aria-label="View all services"
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

const RoCafeSection = ({ menuItems, loading, error, refetch }) => {
  // Filter for featured items (context already handles API-first with static fallback)
  const featuredItems = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];
    return menuItems.filter((item) => item.featured);
  }, [menuItems]);

  return (
    <section id="rocafe" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
      <img
        src={getAssetUrl('/images/pattern.png')}
        alt="Brand pattern background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        aria-hidden="true"
        loading="lazy"
      />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-black/20 skew-x-12 transform translate-x-20"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 bg-white/80"
                style={{ backgroundColor: 'rgba(var(--color-surface), 0.1)', borderColor: 'var(--color-accent)' }}
              >
                <img
                  src={getAssetUrl('/rocafe-logo.png')}
                  alt="RoCafe logo"
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-4xl" style={{ color: 'var(--color-text-on-primary)' }}>
                  RoCafé
                </h2>
                <p className="font-inter tracking-wider uppercase text-sm" style={{ color: 'var(--color-accent)' }}>
                  Sip. Savor. Repeat.
                </p>
              </div>
            </div>
            <p className="font-inter text-lg mb-8" style={{ color: 'var(--color-text-on-primary)' }}>
              Step into our dedicated café corner. Whether you need a morning espresso kick or a refreshing afternoon
              tea, RoCafé is brewing specifically for you.
            </p>

            {/* Featured Menu Items with StandardizedItem */}
            <div className="space-y-3 mb-8">
              {loading ? (
                <output
                  className="block text-center py-4"
                  aria-live="polite"
                  style={{ color: 'var(--color-text-on-primary)' }}
                >
                  <div
                    className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
                    aria-hidden="true"
                    style={{ borderColor: 'var(--color-accent)' }}
                  ></div>
                  <p className="mt-2 text-sm font-inter">Loading menu...</p>
                </output>
              ) : (
                <>
                  {error && (
                    <div
                      className="flex items-center justify-center gap-3 py-2 px-4 rounded-lg mb-3 text-sm font-inter"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--color-accent)' }}
                      role="alert"
                    >
                      <span>Using cached data.</span>
                      <button
                        type="button"
                        onClick={refetch}
                        className="underline font-semibold hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                        style={{ '--tw-ring-color': 'var(--color-accent)' }}
                      >
                        Update
                      </button>
                    </div>
                  )}
                  {featuredItems.map((item) => (
                    <StandardizedItem key={item.id} item={item} itemType="menu" defaultExpanded={false} />
                  ))}
                </>
              )}
            </div>

            <div className="mt-8">
              <Button
                href={`${BASE_URL}rocafe`}
                variant="navlink"
                size="lg"
                icon={<ArrowRight size={20} />}
                aria-label="View full RoCafe menu"
              >
                View Full Menu
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="relative aspect-square rounded-full overflow-hidden border-8 border-white/5 shadow-2xl">
              <img
                src={getAssetUrl('/stickers-rocafe-lightblue.png')}
                alt="RoCafé sticker logo in light blue"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Locations = () => {
  const [userCoords, setUserCoords] = useState(null);
  const { locations, loading: locLoading, error: locError, refetch: locRefetch } = useLocations();

  const primaryLocation = useMemo(() => locations.find((loc) => loc.isPrimary) || locations[0], [locations]);

  const preferredLocation = useMemo(
    () => getPreferredLocation({ userCoords, locations }) || primaryLocation,
    [userCoords, locations, primaryLocation]
  );

  const locationCount = useMemo(() => locations.filter((loc) => loc.status === 'open').length, [locations]);

  const handleAutoLocation = useCallback((pos) => {
    const coords = pos?.coords;
    if (coords?.latitude && coords?.longitude) {
      setUserCoords({ latitude: coords.latitude, longitude: coords.longitude });
    }
  }, []);

  useAutoLocation(handleAutoLocation);

  const displayLocation = useMemo(
    () => ({
      id: preferredLocation.id,
      name: preferredLocation.name,
      address: preferredLocation.address.formatted,
      mapLink: preferredLocation.google.mapLink,
      embedUrl: preferredLocation.google.embedUrl,
      isOpen: isLocationOpen(preferredLocation),
    }),
    [preferredLocation]
  );

  // Note: Homepage only displays one location (the preferred/closest one)
  // so we don't need user selection logic here. Use displayLocation directly.
  const activeLoc = displayLocation;

  return (
    <section id="locations" className="py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--color-accent)' }}>
            Find Us
          </span>
          <h2 className="text-4xl mt-2" style={{ color: 'var(--color-heading)' }}>
            Our Location{locationCount > 1 ? 's' : ''}
          </h2>
        </div>

        {locLoading ? (
          <output className="block text-center py-8" aria-live="polite">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-3"
              aria-hidden="true"
              style={{ borderColor: 'var(--color-accent)' }}
            ></div>
            <p className="text-sm font-inter" style={{ color: 'var(--color-text)' }}>
              Loading locations...
            </p>
          </output>
        ) : (
          <>
            {locError && (
              <div
                className="flex items-center justify-center gap-3 py-2 px-4 rounded-lg mb-6 text-sm font-inter"
                style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}
                role="alert"
              >
                <span>Using cached data.</span>
                <button
                  type="button"
                  onClick={locRefetch}
                  className="underline font-semibold hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  style={{ '--tw-ring-color': 'var(--color-accent)' }}
                >
                  Update
                </button>
              </div>
            )}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                {[displayLocation].map((loc) => (
                  <div
                    key={loc.id}
                    className="w-full text-left p-6 rounded-xl border-2 flex items-center gap-4"
                    style={{
                      borderColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    {preferredLocation.photos?.thumbnail && (
                      <img
                        src={preferredLocation.photos.thumbnail}
                        alt={`${loc.name} thumbnail`}
                        className="w-16 h-16 rounded-lg object-cover border border-[var(--color-accent)] shadow"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg mb-1" style={{ color: 'var(--color-heading)' }}>
                        {loc.name}
                      </h3>
                      <p className="text-sm font-inter mb-4" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        {loc.address}
                      </p>
                      <div
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: loc.isOpen ? 'var(--color-success)' : 'var(--color-error)' }}
                        ></div>
                        {loc.isOpen ? 'Open Now' : 'Closed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="lg:col-span-2 rounded-3xl overflow-hidden min-h-[400px] relative shadow-inner"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {displayLocation.embedUrl ? (
                  <iframe
                    title={`Google Maps - ${displayLocation.name}`}
                    src={displayLocation.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="absolute inset-0"
                  ></iframe>
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6"
                    style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  >
                    <p className="font-inter text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Open this location in Google Maps for directions.
                    </p>
                    <a
                      href={displayLocation.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                    >
                      Open Map
                    </a>
                  </div>
                )}
                <div className="absolute bottom-6 right-6">
                  <a
                    href={activeLoc.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
                  >
                    <MapPin size={18} /> Open in Maps
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Button
                href={`${BASE_URL}locations`}
                variant="navlink"
                size="lg"
                icon={<ArrowRight size={20} />}
                aria-label="View all locations"
              >
                View All Locations
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// --- CONTACT SECTION ---
const ContactSection = () => {
  const { companyData } = useCompanyData();
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };
  const { locations } = useLocations();
  const primaryLocation = useMemo(() => locations.find((loc) => loc.isPrimary) || locations[0], [locations]);

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info Side */}
          <div>
            <span className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--color-accent)' }}>
              Get in Touch
            </span>
            <h2 className="text-4xl mt-2 mb-6" style={{ color: 'var(--color-heading)' }}>
              Contact Us
            </h2>
            <p className="mb-10 font-inter leading-relaxed" style={mutedTextColor}>
              Have a question about our products, want to suggest a new snack, or interested in a partnership? We'd love
              to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <MapPin aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>
                    Visit Us
                  </h3>
                  <p className="mb-2" style={textColor}>
                    {primaryLocation.address.formatted}
                  </p>
                  <CopyButton
                    text={primaryLocation.address.formatted}
                    label="Address"
                    className="text-xs"
                    style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <Phone aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-heading)' }}>
                    Call Us
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`tel:${normalizePhoneForTel(companyData?.location?.contact?.phone)}`}
                      className="hover:underline"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {companyData?.location?.contact?.phone}
                    </a>
                    <CopyButton
                      text={companyData?.location?.contact?.phone}
                      label="Phone number"
                      style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <Clock aria-hidden="true" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--color-accent)' }}>
                    Hours
                  </h3>
                  <LiveHoursDisplay
                    placeId={primaryLocation.google.placeId}
                    fallbackHours={{
                      daily: primaryLocation.hours.daily,
                      exceptions: primaryLocation.hours.exceptions,
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
          <div
            className="p-8 rounded-2xl shadow-lg border"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
          >
            <h3 className="text-2xl mb-6" style={{ color: 'var(--color-heading)' }}>
              Send a Message
            </h3>
            <ContactForm idPrefix="home-contact" formSubject="New Contact from Roma Mart Website" />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN APP ---
function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(BASE_URL, '/') : '/';
  const { companyData } = useCompanyData();
  const { updateAvailable, skipWaiting } = useServiceWorker();
  const [updateDismissed, setUpdateDismissed] = useState(sessionStorage.getItem('pwa-update-dismissed') === 'true');
  const isVisible = usePageVisibility();

  // Fetch menu data from API for homepage featured schemas + RoCafe section
  // Menu is now provided via MenuProvider context to avoid duplicate API calls
  const { menuItems, loading, error: menuError, refetch: menuRefetch } = useMenu();

  // Fetch services data from API with fallback to static SERVICES
  const { services, loading: servicesLoading, error: servicesError, refetch: servicesRefetch } = useServices();

  // Fetch locations data from API with fallback to static LOCATIONS
  const { locations } = useLocations();

  // Only include featured items for homepage schemas (limited selection)
  const featuredSchemaItems = useMemo(() => {
    const featured = menuItems.filter((item) => item.featured);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[App.jsx] Featured menu items for homepage:', {
        totalMenuItems: menuItems.length,
        featuredCount: featured.length,
        featuredItems: featured.map((item) => ({ id: item.id, name: item.name })),
      });
    }
    return featured;
  }, [menuItems]);

  // Only include featured services for homepage schemas
  const featuredServices = useMemo(() => {
    return services.filter((service) => service.featured);
  }, [services]);

  // Prices are already normalized to dollars by MenuContext
  const schemaPriceInCents = false;
  useEffect(() => {
    if (!isVisible && import.meta.env.DEV) {
      console.warn('[Performance] Tab hidden - pausing heavy operations');
    }
  }, [isVisible]);
  const getPage = useCallback(() => {
    const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    switch (normalized) {
      case '/':
        return 'home';
      case '/services':
        return 'services';
      case '/rocafe':
        return 'rocafe';
      case '/locations':
        return 'locations';
      case '/contact':
        return 'contact';
      case '/about':
        return 'about';
      case '/accessibility':
        return 'accessibility';
      case '/privacy':
        return 'privacy';
      case '/terms':
        return 'terms';
      case '/cookies':
        return 'cookies';
      case '/return-policy':
        return 'return-policy';
      default:
        return 'not-found';
    }
  }, [pathname]);
  const currentPage = getPage();
  const handleTrackOrderClick = useCallback((location = 'hero_section') => {
    try {
      if (typeof window.trackOrderClick === 'function') {
        window.trackOrderClick(location);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn('trackOrderClick failed:', e);
    }
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'order_cta_click', cta_location: location, cta_text: 'Order Online' });
    }
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
        {/* PWA WebApplication Schema (Homepage Only) */}
        {currentPage === 'home' && (
          <StructuredData
            type="WebApplication"
            data={{
              ...companyData.pwa?.webApplication,
              name: companyData.pwa?.webApplication?.name || companyData.dba || 'Roma Mart Convenience',
              url: companyData.pwa?.webApplication?.url || 'https://romamart.ca',
              author: {
                name: companyData.legalName || 'Roma Mart Corp.',
                url: 'https://romamart.ca',
              },
            }}
          />
        )}
        {/* Homepage Product Schemas (Featured Items Only - Primary Source for Google) */}
        {currentPage === 'home' && featuredSchemaItems.length > 0 && (
          <StructuredData
            type="ProductList"
            data={{
              products: featuredSchemaItems.map((item) => ({
                menuItem: item,
                itemUrl: 'https://romamart.ca/rocafe/',
                priceInCents: schemaPriceInCents,
              })),
            }}
          />
        )}
        {/* Homepage Service Schemas (Featured Services Only) */}
        {currentPage === 'home' && featuredServices.length > 0 && (
          <StructuredData
            type="ServiceList"
            data={{
              services: featuredServices,
              options: {
                serviceUrl: 'https://romamart.ca/services/',
                providerUrl: 'https://romamart.ca',
              },
            }}
          />
        )}
        {/* Homepage Location Schemas */}
        {currentPage === 'home' && locations.length > 0 && (
          <StructuredData
            type="LocationList"
            data={{
              locations: locations,
              options: {},
            }}
          />
        )}
        <ErrorBoundary>
          <Navbar currentPage={currentPage} />
        </ErrorBoundary>
        <main className="flex-1">
          {currentPage !== 'home' ? (
            <Suspense fallback={<LoadingFallback />}>
              <div id="main-content">
                {currentPage === 'services' && (
                  <ErrorBoundary>
                    <ServicesPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'rocafe' && (
                  <ErrorBoundary>
                    <RoCafePage />
                  </ErrorBoundary>
                )}
                {currentPage === 'locations' && (
                  <ErrorBoundary>
                    <LocationsPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'contact' && (
                  <ErrorBoundary>
                    <ContactPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'about' && (
                  <ErrorBoundary>
                    <AboutPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'accessibility' && (
                  <ErrorBoundary>
                    <AccessibilityPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'privacy' && (
                  <ErrorBoundary>
                    <PrivacyPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'terms' && (
                  <ErrorBoundary>
                    <TermsPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'cookies' && (
                  <ErrorBoundary>
                    <CookiesPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'return-policy' && (
                  <ErrorBoundary>
                    <ReturnPolicyPage />
                  </ErrorBoundary>
                )}
                {currentPage === 'not-found' && (
                  <ErrorBoundary>
                    <NotFoundPage />
                  </ErrorBoundary>
                )}
              </div>
            </Suspense>
          ) : (
            <>
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Hero onTrackOrder={handleTrackOrderClick} />
              <div id="main-content">
                <ErrorBoundary>
                  <ServicesSection
                    featuredServices={featuredServices}
                    loading={servicesLoading}
                    error={servicesError}
                    refetch={servicesRefetch}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <RoCafeSection menuItems={menuItems} loading={loading} error={menuError} refetch={menuRefetch} />
                </ErrorBoundary>
                <ErrorBoundary>
                  <Locations />
                </ErrorBoundary>
                <ErrorBoundary>
                  <ContactSection />
                </ErrorBoundary>
              </div>
            </>
          )}
          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </main>
      </div>
      <PWAInstallPrompt />
      <PWAUpdatePrompt
        updateAvailable={updateAvailable && !updateDismissed}
        onUpdate={skipWaiting}
        onDismiss={() => {
          sessionStorage.setItem('pwa-update-dismissed', 'true');
          setUpdateDismissed(true);
        }}
      />
      <NetworkStatus />
    </>
  );
}

export default App;
