import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  ExternalLink,
  Store,
  Coffee,
  MapPin,
  Mail,
  Info,
  ShoppingCart,
  EllipsisVertical,
} from 'lucide-react';
import Button from './Button';
import { useCompanyData } from '../contexts/CompanyDataContext';
import { Logo } from './Logo';
import { NAVIGATION_LINKS } from '../config/navigation';
import { useFocusTrap } from '../hooks/useFocusTrap';

// WCO icon mapping for nav links (keyed by href for stability)
const WCO_LINK_ICONS = {
  '/services': Store,
  '/rocafe': Coffee,
  '/locations': MapPin,
  '/contact': Mail,
  '/about': Info,
};

// WCO progressive collapse: priority links shown inline, overflow links in dropdown
const WCO_PRIORITY_HREFS = ['/services', '/rocafe', '/locations'];
const WCO_OVERFLOW_HREFS = ['/contact', '/about'];

export default function Navbar({ currentPage = 'home' }) {
  const { companyData } = useCompanyData();
  const [wcoActive, setWcoActive] = useState(false);
  const [wcoWidth, setWcoWidth] = useState(0);
  // Window Controls Overlay detection + titlebar geometry tracking
  // Visibility toggle is immediate; width is debounced (geometrychange fires rapidly during resize)
  useEffect(() => {
    if ('windowControlsOverlay' in navigator) {
      let debounceTimer;
      const updateWco = () => {
        const visible = navigator.windowControlsOverlay.visible;
        setWcoActive(visible);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (navigator.windowControlsOverlay.visible) {
            setWcoWidth(navigator.windowControlsOverlay.getTitlebarAreaRect().width);
          }
        }, 200);
      };
      navigator.windowControlsOverlay.addEventListener('geometrychange', updateWco);
      updateWco();
      return () => {
        navigator.windowControlsOverlay.removeEventListener('geometrychange', updateWco);
        clearTimeout(debounceTimer);
      };
    }
  }, []);
  // WCO progressive collapse breakpoints
  const wcoShowIconLabels = wcoActive && wcoWidth >= 600; // Wide: priority icons + text labels
  const wcoShowIcons = wcoActive && wcoWidth >= 450; // Medium: priority icons only
  // Narrow (<450px): all nav links collapse into overflow dropdown
  const wcoOrderText = !wcoActive || wcoWidth >= 450;
  const BASE_URL =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(currentPage === 'home');
  const [colorScheme, setColorScheme] = useState('light');
  const [highContrast, setHighContrast] = useState(false);
  const [wcoOverflowOpen, setWcoOverflowOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

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
    let ticking = false;
    let rafId;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    // Update isHomePage when currentPage changes
    setIsHomePage(currentPage === 'home');
  }, [currentPage]);

  // Detect standalone PWA mode (iOS + Android/desktop without WCO)
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(standalone);
  }, []);

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
        cta_text: 'Order Online',
      });
    }
  }, []);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleMenuClose = useCallback(() => setIsOpen(false), []);
  const handleOrderClick = useCallback(() => trackOrderClick('header_mobile'), [trackOrderClick]);
  const toggleOverflow = useCallback(() => setWcoOverflowOpen((prev) => !prev), []);
  const handleOverflowClose = useCallback(() => setWcoOverflowOpen(false), []);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const overflowRef = useRef(null);
  const overflowButtonRef = useRef(null);

  useFocusTrap(mobileMenuRef, isOpen, {
    onEscape: handleMenuClose,
    returnFocusRef: hamburgerRef,
    initialFocusDelay: 150,
  });

  // Close WCO overflow dropdown on outside click or Escape
  useEffect(() => {
    if (!wcoOverflowOpen) return;
    const handleClickOutside = (e) => {
      const overflowEl = overflowRef.current;
      const buttonEl = overflowButtonRef.current;
      // If both elements are gone (WCO deactivated), close defensively
      if (!overflowEl && !buttonEl) {
        setWcoOverflowOpen(false);
        return;
      }
      if ((overflowEl && overflowEl.contains(e.target)) || (buttonEl && buttonEl.contains(e.target))) {
        return;
      }
      setWcoOverflowOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setWcoOverflowOpen(false);
        overflowButtonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [wcoOverflowOpen]);

  // Close overflow if WCO deactivates while dropdown is open
  useEffect(() => {
    if (!wcoActive && wcoOverflowOpen) setWcoOverflowOpen(false);
  }, [wcoActive, wcoOverflowOpen]);

  return (
    <nav
      className={`fixed w-full z-50 ${wcoActive ? 'navbar-wco' : `transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}`}
      style={{
        backgroundColor: wcoActive
          ? isHomePage && !scrolled
            ? 'var(--color-primary)'
            : 'var(--color-bg)'
          : isOpen
            ? isHomePage && !scrolled
              ? 'var(--color-primary)'
              : 'var(--color-bg)'
            : scrolled
              ? 'var(--color-bg)'
              : 'transparent',
        ...(isStandalone && !wcoActive ? { paddingTop: 'env(safe-area-inset-top, 0)' } : {}),
      }}
      data-wco={wcoActive ? 'active' : undefined}
    >
      <div className={`max-w-7xl mx-auto ${wcoActive ? 'px-2' : 'px-4 sm:px-6 lg:px-8'}`}>
        <div className="flex justify-between items-center">
          {/* Logo Area */}
          <a
            href={`${BASE_URL}`}
            className={`flex items-center transition-opacity cursor-pointer no-drag hover:opacity-80 focus-visible:opacity-80${isOpen ? ' invisible' : ''} md:visible`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Roma Mart - Go to homepage"
          >
            {/* Mobile: vertical logo (compact horizontal in WCO) */}
            <span className="md:hidden">
              <Logo
                size={wcoActive ? 22 : 40}
                layout={wcoActive ? 'horizontal' : 'vertical'}
                variant={
                  colorScheme === 'dark' || highContrast
                    ? 'white'
                    : isHomePage
                      ? scrolled
                        ? 'brand'
                        : 'white'
                      : 'brand'
                }
              />
            </span>
            {/* Desktop: horizontal logo */}
            <span className="hidden md:block">
              <Logo
                size={wcoActive ? 22 : 40}
                layout="horizontal"
                variant={
                  colorScheme === 'dark' || highContrast
                    ? 'white'
                    : isHomePage
                      ? scrolled
                        ? 'brand'
                        : 'white'
                      : 'brand'
                }
              />
            </span>
          </a>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center ${wcoActive ? 'space-x-2' : 'space-x-8'}`}>
            {/* Only show Home button if NOT on homepage */}
            {!isHomePage && (
              <a
                key="home"
                href={BASE_URL}
                className={`font-inter font-medium transition-opacity flex items-center gap-2 no-drag hover:opacity-80 focus-visible:opacity-80${wcoActive ? ' wco-nav-link' : ''}`}
                style={{ color: 'var(--color-text)', WebkitTapHighlightColor: 'transparent' }}
                aria-label="Go to homepage"
                title="Home"
              >
                <Home size={wcoActive ? 16 : 20} />
              </a>
            )}
            {/* Non-WCO: render all nav links as text */}
            {!wcoActive &&
              NAVIGATION_LINKS.filter((link) => link.showIn.navbar && link.href !== '/').map((link) => (
                <a
                  key={link.href}
                  href={
                    isHomePage && link.href.startsWith('/')
                      ? `${BASE_URL}#${link.href.replace('/', '')}`
                      : `${BASE_URL}${link.href.replace('/', '')}`
                  }
                  onClick={(e) =>
                    handleNavClick(
                      e,
                      link.href !== '/' ? link.href.replace('/', '') : null,
                      `${BASE_URL}${link.href.replace('/', '')}`
                    )
                  }
                  className="font-inter font-medium transition-opacity no-drag hover:opacity-80 focus-visible:opacity-80"
                  style={{
                    color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-text)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  aria-label={link.ariaLabel || link.label}
                  title={link.label}
                >
                  {link.label}
                </a>
              ))}
            {/* WCO: render priority links inline (hide at narrow widths) */}
            {wcoActive &&
              wcoShowIcons &&
              NAVIGATION_LINKS.filter(
                (link) => link.showIn.navbar && link.href !== '/' && WCO_PRIORITY_HREFS.includes(link.href)
              ).map((link) => {
                const WcoIcon = WCO_LINK_ICONS[link.href] || Info;
                return (
                  <a
                    key={link.href}
                    href={
                      isHomePage && link.href.startsWith('/')
                        ? `${BASE_URL}#${link.href.replace('/', '')}`
                        : `${BASE_URL}${link.href.replace('/', '')}`
                    }
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        link.href !== '/' ? link.href.replace('/', '') : null,
                        `${BASE_URL}${link.href.replace('/', '')}`
                      )
                    }
                    className="font-inter font-medium transition-opacity no-drag hover:opacity-80 focus-visible:opacity-80 wco-nav-link"
                    style={{
                      color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-text)',
                      WebkitTapHighlightColor: 'transparent',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    aria-label={link.ariaLabel || link.label}
                    title={link.label}
                  >
                    <WcoIcon size={16} />
                    {wcoShowIconLabels && <span>{link.label}</span>}
                  </a>
                );
              })}
            {/* WCO overflow dropdown: secondary links (+ all links at narrow widths) */}
            {wcoActive &&
              (() => {
                const overflowLinks = NAVIGATION_LINKS.filter((link) => {
                  if (!link.showIn.navbar || link.href === '/') return false;
                  if (WCO_OVERFLOW_HREFS.includes(link.href)) return true;
                  if (!wcoShowIcons && WCO_PRIORITY_HREFS.includes(link.href)) return true;
                  return false;
                });
                if (overflowLinks.length === 0) return null;
                return (
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      ref={overflowButtonRef}
                      onClick={toggleOverflow}
                      className="no-drag p-1 rounded-md transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent"
                      style={{
                        color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-text)',
                        minWidth: 32,
                        minHeight: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label="More navigation options"
                      aria-expanded={wcoOverflowOpen}
                      aria-controls="wco-overflow-nav"
                    >
                      <EllipsisVertical size={16} />
                    </button>
                    <AnimatePresence>
                      {wcoOverflowOpen && (
                        <motion.div
                          ref={overflowRef}
                          initial={{ opacity: 0, y: -4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          id="wco-overflow-nav"
                          aria-label="Additional navigation"
                          className="no-drag"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: 4,
                            minWidth: 160,
                            backgroundColor: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg, 8px)',
                            boxShadow: 'var(--shadow-lg)',
                            zIndex: 1060,
                            overflow: 'hidden',
                          }}
                        >
                          {overflowLinks.map((link) => {
                            const WcoIcon = WCO_LINK_ICONS[link.href] || Info;
                            return (
                              <a
                                key={link.href}
                                href={
                                  isHomePage && link.href.startsWith('/')
                                    ? `${BASE_URL}#${link.href.replace('/', '')}`
                                    : `${BASE_URL}${link.href.replace('/', '')}`
                                }
                                onClick={(e) => {
                                  handleNavClick(
                                    e,
                                    link.href !== '/' ? link.href.replace('/', '') : null,
                                    `${BASE_URL}${link.href.replace('/', '')}`
                                  );
                                  handleOverflowClose();
                                }}
                                className="wco-overflow-item no-drag"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '10px 14px',
                                  color: 'var(--color-text)',
                                  fontSize: '0.875rem',
                                  fontFamily: 'var(--font-body)',
                                  textDecoration: 'none',
                                  transition: 'background-color 0.15s',
                                }}
                                aria-label={link.ariaLabel || link.label}
                              >
                                <WcoIcon size={16} />
                                {link.label}
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}
            {companyData.onlineStoreUrl && (
              <Button
                variant="order"
                size="sm"
                href={companyData.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon={wcoOrderText ? <ExternalLink size={wcoActive ? 12 : 14} /> : null}
                iconPosition="right"
                analyticsEvent={{ event: 'order_cta_click', cta_location: 'header_desktop', cta_text: 'Order Online' }}
                ariaLabel="Order Online"
                className={`no-drag${wcoActive ? ' wco-order-btn' : ' shadow-lg'}`}
                style={{ minWidth: wcoActive ? 'unset' : 120 }}
              >
                {wcoOrderText ? 'ORDER NOW' : <ShoppingCart size={14} />}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            ref={hamburgerRef}
            onClick={toggleMenu}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            className={`md:hidden p-2 min-w-[44px] min-h-[44px] rounded-md no-drag focus-visible:ring-2 focus-visible:ring-accent${isOpen ? ' invisible' : ''}`}
            style={{ color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-heading)' }}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
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
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t absolute w-full shadow-2xl"
            style={{
              backgroundColor: isHomePage && !scrolled ? 'var(--color-primary)' : 'var(--color-bg)',
              borderColor: 'var(--color-surface)',
              paddingTop: 0,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Close button inside focus trap (hamburger X is inerted when overlay opens) */}
            <button
              type="button"
              onClick={handleMenuClose}
              className="absolute p-2 rounded-md md:hidden focus-visible:ring-2 focus-visible:ring-accent min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{
                top: 16,
                right: 16,
                zIndex: 10,
                color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-heading)',
              }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            {/* Overlay logo, absolutely positioned top-left for perfect alignment */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
              <Logo
                size={40}
                layout="horizontal"
                variant={
                  colorScheme === 'dark' || highContrast
                    ? 'white'
                    : isHomePage
                      ? scrolled
                        ? 'brand'
                        : 'white'
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
                  className="px-3 py-4 text-lg font-bold text-heading uppercase border-b flex items-center gap-2"
                  style={{ color: 'var(--color-heading)', borderColor: 'var(--color-surface)' }}
                  aria-label="Go to homepage"
                  title="Home"
                  onClick={handleMenuClose}
                >
                  <Home size={20} />
                </a>
              )}
              {NAVIGATION_LINKS.filter((link) => link.showIn.navbar && link.href !== '/').map((link) => (
                <a
                  key={link.href}
                  href={
                    isHomePage && link.href.startsWith('/')
                      ? `${BASE_URL}#${link.href.replace('/', '')}`
                      : `${BASE_URL}${link.href.replace('/', '')}`
                  }
                  onClick={(e) => {
                    handleNavClick(
                      e,
                      link.href !== '/' ? link.href.replace('/', '') : null,
                      `${BASE_URL}${link.href.replace('/', '')}`
                    );
                    handleMenuClose();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMenuClose();
                    }
                  }}
                  className="block px-3 py-4 text-lg font-bold text-heading uppercase border-b"
                  style={{
                    color: isHomePage && !scrolled ? 'var(--color-text-on-primary)' : 'var(--color-heading)',
                    borderColor: 'var(--color-surface)',
                  }}
                  aria-label={link.ariaLabel || link.label}
                  title={link.label}
                >
                  {link.label}
                </a>
              ))}
              {companyData.onlineStoreUrl && (
                <a
                  href={companyData.onlineStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOrderClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOrderClick();
                    }
                  }}
                  className="block px-3 py-4 text-center rounded-lg font-bold text-heading uppercase mt-4 order-now-mobile"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                >
                  ORDER NOW
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
