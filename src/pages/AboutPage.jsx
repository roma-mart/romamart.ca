import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Heart, Users, Award, MapPin } from 'lucide-react';
import ShareButton from '../components/ShareButton';

const AboutPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  // Hero images carousel
  const heroImages = [
    '/images/store-front.jpg',
    '/images/store-interior.jpg',
    '/images/team.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const team = [
    {
      name: 'Mohammed Osman Khan',
      role: 'Owner',
      image: '/images/team/mohammed-khan.jpg',
      bio: 'Founder and owner of Roma Mart, dedicated to serving the Sarnia community with quality products and exceptional service.'
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
      description: 'Proudly serving Sarnia and the surrounding areas for years.'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Helmet>
        <title>About Us | Roma Mart Convenience</title>
        <meta name="description" content="Learn about Roma Mart's story, mission, and the team dedicated to serving the Sarnia community with quality products and exceptional service." />
        <link rel="canonical" href="https://romamart.ca/about" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 mb-8">
        <ol className="flex items-center gap-2 text-sm font-inter">
          <li>
            <a 
              href={`${BASE_URL}`} 
              className="hover:text-yellow-500 transition-colors"
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
              className="text-4xl md:text-5xl font-coco uppercase mb-6"
              style={{ color: 'var(--color-heading)' }}
            >
              About <span style={{ color: COLORS.yellow }}>Roma Mart</span>
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
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            />
          </div>

          {/* Image Carousel */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-transparent to-transparent opacity-40 z-10" />
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: COLORS.navy // Fallback color
                }}
              />
            ))}
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'w-8' : 'w-2'
                  }`}
                  style={{ backgroundColor: index === currentImageIndex ? COLORS.yellow : 'white' }}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 
          className="text-3xl md:text-4xl font-coco uppercase text-center mb-12"
          style={{ color: 'var(--color-heading)' }}
        >
          Our <span style={{ color: COLORS.yellow }}>Values</span>
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
                style={{ backgroundColor: COLORS.yellow + '20', color: 'var(--color-icon)' }}
              >
                {value.icon}
              </div>
              <h3 className="font-coco text-xl mb-3" style={{ color: 'var(--color-heading)' }}>
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
          className="text-3xl md:text-4xl font-coco uppercase text-center mb-12"
          style={{ color: 'var(--color-heading)' }}
        >
          Meet Our <span style={{ color: COLORS.yellow }}>Team</span>
        </h2>

        <div className="flex justify-center">
          {team.map((member, index) => (
            <div 
              key={index}
              className="max-w-sm p-8 rounded-2xl text-center hover:shadow-xl transition-shadow"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {/* Circular headshot */}
              <div className="w-48 h-48 rounded-full mx-auto mb-6 overflow-hidden border-4 shadow-lg" style={{ borderColor: COLORS.yellow }}>
                <div 
                  className="w-full h-full"
                  style={{ 
                    backgroundImage: `url(${member.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: COLORS.navy // Fallback
                  }}
                />
              </div>
              
              <h3 className="font-coco text-2xl mb-2" style={{ color: 'var(--color-heading)' }}>
                {member.name}
              </h3>
              
              <p className="text-sm font-inter font-bold uppercase tracking-wider mb-4" style={{ color: COLORS.yellow }}>
                {member.role}
              </p>
              
              <p className="font-inter leading-relaxed" style={mutedTextColor}>
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: COLORS.navy }}>
          <h2 className="text-3xl md:text-4xl font-coco uppercase text-white mb-4">
            Visit Us Today
          </h2>
          <p className="text-white/90 font-inter text-lg mb-8 max-w-2xl mx-auto">
            Come experience the Roma Mart difference. We're here to serve you with a smile!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE_URL}#contact`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
            >
              Get Directions
            </a>
            <a
              href={`${BASE_URL}#contact`}
              className="px-8 py-4 rounded-full font-bold font-inter transition-transform hover:scale-105 border-2 text-white"
              style={{ borderColor: 'white' }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
