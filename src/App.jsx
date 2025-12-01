import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Coffee, 
  ShoppingBasket, 
  Bitcoin, 
  Utensils, 
  Menu, 
  ArrowRight,
  Send,
  ExternalLink,
  Star,
  X,
  Home
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import TrustpilotWidget from './components/TrustpilotWidget';
import OrderCTA from './components/OrderCTA';
import ShareButton from './components/ShareButton';
import CopyButton from './components/CopyButton';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NetworkStatus from './components/NetworkStatus';
import StructuredData from './components/StructuredData';
import { LocationProvider } from './components/LocationProvider';
import { getPrimaryLocation, getActiveLocationCount } from './data/locations';

// PWA Hooks
import { useServiceWorker } from './hooks/useServiceWorker';
import { usePageVisibility, useBatteryStatus } from './hooks/useBrowserFeatures';

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
const StandardizedItemDemo = lazy(() => import('./components/StandardizedItemDemo'));

// GTM tracking utility
const trackOrderClick = (location) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'order_cta_click',
      cta_location: location,
      cta_text: 'Order Online'
    });
  }
};

// --- BRAND GUIDELINES & DATA ---

// Colors from your guide
const COLORS = {
  navy: '#020178',      // "Navy Blue" - Reliability
  yellow: '#E4B340',    // "Tulip Tree" - Warmth/Energy
  darkGrey: '#242424',  // "Baltic Sea"
  black: '#151515',     // "Woodsmoke"
  white: '#FFFFFF'
};

const STORE_DATA = {
  legalName: "Roma Mart Corp.",
  dba: "Roma Mart Convenience",
  // 1. PASTE YOUR NRS ONLINE STORE LINK HERE
  onlineStoreUrl: "https://nrsplus.com/orders/your-store-link",
  // Social media links
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
    // Web3Forms Access Key (contact form backend)
    web3FormsAccessKey: "e4a0fd98-2ea3-4d6c-8449-346b6097c7dc" 
  }
  // NOTE: Location data moved to src/data/locations.js
  // Use getPrimaryLocation() to get featured location
};

const SERVICES = [
  { id: 1, title: "GROCERY ESSENTIALS", desc: "Daily staples, milk, bread & pantry needs.", icon: <ShoppingBasket /> },
  { id: 2, title: "GLOBAL SNACKS", desc: "Imported flavors and unique treats.", icon: <Star /> },
  { id: 3, title: "ATM + BTM", desc: "Cash & Bitcoin machines available.", icon: <Bitcoin /> },
  { id: 4, title: "TOBACCO & VAPE", desc: "Wide selection for adult customers.", icon: <ShoppingBasket /> },
  { id: 5, title: "HALAL MEAT", desc: "Certified Zabiha Halal meats.", icon: <Utensils /> },
  { id: 6, title: "LOTTERY", desc: "OLG Lottery & Scratch cards.", icon: <Star /> },
];

const ROCAFE_MENU = [
  { name: "Signature Bubble Tea", price: "$5.99", popular: true },
  { name: "Fresh Brewed Coffee", price: "$2.50", popular: false },
  { name: "Matcha Latte", price: "$4.99", popular: true },
  { name: "Fruit Slush", price: "$5.50", popular: false },
];

// Use Vite's base URL so links work both at root and when hosted under a subpath (e.g. /romamart.ca/)
const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

// --- CUSTOM COMPONENTS ---

const BrandPattern = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="brand-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M10 20 Q 30 45 50 20" fill="none" stroke={COLORS.yellow} strokeWidth="3" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#brand-pattern)" />
    </svg>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      setIsHomePage(path === '/' || path === BASE_URL || path === BASE_URL + '/');
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  // Memoize navigation handlers to prevent unnecessary re-renders
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleNavClick = useCallback((e, sectionId, subpageUrl) => {
    closeMenu();
    if (isHomePage && sectionId) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (subpageUrl) {
      e.preventDefault();
      window.location.href = subpageUrl;
    }
  }, [isHomePage, closeMenu]);

  return (
    <>
      <style>{`
        /* Use client-side free fonts: Poppins for display, Inter for UI */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700;800&display=swap');

        .font-coco { font-family: 'Poppins', sans-serif; font-weight: 700; letter-spacing: -0.02em; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}
        style={{ backgroundColor: scrolled ? COLORS.white : 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Area */}
            <a 
              href={`${BASE_URL}`}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Roma Mart - Go to homepage"
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg"
                style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
              >
                <span className="font-coco text-2xl">RM</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="block font-coco text-xl uppercase" style={{ color: scrolled ? COLORS.navy : COLORS.white }}>Roma Mart</span>
                <span className="block text-xs font-inter font-semibold tracking-wider" style={{ color: COLORS.yellow }}>CONVENIENCE</span>
              </div>
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {!isHomePage && (
                <a 
                  href={`${BASE_URL}`}
                  className="font-inter font-medium hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  style={{ color: scrolled ? COLORS.darkGrey : COLORS.white }}
                  aria-label="Go to home"
                  title="Home"
                >
                  <Home size={18} />
                </a>
              )}
              <a 
                href={isHomePage ? `${BASE_URL}#services` : `${BASE_URL}services`}
                onClick={(e) => handleNavClick(e, 'services', `${BASE_URL}services`)}
                className="font-inter font-medium hover:opacity-80 transition-opacity"
                style={{ color: scrolled ? COLORS.darkGrey : COLORS.white }}
              >
                Services
              </a>
              <a 
                href={isHomePage ? `${BASE_URL}#rocafe` : `${BASE_URL}rocafe`}
                onClick={(e) => handleNavClick(e, 'rocafe', `${BASE_URL}rocafe`)}
                className="font-inter font-medium hover:opacity-80 transition-opacity"
                style={{ color: scrolled ? COLORS.darkGrey : COLORS.white }}
              >
                RoCafe
              </a>
              <a 
                href={isHomePage ? `${BASE_URL}#locations` : `${BASE_URL}locations`}
                onClick={(e) => handleNavClick(e, 'locations', `${BASE_URL}locations`)}
                className="font-inter font-medium hover:opacity-80 transition-opacity"
                style={{ color: scrolled ? COLORS.darkGrey : COLORS.white }}
              >
                Locations
              </a>
              <a 
                href={isHomePage ? `${BASE_URL}#contact` : `${BASE_URL}contact`}
                onClick={(e) => handleNavClick(e, 'contact', `${BASE_URL}contact`)}
                className="font-inter font-medium hover:opacity-80 transition-opacity"
                style={{ color: scrolled ? COLORS.darkGrey : COLORS.white }}
              >
                Contact
              </a>
              <a 
                href={STORE_DATA.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOrderClick('header_desktop')}
                className="px-6 py-2 rounded-full font-bold font-inter text-sm transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
              >
                ORDER NOW <ExternalLink size={14} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md"
              style={{ color: scrolled ? COLORS.navy : COLORS.white }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t absolute w-full shadow-xl"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-surface)' }}
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {!isHomePage && (
                  <a
                    href={`${BASE_URL}`}
                    onClick={closeMenu}
                    className="block px-3 py-4 text-lg font-bold font-coco uppercase border-b flex items-center gap-2"
                    style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                  >
                    <Home size={20} /> Home
                  </a>
                )}
                <a
                  href={isHomePage ? `${BASE_URL}#services` : `${BASE_URL}services`}
                  onClick={(e) => handleNavClick(e, 'services', `${BASE_URL}services`)}
                  className="block px-3 py-4 text-lg font-bold font-coco uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                >
                  Services
                </a>
                <a
                  href={isHomePage ? `${BASE_URL}#rocafe` : `${BASE_URL}rocafe`}
                  onClick={(e) => handleNavClick(e, 'rocafe', `${BASE_URL}rocafe`)}
                  className="block px-3 py-4 text-lg font-bold font-coco uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                >
                  RoCafe
                </a>
                <a
                  href={isHomePage ? `${BASE_URL}#locations` : `${BASE_URL}locations`}
                  onClick={(e) => handleNavClick(e, 'locations', `${BASE_URL}locations`)}
                  className="block px-3 py-4 text-lg font-bold font-coco uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                >
                  Locations
                </a>
                <a
                  href={isHomePage ? `${BASE_URL}#contact` : `${BASE_URL}contact`}
                  onClick={(e) => handleNavClick(e, 'contact', `${BASE_URL}contact`)}
                  className="block px-3 py-4 text-lg font-bold font-coco uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                >
                  Contact
                </a>
                <div className="pt-4">
                  <a 
                    href={STORE_DATA.onlineStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackOrderClick('mobile_menu')}
                    className="block w-full text-center px-6 py-4 rounded-xl font-bold font-inter text-lg shadow-lg"
                    style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
                  >
                    ORDER ONLINE NOW
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const Hero = () => {
  return (
    <div id="hero-section" className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: COLORS.navy }}>
      <BrandPattern />
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-transparent opacity-90 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 mb-6 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
              <span className="text-sm font-inter font-semibold tracking-widest uppercase" style={{ color: COLORS.yellow }}>
                New In Town
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-coco uppercase leading-none text-white mb-6">
              Your Daily <br/>
              <span style={{ color: COLORS.yellow }}>Stop & Go</span>
            </h1>
            
            <p className="text-lg md:text-xl font-inter mb-6 max-w-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Experience Sarnia's newest convenience destination. From daily essentials to bubble tea, we have what you need.
            </p>
            
            <div className="mb-6">
              <ShareButton 
                title="Roma Mart"
                text="Check out Roma Mart - Sarnia's newest convenience store!"
                className="bg-white/10 text-white hover:bg-white/20 border border-white/30"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* PRIMARY CTA - ORDER NOW */}
              <motion.a 
                href={STORE_DATA.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOrderClick('hero_section')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold font-inter text-lg flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20"
                style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
              >
                ORDER ONLINE NOW <ExternalLink size={20} />
              </motion.a>
              
              <a 
                href="#locations"
                className="px-8 py-4 rounded-xl font-bold font-inter text-lg border-2 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                style={{ borderColor: COLORS.white, color: COLORS.white }}
              >
                Visit In Store <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative hidden md:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1000&h=500&fit=crop" 
                 alt="Roma Mart Storefront"
                 className="w-full h-[500px] object-cover"
                 loading="lazy"
               />
               
               <div className="absolute top-6 right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg rotate-12">
                 <div className="text-center">
                   <span className="block font-coco text-xl leading-none" style={{ color: '#020178' }}>2.5%</span>
                   <span className="block text-xs font-bold uppercase" style={{ color: COLORS.darkGrey }}>OFF CASH</span>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ServicesScroll = () => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="services" className="py-20 overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-coco uppercase text-center" style={{ color: 'var(--color-heading)' }}>
          Our <span style={{ color: COLORS.yellow }}>Services</span>
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Scroll buttons for desktop */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          aria-label="Scroll left"
        >
          <ArrowRight size={24} className="rotate-180" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          aria-label="Scroll right"
        >
          <ArrowRight size={24} />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-8 pt-2 gap-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SERVICES.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -5 }}
            className="flex-shrink-0 w-72 md:w-80 p-8 rounded-2xl shadow-sm border snap-center flex flex-col items-start hover:shadow-md transition-shadow"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-surface)' }}
          >
            <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'var(--color-surface)' }}>
              {React.cloneElement(item.icon, { size: 32, style: { color: 'var(--color-icon)' } })}
            </div>
            <h3 className="font-coco text-xl mb-3" style={{ color: 'var(--color-heading)' }}>{item.title}</h3>
            <p className="font-inter leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{item.desc}</p>
          </motion.div>
        ))}
        </div>
      </div>

      {/* View All Services CTA */}
      <div className="text-center mt-12">
        <a
          href={`${BASE_URL}services`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
        >
          View All Services <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
};

const RoCafeSection = () => {
  return (
    <section id="rocafe" className="py-24 relative overflow-hidden text-white" style={{ backgroundColor: COLORS.darkGrey }}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-black/20 skew-x-12 transform translate-x-20"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-yellow-500">
                <Coffee size={32} color={COLORS.yellow} />
              </div>
              <div>
                 <h2 className="text-4xl font-coco text-white">RoCafé</h2>
                 <p className="text-yellow-400 font-inter tracking-wider uppercase text-sm">Sip. Savor. Repeat.</p>
              </div>
            </div>
            
            <p className="font-inter text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Step into our dedicated café corner. Whether you need a morning espresso kick or a refreshing afternoon bubble tea, RoCafé is brewing specifically for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROCAFE_MENU.map((item, idx) => (
                 <div key={idx} className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 flex justify-between items-center">
                   <div>
                     <p className="font-bold text-white">{item.name}</p>
                     {item.popular && <span className="text-xs text-yellow-400 uppercase font-bold">Best Seller</span>}
                   </div>
                   <p className="font-coco text-lg" style={{ color: COLORS.yellow }}>{item.price}</p>
                 </div>
              ))}
            </div>

            {/* View Full Menu CTA */}
            <div className="mt-8">
              <a
                href={`${BASE_URL}rocafe`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg border-2"
                style={{ borderColor: COLORS.yellow, color: 'white' }}
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
  const displayLocation = {
    id: primaryLocation.id,
    name: primaryLocation.name,
    address: primaryLocation.address.formatted,
    mapLink: primaryLocation.google.mapLink,
    isOpen: primaryLocation.status === 'open'
  };
  
  const [activeLoc, setActiveLoc] = useState(displayLocation);

  return (
    <section id="locations" className="py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Find Us</span>
          <h2 className="text-4xl font-coco mt-2" style={{ color: 'var(--color-heading)' }}>Our Location{locationCount > 1 ? 's' : ''}</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {[displayLocation].map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLoc(loc)}
                className="w-full text-left p-6 rounded-xl border-2 transition-all"
                style={{ 
                  borderColor: activeLoc.id === loc.id ? 'var(--color-primary)' : 'var(--color-surface)',
                  backgroundColor: activeLoc.id === loc.id ? 'var(--color-surface)' : 'transparent'
                }}
              >
                <h3 className="font-coco text-lg mb-1" style={{ color: 'var(--color-heading)' }}>{loc.name}</h3>
                <p className="text-sm font-inter mb-4" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{loc.address}</p>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.yellow }}>
                  <div className={`w-2 h-2 rounded-full ${loc.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {loc.isOpen ? 'Open Now' : 'Closed'}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 rounded-3xl overflow-hidden min-h-[400px] relative shadow-inner" style={{ backgroundColor: 'var(--color-surface)' }}>
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
                  style={{ backgroundColor: COLORS.navy }}
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
  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };
  const primaryLocation = getPrimaryLocation();
  
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Contact Info Side */}
          <div>
            <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Get in Touch</span>
            <h2 className="text-4xl font-coco mt-2 mb-6" style={{ color: 'var(--color-primary)' }}>Contact Us</h2>
            <p className="mb-10 font-inter leading-relaxed" style={mutedTextColor}>
              Have a question about our products, want to suggest a new snack, or interested in a partnership? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <MapPin className="text-navy-900" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary)' }}>Visit Us</h4>
                  <p className="mb-2" style={textColor}>{primaryLocation.address.formatted}</p>
                  <CopyButton 
                    text={primaryLocation.address.formatted}
                    label="Address"
                    className="text-xs"
                    style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <Phone className="text-navy-900" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary)' }}>Call Us</h4>
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
                  <Clock className="text-navy-900" style={{ color: 'var(--color-icon)' }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Hours</h4>
                  <p style={textColor}>Mon-Fri: {STORE_DATA.locations[0].hours.weekdays}</p>
                  <p style={textColor}>Sat-Sun: {STORE_DATA.locations[0].hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Web3Forms Contact Form */}
          <div className="p-8 rounded-2xl shadow-lg border" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-coco text-2xl mb-6" style={{ color: 'var(--color-primary)' }}>Send a Message</h3>
            
            <form 
              action="https://api.web3forms.com/submit" 
              method="POST" 
              className="space-y-6"
              onSubmit={() => {
                if (window.dataLayer) {
                  window.dataLayer.push({
                    event: 'contact_form_submit',
                    form_location: 'contact_section'
                  });
                }
              }}
            >
              {/* Web3Forms Access Key is set in STORE_DATA */}
              <input type="hidden" name="access_key" value={STORE_DATA.contact.web3FormsAccessKey} />
              <input type="hidden" name="subject" value="New Contact from Roma Mart Website" />
              <input type="hidden" name="from_name" value="Roma Mart Website" />

              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2" style={textColor}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  required 
                  className="w-full px-4 py-3 rounded-lg border focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2" style={textColor}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  required 
                  className="w-full px-4 py-3 rounded-lg border focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2" style={textColor}>Message</label>
                <textarea 
                  name="message" 
                  id="message"
                  required 
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl font-bold font-inter text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                style={{ backgroundColor: COLORS.navy }}
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

const Footer = () => {
  return (
    <footer className="text-white pt-16 pb-8" style={{ backgroundColor: COLORS.black }}>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
           <a 
             href={`${BASE_URL}`}
             className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity cursor-pointer w-fit"
             aria-label="Roma Mart - Go to homepage"
           >
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-coco text-xl" style={{ color: '#020178' }}>RM</div>
              <span className="font-coco text-2xl uppercase">Roma Mart</span>
           </a>
           <p className="font-inter max-w-sm mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
             Your local one-stop shop for everything from daily groceries to premium café drinks. Proudly serving the Sarnia community.
           </p>
           <div className="flex gap-4">
              <a 
                href={STORE_DATA.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="Facebook"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'facebook' })}
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="Instagram"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'instagram' })}
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="TikTok"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'tiktok' })}
              >
                <FontAwesomeIcon icon={faTiktok} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.x} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="X (Twitter)"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'x' })}
              >
                <FontAwesomeIcon icon={faXTwitter} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.snapchat} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="Snapchat"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'snapchat' })}
              >
                <FontAwesomeIcon icon={faSnapchat} size="lg" style={{ color: COLORS.yellow }} />
              </a>
           </div>
        </div>

        <div>
          <h4 className="font-coco text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Pages</h4>
          <ul className="space-y-3 font-inter" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <li><a href={`${BASE_URL}services`} className="hover:text-yellow-400 transition-colors">Services</a></li>
            <li><a href={`${BASE_URL}rocafe`} className="hover:text-yellow-400 transition-colors">RoCafé Menu</a></li>
            <li><a href={`${BASE_URL}locations`} className="hover:text-yellow-400 transition-colors">Locations</a></li>
            <li><a href={`${BASE_URL}contact`} className="hover:text-yellow-400 transition-colors">Contact</a></li>
            <li><a href={`${BASE_URL}about`} className="hover:text-yellow-400 transition-colors">About Us</a></li>
            <li><a href={STORE_DATA.onlineStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors font-bold text-yellow-500">Order Online</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-coco text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Legal & Accessibility</h4>
          <ul className="space-y-2 font-inter" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <li><a href={`${BASE_URL}privacy`} className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
            <li><a href={`${BASE_URL}terms`} className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
            <li><a href={`${BASE_URL}cookies`} className="hover:text-yellow-400 transition-colors">Cookie Policy</a></li>
            <li><a href={`${BASE_URL}accessibility`} className="hover:text-yellow-400 transition-colors font-bold text-yellow-500">Accessibility</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10">
        {/* Trustpilot Widget - loads async via component */}
        <div className="mb-8">
          <TrustpilotWidget />
        </div>
        <div className="text-center font-inter text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          <p>&copy; {new Date().getFullYear()} {STORE_DATA.legalName} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Loading fallback component (defined outside App to prevent recreation)
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#E4B340' }}></div>
      <p className="mt-4 font-inter" style={{ color: 'var(--color-text)' }}>Loading...</p>
    </div>
  </div>
);

// --- MAIN APP ---
function App() {
  // Simple client-side routing
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(BASE_URL, '/') : '/';
  
  // Initialize PWA Service Worker
  useServiceWorker();
  
  // Batch 3: Performance optimizations
  const { isVisible } = usePageVisibility();
  const { batteryLevel, isCharging } = useBatteryStatus();
  
  // Disable heavy animations when battery low or user prefers reduced motion
  // eslint-disable-next-line no-unused-vars
  const shouldReduceMotion = React.useMemo(() => {
    const lowBattery = batteryLevel !== null && batteryLevel < 0.2 && !isCharging;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return lowBattery || prefersReduced;
  }, [batteryLevel, isCharging]);
  
  // Log page visibility changes (for analytics/debugging)
  useEffect(() => {
    if (!isVisible && import.meta.env.DEV) {
      console.warn('[Performance] Tab hidden - pausing heavy operations');
    }
  }, [isVisible]);
  
  const getPage = () => {
    if (pathname.includes('/services')) return 'services';
    if (pathname.includes('/rocafe')) return 'rocafe';
    if (pathname.includes('/locations')) return 'locations';
    if (pathname.includes('/contact')) return 'contact';
    if (pathname.includes('/about')) return 'about';
    if (pathname.includes('/accessibility')) return 'accessibility';
    if (pathname.includes('/privacy')) return 'privacy';
    if (pathname.includes('/terms')) return 'terms';
    if (pathname.includes('/cookies')) return 'cookies';
    return 'home';
  };

  const currentPage = getPage();

  return (
    <LocationProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        {currentPage !== 'home' ? (
          <Suspense fallback={<LoadingFallback />}>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Navbar />
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
            {currentPage === 'demo' && <StandardizedItemDemo />}
          </div>
          <Footer />
          <OrderCTA orderUrl={STORE_DATA.onlineStoreUrl} />
        </Suspense>
      ) : (
        <>
          {/* WCAG 2.2 AA: Skip Navigation Link (Operable 2.4.1) */}
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Navbar />
          <Hero />
          <div id="main-content">
            <ServicesScroll />
            <RoCafeSection />
            <Locations />
            <ContactSection />
          </div>
          <Footer />
          <OrderCTA orderUrl={STORE_DATA.onlineStoreUrl} />
        </>
      )}
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <NetworkStatus />
      
      {/* Batch 3: Structured Data for SEO */}
      <StructuredData 
        type="LocalBusiness" 
        data={{
          name: STORE_DATA.dba,
          alternateName: "Roma Mart",
          description: "Your daily stop & go convenience store in Sarnia, Ontario. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.",
          telephone: STORE_DATA.contact.phone,
          email: STORE_DATA.contact.email,
          address: {
            street: "189-3 Wellington Street",
            city: "Sarnia",
            region: "ON",
            postal: "N7T 1G6"
          },
          geo: {
            latitude: 42.970389,
            longitude: -82.404589
          },
          socialLinks: Object.values(STORE_DATA.socialLinks)
        }}
      />
      <StructuredData 
        type="WebSite" 
        data={{
          description: "Your daily stop & go convenience store in Sarnia, Ontario."
        }}
      />
      </div>
    </LocationProvider>
  );
}

export default App;