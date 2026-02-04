import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, ExternalLink } from 'lucide-react';
import Button from './Button';
import COMPANY_DATA from '../config/company_data';
import { Logo } from './Logo';
import { NAVIGATION_LINKS } from '../config/navigation';
// Removed duplicate imports of useEffect and useState

export default function Navbar() {
  const [wcoActive, setWcoActive] = useState(false);
    // Window Controls Overlay detection
    useEffect(() => {
      if ('windowControlsOverlay' in navigator) {
        const updateWco = () => setWcoActive(navigator.windowControlsOverlay.visible);
        navigator.windowControlsOverlay.addEventListener('geometrychange', updateWco);
        updateWco();
        return () => navigator.windowControlsOverlay.removeEventListener('geometrychange', updateWco);
      }
    }, []);
  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [colorScheme, setColorScheme] = useState('light');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    const mqContrast = window.matchMedia('(forced-colors: active)');
    const updateScheme = () => setColorScheme(mqDark.matches ? 'dark' : 'light');
    const updateContrast = () => setHighContrast(mqContrast.matches);
    updateScheme();
    updateContrast();
    mqDark.addEventListener('change', updateScheme);
    mqContrast.addEventListener('change', updateContrast);
    return () => {
      mqDark.removeEventListener('change', updateScheme);
      mqContrast.removeEventListener('change', updateContrast);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkPath = () => {
      const normalizePath = (value) => {
        if (!value) return '/';
        const trimmed = value.replace(/\/+$/, '');
        return trimmed === '' ? '/' : trimmed;
      };
      const path = normalizePath(window.location.pathname);
      const basePath = normalizePath(BASE_URL);
      setIsHomePage(path === '/' || path === basePath);
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, [BASE_URL]);

  const scrollToSection = (sectionId) => {
    if (!sectionId) return false;
    const element = document.getElementById(sectionId);
    if (!element) return false;
    const navHeight = document.querySelector('nav')?.offsetHeight || 0;
    const top = element.getBoundingClientRect().top + window.scrollY - navHeight - 12;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    window.scrollTo({ top, behavior });
    return true;
  };

  const handleNavClick = (e, sectionId, subpageUrl) => {
    setIsOpen(false);
    if (sectionId) {
      e.preventDefault();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!scrollToSection(sectionId) && subpageUrl) {
            window.location.assign(subpageUrl);
          }
        });
      });
      return;
    }
    if (subpageUrl) {
      e.preventDefault();
      window.location.assign(subpageUrl);
    }
  };

  const trackOrderClick = useCallback((location) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'order_cta_click',
        cta_location: location,
        cta_text: 'Order Online'
      });
    }
  }, []);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const handleMenuClose = useCallback(() => setIsOpen(false), []);
  const handleOrderClick = useCallback(() => trackOrderClick('header_mobile'), [trackOrderClick]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${wcoActive ? 'navbar-wco' : ''} ${scrolled ? 'shadow-md py-2' : 'py-4'}`}
      style={{ backgroundColor: isOpen ? (isHomePage && !scrolled ? 'var(--color-primary)' : 'var(--color-bg)') : (scrolled ? 'var(--color-bg)' : 'transparent') }}
      data-wco={wcoActive ? 'active' : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Area */}
          <a
            href={`${BASE_URL}`}
            className={`flex items-center transition-opacity cursor-pointer no-drag hover:opacity-80 focus-visible:opacity-80${isOpen ? ' invisible' : ''} md:visible`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Roma Mart - Go to homepage"
          >
            {/* Mobile: vertical logo */}
            <span className="md:hidden">
              <Logo
                size={40}
                layout="vertical"
                variant={
                  (colorScheme === 'dark' || highContrast)
                    ? 'white'
                    : isHomePage
                      ? (scrolled ? 'brand' : 'white')
                      : 'brand'
                }
              />
            </span>
            {/* Desktop: horizontal logo */}
            <span className="hidden md:block">
              <Logo
                size={40}
                layout="horizontal"
                variant={
                  (colorScheme === 'dark' || highContrast)
                    ? 'white'
                    : isHomePage
                      ? (scrolled ? 'brand' : 'white')
                      : 'brand'
                }
              />
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Only show Home button if NOT on homepage */}
            {!isHomePage && (
              <a
                key="home"
                href={BASE_URL}
                className="font-inter font-medium transition-opacity flex items-center gap-2"
                style={{ color: 'var(--color-text)', WebkitTapHighlightColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                aria-label="Go to homepage"
                title="Home"
              >
                <Home size={20} />
              </a>
            )}
            {NAVIGATION_LINKS.filter(link => link.showIn.navbar && link.href !== '/').map(link => (
              <a
                key={link.href}
                href={isHomePage && link.href.startsWith('/') ? `${BASE_URL}#${link.href.replace('/', '')}` : `${BASE_URL}${link.href.replace('/', '')}`}
                onClick={e => handleNavClick(e, link.href !== '/' ? link.href.replace('/', '') : null, `${BASE_URL}${link.href.replace('/', '')}`)}
                className="font-inter font-medium transition-opacity"
                style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-text)', WebkitTapHighlightColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                aria-label={link.ariaLabel || link.label}
                title={link.label}
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="order"
              href={COMPANY_DATA.onlineStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLink size={14} />}
              iconPosition="right"
              analyticsEvent={{ event: 'order_cta_click', cta_location: 'header_desktop', cta_text: 'Order Online' }}
              ariaLabel="Order Online"
              className="font-bold font-inter text-sm shadow-lg"
              style={{ minWidth: 120 }}
            >
              ORDER NOW
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            className="md:hidden p-2 rounded-md"
            style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-heading)' }}
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
            className="md:hidden border-t absolute w-full shadow-2xl"
            style={{ backgroundColor: isHomePage && !scrolled ? 'var(--color-primary)' : 'var(--color-bg)', borderColor: 'var(--color-surface)', paddingTop: 0 }}
          >
            {/* Overlay logo, absolutely positioned top-left for perfect alignment */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
              <Logo
                size={40}
                layout="horizontal"
                variant={
                  (colorScheme === 'dark' || highContrast)
                    ? 'white'
                    : isHomePage
                      ? (scrolled ? 'brand' : 'white')
                      : 'brand'
                }
                style={{ maxWidth: 120, height: 'auto' }}
              />
            </div>
            <div className="px-4 pt-2 pb-6 space-y-1" style={{ paddingTop: '64px' }}>
              {/* Only show Home button if NOT on homepage */}
              {!isHomePage && (
                <a
                  key="home"
                  href={BASE_URL}
                  className="px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b flex items-center gap-2"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                  aria-label="Go to homepage"
                  title="Home"
                  onClick={handleMenuClose}
                >
                  <Home size={20} />
                </a>
              )}
              {NAVIGATION_LINKS.filter(link => link.showIn.navbar && link.href !== '/').map(link => (
                <a
                  key={link.href}
                  href={isHomePage && link.href.startsWith('/') ? `${BASE_URL}#${link.href.replace('/', '')}` : `${BASE_URL}${link.href.replace('/', '')}`}
                  onClick={e => { handleNavClick(e, link.href !== '/' ? link.href.replace('/', '') : null, `${BASE_URL}${link.href.replace('/', '')}`); handleMenuClose(); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMenuClose();
                    }
                  }}
                  className="block px-3 py-4 text-lg font-bold var(--font-heading) uppercase border-b"
                  style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                  aria-label={link.ariaLabel || link.label}
                  title={link.label}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={COMPANY_DATA.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOrderClick();
                  }
                }}
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
