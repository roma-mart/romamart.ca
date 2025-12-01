import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Banknote, Bitcoin, Printer, Package, UtensilsCrossed, Send, CreditCard, Sparkles, Ticket, AlertCircle } from 'lucide-react';
import ShareButton from '../components/ShareButton';

const ServicesPage = () => {
  const COLORS = {
    navy: '#020178',
    yellow: '#E4B340',
  };

  const textColor = { color: 'var(--color-text)' };
  const mutedTextColor = { color: 'var(--color-text)', opacity: 0.7 };

  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';

  const services = [
    {
      id: 1,
      icon: <Banknote size={40} />,
      title: 'ATM',
      description: 'Convenient 24/7 ATM access with competitive fees. Withdraw cash anytime you need it.',
      features: ['24/7 Access', 'Low Fees', 'Major Bank Support', 'Secure Transactions']
    },
    {
      id: 2,
      icon: <Bitcoin size={40} />,
      title: 'Bitcoin ATM',
      description: 'Buy and sell cryptocurrency with ease. Our Bitcoin ATM supports multiple digital currencies.',
      features: ['Buy & Sell Crypto', 'Multiple Coins', 'Instant Transactions', 'Secure & Private']
    },
    {
      id: 3,
      icon: <Printer size={40} />,
      title: 'Printing Services',
      description: 'Professional printing services for documents, photos, and more. Black & white or color printing available.',
      features: ['Document Printing', 'Photo Printing', 'Color & B/W', 'Multiple Sizes']
    },
    {
      id: 4,
      icon: <Package size={40} />,
      title: 'Package Pickup & Dropoff',
      description: 'Convenient package handling services. Drop off your shipments or pick up deliveries at your convenience.',
      features: ['Multiple Carriers', 'Secure Storage', 'Extended Hours', 'Package Tracking']
    },
    {
      id: 5,
      icon: <UtensilsCrossed size={40} />,
      title: 'Halal Meat',
      description: 'Premium quality halal-certified meat products. Fresh cuts available daily.',
      features: ['100% Halal Certified', 'Fresh Daily', 'Multiple Cuts', 'Quality Guaranteed']
    },
    {
      id: 6,
      icon: <Send size={40} />,
      title: 'Money Transfer',
      description: 'Fast and secure money transfer services to send funds domestically and internationally.',
      features: ['Domestic & International', 'Competitive Rates', 'Fast Processing', 'Secure Transfers']
    },
    {
      id: 7,
      icon: <CreditCard size={40} />,
      title: 'Gift & Prepaid Cards',
      description: 'Wide selection of gift cards and prepaid cards for all occasions. Popular brands available.',
      features: ['Major Retailers', 'Multiple Denominations', 'Perfect for Gifting', 'No Expiry']
    },
    {
      id: 8,
      icon: <Sparkles size={40} />,
      title: 'Perfumes & Fragrances',
      description: 'Curated collection of premium perfumes and fragrances. Find your signature scent.',
      features: ['Designer Brands', 'Variety of Scents', 'Unisex Options', 'Gift Sets Available']
    },
    {
      id: 9,
      icon: <AlertCircle size={40} />,
      title: 'Tobacco & Vapes',
      description: 'Age-restricted tobacco products and vaping supplies. Valid government-issued photo ID required.',
      features: ['19+ Only (Ontario Law)', 'Photo ID Required', 'Cigarettes & Cigars', 'Vaping Supplies'],
      restricted: true
    },
    {
      id: 10,
      icon: <Ticket size={40} />,
      title: 'Lottery',
      description: 'Provincial lottery tickets coming soon! Play your favorite games.',
      features: ['Coming Soon', '19+ Only (Ontario Law)', 'Instant Tickets', 'Draw Games'],
      comingSoon: true,
      restricted: true
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
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
              className="hover:text-yellow-500 transition-colors"
              style={mutedTextColor}
            >
              Home
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight size={16} style={mutedTextColor} /></li>
          <li aria-current="page" className="font-semibold" style={textColor}>Services</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 
              className="text-4xl md:text-5xl font-coco uppercase mb-4"
              style={{ color: 'var(--color-heading)' }}
            >
              Our <span style={{ color: COLORS.yellow }}>Services</span>
            </h1>
            <p className="text-lg font-inter leading-relaxed max-w-3xl" style={textColor}>
              Roma Mart is your one-stop convenience store offering a wide range of services to make your life easier. 
              From financial services to everyday essentials, we've got you covered.
            </p>
          </div>
          <ShareButton 
            title="Roma Mart Services"
            text="Check out all the amazing services at Roma Mart in Sarnia!"
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="p-8 rounded-2xl shadow-sm border hover:shadow-lg transition-all"
              style={{ 
                backgroundColor: 'var(--color-bg)', 
                borderColor: service.comingSoon ? COLORS.yellow : 'var(--color-border)',
                borderWidth: service.comingSoon ? '2px' : '1px'
              }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ 
                  backgroundColor: service.restricted ? 'var(--color-error-light)' : service.comingSoon ? COLORS.yellow + '20' : 'var(--color-surface)',
                  color: service.restricted ? 'var(--color-error)' : 'var(--color-icon)'
                }}
              >
                {service.icon}
              </div>
              
              <h3 className="font-coco text-2xl mb-3 flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
                {service.title}
                {service.comingSoon && (
                  <span className="text-xs font-inter font-bold px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}>
                    SOON
                  </span>
                )}
              </h3>
              
              <p className="font-inter leading-relaxed mb-6" style={mutedTextColor}>
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 font-inter text-sm" style={textColor}>
                    <span style={{ color: COLORS.yellow }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {service.restricted && (
                <div className="mt-6 p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error)' }}>
                  <p className="text-sm font-inter font-bold mb-2" style={{ color: 'var(--color-error)' }}>
                    ⚠️ AGE RESTRICTED - ONTARIO LAW
                  </p>
                  <p className="text-xs font-inter leading-relaxed" style={{ color: 'var(--color-error-dark)' }}>
                    {service.comingSoon ? 'Must be 19 or older to purchase lottery tickets. ' : 'Must be 19 or older to purchase tobacco or vapour products. '}
                    Government-issued photo ID with birth date must be shown when requested.
                  </p>
                  <p className="text-xs font-inter mt-2" style={{ color: 'var(--color-error-darker)' }}>
                    Under the <a href="https://www.ontario.ca/laws/statute/17s26" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Smoke-Free Ontario Act, 2017</a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Notice with SFOA Signage */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="font-coco text-2xl mb-6" style={{ color: 'var(--color-heading)' }}>Age-Restricted Products Compliance</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Tobacco/Vape Section */}
            <div>
              <h4 className="font-coco font-bold text-lg mb-3" style={{ color: 'var(--color-heading)' }}>Tobacco & Vapour Products</h4>
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
                Required signage displayed in-store per <a href="https://www.ontario.ca/page/rules-selling-tobacco-and-vapour-products" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">Smoke-Free Ontario Act, 2017</a>
              </p>
            </div>

            {/* Lottery Section */}
            <div>
              <h4 className="font-coco font-bold text-lg mb-3" style={{ color: 'var(--color-heading)' }}>Lottery Products (Coming Soon)</h4>
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
                Regulated by <a href="https://www.olg.ca/" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">Ontario Lottery and Gaming Corporation (OLG)</a>
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
        <div className="p-12 rounded-3xl text-center" style={{ backgroundColor: COLORS.navy }}>
          <h2 className="text-3xl md:text-4xl font-coco uppercase text-white mb-4">
            Visit Us Today
          </h2>
          <p className="text-white/90 font-inter text-lg mb-8 max-w-2xl mx-auto">
            Experience the convenience of all our services under one roof. Our friendly staff is ready to assist you.
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

export default ServicesPage;
