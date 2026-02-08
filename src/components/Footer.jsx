/**
 * Footer.jsx
 * Main footer component — orchestrates sub-components and renders brand/social/copyright sections.
 */
import React, { useCallback, useMemo } from 'react';
import COMPANY_DATA from '../config/company_data';
import { Logo } from './Logo';
import TrustpilotWidget from './TrustpilotWidget';
import { useLocationContext } from '../hooks/useLocationContext';
import { useLocations } from '../contexts/LocationsContext';
import { findNearestLocation } from '../utils/locationMath';
import OrderCTA from './OrderCTA';
import Button from './Button';
import FooterReviews from './FooterReviews';
import FooterLinks from './FooterLinks';
import FooterLocation from './FooterLocation';

const SOCIAL_ICONS = {
  Facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.032 1.545.08v3.281h-1.163c-1.468 0-1.924.7-1.924 2.118v2.079h3.028l-.521 3.667h-2.507v7.98h-4.316z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9371.0635 15.6599.0075 15.2491-.006 12.0001-.0095 8.74-.0125 8.3326.0011 7.0301.084zm.1402 21.6154c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6794-.8186-.8954-1.3802-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.8988.4227-.1644 1.0573-.3624 2.2271-.4171 1.2655-.06 1.6447-.072 4.8479-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.8962 1.3816.1644.4217.3624 1.0573.4171 2.2271.0605 1.2645.0718 1.6465.079 4.8479.007 3.2025-.006 3.5827-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.8952-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608zM16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424zM5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738zm2.1622-.001c-.0041-2.2037 1.7837-3.9978 3.9877-4.002 2.204-.004 3.9985 1.7837 4.0026 3.9877.004 2.2038-1.7836 3.998-3.9877 4.002-2.2038.0042-3.9985-1.7834-4.0026-3.9877z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
  Snapchat: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.959-.289.156-.09.3-.09.444-.06.195.045.375.15.48.3.105.135.195.345.135.585-.075.315-.375.63-.9.795-.168.045-.357.09-.57.12A6.783 6.783 0 0 1 18 11.775c-.104.245-.105.51-.015.76a8.463 8.463 0 0 0 3.121 3.845c.27.165.44.333.525.51.075.165.075.36-.015.555-.12.315-.375.555-.72.735-.39.225-.87.36-1.365.42l-.123.018c-.183.027-.405.06-.594.195-.18.135-.285.345-.345.585-.075.285-.18.51-.33.66-.225.225-.51.33-.795.33-.255 0-.51-.075-.75-.165l-.06-.03a7.47 7.47 0 0 0-1.08-.27 2.727 2.727 0 0 0-.615-.06c-.296 0-.57.048-.89.135-.39.105-.78.285-1.244.525l-.102.054c-.28.148-.59.3-.885.42-.36.135-.72.21-1.095.21s-.735-.075-1.095-.21a5.12 5.12 0 0 1-.87-.42l-.12-.06c-.465-.24-.855-.42-1.246-.525a3.225 3.225 0 0 0-.87-.135c-.225 0-.435.03-.69.09-.3.06-.655.165-1.065.27l-.069.024c-.234.09-.495.165-.75.165-.285 0-.57-.105-.795-.33a1.572 1.572 0 0 1-.33-.66c-.06-.24-.165-.45-.345-.585-.19-.13-.408-.165-.594-.195L2.61 18.15c-.504-.06-.975-.195-1.365-.42a1.443 1.443 0 0 1-.72-.735.97.97 0 0 1-.015-.555c.09-.18.255-.345.524-.51a8.474 8.474 0 0 0 3.122-3.846.897.897 0 0 0-.015-.76c-.173-.385-.435-.577-.57-.614-.21-.06-.39-.09-.57-.12-.279-.075-.564-.15-.795-.255-.306-.135-.546-.315-.661-.525a.815.815 0 0 1-.045-.585c.075-.195.234-.375.48-.45.106-.03.225-.038.345 0 .15.03.33.096.51.183.285.135.63.255.96.284.18.015.33-.03.405-.09a4.69 4.69 0 0 1-.03-.51l-.003-.06c-.104-1.628-.229-3.654.3-4.847C6.563 1.069 9.917.793 10.907.793h1.299z" />
    </svg>
  ),
};

const SOCIAL_LINKS = [
  { label: 'Facebook' },
  { label: 'Instagram' },
  { label: 'TikTok' },
  { label: 'X' },
  { label: 'Snapchat' },
];

export default function Footer() {
  const BASE_URL =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  const { userLocation } = useLocationContext();
  const { locations, selectedLocationId, selectLocation } = useLocations();

  // Nearest open location (delegates to shared utility)
  const nearestLocationId = useMemo(() => {
    const openLocations = locations.filter((loc) => loc.status === 'open');
    const nearest = findNearestLocation(userLocation, openLocations);
    return nearest?.id ?? null;
  }, [userLocation, locations]);

  // Resolve selected/nearest/fallback into a single current location for both children
  const currentLocation = useMemo(() => {
    let location;
    if (selectedLocationId === 'auto') {
      location = nearestLocationId ? locations.find((l) => l.id === nearestLocationId) : COMPANY_DATA.location;
    } else {
      location = locations.find((l) => l.id === selectedLocationId);
    }
    if (!location) location = COMPANY_DATA.location;
    if (location) {
      return {
        ...location,
        address: location.address || COMPANY_DATA.location?.address,
        contact: location.contact || COMPANY_DATA.location?.contact,
        hours: location.hours || COMPANY_DATA.location?.hours,
      };
    }
    return COMPANY_DATA.location;
  }, [selectedLocationId, nearestLocationId, locations]);

  const socialHandlers = useMemo(() => {
    const handlers = {};
    SOCIAL_LINKS.forEach((link) => {
      handlers[link.label.toLowerCase()] = () =>
        window.dataLayer?.push({ event: 'social_click', platform: link.label.toLowerCase() });
    });
    return handlers;
  }, []);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <React.Fragment>
      <OrderCTA />
      <footer
        className="pt-16 pb-20"
        style={{ backgroundColor: 'var(--color-footer)', color: 'var(--color-on-footer)' }}
      >
        {/* Google Reviews */}
        <FooterReviews currentLocation={currentLocation} locations={locations} />

        {/* Logo + Social + Links */}
        <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-4 gap-12 mb-12">
          <div className="p-1 col-span-1 md:col-span-2">
            <a
              href={`${BASE_URL}`}
              className="flex items-center gap-3 mb-6 transition-opacity cursor-pointer w-fit hover:opacity-80 focus-visible:opacity-80"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label="Roma Mart - Go to homepage"
            >
              <Logo layout="horizontal" variant="white" size={40} />
            </a>
            <p className="p-1 font-inter max-w-sm mb-6" style={{ color: 'var(--color-on-footer-muted)' }}>
              Your local one-stop shop for everything from daily groceries to premium café drinks. Proudly serving the
              Sarnia community.
            </p>
            <div className="flex gap-4 p-1">
              {SOCIAL_LINKS.map((link) => {
                const url = COMPANY_DATA.socialLinks[link.label.toLowerCase()];
                if (!url) return null;
                return (
                  <a
                    key={link.label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    style={{ backgroundColor: 'var(--color-surface-muted)' }}
                    aria-label={`Visit Roma Mart on ${link.label}`}
                    onClick={socialHandlers[link.label.toLowerCase()]}
                    onMouseEnter={(e) => (e.currentTarget.firstChild.style.color = 'var(--color-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.firstChild.style.color = 'var(--color-on-footer)')}
                  >
                    <span style={{ color: 'var(--color-on-footer)', display: 'flex' }}>{SOCIAL_ICONS[link.label]}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <FooterLinks />
        </div>

        {/* Trustpilot + Location + Copyright */}
        <div className="max-w-7xl mx-auto px-4 pt-8" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
          <div className="mb-8 flex justify-center items-center">
            <TrustpilotWidget />
          </div>

          <FooterLocation
            locations={locations}
            nearestLocationId={nearestLocationId}
            selectedLocationId={selectedLocationId}
            onLocationChange={selectLocation}
            currentLocation={currentLocation}
          />

          <div className="text-center font-inter text-sm" style={{ color: 'var(--color-on-footer-subtle)' }}>
            <p>
              &copy; {new Date().getFullYear()} {COMPANY_DATA.legalName} All rights reserved.
            </p>
            <p>GST#: {COMPANY_DATA.gstNumber}</p>
            <p>{'\uD83C\uDF41'}</p>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-12 flex justify-center mb-10">
          <Button variant="action" size="lg" onClick={handleBackToTop} aria-label="Back to top of page">
            {'\u2191'} Back to Top
          </Button>
        </div>
      </footer>
    </React.Fragment>
  );
}
