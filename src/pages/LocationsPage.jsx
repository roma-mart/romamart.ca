import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, Phone, ExternalLink, Building2 } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import Button from '../components/Button';
import { getActiveLocations, formatDistance, getPreferredLocations } from '../data/locations';
import LocationImageCarousel from '../components/LocationImageCarousel';
import LiveHoursDisplay from '../components/LiveHoursDisplay';
import { useAutoLocation } from '../hooks/useAutoLocation';

const LocationsPage = () => {
  const [loadedMaps, setLoadedMaps] = useState(() => new Set());
  const [userCoords, setUserCoords] = useState(null);


  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const handleAutoLocation = useCallback((pos) => {
    const coords = pos?.coords;
    if (coords?.latitude && coords?.longitude) {
      setUserCoords({ latitude: coords.latitude, longitude: coords.longitude });
    }
  }, []);

  useAutoLocation(handleAutoLocation);

  const sortedLocations = getPreferredLocations({
    userCoords,
    locations: getActiveLocations()
  });
  const preferredLocationId = sortedLocations[0]?.id;

  const locations = sortedLocations.map(loc => ({
    ...loc,
    id: loc.id,
    name: loc.name,
    address: loc.address.formatted,
    phone: loc.contact.phone,
    hours: loc.hours,
    isOpen: loc.status === 'open',
    mapUrl: loc.google.embedUrl,
    features: loc.services.map(s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
    distanceText: Number.isFinite(loc.distance) ? formatDistance(loc.distance) : null
  }));

  const handleLoadMap = (locationId) => {
    setLoadedMaps(prev => {
      const next = new Set(prev);
      next.add(locationId);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>Our Locations | Roma Mart Convenience</title>
        <meta name="description" content="Find Roma Mart convenience store locations in Sarnia, Ontario. Get directions, hours, and contact information." />
        <link rel="canonical" href="https://romamart.ca/locations" />
      </Helmet>

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a href={`${BASE_URL}`} className="hover:text-accent transition-colors" style={mutedTextColor}>Home</a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Locations</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-heading)' }}>
              Our <span style={{ color: 'var(--color-accent)' }}>Locations</span>
            </h1>
            <p className="text-lg font-inter leading-relaxed max-w-3xl" style={textColor}>
              Visit us at any of our convenient locations. We're here to serve you with quality products and exceptional service.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ShareButton 
              title="Roma Mart Locations"
              text="Find Roma Mart convenience stores near you in Sarnia!"
              className="bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[color-mix(in srgb, var(--color-accent) 85%, transparent)]"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="space-y-12">
          {locations.map((location) => (
            <div 
              key={location.id}
              id={`location-${location.id}`}
              className="grid lg:grid-cols-2 gap-8"
              style={{
                border: location.id === preferredLocationId ? '3px solid var(--color-accent)' : 'none',
                borderRadius: '1rem',
                padding: location.id === preferredLocationId ? '0.5rem' : '0'
              }}
            >
              {/* Info column (always first on mobile, left on desktop) */}
              <div className="p-8 rounded-2xl flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
                {/* Location Images */}
                <div className="flex gap-4 mb-6 items-center">
                  {location.photos?.primary && (
                    <img
                      src={location.photos.primary}
                      alt={`${location.name} exterior`}
                      className="rounded-2xl w-40 h-32 object-cover shadow-lg"
                      loading="lazy"
                      aria-hidden={location.photos.thumbnail ? "true" : "false"}
                    />
                  )}
                  {location.photos?.thumbnail && (
                    <img
                      src={location.photos.thumbnail}
                      alt={`${location.name} thumbnail`}
                      className="rounded-xl w-20 h-20 object-cover border-2 border-[var(--color-accent)] shadow"
                      loading="lazy"
                    />
                  )}
                </div>
                {/* HQ Badge + Distance */}
                {(location.isPrimary || location.distanceText) && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {location.isPrimary && (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                      >
                        <Building2 size={14} />
                        HEADQUARTERS
                      </span>
                    )}
                    {location.distanceText && (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                      >
                        <MapPin size={14} />
                        {location.distanceText}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl var(--font-heading)" style={{ color: 'var(--color-heading)' }}>
                    {location.name}
                  </h2>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: location.isOpen ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                      color: location.isOpen ? 'var(--color-success)' : 'var(--color-error)'
                    }}
                  >
                    {location.isOpen ? 'Open Now' : 'Closed'}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin size={24} style={{ color: 'var(--color-icon)' }} className="flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold mb-1" style={textColor}>Address</h3>
                      <p className="font-inter mb-2" style={mutedTextColor}>{location.address}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-inter text-sm font-semibold hover:underline"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          Get Directions <ExternalLink size={14} />
                        </a>
                        <CopyButton 
                          text={location.address}
                          label="Address"
                          className="text-xs"
                          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                        />
                      </div>
                    </div>
                  </div>

                  <LiveHoursDisplay 
                    placeId={location.google.placeId}
                    fallbackHours={{
                      weekdays: location.hours.weekdays,
                      weekends: location.hours.weekends
                    }}
                    showStatus={true}
                  />

                  <div className="flex gap-4">
                    <Phone size={24} style={{ color: 'var(--color-icon)' }} className="flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold mb-1" style={textColor}>Phone</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <a href={`tel:${location.phone}`} className="font-inter hover:underline" style={{ color: 'var(--color-accent)' }}>
                          {location.phone}
                        </a>
                      <CopyButton 
                        text={location.phone}
                        label="Phone number"
                        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                      />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-3" style={textColor}>Available Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-sm font-inter font-semibold"
                          style={{ backgroundColor: 'rgba(228, 179, 64, 0.15)', color: 'var(--color-text)' }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: Carousel above Map on desktop, stacked on mobile */}
              <div className="flex flex-col rounded-3xl overflow-hidden shadow-2xl">
                {/* Carousel and map now share the same height and border radius handling */}
                <div className="w-full aspect-[4/3] min-h-[18rem] max-h-[28rem] order-1">
                  <LocationImageCarousel photos={location.photos} locationName={location.name} />
                </div>
                <div className="w-full aspect-[4/3] min-h-[18rem] max-h-[28rem] order-2">
                  {location.id === preferredLocationId ? (
                    location.mapUrl && loadedMaps.has(location.id) ? (
                      <iframe 
                        title={`Google Maps - ${location.name}`}
                        src={location.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6"
                        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                      >
                        <p className="font-inter text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {location.mapUrl
                            ? 'Load the interactive map to view directions and details.'
                            : 'Open this location in Google Maps for directions.'}
                        </p>
                        {location.mapUrl ? (
                          <button
                            type="button"
                            onClick={() => handleLoadMap(location.id)}
                            className="px-4 py-2 rounded-full text-sm font-semibold"
                            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                            aria-label={`Load interactive map for ${location.name}`}
                          >
                            Load Map
                          </button>
                        ) : null}
                        <a
                          href={location.google.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold hover:underline"
                          style={{ color: 'var(--color-accent)' }}
                          aria-label={`Open ${location.name} in Google Maps`}
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    )
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6"
                      style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    >
                      <p className="font-inter text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Open this location in Google Maps for directions.
                      </p>
                      <a
                        href={location.google.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full text-sm font-semibold"
                        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                      >
                        Open Map
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h2 className="text-3xl md:text-4xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-text-on-primary)' }}>
            Visit Us Today
          </h2>
          <p className="font-inter text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-on-primary)', opacity: 0.9 }}>
            Stop by any of our locations for quality products and friendly service!
          </p>
          <Button
            href={`${BASE_URL}contact`}
            variant="navlink"
            style={{ minWidth: 180 }}
            analyticsEvent="locations_contact_us"
          >
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;
