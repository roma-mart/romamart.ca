import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, ExternalLink } from 'lucide-react';
import { getOrderingUrl } from '../config/ordering';
import { Logo } from './Logo';

const BRAND = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  heading: 'var(--color-heading)',
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  text: 'var(--color-text)',
  white: 'var(--color-primary)'
};

const STORE_DATA = {
  onlineStoreUrl: getOrderingUrl()
};

export default function Navbar() {
  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
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
  }, [BASE_URL]);

  const handleNavClick = (e, sectionId, subpageUrl) => {
    setIsOpen(false);
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
  };

  const trackOrderClick = (location) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'order_cta_click',
        cta_location: location,
        cta_text: 'Order Online'
      });
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}
      style={{ backgroundColor: scrolled ? 'var(--color-bg)' : 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Area */}
          <a
            href={`${BASE_URL}`}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Roma Mart - Go to homepage"
          >
            <Logo size={48} />
            {/* <div className="hidden sm:block leading-tight">
              <span className="block var(--font-heading) text-xl uppercase" style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.heading }}>Roma Mart</span>
              <span className="block text-xs font-inter font-semibold tracking-wider" style={{ color: BRAND.accent }}>CONVENIENCE</span>
            </div> */}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!isHomePage && (
              <a
                href={`${BASE_URL}`}
                className="font-inter font-medium hover:opacity-80 transition-opacity flex items-center gap-1.5"
                style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.text }}
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
              style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.text }}
            >
              Services
            </a>
            <a
              href={isHomePage ? `${BASE_URL}#rocafe` : `${BASE_URL}rocafe`}
              onClick={(e) => handleNavClick(e, 'rocafe', `${BASE_URL}rocafe`)}
              className="font-inter font-medium hover:opacity-80 transition-opacity"
              style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.text }}
            >
              RoCafé
            </a>
            <a
              href={isHomePage ? `${BASE_URL}#locations` : `${BASE_URL}locations`}
              onClick={(e) => handleNavClick(e, 'locations', `${BASE_URL}locations`)}
              className="font-inter font-medium hover:opacity-80 transition-opacity"
              style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.text }}
            >
              Locations
            </a>
            <a
              href={isHomePage ? `${BASE_URL}about` : `${BASE_URL}about`}
              onClick={(e) => handleNavClick(e, 'about', `${BASE_URL}about`)}
              className="font-inter font-medium hover:opacity-80 transition-opacity"
              style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.text }}
            >
              About
            </a>
            <a
              href={isHomePage ? `${BASE_URL}#contact` : `${BASE_URL}contact`}
              onClick={(e) => handleNavClick(e, 'contact', `${BASE_URL}contact`)}
              className="font-inter font-medium hover:opacity-80 transition-opacity"
              style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : BRAND.text }}
            >
              Contact
            </a>
            <a
              href={STORE_DATA.onlineStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOrderClick('header_desktop')}
              className="px-6 py-2 rounded-full font-bold font-inter text-sm transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
            >
              ORDER NOW <ExternalLink size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md"
            style={{ color: scrolled ? BRAND.heading : BRAND.white }}
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
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b flex items-center gap-2"
                    style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                >
                  <Home size={20} /> Home
                </a>
              )}
              <a
                href={isHomePage ? `${BASE_URL}#services` : `${BASE_URL}services`}
                onClick={(e) => handleNavClick(e, 'services', `${BASE_URL}services`)}
                className="block px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
              >
                Services
              </a>
              <a
                href={isHomePage ? `${BASE_URL}#rocafe` : `${BASE_URL}rocafe`}
                onClick={(e) => handleNavClick(e, 'rocafe', `${BASE_URL}rocafe`)}
                className="block px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
              >
                RoCafé
              </a>
              <a
                href={isHomePage ? `${BASE_URL}#locations` : `${BASE_URL}locations`}
                onClick={(e) => handleNavClick(e, 'locations', `${BASE_URL}locations`)}
                className="block px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
              >
                Locations
              </a>
                <a
                  href={isHomePage ? `${BASE_URL}about` : `${BASE_URL}about`}
                  onClick={(e) => handleNavClick(e, 'about', `${BASE_URL}about`)}
                  className="block px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                >
                  About
                </a>
              <a
                href={isHomePage ? `${BASE_URL}#contact` : `${BASE_URL}contact`}
                onClick={(e) => handleNavClick(e, 'contact', `${BASE_URL}contact`)}
                className="block px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
              >
                Contact
              </a>
              <a
                href={STORE_DATA.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOrderClick('header_mobile')}
                className="block px-3 py-4 text-center rounded-lg font-bold var(--font-heading) uppercase mt-4"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
              >
                ORDER NOW
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
