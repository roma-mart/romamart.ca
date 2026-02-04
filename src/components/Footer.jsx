          /**
           * info @ Location Selector (in Footer)
           * Accessible, standards-based location selector using native <select> and design tokens.
           * @returns {JSX.Element}
           */
import React, { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import COMPANY_DATA from '../config/company_data';
import { Logo } from './Logo';
import TrustpilotWidget from './TrustpilotWidget';
import { useLocationContext } from '../hooks/useLocationContext';
import { LOCATIONS, getActiveLocations } from '../data/locations';
import { NAVIGATION_LINKS } from '../config/navigation';
import OrderCTA from './OrderCTA';
import Button from './Button';
import { ReactGoogleReviews } from 'react-google-reviews';
import 'react-google-reviews/dist/index.css';
import { circuitBreakers } from '../utils/apiCircuitBreaker';


// Social platforms to control display in Footer (label, icon)
const SOCIAL_LINKS = [
  { label: 'Facebook', icon: 'Facebook' },
  { label: 'Instagram', icon: 'Instagram' },
  { label: 'TikTok', icon: 'TikTok' },
  { label: 'X', icon: 'X' },
  { label: 'Snapchat', icon: 'Snapchat' }
];

export default function Footer() {

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  const { userLocation } = useLocationContext();
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    return localStorage.getItem('roma_mart_selected_location') || 'auto';
  });


  // Calculate nearest location
  const nearestLocationId = useMemo(() => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return null;
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

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


  const handleLocationChange = (e) => {
    const newLocationId = e.target.value;
    setSelectedLocationId(newLocationId);
    
    if (newLocationId === 'auto') {
      localStorage.removeItem('roma_mart_selected_location');
    } else {
      localStorage.setItem('roma_mart_selected_location', newLocationId);
    }
  };





  // Compute currentLocation before rendering (use only one getCurrentLocation definition in this component)
  const getCurrentLocation = () => {
    let location = null;
    if (selectedLocationId === 'auto') {
      if (nearestLocationId) {
        location = LOCATIONS.find(loc => loc.id === nearestLocationId);
      } else {
        location = COMPANY_DATA.location;
      }
    } else {
      location = LOCATIONS.find(loc => loc.id === selectedLocationId);
      if (!location) {
        location = COMPANY_DATA.location;
      }
    }
    if (location) {
      return {
        ...location,
        address: location.address || COMPANY_DATA.hq?.address,
        contact: location.contact || COMPANY_DATA.hq?.contact,
        hours: location.hours || COMPANY_DATA.hq?.hours,
      };
    }
    return COMPANY_DATA.hq;
  };
  const currentLocation = getCurrentLocation();

                  <div className="mt-8 text-sm font-inter" style={{ color: 'var(--color-on-footer)' }}>
                    {/* Prefer currentLocation, fallback to COMPANY_DATA.hq */}
                    <div className="mb-2">
                      <strong>Address:</strong> {currentLocation?.address?.formatted || COMPANY_DATA.hq?.address?.formatted}
                    </div>
                    <div className="mb-2">
                      <strong>Phone:</strong> {currentLocation?.contact?.phone || COMPANY_DATA.hq?.contact?.phone}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {currentLocation?.contact?.email || COMPANY_DATA.hq?.contact?.email}
                    </div>
                    <div className="mb-2">
                      <strong>Hours:</strong> Mon-Fri: {currentLocation?.hours?.weekdays || COMPANY_DATA.hq?.hours?.weekdays}, Sat-Sun: {currentLocation?.hours?.weekends || COMPANY_DATA.hq?.hours?.weekends}
                    </div>
                  </div>

  const isAutoMode = selectedLocationId === 'auto';
  const activeLocations = getActiveLocations();

  const socialHandlers = useMemo(() => {
    const handlers = {};
    SOCIAL_LINKS.forEach(link => {
      handlers[link.label.toLowerCase()] = () => window.dataLayer?.push({ event: 'social_click', platform: link.label.toLowerCase() });
    });
    return handlers;
  }, []);

  return (
      <React.Fragment>
      {/* Persistent floating OrderCTA button for site-wide visibility */}
      <OrderCTA />
      <footer className="pt-16 pb-8" style={{ backgroundColor: 'var(--color-footer)', color: 'var(--color-on-footer)' }}>
        {/* Google Places Reviews Carousel */}
        <div className="mb-8 flex justify-center">
          {import.meta.env.VITE_GOOGLE_PLACES_API_KEY && 
           LOCATIONS[0]?.google?.placeId && 
           circuitBreakers.googlePlaces.shouldAttemptCall() ? (
            <ReactGoogleReviews 
              layout="carousel"
              googlePlaceId={LOCATIONS[0].google.placeId}
              googleAPIKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
              theme="dark"
              carouselAutoplay={true}
              carouselSpeed={5000}
              maxItems={3}
              reviewVariant="card"
              structuredData={true}
              brandName={COMPANY_DATA.name}
            />
          ) : (
            <div className="text-center text-base font-inter text-[var(--color-on-footer-muted)]">
              <span>We value your feedback!&nbsp;</span>
              <a
                href={LOCATIONS[0]?.google?.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                View Google Reviews
              </a>
            </div>
          )}
        </div>
      <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-4 gap-12 mb-12">
        <div className="p-1 col-span-1 md:col-span-2">
           <a 
             href={`${BASE_URL}`}
             className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity cursor-pointer w-fit"
             aria-label="Roma Mart - Go to homepage"
           >
              <Logo layout="horizontal" variant="white" size={40} />
           </a>
           <p className="p-1 font-inter max-w-sm mb-6" style={{ color: 'var(--color-on-footer-muted)' }}>
             Your local one-stop shop for everything from daily groceries to premium café drinks. Proudly serving the Sarnia community.
           </p>
           <div className="flex gap-4 p-1">
             {SOCIAL_LINKS.map(link => {
               const url = COMPANY_DATA.socialLinks[link.label.toLowerCase()];
               if (!url) return null;
               let icon;
               switch (link.icon) {
                 case 'Facebook':
                   icon = faFacebook;
                   break;
                 case 'Instagram':
                   icon = faInstagram;
                   break;
                 case 'TikTok':
                   icon = faTiktok;
                   break;
                 case 'X':
                   icon = faXTwitter;
                   break;
                 case 'Snapchat':
                   icon = faSnapchat;
                   break;
                 default:
                   icon = faFacebook;
               }
               return (
                 <a
                   key={link.label}
                   href={url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                   style={{ backgroundColor: 'var(--color-surface-muted)' }}
                   title={link.label}
                   onClick={socialHandlers[link.label.toLowerCase()]}
                   onMouseEnter={e => e.currentTarget.firstChild.style.color = 'var(--color-accent)'}
                   onMouseLeave={e => e.currentTarget.firstChild.style.color = 'var(--color-on-footer)'}
                 >
                   <FontAwesomeIcon icon={icon} size="lg" style={{ color: 'var(--color-on-footer)' }} />
                 </a>
               );
             })}
           </div>
        </div>

        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
          {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-12"> */}
            <div className="p-1">
              <h4 className="font-heading text-lg mb-6" style={{ color: 'var(--color-on-footer)' }}>Pages</h4>
              <ul className="space-y-3 font-inter" style={{ color: 'var(--color-on-footer-muted)' }}>
                {NAVIGATION_LINKS.filter(link => link.showIn.footer && !['privacy','terms','cookies','accessibility','return-policy'].includes(link.label.toLowerCase())).map(link => (
                  <li key={link.href}>
                    <a
                      href={`${BASE_URL}${link.href.replace('/', '')}`}
                      className="transition-colors"
                      style={{ color: 'var(--color-on-footer-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-footer-muted)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={COMPANY_DATA.onlineStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold transition-colors"
                    style={{ color: 'var(--color-accent)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  >
                    Order Online
                  </a>
                </li>
              </ul>
            </div>
            <div className="p-1">
              <h4 className="font-heading text-lg mb-6" style={{ color: 'var(--color-on-footer)' }}>Legal & Accessibility</h4>
              <ul className="space-y-2 font-inter" style={{ color: 'var(--color-on-footer-muted)' }}>
                {NAVIGATION_LINKS.filter(link => link.showIn.footer && ['privacy','terms','cookies','accessibility','return-policy'].includes(link.label.toLowerCase())).map(link => (
                  <li key={link.href}>
                    <a
                      href={`${BASE_URL}${link.href.replace('/', '')}`}
                      className="transition-colors"
                      style={{ color: 'var(--color-on-footer-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-footer-muted)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`${BASE_URL}ai.txt`}
                    className="transition-colors text-xs"
                    style={{ color: 'var(--color-on-footer-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-footer-muted)'}
                    title="AI Crawler Guidelines"
                  >
                    AI Guidelines
                  </a>
                </li>
              </ul>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
        <div className="mb-8 flex justify-center items-center">
          <TrustpilotWidget />
        </div>

        <div className="mb-8 max-w-md mx-auto">
            <div className="rounded-lg p-4 flex flex-col items-center" style={{ backgroundColor: 'var(--color-footer)', border: '.5px solid var(--color-border)', position: 'relative' }}>
              <label 
                htmlFor="location-selector" 
                className="font-heading text-base mb-2 flex items-center gap-2 justify-center text-center"
                style={{ color: 'var(--color-accent)', fontWeight: 600, width: '100%' }}
              >
                <MapPin className="inline-block" size={18} aria-hidden="true" />
                <span>Your Store Location</span>
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  id="location-selector"
                  value={selectedLocationId}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 rounded-xl font-inter shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent hover:border-accent focus-visible:z-10 border border-[var(--color-border)] pr-10 text-center"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px 0 var(--color-footer-shadow, rgba(21,21,21,0.06))',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    fontSize: '1.08rem',
                    fontWeight: 600,
                    minHeight: '48px',
                    letterSpacing: '0.01em',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  aria-describedby="footer-location-helper"
                >
                  <option value="auto">
                    {isAutoMode && nearestLocationId
                      ? `🎯 Auto-Detected: ${currentLocation.name}`
                      : '🏢 Auto (HQ - Wellington St.)'}
                  </option>
                  {activeLocations.map(loc => (
                    <option 
                      key={loc.id}
                      value={loc.id}
                    >
                      {loc.name} {loc.isPrimary ? '(HQ)' : ''}
                    </option>
                  ))}
                </select>
                {/* Dropdown indicator (chevron) */}
                <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-on-surface-muted)' }}>
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

            <div className="mt-2 text-xs font-inter text-center" style={{ color: 'var(--color-on-footer-subtle)', width: '100%' }}>
              {isAutoMode ? (
                nearestLocationId ? (
                  <span>✓ Nearest store: <strong>{currentLocation.name}</strong></span>
                ) : (
                  <span>Defaulting to headquarters. Enable location for nearest store.</span>
                )
              ) : (
                <span>✓ Selected: <strong>{currentLocation.name}</strong></span>
              )}
              <div className="mt-8 flex justify-center">
                <Button
                  variant="location"
                  aria-label="Detect Nearest Store"
                  onClick={e => {
                    if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                      setSelectedLocationId('auto');
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedLocationId('auto');
                    }
                  }}
                  tabIndex={0}
                >
                  Detect Nearest Store
                </Button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="text-center font-inter text-sm" style={{ color: 'var(--color-on-footer-subtle)' }}>
          <p>&copy; {new Date().getFullYear()} {COMPANY_DATA.legalName} All rights reserved.</p>
          <p>GST#: {COMPANY_DATA.gstNumber}</p>
          <p>🍁</p>
        </div>
      </div>
      {/* Back to Top Button (Best Practice) */}
      <div className="mt-12 flex justify-center mb-10">
        <button
          type="button"
          aria-label="Back to top of page"
          className="px-8 py-4 min-w-[44px] min-h-[44px] rounded-full font-bold font-inter bg-[var(--color-accent)] text-[var(--color-primary)] shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          style={{ outline: '2px solid var(--color-focus)', outlineOffset: '2px', fontSize: '1rem' }}
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          ↑ Back to Top
        </button>
      </div>
    </footer>
    </React.Fragment>
  );
}
