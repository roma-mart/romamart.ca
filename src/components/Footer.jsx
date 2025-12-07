import React, { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import { getOrderingUrl } from '../config/ordering';
import { Logo } from './Logo';
import TrustpilotWidget from './TrustpilotWidget';
import { useLocationContext } from '../hooks/useLocationContext';
import { LOCATIONS, getActiveLocations, getPrimaryLocation } from '../data/locations';



const STORE_DATA = {
  legalName: "Roma Mart Corp.",
  onlineStoreUrl: getOrderingUrl(),
  socialLinks: {
    facebook: "https://www.facebook.com/romamartca",
    instagram: "https://www.instagram.com/romamartca/",
    tiktok: "https://www.tiktok.com/@romamartca/",
    snapchat: "https://www.snapchat.com/@romamartca/",
    x: "https://www.x.com/romamartca/"
  }
};

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

  const getCurrentLocation = () => {
    if (selectedLocationId === 'auto') {
      return nearestLocationId 
        ? LOCATIONS.find(loc => loc.id === nearestLocationId)
        : getPrimaryLocation();
    } else {
      return LOCATIONS.find(loc => loc.id === selectedLocationId) || getPrimaryLocation();
    }
  };

  const currentLocation = getCurrentLocation();
  const isAutoMode = selectedLocationId === 'auto';
  const activeLocations = getActiveLocations();

  const socialHandlers = useMemo(() => ({
    facebook: () => window.dataLayer?.push({ event: 'social_click', platform: 'facebook' }),
    instagram: () => window.dataLayer?.push({ event: 'social_click', platform: 'instagram' }),
    tiktok: () => window.dataLayer?.push({ event: 'social_click', platform: 'tiktok' }),
    x: () => window.dataLayer?.push({ event: 'social_click', platform: 'x' }),
    snapchat: () => window.dataLayer?.push({ event: 'social_click', platform: 'snapchat' })
  }), []);

  return (
    <footer className="pt-16 pb-8" style={{ backgroundColor: 'var(--color-footer)', color: 'var(--color-on-footer)' }}>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
           <a 
             href={`${BASE_URL}`}
             className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity cursor-pointer w-fit"
             aria-label="Roma Mart - Go to homepage"
           >
              <Logo />
           </a>
           <p className="font-inter max-w-sm mb-6" style={{ color: 'var(--color-on-footer-muted)' }}>
             Your local one-stop shop for everything from daily groceries to premium café drinks. Proudly serving the Sarnia community.
           </p>
           <div className="flex gap-4">
              <a 
                href={STORE_DATA.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{ backgroundColor: 'var(--color-surface-muted)' }}
                title="Facebook"
                onClick={socialHandlers.facebook}
                onMouseEnter={e => e.currentTarget.firstChild.style.color = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.firstChild.style.color = 'var(--color-on-footer)'}
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" style={{ color: 'var(--color-on-footer)' }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{ backgroundColor: 'var(--color-surface-muted)' }}
                title="Instagram"
                onClick={socialHandlers.instagram}
                onMouseEnter={e => e.currentTarget.firstChild.style.color = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.firstChild.style.color = 'var(--color-on-footer)'}
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: 'var(--color-on-footer)' }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{ backgroundColor: 'var(--color-surface-muted)' }}
                title="TikTok"
                onClick={socialHandlers.tiktok}
                onMouseEnter={e => e.currentTarget.firstChild.style.color = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.firstChild.style.color = 'var(--color-on-footer)'}
              >
                <FontAwesomeIcon icon={faTiktok} size="lg" style={{ color: 'var(--color-on-footer)' }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.x} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{ backgroundColor: 'var(--color-surface-muted)' }}
                title="X (Twitter)"
                onClick={socialHandlers.x}
                onMouseEnter={e => e.currentTarget.firstChild.style.color = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.firstChild.style.color = 'var(--color-on-footer)'}
              >
                <FontAwesomeIcon icon={faXTwitter} size="lg" style={{ color: 'var(--color-on-footer)' }} />
              </a>
                <a 
                  href={STORE_DATA.socialLinks.snapchat} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  style={{ backgroundColor: 'var(--color-surface-muted)' }}
                  title="Snapchat"
                  onClick={socialHandlers.snapchat}
                  onMouseEnter={e => e.currentTarget.firstChild.style.color = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.firstChild.style.color = 'var(--color-on-footer)'}
                >
                  <FontAwesomeIcon icon={faSnapchat} size="lg" style={{ color: 'var(--color-on-footer)' }} />
                </a>
           </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-heading text-lg mb-6" style={{ color: 'var(--color-on-footer)' }}>Pages</h4>
              <ul className="space-y-3 font-inter" style={{ color: 'var(--color-on-footer-muted)' }}>
                <li><a href={`${BASE_URL}services`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>Services</a></li>
                <li><a href={`${BASE_URL}rocafe`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>RoCafé Menu</a></li>
                <li><a href={`${BASE_URL}locations`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>Locations</a></li>
                <li><a href={`${BASE_URL}contact`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>Contact</a></li>
                <li><a href={`${BASE_URL}about`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>About Us</a></li>
                <li><a href={STORE_DATA.onlineStoreUrl} target="_blank" rel="noopener noreferrer" className="font-bold transition-colors" style={{ color: 'var(--color-accent)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-accent)'}>Order Online</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-6" style={{ color: 'var(--color-on-footer)' }}>Legal & Accessibility</h4>
              <ul className="space-y-2 font-inter" style={{ color: 'var(--color-on-footer-muted)' }}>
                <li><a href={`${BASE_URL}privacy`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>Privacy Policy</a></li>
                <li><a href={`${BASE_URL}terms`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>Terms of Service</a></li>
                <li><a href={`${BASE_URL}cookies`} className="transition-colors" style={{ color: 'var(--color-link)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-link)'}>Cookie Policy</a></li>
                <li><a href={`${BASE_URL}accessibility`} className="font-bold transition-colors" style={{ color: 'var(--color-accent)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-accent)'}>Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
        <div className="mb-8 flex justify-center items-center">
          <TrustpilotWidget />
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-footer)', border: '.5px solid var(--color-border)' }}>
            <label 
              htmlFor="location-selector" 
              className="block font-heading text-sm mb-3"
              style={{ color: 'var(--color-accent)' }}
            >
              <MapPin className="inline-block mr-2" size={16} />
              Your Current Store
            </label>
            
            <select
              id="location-selector"
              value={selectedLocationId}
              onChange={handleLocationChange}
              className="w-full px-4 py-3 rounded-lg font-inter transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              style={{ backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)', cursor: 'pointer' }}
            >
              <option value="auto" style={{ backgroundColor: 'var(--color-footer)', color: 'var(--color-on-footer)' }}>
                {isAutoMode && nearestLocationId
                  ? `🎯 Auto-Detected: ${currentLocation.name}`
                  : '🏢 Auto (HQ - Wellington St.)'}
              </option>
              {activeLocations.map(loc => (
                <option 
                  key={loc.id}
                  value={loc.id}
                  style={{ backgroundColor: 'var(--color-footer)', color: 'var(--color-on-footer)' }}
                >
                  {loc.name} {loc.isPrimary ? '(HQ)' : ''}
                </option>
              ))}
            </select>

            <div className="mt-3 text-xs font-inter" style={{ color: 'var(--color-on-footer-subtle)' }}>
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

        <div className="text-center font-inter text-sm" style={{ color: 'var(--color-on-footer-subtle)' }}>
          <p>&copy; {new Date().getFullYear()} {STORE_DATA.legalName} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
