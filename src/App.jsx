import React, { useState, useEffect } from 'react';
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
  Star
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

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
    // 2. GET YOUR FREE ACCESS KEY FROM WEB3FORMS.COM
    web3FormsAccessKey: "YOUe4a0fd98-2ea3-4d6c-8449-346b6097c7dc" 
  },
  locations: [
    {
      id: 1,
      name: "Wellington St. (Flagship)",
      address: "189-3 Wellington Street, Sarnia, ON N7T 1G6",
      mapLink: "https://maps.google.com/?q=189+Wellington+St+Sarnia+ON",
      hours: {
        weekdays: "8:00 AM - 10:00 PM",
        weekends: "9:00 AM - 11:00 PM"
      },
      isOpen: true
    },
  ]
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div className="flex items-center space-x-2">
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
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Services', 'RoCafe', 'Locations', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="font-inter font-medium hover:opacity-80 transition-opacity"
                  style={{ color: scrolled ? COLORS.darkGrey : COLORS.white }}
                >
                  {item}
                </a>
              ))}
              <a 
                href={STORE_DATA.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full font-bold font-inter text-sm transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
              >
                ORDER NOW <ExternalLink size={14} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md"
              style={{ color: scrolled ? COLORS.navy : COLORS.white }}
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
              className="md:hidden border-t absolute w-full bg-white shadow-xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {['Services', 'RoCafe', 'Locations', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-lg font-bold font-coco uppercase border-b border-gray-100"
                    style={{ color: COLORS.navy }}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4">
                  <a 
                    href={STORE_DATA.onlineStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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
    <div className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: COLORS.navy }}>
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
            
            <p className="text-lg md:text-xl font-inter text-gray-300 mb-8 max-w-lg leading-relaxed">
              Experience Sarnia's newest convenience destination. From daily essentials to bubble tea, we have what you need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* PRIMARY CTA - ORDER NOW */}
              <motion.a 
                href={STORE_DATA.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
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
                 src="https://images.unsplash.com/photo-1604719312566-b7cb0463ab18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Roma Mart Storefront"
                 className="w-full h-[500px] object-cover"
               />
               
               <div className="absolute top-6 right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg rotate-12">
                 <div className="text-center">
                   <span className="block font-coco text-xl leading-none" style={{ color: COLORS.navy }}>2.5%</span>
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
  return (
    <section id="services" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-coco uppercase text-center" style={{ color: COLORS.navy }}>
          Our <span style={{ color: COLORS.yellow }}>Services</span>
        </h2>
      </div>

      <div className="flex overflow-x-auto pb-8 pt-2 px-4 gap-6 snap-x snap-mandatory scrollbar-hide max-w-7xl mx-auto">
        {SERVICES.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -5 }}
            className="flex-shrink-0 w-72 md:w-80 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 snap-center flex flex-col items-start hover:shadow-md transition-shadow"
          >
            <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: COLORS.navy + '10', color: COLORS.navy }}>
              {React.cloneElement(item.icon, { size: 32 })}
            </div>
            <h3 className="font-coco text-xl mb-3" style={{ color: COLORS.navy }}>{item.title}</h3>
            <p className="font-inter text-gray-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
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
            
            <p className="text-gray-400 font-inter text-lg mb-8">
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
          </div>

          <div className="md:w-1/2 w-full">
            <div className="relative aspect-square rounded-full overflow-hidden border-8 border-white/5 shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1558507304-7c2a5d911139?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Bubble Tea and Coffee"
                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Locations = () => {
  const [activeLoc, setActiveLoc] = useState(STORE_DATA.locations[0]);

  return (
    <section id="locations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Find Us</span>
          <h2 className="text-4xl font-coco mt-2" style={{ color: COLORS.navy }}>Our Locations</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {STORE_DATA.locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLoc(loc)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all ${activeLoc.id === loc.id ? 'border-navy-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                style={{ borderColor: activeLoc.id === loc.id ? COLORS.navy : '' }}
              >
                <h3 className="font-coco text-lg mb-1" style={{ color: COLORS.navy }}>{loc.name}</h3>
                <p className="text-gray-500 text-sm font-inter mb-4">{loc.address}</p>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.yellow }}>
                  <div className={`w-2 h-2 rounded-full ${loc.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {loc.isOpen ? 'Open Now' : 'Closed'}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-gray-100 rounded-3xl overflow-hidden min-h-[400px] relative shadow-inner">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2938.868770732483!2d-82.40458892398539!3d42.97038897114251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8825838570075305%3A0x6641775e744d0810!2s189%20Wellington%20St%2C%20Sarnia%2C%20ON%20N7T%201G6%2C%20Canada!5e0!3m2!1sen!2sus!4v1709669042595!5m2!1sen!2sus"
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
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Contact Info Side */}
          <div>
            <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Get in Touch</span>
            <h2 className="text-4xl font-coco mt-2 mb-6" style={{ color: COLORS.navy }}>Contact Us</h2>
            <p className="text-gray-600 mb-10 font-inter leading-relaxed">
              Have a question about our products, want to suggest a new snack, or interested in a partnership? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.navy + '10' }}>
                  <MapPin className="text-navy-900" style={{ color: COLORS.navy }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: COLORS.navy }}>Visit Us</h4>
                  <p className="text-gray-600">{STORE_DATA.locations[0].address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.navy + '10' }}>
                  <Phone className="text-navy-900" style={{ color: COLORS.navy }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: COLORS.navy }}>Call Us</h4>
                  <p className="text-gray-600">{STORE_DATA.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.navy + '10' }}>
                  <Clock className="text-navy-900" style={{ color: COLORS.navy }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: COLORS.navy }}>Hours</h4>
                  <p className="text-gray-600">Mon-Fri: {STORE_DATA.locations[0].hours.weekdays}</p>
                  <p className="text-gray-600">Sat-Sun: {STORE_DATA.locations[0].hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Web3Forms Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-coco text-2xl mb-6" style={{ color: COLORS.navy }}>Send a Message</h3>
            
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
              {/* Web3Forms Access Key is set in STORE_DATA */}
              <input type="hidden" name="access_key" value={STORE_DATA.contact.web3FormsAccessKey} />
              <input type="hidden" name="subject" value="New Contact from Roma Mart Website" />
              <input type="hidden" name="from_name" value="Roma Mart Website" />

              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea 
                  name="message" 
                  id="message"
                  required 
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all"
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
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-coco text-xl" style={{ color: COLORS.navy }}>RM</div>
              <span className="font-coco text-2xl uppercase">Roma Mart</span>
           </div>
           <p className="text-gray-400 font-inter max-w-sm mb-6">
             Your local one-stop shop for everything from daily groceries to premium café drinks. Proudly serving the Sarnia community.
           </p>
           <div className="flex gap-4">
              <a href={STORE_DATA.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" title="Facebook">
                <FontAwesomeIcon icon={faFacebook} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a href={STORE_DATA.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" title="Instagram">
                <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a href={STORE_DATA.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" title="TikTok">
                <FontAwesomeIcon icon={faTiktok} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a href={STORE_DATA.socialLinks.x} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" title="X (Twitter)">
                <FontAwesomeIcon icon={faXTwitter} size="lg" style={{ color: COLORS.yellow }} />
              </a>
              <a href={STORE_DATA.socialLinks.snapchat} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" title="Snapchat">
                <FontAwesomeIcon icon={faSnapchat} size="lg" style={{ color: COLORS.yellow }} />
              </a>
           </div>
        </div>

        <div>
          <h4 className="font-coco text-lg mb-6 text-gray-200">Links</h4>
          <ul className="space-y-3 font-inter text-gray-400">
            <li><a href="#services" className="hover:text-yellow-400 transition-colors">Services</a></li>
            <li><a href="#rocafe" className="hover:text-yellow-400 transition-colors">RoCafé Menu</a></li>
            <li><a href="#locations" className="hover:text-yellow-400 transition-colors">Locations</a></li>
            <li><a href={STORE_DATA.onlineStoreUrl} className="hover:text-yellow-400 transition-colors font-bold text-yellow-500">Order Online</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-coco text-lg mb-6 text-gray-200">Legal</h4>
          <ul className="space-y-2 font-inter text-gray-400">
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 text-center text-gray-500 font-inter text-sm">
        <p>&copy; {new Date().getFullYear()} {STORE_DATA.legalName} All rights reserved.</p>
      </div>
    </footer>
  );
};

// --- MAIN APP ---
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ServicesScroll />
      <RoCafeSection />
      <Locations />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;