import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Heart, Users, Award, MapPin } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import StructuredData from '../components/StructuredData';
import COMPANY_DATA from '../config/company_data';
import { getAssetUrl } from "../utils/getAssetUrl";
import { buildBreadcrumbArray } from '../schemas/breadcrumbSchema';

const AboutPage = () => {

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text-muted)' };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  // Hero images carousel
  
  const heroImages = useMemo(() => [
    getAssetUrl('/images/romamart-opening1.png'),
    getAssetUrl('/images/romamart-interior1.png'),
    getAssetUrl('/images/romamart-interior3.jpg'),
    getAssetUrl('/images/romamart-opening2.png'),
    getAssetUrl('/images/romamart-opening3.png'),
  ], []);
  

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isCarouselPaused = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      if (!isCarouselPaused.current) {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSelectImage = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  const heroImageHandlers = useMemo(() => {
    return heroImages.map((_, idx) => () => handleSelectImage(idx));
  }, [heroImages, handleSelectImage]);

  const team = [
    {
      name: 'Mohammed Osman Khan',
      role: 'Owner/GM',
      image: getAssetUrl('/images/id-mohammedosmankhan.png'),
      bio: 'Founder and owner of Roma Mart Corp., dedicated to serving the community with quality products and exceptional service.'
    },
    {
      name: 'Rumana Mohammadi',
      role: 'RoCafé Manager',
      image: getAssetUrl('/images/id-rumanamohammadi.png'),
      bio: 'Mother, wife, and heart of Roma Mart, ensuring every customer feels at home.'
    },
    {
      name: 'Faizan Osman Khan',
      role: 'Management',
      image: getAssetUrl('/images/id-faizanosmankhan.png'),
      bio: 'Dedicated son and team member, passionate about delivering excellent service and supporting our community.'
    },
    {
      name: 'Raaida Malak Khan',
      role: 'Social Media Manager',
      image: getAssetUrl('/images/id-raaidamkhan.png'),
      bio: 'Social media manager and community liaison, connecting Roma Mart with our valued customers online and offline.'
    },
    {
      name: 'Adyan Osman Khan',
      role: 'Team Member',
      image: getAssetUrl('/images/id-adyanosmankhan.png'),
      bio: 'Youngest member of the Roma Mart family, bringing fresh ideas and enthusiasm to our team.'
    }
  ];

  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Community First',
      description: 'We are committed to serving our local community with integrity and care.'
    },
    {
      icon: <Award size={32} />,
      title: 'Quality Products',
      description: 'We source the best products to ensure customer satisfaction every time.'
    },
    {
      icon: <Users size={32} />,
      title: 'Customer Service',
      description: 'Our friendly staff is always ready to assist you with a smile.'
    },
    {
      icon: <MapPin size={32} />,
      title: 'Local Focus',
      description: 'Dedicated to serving Sarnia and the surrounding areas for many years to come.'
    }
  ];

  // --- Team Section Scroll State ---
  const teamScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scrollability and update chevron visibility
  const updateTeamScrollButtons = useCallback(() => {
    const el = teamScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8); // allow for rounding
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = teamScrollRef.current;
    if (!el) return;
    updateTeamScrollButtons();
    el.addEventListener('scroll', updateTeamScrollButtons);
    window.addEventListener('resize', updateTeamScrollButtons);
    // On mount, check after a tick (for images)
    setTimeout(updateTeamScrollButtons, 200);
    return () => {
      el.removeEventListener('scroll', updateTeamScrollButtons);
      window.removeEventListener('resize', updateTeamScrollButtons);
    };
  }, [updateTeamScrollButtons]);
  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <StructuredData type="Organization" />
      <Helmet>
        <title>About Us | Roma Mart Convenience</title>
        <meta name="description" content="Learn about Roma Mart's story, mission, and the team dedicated to serving the Sarnia community with quality products and exceptional service." />
        <link rel="canonical" href="https://romamart.ca/about" />
      </Helmet>

      {/* Breadcrumb Schema */}
      <StructuredData type="BreadcrumbList" data={{ breadcrumbs: buildBreadcrumbArray('About', 'https://romamart.ca/about') }} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a
              href={`${BASE_URL}`}
              className="hover:text-accent transition-colors"
              style={mutedTextColor}
            >
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>About Us</li>
        </ol>
      </nav>

      {/* Hero Section with Rotating Images */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 
              className="text-4xl md:text-5xl uppercase mb-6"
              style={{ color: 'var(--color-heading)' }}
            >
              About <span style={{ color: 'var(--color-accent)' }}>Roma Mart</span>
            </h1>
            <p className="text-lg font-inter leading-relaxed mb-6" style={textColor}>
              Roma Mart is your trusted neighborhood convenience store, proudly serving the Sarnia community. 
              We're more than just a store – we're your local partners in convenience, quality, and service.
            </p>
            <p className="text-lg font-inter leading-relaxed mb-6" style={mutedTextColor}>
              From our fresh RoCafé offerings to our comprehensive range of services, we strive to be your 
              one-stop destination for everything you need, delivered with a smile.
            </p>
            <ShareButton 
              title="About Roma Mart"
              text="Learn about Roma Mart - your trusted convenience store in Sarnia!"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)', transition: 'background-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
            />
          </div>

          {/* Image Carousel */}
          <div
            className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
            onMouseEnter={() => { isCarouselPaused.current = true; }}
            onMouseLeave={() => { isCarouselPaused.current = false; }}
            onFocus={() => { isCarouselPaused.current = true; }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                isCarouselPaused.current = false;
              }
            }}
          >
            {/* Left/Right Scroll Buttons for Carousel */}
            {heroImages.length > 1 && currentImageIndex > 0 && (
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              >
                <ChevronRight size={28} style={{ transform: 'rotate(180deg)', color: 'var(--color-accent)' }} />
              </button>
            )}
            {heroImages.length > 1 && currentImageIndex < heroImages.length - 1 && (
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
              >
                <ChevronRight size={28} style={{ color: 'var(--color-accent)' }} />
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-transparent to-transparent opacity-40 z-10" />
            {heroImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={(() => {
                  if (image.includes('opening1')) return 'Roma Mart store front, opening day';
                  if (image.includes('interior1')) return 'Roma Mart store interior, counter';
                  if (image.includes('interior3')) return 'RoCafe area inside Roma Mart';
                  return 'Roma Mart image';
                })()}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            ))}
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroImages.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={heroImageHandlers[index]}
                  className={`w-2 h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    index === currentImageIndex ? 'w-8' : 'w-2'
                  }`}
                  style={{ backgroundColor: index === currentImageIndex ? 'var(--color-accent)' : 'var(--color-surface)', outline: '2px solid var(--color-focus)', outlineOffset: '2px' }}
                  aria-label={`View image ${index + 1}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { heroImageHandlers[index](); } }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl md:text-4xl uppercase text-center mb-12"
          style={{ color: 'var(--color-heading)' }}
        >
          Our <span style={{ color: 'var(--color-accent)' }}>Values</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl text-center hover:shadow-lg transition-shadow"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-accent-bg)', color: 'var(--color-icon)' }}
              >
                {value.icon}
              </div>
              <h3 className="text-heading text-xl mb-3" style={{ color: 'var(--color-heading)' }}>
                {value.title}
              </h3>
              <p className="font-inter text-sm leading-relaxed" style={mutedTextColor}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl md:text-4xl uppercase text-center mb-12"
          style={{ color: 'var(--color-heading)' }}
        >
          Meet Our <span style={{ color: 'var(--color-accent)' }}>Team</span>
        </h2>

        <div className="relative">
          {/* Scroll Buttons (conditionally visible) */}
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:hidden"
              onClick={() => {
                const el = teamScrollRef.current;
                if (el) el.scrollBy({ left: -window.innerWidth * 0.7, behavior: 'smooth' });
              }}
            >
              <ChevronRight size={28} style={{ transform: 'rotate(180deg)', color: 'var(--color-accent)' }} />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:hidden"
              onClick={() => {
                const el = teamScrollRef.current;
                if (el) el.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
              }}
            >
              <ChevronRight size={28} style={{ color: 'var(--color-accent)' }} />
            </button>
          )}
          <div
            ref={teamScrollRef}
            id="team-scroll-container"
            className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-x-visible md:mx-0 md:px-0 lg:grid-cols-5"
            role="region"
            aria-label="Meet our team"
          >
            {team.map((member, index) => (
              <div
                key={index}
                className="min-w-[80vw] max-w-xs md:min-w-0 md:max-w-sm p-8 rounded-2xl text-center hover:shadow-xl transition-shadow flex-shrink-0 md:flex-shrink md:w-auto"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {/* Circular headshot */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-6 overflow-hidden border-4 shadow-lg" style={{ borderColor: 'var(--color-accent)' }}>
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                </div>
                <h3 className="text-heading text-2xl mb-2" style={{ color: 'var(--color-heading)' }}>
                  {member.name}
                </h3>
                <p className="text-sm font-inter font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>
                  {member.role}
                </p>
                <p className="font-inter leading-relaxed" style={mutedTextColor}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h2 className="text-3xl md:text-4xl uppercase mb-4" style={{ color: 'var(--color-text-on-primary)' }}>
            Visit Us Today
          </h2>
          <p className="font-inter text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-on-primary)', opacity: 0.9 }}>
            Come experience the Roma Mart difference. We're here to serve you with a smile!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE_URL}locations`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', outline: '2px solid var(--color-focus)', outlineOffset: '2px' }}
              tabIndex={0}
            >
              Get Directions
            </a>
            <a
              href={`${BASE_URL}contact`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 border-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-on-primary)', outline: '2px solid var(--color-focus)', outlineOffset: '2px' }}
              tabIndex={0}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
