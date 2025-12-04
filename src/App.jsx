import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBasket,
  Star,
  Bitcoin,
  Utensils,
  ArrowRight,
  ExternalLink,
  MapPin,
  Coffee,
  Send
} from 'lucide-react';
import { getOrderingUrl } from './config/ordering';
import { LocationProvider } from './components/LocationProvider';
import { getPrimaryLocation, getActiveLocationCount, LOCATIONS, isLocationOpenNow } from './data/locations';
import { Logo } from './components/Logo';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrandPatternBackground from './components/BrandPatternBackground';
import ShareButton from './components/ShareButton';
import StandardizedItem from './components/StandardizedItem';
import { ROCAFE_FEATURED } from './data/rocafe-menu';
import Phone from 'lucide-react/dist/esm/icons/phone.js';
import Clock from 'lucide-react/dist/esm/icons/clock.js';

// PWA Hooks
import { useServiceWorker } from './hooks/useServiceWorker';
import { usePageVisibility, useBatteryStatus } from './hooks/useBrowserFeatures';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Code splitting: Lazy load page components
const AccessibilityPage = lazy(() => import('./components/AccessibilityPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const RoCafePage = lazy(() => import('./pages/RoCafePage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// component imports
import NetworkStatus from  './components/NetworkStatus';
import CopyButton from './components/CopyButton';

// --- BRAND GUIDELINES & DATA ---
const BRAND = {
  primary: 'var(--Color-primary, var(--color-primary))',
  accent: 'var(--color-accent)',
  heading: 'var(--color-heading)',
  icon: 'var(--color-icon)',
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
  text: 'var(--color-text)'
};

const STORE_DATA = {
  legalName: "Roma Mart Corp.",
  dba: "Roma Mart Convenience",
  onlineStoreUrl: getOrderingUrl(),
  socialLinks: {
    facebook: "https://www.facebook.com/romamartca",
    instagram: "https://www.instagram.com/romamartca/",
    tiktok: "https://www.tiktok.com/@romamartca/",
    snapchat: "https://www.snapchat.com/@romamartca/",
    x: "https://www.x.com/romamartca/"
  },
  contact: {
    phone: "+1 (382) 342-2000",
    email: "contact@romamart.ca",
    // Use Vite environment variable VITE_WEB3FORMS_KEY for production builds
    web3FormsAccessKey: import.meta.env.VITE_WEB3FORMS_KEY || ''
  }
};

const SERVICES = [
  { id: 1, title: "GROCERY ESSENTIALS", desc: "Daily staples, milk, bread & pantry needs.", icon: <ShoppingBasket /> },
  { id: 2, title: "GLOBAL SNACKS", desc: "Imported flavors and unique treats.", icon: <Star /> },
  { id: 3, title: "ATM + BTM", desc: "Cash & Bitcoin machines available.", icon: <Bitcoin /> },
  { id: 4, title: "TOBACCO & VAPE", desc: "Wide selection for adult customers.", icon: <ShoppingBasket /> },
  { id: 5, title: "HALAL MEAT", desc: "Certified Zabiha Halal meats.", icon: <Utensils /> },
  { id: 6, title: "LOTTERY", desc: "OLG Lottery & Scratch cards.", icon: <Star /> },
];

const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

// --- CUSTOM COMPONENTS ---
function Hero({ onTrackOrder }) {
  const handleOrderClick = useCallback(() => {
    if (onTrackOrder) onTrackOrder('hero_section');
  }, [onTrackOrder]);

  return (
    <div id="hero-section" className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: BRAND.primary }}>
      <BrandPatternBackground className="absolute inset-0" opacity={0.12} />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-transparent opacity-90 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block px-4 py-1 mb-6 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
              <span className="text-sm font-inter font-semibold tracking-widest uppercase" style={{ color: BRAND.accent }}>New In Town</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-coco uppercase leading-none text-white mb-6">Your Daily <br/><span style={{ color: BRAND.accent }}>Stop & Go</span></h1>
            <p className="text-lg md:text-xl font-inter mb-6 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>Experience Sarnia's newest convenience destination. From daily essentials to bubble tea, we have what you need.</p>
            <div className="mb-6"><ShareButton title="Roma Mart" text="Check out Roma Mart - Sarnia's newest convenience store!" className="bg-white/10 text-white hover:bg-white/20 border border-white/30" /></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a href={STORE_DATA.onlineStoreUrl} target="_blank" rel="noopener noreferrer" onClick={handleOrderClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 rounded-xl font-bold font-inter text-lg flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20" style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}>
                ORDER ONLINE NOW <ExternalLink size={20} />
              </motion.a>
              <a href="#locations" className="px-8 py-4 rounded-xl font-bold font-inter text-lg border-2 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}>Visit In Store <ArrowRight size={20} /></a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative hidden md:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1000&h=500&fit=crop" alt="Roma Mart Storefront" className="w-full h-[500px] object-cover" loading="lazy" />
              <div className="absolute top-6 right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg rotate-12"><div className="text-center"><span className="block font-coco text-xl leading-none" style={{ color: BRAND.primary }}>2.5%</span><span className="block text-xs font-bold uppercase" style={{ color: 'var(--color-text)' }}>OFF CASH</span></div></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const ServicesScroll = () => {
  const scrollRef = useRef(null);
  const scrollByAmount = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }, []);
  const scrollLeft = useCallback(() => scrollByAmount('left'), [scrollByAmount]);
  const scrollRight = useCallback(() => scrollByAmount('right'), [scrollByAmount]);

  return (
    <section id="services" className="py-20 overflow-hidden" style={{ backgroundColor: BRAND.surface }}>
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-coco uppercase text-center" style={{ color: BRAND.heading }}>Our <span style={{ color: BRAND.accent }}>Services</span></h2>
      </div>
      <div className="relative max-w-7xl mx-auto px-4">
        <button type="button" onClick={scrollLeft} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform" style={{ backgroundColor: BRAND.accent, color: BRAND.primary }} aria-label="Scroll left"><ArrowRight size={24} className="rotate-180" /></button>
        <button type="button" onClick={scrollRight} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform" style={{ backgroundColor: BRAND.accent, color: BRAND.primary }} aria-label="Scroll right"><ArrowRight size={24} /></button>
        <div ref={scrollRef} className="flex overflow-x-auto pb-8 pt-2 gap-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SERVICES.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -5 }} className="flex-shrink-0 w-72 md:w-80 p-8 rounded-2xl shadow-sm border snap-center flex flex-col items-start hover:shadow-md transition-shadow" style={{ backgroundColor: BRAND.bg, borderColor: BRAND.surface }}>
              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: BRAND.surface }}>{React.cloneElement(item.icon, { size: 32, style: { color: BRAND.icon } })}</div>
              <h3 className="font-coco text-xl mb-3" style={{ color: BRAND.heading }}>{item.title}</h3>
              <p className="font-inter leading-relaxed" style={{ color: BRAND.text, opacity: 0.7 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="text-center mt-12">
        <a href={`${BASE_URL}services`} className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg" style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}>View All Services <ArrowRight size={20} /></a>
      </div>
    </section>
  );
};

const RoCafeSection = () => {
  return (
    <section id="rocafe" className="py-24 relative overflow-hidden" style={{ backgroundColor: BRAND.primary }}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-black/20 skew-x-12 transform translate-x-20"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-yellow-500">
                <Coffee size={32} color={undefined} style={{ color: BRAND.accent }} />
              </div>
              <div>
                 <h2 className="text-4xl font-coco text-white">RoCafé</h2>
                 <p className="text-yellow-400 font-inter tracking-wider uppercase text-sm">Sip. Savor. Repeat.</p>
              </div>
            </div>
            <p className="font-inter text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Step into our dedicated café corner. Whether you need a morning espresso kick or a refreshing afternoon bubble tea, RoCafé is brewing specifically for you.
            </p>
            
            {/* Featured Menu Items with StandardizedItem */}
            <div className="space-y-3 mb-8">
              {ROCAFE_FEATURED.map((item) => (
                <StandardizedItem 
                  key={item.id}
                  item={item}
                  defaultExpanded={false}
                />
              ))}
            </div>
            
            <div className="mt-8">
              <a
                href={`${BASE_URL}rocafe`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg border-2"
                style={{ borderColor: 'var(--color-accent)', color: 'white' }}
              >
                View Full Menu <ArrowRight size={20} />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="relative aspect-square rounded-full overflow-hidden border-8 border-white/5 shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1558507304-7c2a5d911139?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Bubble Tea and Coffee"
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
  const primaryLocation = getPrimaryLocation();
  const locationCount = getActiveLocationCount();
  
  // Transform to match old format for compatibility
  const displayLocation = useMemo(() => ({
    id: primaryLocation.id,
    name: primaryLocation.name,
    address: primaryLocation.address.formatted,
    mapLink: primaryLocation.google.mapLink,
    isOpen: isLocationOpenNow(primaryLocation)
  }), [primaryLocation]);
  
  const [activeLoc, setActiveLoc] = useState(displayLocation);

  // create memoized handlers for each location to avoid inline closures
  const locationHandlers = React.useMemo(() => {
    const map = {};
    [displayLocation].forEach(loc => { map[loc.id] = () => setActiveLoc(loc); });
    return map;
  }, [displayLocation]);

  return (
    <section id="locations" className="py-24" style={{ backgroundColor: BRAND.bg }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Find Us</span>
          <h2 className="text-4xl font-coco mt-2" style={{ color: BRAND.heading }}>Our Location{locationCount > 1 ? 's' : ''}</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {[displayLocation].map(loc => (
              <button
                type="button"
                key={loc.id}
                onClick={locationHandlers[loc.id]}
                className="w-full text-left p-6 rounded-xl border-2 transition-all"
                style={{ 
                  borderColor: activeLoc.id === loc.id ? BRAND.primary : BRAND.surface,
                  backgroundColor: activeLoc.id === loc.id ? BRAND.surface : 'transparent'
                }}
              >
                <h3 className="font-coco text-lg mb-1" style={{ color: BRAND.heading }}>{loc.name}</h3>
                <p className="text-sm font-inter mb-4" style={{ color: BRAND.text, opacity: 0.7 }}>{loc.address}</p>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND.accent }}>
                  <div className={`w-2 h-2 rounded-full ${loc.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {loc.isOpen ? 'Open Now' : 'Closed'}
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 rounded-3xl overflow-hidden min-h-[400px] relative shadow-inner" style={{ backgroundColor: BRAND.surface }}>
             <iframe
               title={`Google Maps - ${primaryLocation.name}`}
               src={primaryLocation.google.embedUrl}
               width="100%"
               height="100%"
               style={{ border: 0 }}
               allowFullScreen="" 
               loading="lazy"
               className="absolute inset-0"
             ></iframe>
             <div className="absolute bottom-6 right-6">
                <a 
                  href={activeLoc.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold shadow-xl hover:scale-105 transition-transform"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <MapPin size={18} /> Open in Maps
                </a>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- CONTACT SECTION ---
const ContactSection = () => {
  const textColor = { color: BRAND.text };
  const mutedTextColor = { color: BRAND.text, opacity: 0.7 };
  const primaryLocation = getPrimaryLocation();
  
  const handleContactSubmit = useCallback(() => {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'contact_form_submit', form_location: 'contact_section' });
    }
    // allow normal form submission to proceed
  }, []);

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: BRAND.surface }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Contact Info Side */}
          <div>
            <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Get in Touch</span>
            <h2 className="text-4xl font-coco mt-2 mb-6" style={{ color: BRAND.primary }}>Contact Us</h2>
            <p className="mb-10 font-inter leading-relaxed" style={mutedTextColor}>
              Have a question about our products, want to suggest a new snack, or interested in a partnership? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: BRAND.surface }}>
                  <MapPin className="text-navy-900" style={{ color: BRAND.icon }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: BRAND.primary }}>Visit Us</h4>
                  <p className="mb-2" style={textColor}>{primaryLocation.address.formatted}</p>
                  <CopyButton 
                    text={primaryLocation.address.formatted}
                    label="Address"
                    className="text-xs"
                    style={{ backgroundColor: BRAND.surface, color: BRAND.text }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify_center shrink-0" style={{ backgroundColor: BRAND.surface }}>
                  <Phone className="text-navy-900" style={{ color: BRAND.icon }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: BRAND.primary }}>Call Us</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`tel:${STORE_DATA.contact.phone}`} className="hover:underline" style={{ color: BRAND.accent }}>
                      {STORE_DATA.contact.phone}
                    </a>
                    <CopyButton 
                      text={STORE_DATA.contact.phone}
                      label="Phone number"
                      style={{ backgroundColor: BRAND.surface, color: BRAND.text }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: BRAND.surface }}>
                  <Clock className="text-navy-900" style={{ color: BRAND.icon }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: BRAND.primary }}>Hours</h4>
                  <p style={textColor}>Mon-Fri: {getPrimaryLocation().hours.weekdays}</p>
                  <p style={textColor}>Sat-Sun: {getPrimaryLocation().hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Web3Forms Contact Form */}
          <div className="p-8 rounded-2xl shadow-lg border" style={{ backgroundColor: BRAND.bg, borderColor: BRAND.border }}>
            <h3 className="font-coco text-2xl mb-6" style={{ color: BRAND.primary }}>Send a Message</h3>
            
            <form 
              action="https://api.web3forms.com/submit" 
              method="POST" 
              className="space-y-6"
              onSubmit={handleContactSubmit}
            >
              {/* Web3Forms Access Key is set in STORE_DATA */}
              <input type="hidden" name="access_key" value={STORE_DATA.contact.web3FormsAccessKey} />
              <input type="hidden" name="subject" value="New Contact from Roma Mart Website" />
              <input type="hidden" name="from_name" value="Roma Mart Website" />

              <div>
                <label htmlFor="name" className="block text_sm font-bold mb-2" style={textColor}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  required 
                  className="w-full px-4 py-3 rounded-lg border focus:border_navy-500 focus:ring-2 focus:ring_navy-200 outline-none transition-all"
                  style={{ backgroundColor: BRAND.surface, borderColor: BRAND.surface, color: BRAND.text }}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text_sm font-bold mb-2" style={textColor}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  required 
                  className="w-full px-4 py-3 rounded-lg border focus:border_navy-500 focus:ring-2 focus:ring_navy-200 outline-none transition-all"
                  style={{ backgroundColor: BRAND.surface, borderColor: BRAND.surface, color: BRAND.text }}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text_sm font-bold mb-2" style={textColor}>Message</label>
                <textarea 
                  name="message" 
                  id="message"
                  required 
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border focus:border_navy-500 focus:ring-2 focus:ring_navy-200 outline-none transition-all"
                  style={{ backgroundColor: BRAND.surface, borderColor: BRAND.surface, color: BRAND.text }}
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl font-bold font-inter text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                style={{ backgroundColor: BRAND.primary }}
              >
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Loading fallback component (defined outside App to prevent recreation)
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.bg }}>
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-accent)' }}></div>
      <p className="mt-4 font-inter" style={{ color: BRAND.text }}>Loading...</p>
    </div>
  </div>
);

// --- MAIN APP ---
function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(BASE_URL, '/') : '/';
  useServiceWorker();
  const { isVisible } = usePageVisibility();
  const { batteryLevel, isCharging } = useBatteryStatus();
  batteryLevel; // avoid unused variable warning
  isCharging; // avoid unused variable warning
  // comment out unused variable
  // const shouldReduceMotion = useMemo(() => { const lowBattery = batteryLevel !== null && batteryLevel < 0.2 && !isCharging; const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; return lowBattery || prefersReduced; }, [batteryLevel, isCharging]);
  useEffect(() => { if (!isVisible && import.meta.env.DEV) { console.warn('[Performance] Tab hidden - pausing heavy operations'); } }, [isVisible]);
  const getPage = useCallback(() => { if (pathname.includes('/services')) return 'services'; if (pathname.includes('/rocafe')) return 'rocafe'; if (pathname.includes('/locations')) return 'locations'; if (pathname.includes('/contact')) return 'contact'; if (pathname.includes('/about')) return 'about'; if (pathname.includes('/accessibility')) return 'accessibility'; if (pathname.includes('/privacy')) return 'privacy'; if (pathname.includes('/terms')) return 'terms'; if (pathname.includes('/cookies')) return 'cookies'; return 'home'; }, [pathname]);
  const currentPage = getPage();
  const handleTrackOrderClick = useCallback((location = 'hero_section') => { try { if (typeof window.trackOrderClick === 'function') { window.trackOrderClick(location); } } catch (e) {
    console.warn('trackOrderClick failed:', e);
  } if (window.dataLayer) { window.dataLayer.push({ event: 'order_cta_click', cta_location: location, cta_text: 'Order Online' }); } }, []);

  return (
    <LocationProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.bg }}>
        <Navbar />
        <main className="flex-1">
          {currentPage !== 'home' ? (
            <Suspense fallback={<div>Loading...</div>}>
              <div id="main-content">
                {currentPage === 'services' && <ServicesPage />}
                {currentPage === 'rocafe' && <RoCafePage />}
                {currentPage === 'locations' && <LocationsPage />}
                {currentPage === 'contact' && <ContactPage />}
                {currentPage === 'about' && <AboutPage />}
                {currentPage === 'accessibility' && <AccessibilityPage />}
                {currentPage === 'privacy' && <PrivacyPage />}
                {currentPage === 'terms' && <TermsPage />}
                {currentPage === 'cookies' && <CookiesPage />}
              </div>
            </Suspense>
          ) : (
            <>
              <a href="#main-content" className="skip-link">Skip to main content</a>
              <Hero onTrackOrder={handleTrackOrderClick} />
              <div id="main-content">
                <ServicesScroll />
                <RoCafeSection />
                <Locations />
                <ContactSection />
              </div>
            </>
          )}
          <Footer />
        </main>
      </div>
      <PWAInstallPrompt />
      <NetworkStatus />
    </LocationProvider>
  );
}

export default App;