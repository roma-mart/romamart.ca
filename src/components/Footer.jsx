import React, { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import { Logo } from './Logo';
import TrustpilotWidget from './TrustpilotWidget';
import { useLocationContext } from '../hooks/useLocationContext';
import { LOCATIONS, getActiveLocations, getPrimaryLocation } from '../data/locations';

const BRAND = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)'
};

const STORE_DATA = {
  legalName: "Roma Mart Corp.",
  onlineStoreUrl: "https://nrsplus.com/orders/your-store-link",
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
    <footer className="text-white pt-16 pb-8" style={{ backgroundColor: BRAND.primary }}>
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
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="Facebook"
                onClick={socialHandlers.facebook}
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="Instagram"
                onClick={socialHandlers.instagram}
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="TikTok"
                onClick={socialHandlers.tiktok}
              >
                <FontAwesomeIcon icon={faTiktok} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.x} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="X (Twitter)"
                onClick={socialHandlers.x}
              >
                <FontAwesomeIcon icon={faXTwitter} size="lg" style={{ color: BRAND.accent }} />
              </a>
              <a 
                href={STORE_DATA.socialLinks.snapchat} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                title="Snapchat"
                onClick={socialHandlers.snapchat}
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
        <div className="mb-8">
          <TrustpilotWidget />
        </div>

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
              <option value="auto" style={{ backgroundColor: BRAND.primary, color: 'white' }}>
                {isAutoMode && nearestLocationId
                  ? `🎯 Auto-Detected: ${currentLocation.name}`
                  : '🏢 Auto (HQ - Wellington St.)'}
              </option>
              {activeLocations.map(loc => (
                <option 
                  key={loc.id}
                  value={loc.id}
                  style={{ backgroundColor: BRAND.primary, color: 'white' }}
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
}
