import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, Clock, Phone, ExternalLink } from 'lucide-react';

const LocationsPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const locations = [
    {
      id: 1,
      name: 'Roma Mart Wellington',
      address: '189-3 Wellington Street, Sarnia, ON N7T 1G6',
      phone: '+1 (382) 342-2000',
      hours: {
        weekdays: '7:00 AM - 11:00 PM',
        weekends: '8:00 AM - 11:00 PM'
      },
      isOpen: true,
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2938.868770732483!2d-82.40458892398539!3d42.97038897114251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8825838570075305%3A0x6641775e744d0810!2s189%20Wellington%20St%2C%20Sarnia%2C%20ON%20N7T%201G6%2C%20Canada!5e0!3m2!1sen!2sus!4v1709669042595!5m2!1sen!2sus',
      features: ['ATM', 'Bitcoin ATM', 'RoCafé', 'Halal Meat', 'Package Services']
    }
  ];

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
        <h1 className="text-4xl md:text-5xl font-coco uppercase mb-6" style={{ color: 'var(--color-heading)' }}>
          Our <span style={{ color: COLORS.yellow }}>Locations</span>
        </h1>
        <p className="text-lg font-inter leading-relaxed max-w-3xl" style={textColor}>
          Visit us at any of our convenient locations. We're here to serve you with quality products and exceptional service.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="space-y-12">
          {locations.map((location) => (
            <div key={location.id} className="grid lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-coco" style={{ color: 'var(--color-heading)' }}>
                    {location.name}
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${location.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {location.isOpen ? 'Open Now' : 'Closed'}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin size={24} style={{ color: 'var(--color-icon)' }} className="flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1" style={textColor}>Address</h3>
                      <p className="font-inter" style={mutedTextColor}>{location.address}</p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 font-inter text-sm font-semibold hover:underline"
                        style={{ color: COLORS.yellow }}
                      >
                        Get Directions <ExternalLink size={14} />
                      </a>
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
                    <div>
                      <h3 className="font-bold mb-1" style={textColor}>Phone</h3>
                      <a href={`tel:${location.phone}`} className="font-inter hover:underline" style={{ color: COLORS.yellow }}>
                        {location.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-3" style={textColor}>Available Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-full text-sm font-inter font-semibold"
                          style={{ backgroundColor: COLORS.yellow + '20', color: 'var(--color-text)' }}
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
                  src={location.mapUrl}
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
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: COLORS.navy }}>
          <h2 className="text-3xl md:text-4xl font-coco uppercase text-white mb-4">
            Visit Us Today
          </h2>
          <p className="text-white/90 font-inter text-lg mb-8 max-w-2xl mx-auto">
            Stop by any of our locations for quality products and friendly service!
          </p>
          <a
            href={`${BASE_URL}#contact`}
            className="inline-block px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;
