import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, Clock, Phone, ExternalLink, Building2 } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import CopyButton from '../components/CopyButton';
import Button from '../components/Button';
import { getActiveLocations, getLocationsByDistance, formatDistance } from '../data/locations';
import COMPANY_DATA from '../config/company_data';

const LocationsPage = () => {


  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const [sortedLocations, setSortedLocations] = useState(() => {
    // Default sort: HQ first, then rest
    const locs = getActiveLocations();
    return locs.sort((a, b) => {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      return 0;
    });
  });

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
    distanceText: loc.distance ? formatDistance(loc.distance) : null
  }));

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
            <a href={`${BASE_URL}`} className="hover:text-yellow-500 transition-colors" style={mutedTextColor}>Home</a>
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
                border: location.isPrimary ? '3px solid var(--color-accent)' : 'none',
                borderRadius: '1rem',
                padding: location.isPrimary ? '0.5rem' : '0'
              }}
            >
              <div className="p-8 rounded-2xl" style={{ backgroundColor: 'var(--color-surface)' }}>
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

                  <div className="flex gap-4">
                    <Clock size={24} style={{ color: 'var(--color-icon)' }} className="flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1" style={textColor}>Hours</h3>
                      <p className="font-inter" style={mutedTextColor}>Mon-Fri: {location.hours.weekdays}</p>
                      <p className="font-inter" style={mutedTextColor}>Sat-Sun: {location.hours.weekends}</p>
                    </div>
                  </div>

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

              <div className="rounded-3xl overflow-hidden shadow-2xl h-96">
                <iframe 
                  title={`Google Maps - ${location.name}`}
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:ChIJCfo3t6SdJYgRIQVbpCppKmY&zoom=15"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
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
