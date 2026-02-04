import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import StandardizedItem from '../components/StandardizedItem';
import { SERVICES } from '../data/services.jsx';
import COMPANY_DATA from '../config/company_data';

const ServicesPage = () => {
  const COLORS = {
    navy: 'var(--color-primary)',
    yellow: 'var(--color-accent)',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  // Sort services by availability, then alphabetically
  const availabilityOrder = {
    'available': 0,
    'available_but_closed': 1,
    'coming_soon': 2,
    'unavailable': 3
  };
  const sortedServices = [...SERVICES].sort((a, b) => {
    const availA = availabilityOrder[a.status] ?? 99;
    const availB = availabilityOrder[b.status] ?? 99;
    if (availA !== availB) return availA - availB;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-surface)' }}>
      <Helmet>
        <title>Our Services | Roma Mart Convenience</title>
        <meta name="description" content="Roma Mart offers ATM, Bitcoin ATM, printing, package services, halal meat, money transfer, gift cards, perfumes, tobacco products, and more in Sarnia, Ontario." />
        <link rel="canonical" href="https://romamart.ca/services" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a
              href={`${BASE_URL}`}
              style={{ color: 'var(--color-accent)', opacity: 0.7 }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-accent-hover)'}
              onFocus={e => e.currentTarget.style.color = 'var(--color-accent-hover)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-accent)'}
              onBlur={e => e.currentTarget.style.color = 'var(--color-accent)'}
            >
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={{ color: 'var(--color-accent)', opacity: 0.7 }} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Services</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 
              className="text-4xl md:text-5xl var(--font-heading) uppercase mb-4"
              style={{ color: 'var(--color-heading)' }}
            >
              Our <span style={{ color: 'var(--color-accent)' }}>Services</span>
            </h1>
            <p className="text-lg font-inter leading-relaxed max-w-3xl" style={textColor}>
              Roma Mart is your one-stop convenience store offering a wide range of services to make your life easier. 
              From financial services to everyday essentials, we've got you covered.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ShareButton 
              title="Roma Mart Services"
              text="Check out all the amazing services at Roma Mart in Sarnia!"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
              onFocus={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
              onBlur={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {sortedServices.map((service, index) => (
            <StandardizedItem
              key={service.id}
              item={{
                id: service.id,
                name: service.name,
                tagline: service.tagline,
                description: service.description,
                icon: service.icon,
                badge: service.badge,
                features: service.features,
                action: service.action,
                status: service.status,
                availableAt: service.availableAt,
                availability: service.availability,
                ageRestricted: service.ageRestricted,
                legalNotice: service.legalNotice
              }}
              defaultExpanded={index === 0}
              variant="service"
            />
          ))}
        </div>
      </section>

      {/* Compliance Notice with SFOA Signage - Keep existing */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
          <h3 className="var(--font-heading) text-2xl mb-6" style={{ color: 'var(--color-heading)' }}>Age-Restricted Products Compliance</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Tobacco/Vape Section */}
            <div>
              <h4 className="var(--font-heading) font-bold text-lg mb-3" style={{ color: 'var(--color-heading)' }}>Tobacco & Vapour Products</h4>
              <div className="p-4 rounded-lg border-2 mb-4" style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error)' }}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🚭</div>
                  <div className="text-sm font-inter" style={{ color: 'var(--color-error-dark)' }}>
                    <p className="font-bold mb-2">It is illegal to sell or supply tobacco or e-cigarettes to anyone under 19 years of age.</p>
                    <p className="text-xs">Government I.D. with a photo and birth date must be shown when requested.</p>
                  </div>
                </div>
              </div>
              <p className="text-xs font-inter" style={mutedTextColor}>
                Required signage displayed in-store per <a
                  href="https://www.ontario.ca/page/rules-selling-tobacco-and-vapour-products"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-accent)' }}
                  className="hover:underline"
                  onMouseOver={e => e.currentTarget.style.color = 'rgba(228, 179, 64, 0.85)'}
                  onFocus={e => e.currentTarget.style.color = 'rgba(228, 179, 64, 0.85)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onBlur={e => e.currentTarget.style.color = 'var(--color-accent)'}
                >Smoke-Free Ontario Act, 2017</a>
              </p>
            </div>

            {/* Lottery Section */}
            <div>
              <h4 className="var(--font-heading) font-bold text-lg mb-3" style={{ color: 'var(--color-heading)' }}>Lottery Products</h4>
              <div className="p-4 rounded-lg border-2 mb-4" style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: COLORS.yellow }}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🎫</div>
                  <div className="text-sm font-inter" style={{ color: 'var(--color-warning)' }}>
                    <p className="font-bold mb-2">Must be 19 or older to purchase lottery tickets in Ontario.</p>
                    <p className="text-xs">Photo identification required. Play responsibly.</p>
                  </div>
                </div>
              </div>
              <p className="text-xs font-inter" style={mutedTextColor}>
                Regulated by <a
                  href="https://www.olg.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-accent)' }}
                  className="hover:underline"
                  onMouseOver={e => e.currentTarget.style.color = 'rgba(228, 179, 64, 0.85)'}
                  onFocus={e => e.currentTarget.style.color = 'rgba(228, 179, 64, 0.85)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onBlur={e => e.currentTarget.style.color = 'var(--color-accent)'}
                >Ontario Lottery and Gaming Corporation (OLG)</a>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs font-inter italic" style={mutedTextColor}>
              Roma Mart is committed to responsible retailing and strict compliance with all Ontario regulations. 
              We reserve the right to refuse service to anyone who cannot provide valid identification. 
              All required regulatory signage is prominently displayed in-store.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h2 className="text-3xl md:text-4xl var(--font-heading) uppercase mb-4" style={{ color: 'var(--color-text-on-primary)' }}>
            Visit Us Today
          </h2>
          <p className="font-inter text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-on-primary)', opacity: 0.9 }}>
            Experience the convenience of all our services under one roof. Our friendly staff is ready to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE_URL}locations`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-all shadow-lg"
              style={{ WebkitTapHighlightColor: 'transparent', transform: 'translateZ(0)', backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) translateZ(0)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateZ(0)'}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(228, 179, 64, 0.85)'}
              onFocus={e => e.currentTarget.style.backgroundColor = 'rgba(228, 179, 64, 0.85)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
              onBlur={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
            >
              Get Directions
            </a>
            <a
              href={`${BASE_URL}contact`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 border-2"
              style={{ borderColor: 'var(--color-accent)', color: 'var(--color-text-on-primary)', backgroundColor: 'transparent' }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
