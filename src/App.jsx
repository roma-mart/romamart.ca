import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LocationProvider } from './components/LocationProvider';
import { getPrimaryLocation, getActiveLocationCount, LOCATIONS, getActiveLocations, isLocationOpenNow } from './data/locations';
import { useLocationContext } from './hooks/useLocationContext';
import { Logo } from './components/Logo';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrandPatternBackground from './components/BrandPatternBackground';

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

// --- BRAND GUIDELINES & DATA ---

// Use CSS variables for brand colors to ensure dark mode compatibility
const BRAND = {
  primary: 'var(--color-primary)',
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
    // Use Vite environment variable VITE_WEB3FORMS_KEY for production builds
    web3FormsAccessKey: import.meta.env.VITE_WEB3FORMS_KEY || ''
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

function Hero() {
  return (
    <div id="hero-section" className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: BRAND.primary }}>
      {/* Add BrandPatternBackground overlay */}
      <BrandPatternBackground className="absolute inset-0" opacity={0.12} />
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-transparent opacity-90 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 mb-6 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
              <span className="text-sm font-inter font-semibold tracking-widest uppercase" style={{ color: BRAND.accent }}>
                New In Town
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-coco uppercase leading-none text-white mb-6">
              Your Daily <br/>
              <span style={{ color: BRAND.accent }}>Stop & Go</span>
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
                style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}
              >
                ORDER ONLINE NOW <ExternalLink size={20} />
              </motion.a>
              
              <a 
                href="#locations"
                className="px-8 py-4 rounded-xl font-bold font-inter text-lg border-2 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
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
                   <span className="block font-coco text-xl leading-none" style={{ color: BRAND.primary }}>2.5%</span>
                   <span className="block text-xs font-bold uppercase" style={{ color: 'var(--color-text)' }}>OFF CASH</span>
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
    <section id="services" className="py-20 overflow-hidden" style={{ backgroundColor: BRAND.surface }}>
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-coco uppercase text-center" style={{ color: BRAND.heading }}>
          Our <span style={{ color: BRAND.accent }}>Services</span>
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Scroll buttons for desktop */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}
          aria-label="Scroll left"
        >
          <ArrowRight size={24} className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}
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
            style={{ backgroundColor: BRAND.bg, borderColor: BRAND.surface }}
          >
            <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: BRAND.surface }}>
              {React.cloneElement(item.icon, { size: 32, style: { color: BRAND.icon } })}
            </div>
            <h3 className="font-coco text-xl mb-3" style={{ color: BRAND.heading }}>{item.title}</h3>
            <p className="font-inter leading-relaxed" style={{ color: BRAND.text, opacity: 0.7 }}>{item.desc}</p>
          </motion.div>
        ))}
        </div>
      </div>

      {/* View All Services CTA */}
      <div className="text-center mt-12">
        <a
          href={`${BASE_URL}services`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}
        >
          View All Services <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
};

const RoCafeSection = () => {
  return (
    <section id="rocafe" className="py-24 relative overflow-hidden text-white" style={{ backgroundColor: 'var(--color-text)' }}>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROCAFE_MENU.map((item, idx) => (
                 <div key={idx} className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 flex justify-between items-center">
                   <div>
                     <p className="font-bold text-white">{item.name}</p>
                     {item.popular && <span className="text-xs text-yellow-400 uppercase font-bold">Best Seller</span>}
                   </div>
                   <p className="font-coco text-lg" style={{ color: BRAND.accent }}>{item.price}</p>
                 </div>
              ))}
            </div>

            {/* View Full Menu CTA */}
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
  const displayLocation = {
    id: primaryLocation.id,
    name: primaryLocation.name,
    address: primaryLocation.address.formatted,
    mapLink: primaryLocation.google.mapLink,
    isOpen: isLocationOpenNow(primaryLocation)
  };
  
  const [activeLoc, setActiveLoc] = useState(displayLocation);

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
                onClick={() => setActiveLoc(loc)}
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

const SiteFooter = () => {
  const { userLocation } = useLocationContext();
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    // Check if user has manually selected a location
    return localStorage.getItem('roma_mart_selected_location') || 'auto';
  });

  // Calculate nearest location using useMemo (derived state, not effect)
  const nearestLocationId = React.useMemo(() => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return null;
    }

    // Haversine distance calculation
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Find nearest active location
    const activeLocations = getActiveLocations();
    let nearest = null;
    let minDistance = Infinity;

    activeLocations.forEach(loc => {
      if (loc.google?.coordinates) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          loc.google.coordinates.lat,
          loc.google.coordinates.lng
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = loc.id;
        }
      }
    });

    return nearest;
  }, [userLocation]);

  // Handle location selection change
  const handleLocationChange = (e) => {
    const newLocationId = e.target.value;
    setSelectedLocationId(newLocationId);
    
    // Persist user's choice
    if (newLocationId === 'auto') {
      localStorage.removeItem('roma_mart_selected_location');
    } else {
      localStorage.setItem('roma_mart_selected_location', newLocationId);
    }
  };

  // Determine which location to display
  const getCurrentLocation = () => {
    if (selectedLocationId === 'auto') {
      // Auto mode: use nearest if available, otherwise HQ
      return nearestLocationId 
        ? LOCATIONS.find(loc => loc.id === nearestLocationId)
        : getPrimaryLocation();
    } else {
      // Manual selection
      return LOCATIONS.find(loc => loc.id === selectedLocationId) || getPrimaryLocation();
    }
  };

  const currentLocation = getCurrentLocation();
  const isAutoMode = selectedLocationId === 'auto';
  const activeLocations = getActiveLocations();

  return (
    <footer className="text-white pt-16 pb-8" style={{ backgroundColor: 'var(--color-text)' }}>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
           <a 
             href={`${BASE_URL}`}
             className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity cursor-pointer w-fit"
             aria-label="Roma Mart - Go to homepage"
           >
              <Logo />
           </a>
           <p className="font-inter max-w-sm mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
             Your local one-stop shop for everything from daily groceries to premium café drinks. Proudly serving the Sarnia community.
           </p>
           <div className="flex gap-4">
              <a 
                href={STORE_DATA.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg_white/10 flex items_center justify_center hover:bg-yellow-500 transition-colors" 
                title="Facebook"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'facebook' })}
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg_white/10 flex items_center justify_center hover:bg-yellow-500 transition-colors" 
                title="Instagram"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'instagram' })}
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg_white/10 flex items_center justify_center hover:bg-yellow-500 transition-colors" 
                title="TikTok"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'tiktok' })}
              >
                <FontAwesomeIcon icon={faTiktok} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.x} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg_white/10 flex items_center justify_center hover:bg-yellow-500 transition-colors" 
                title="X (Twitter)"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'x' })}
              >
                <FontAwesomeIcon icon={faXTwitter} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.snapchat} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg_white/10 flex items_center justify_center hover:bg-yellow-500 transition-colors" 
                title="Snapchat"
                onClick={() => window.dataLayer?.push({ event: 'social_click', platform: 'snapchat' })}
              >
                <FontAwesomeIcon icon={faSnapchat} size="lg" style={{ color: BRAND.accent }} />
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

        {/* Location Selector */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <label 
              htmlFor="location-selector" 
              className="block font-coco text-sm mb-3"
              style={{ color: BRAND.accent }}
            >
              <MapPin className="inline-block mr-2" size={16} />
              Your Current Store
            </label>
            
            <select
              id="location-selector"
              value={selectedLocationId}
              onChange={handleLocationChange}
              className="w-full px-4 py-3 rounded-lg font-inter bg-white/10 border border-white/20 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              style={{ cursor: 'pointer' }}
            >
              <option value="auto" style={{ backgroundColor: 'var(--color-text)', color: 'white' }}>
                {isAutoMode && nearestLocationId
                  ? `🎯 Auto-Detected: ${currentLocation.name}`
                  : '🏢 Auto (HQ - Wellington St.)'}
              </option>
              {activeLocations.map(loc => (
                <option 
                  key={loc.id} 
                  value={loc.id}
                  style={{ backgroundColor: 'var(--color-text)', color: 'white' }}
                >
                  {loc.name} {loc.isPrimary ? '(HQ)' : ''}
                </option>
              ))}
            </select>

            <div className="mt-3 text-xs font-inter" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {isAutoMode ? (
                nearestLocationId ? (
                  <span>✓ Using nearest location based on your current position</span>
                ) : (
                  <span>Using headquarters as default • Grant location access for nearest store</span>
                )
              ) : (
                <span>✓ Manually selected: {currentLocation.name}</span>
              )}
            </div>
          </div>
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
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.bg }}>
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-accent)' }}></div>
      <p className="mt-4 font-inter" style={{ color: BRAND.text }}>Loading...</p>
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
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.bg }}>
        <Navbar />
        <main className="flex-1">
          {currentPage !== 'home' ? (
            <Suspense fallback={<LoadingFallback />}>
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
              {/* WCAG 2.2 AA: Skip Navigation Link (Operable 2.4.1) */}
              <a href="#main-content" className="skip-link">Skip to main content</a>
              <Hero />
              <div id="main-content">
                <ServicesScroll />
                <RoCafeSection />
                <Locations />
                <ContactSection />
              </div>
            </>
          )}
          {/* Use local footer implementation to avoid import conflict */}
          <SiteFooter />
        </main>
      </div>
      
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
    </LocationProvider>
  );
}

export default App;