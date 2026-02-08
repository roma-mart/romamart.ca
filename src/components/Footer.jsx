/**
 * Footer.jsx
 * Main footer component — orchestrates sub-components and renders brand/social/copyright sections.
 */
import React, { useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
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

const SOCIAL_LINKS = [
  { label: 'Facebook', icon: faFacebook },
  { label: 'Instagram', icon: faInstagram },
  { label: 'TikTok', icon: faTiktok },
  { label: 'X', icon: faXTwitter },
  { label: 'Snapchat', icon: faSnapchat },
];

export default function Footer() {
  const BASE_URL =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
      ? import.meta.env.BASE_URL
      : '/';
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
    let location = null;
    if (selectedLocationId === 'auto') {
      location = nearestLocationId
        ? locations.find((l) => l.id === nearestLocationId)
        : COMPANY_DATA.location;
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
            <p
              className="p-1 font-inter max-w-sm mb-6"
              style={{ color: 'var(--color-on-footer-muted)' }}
            >
              Your local one-stop shop for everything from daily groceries to premium café drinks.
              Proudly serving the Sarnia community.
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.firstChild.style.color = 'var(--color-accent)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.firstChild.style.color = 'var(--color-on-footer)')
                    }
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      size="lg"
                      style={{ color: 'var(--color-on-footer)' }}
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterLinks />
        </div>

        {/* Trustpilot + Location + Copyright */}
        <div
          className="max-w-7xl mx-auto px-4 pt-8"
          style={{ borderTop: '1px solid var(--color-border-muted)' }}
        >
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

          <div
            className="text-center font-inter text-sm"
            style={{ color: 'var(--color-on-footer-subtle)' }}
          >
            <p>
              &copy; {new Date().getFullYear()} {COMPANY_DATA.legalName} All rights reserved.
            </p>
            <p>GST#: {COMPANY_DATA.gstNumber}</p>
            <p>{'\uD83C\uDF41'}</p>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-12 flex justify-center mb-10">
          <Button
            variant="action"
            size="lg"
            onClick={handleBackToTop}
            aria-label="Back to top of page"
          >
            {'\u2191'} Back to Top
          </Button>
        </div>
      </footer>
    </React.Fragment>
  );
}
