/**
 * Centralized Services Management System
 * 
 * All Roma Mart services with availability, descriptions, and metadata.
 * Links to location system for availability display.
 */

import { Banknote, Bitcoin, Printer, Package, UtensilsCrossed, Send, CreditCard, Sparkles, Ticket, AlertCircle, ShoppingBag, Globe, ShoppingBasket, Candy } from 'lucide-react';

// Service categories
export const SERVICE_CATEGORIES = {
  FINANCIAL: 'financial',
  FOOD: 'food',
  RETAIL: 'retail',
  CONVENIENCE: 'convenience',
  AGE_RESTRICTED: 'age_restricted'
};

// All services data
export const SERVICES = [
  {
    itemType: 'service',
    id: 'atm',
    name: 'ATM',
    tagline: 'Cash when you need it',
    description: 'Convenient ATM access with competitive fees. Withdraw cash safely and securely. Supports all major bank networks with secure transactions.',
    icon: <Banknote size={20} />,
    category: SERVICE_CATEGORIES.FINANCIAL,
    availableAt: ['loc-wellington-001'], // Location IDs where available
    availability: 'store_hours', // store_hours | 24_7 | custom
    features: [
      'Available during store hours',
      'Low transaction fees',
      'All major bank networks',
      'Secure transactions',
      'Receipt provided'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true
  },
  
  {
    itemType: 'service',
    id: 'bitcoin_atm',
    name: 'Bitcoin ATM',
    tagline: 'Buy & sell crypto instantly',
    description: 'Buy and sell cryptocurrency with ease. Our Bitcoin ATM supports multiple digital currencies with instant transactions and complete privacy. Managed by Bitcoin4U.',
    icon: <Bitcoin size={20} />,
    category: SERVICE_CATEGORIES.FINANCIAL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Buy & sell Bitcoin',
      'Multiple cryptocurrencies',
      'Instant transactions',
      'Secure & private',
      'Managed by Bitcoin4U'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true,
    partner: {
      name: 'Bitcoin4U',
      url: 'https://bitcoin4u.ca/atm/sarnia/',
      logo: '/images/b4u-logo.png' // Can add logo path later
    },
    action: {
      text: 'View Rates',
      url: 'https://bitcoin4u.ca/atm/sarnia/'
    }
  },
  
  {
    itemType: 'service',
    id: 'gift_cards',
    name: 'Gift Cards',
    tagline: 'Perfect for any occasion',
    description: 'Wide selection of gift cards for all occasions. Choose from major retailers, restaurants, and entertainment brands. Various denominations available with instant activation.',
    icon: <CreditCard size={20} />,
    category: SERVICE_CATEGORIES.RETAIL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Major retailers',
      'Restaurants & entertainment',
      'Multiple denominations',
      'Instant activation',
      'Perfect for gifting'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true,
  },
  
  {
    itemType: 'service',
    id: 'printing',
    name: 'Printing Services',
    tagline: 'Black & white printing on demand',
    description: 'Professional black & white printing services. Email your document to print@romamart.ca and pay at the counter when you pick up. QR code verification prevents spam orders.',
    icon: <Printer size={20} />,
    category: SERVICE_CATEGORIES.CONVENIENCE,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Black & white printing only',
      'Email to print@romamart.ca',
      'Pay at counter',
      'QR verification required',
      'Multiple page sizes'
    ],
    badge: null,
    ageRestricted: false,
    status: 'coming_soon',
    featured: false,
    action: {
      text: 'Email Print Job',
      email: 'print@romamart.ca',
      subject: 'Print Request',
      body: 'Please attach your document. Include your name and phone number. You will receive a QR code to show at the counter.'
    }
  },
  
  {
    itemType: 'service',
    id: 'halal_meat',
    name: 'Halal Meat',
    tagline: '100% certified halal',
    description: 'Premium quality halal-certified meat products from local suppliers. Fresh cuts available on demand. All meat is Zabiha halal certified.',
    icon: <UtensilsCrossed size={20} />,
    category: SERVICE_CATEGORIES.FOOD,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      '100% Zabiha halal certified',
      'Local suppliers',
      'Fresh cuts on demand',
      'Quality guaranteed',
      'Various meat options'
    ],
    badge: 'halal',
    ageRestricted: false,
    status: 'available',
    featured: true
  },
  
  {
    itemType: 'service',
    id: 'perfumes',
    name: 'Perfumes & Fragrances',
    tagline: 'Find your signature scent',
    description: 'Curated collection of premium perfumes and fragrances. Designer brands with unisex options and gift sets available.',
    icon: <Sparkles size={20} />,
    category: SERVICE_CATEGORIES.RETAIL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Designer brands',
      'Variety of scents',
      'Unisex options',
      'Gift sets available',
      'Testers available'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: false,
  },
  
  {
    itemType: 'service',
    id: 'canadian_products',
    name: 'Canadian Products',
    tagline: 'Support Local 🍁',
    description: 'Selection of proudly Canadian-made products. Support local brands and enjoy authentic Canadian flavors and quality.',
    icon: <ShoppingBag size={20} />,
    category: SERVICE_CATEGORIES.RETAIL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Canadian-made products',
      'Support local brands',
      'Authentic quality',
      'Maple products',
      'Regional specialties'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true,
  },
  
  {
    itemType: 'service',
    id: 'international_products',
    name: 'International Products',
    tagline: 'Global flavors at home',
    description: 'Imported products from around the world. Discover unique snacks, beverages, and specialty items from Asia, Europe, Middle East, and beyond.',
    icon: <Globe size={20} />,
    category: SERVICE_CATEGORIES.RETAIL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Asian imports',
      'European products',
      'Middle Eastern items',
      'Unique snacks',
      'Hard-to-find items'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true
  },
  
  {
    itemType: 'service',
    id: 'groceries',
    name: 'Pantry Essentials & Groceries',
    tagline: 'Your daily essentials',
    description: 'Expansive selection of pantry staples and grocery essentials. Milk, bread, eggs, canned goods, and everyday items you need.',
    icon: <ShoppingBasket size={20} />,
    category: SERVICE_CATEGORIES.RETAIL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Fresh dairy products',
      'Bread & bakery',
      'Canned goods',
      'Pantry staples',
      'Household items'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true,
  },
  
  {
    itemType: 'service',
    id: 'snacks',
    name: 'Snacks & Confectionery',
    tagline: 'Sweet & savory treats',
    description: 'Wide variety of snacks and candy for every craving. Chips, chocolate bars, gummies, nuts, and more.',
    icon: <Candy size={20} />,
    category: SERVICE_CATEGORIES.RETAIL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Chips & crisps',
      'Chocolate bars',
      'Gummy candies',
      'Nuts & seeds',
      'Popcorn & pretzels'
    ],
    badge: null,
    ageRestricted: false,
    status: 'available',
    featured: true,
  },
  
  {
    itemType: 'service',
    id: 'package_services',
    name: 'Package Pickup & Dropoff',
    tagline: 'Your package hub',
    description: 'Convenient package handling services. Drop off your shipments or pick up deliveries at your convenience with secure storage.',
    icon: <Package size={20} />,
    category: SERVICE_CATEGORIES.CONVENIENCE,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Multiple carriers',
      'Secure storage',
      'Extended hours',
      'Package tracking',
      'Signature service'
    ],
    badge: null,
    ageRestricted: false,
    status: 'coming_soon',
    featured: false
  },
  
  {
    itemType: 'service',
    id: 'money_transfer',
    name: 'Money Transfer',
    tagline: 'Send money anywhere',
    description: 'Fast and secure money transfer services to send funds domestically and internationally with competitive rates.',
    icon: <Send size={20} />,
    category: SERVICE_CATEGORIES.FINANCIAL,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      'Domestic & international',
      'Competitive rates',
      'Fast processing',
      'Secure transfers',
      'Multiple currencies'
    ],
    badge: null,
    ageRestricted: false,
    status: 'coming_soon',
    featured: true
  },
  
  {
    itemType: 'service',
    id: 'tobacco',
    name: 'Tobacco & Vape',
    tagline: '19+ Only - ID Required',
    description: 'Age-restricted tobacco products and vaping supplies. Valid government-issued photo ID with birth date required under Ontario law (Smoke-Free Ontario Act, 2017).',
    icon: <AlertCircle size={20} />,
    category: SERVICE_CATEGORIES.AGE_RESTRICTED,
    availableAt: ['loc-wellington-001'],
    availability: 'store_hours',
    features: [
      '19+ Only (Ontario law)',
      'Photo ID required',
      'Cigarettes & cigars',
      'Vaping supplies',
      'Accessories'
    ],
    badge: null,
    ageRestricted: true,
    status: 'available',
    featured: false,
    legalNotice: {
      text: 'It is illegal to sell or supply tobacco or e-cigarettes to anyone under 19 years of age.',
      law: 'Smoke-Free Ontario Act, 2017',
      url: 'https://www.ontario.ca/laws/statute/17s26'
    }
  },
  
  {
    itemType: 'service',
    id: 'lottery',
    name: 'Lottery',
    tagline: 'Play your favorite games!',
    description: 'Provincial lottery tickets! Play your favorite OLG games including instant tickets and draw games. Must be 19 or older.',
    icon: <Ticket size={20} />,
    category: SERVICE_CATEGORIES.AGE_RESTRICTED,
    availableAt: ['loc-wellington-001'], // Empty until live
    availability: 'store_hours',
    features: [
      '19+ Only (Ontario law)',
      'Instant tickets',
      'Draw games',
      'OLG authorized'
    ],
    badge: null,
    ageRestricted: true,
    status: 'coming_soon',
    featured: false,
    legalNotice: {
      text: 'Must be 19 or older to purchase lottery tickets in Ontario.',
      law: 'Ontario Lottery and Gaming Corporation',
      url: 'https://www.olg.ca/'
    }
  }
];

// === HELPER FUNCTIONS ===

/**
 * Get service by ID
 */
export const getServiceById = (id) => {
  return SERVICES.find(s => s.id === id) || null;
};

/**
 * Get services by category
 */
export const getServicesByCategory = (category) => {
  return SERVICES.filter(s => s.category === category);
};

/**
 * Get services available at specific location
 */
export const getServicesAtLocation = (locationId) => {
  return SERVICES.filter(s => s.availableAt.includes(locationId));
};

/**
 * Get age-restricted services
 */
export const getAgeRestrictedServices = () => {
  return SERVICES.filter(s => s.ageRestricted);
};

/**
 * Get coming soon services
 */
export const getComingSoonServices = () => {
  return SERVICES.filter(s => s.comingSoon);
};

/**
 * Get active (available now) services
 */
export const getActiveServices = () => {
  return SERVICES.filter(s => !s.comingSoon && s.availableAt.length > 0);
};

/**
 * Check if service is available at location
 */
export const isServiceAvailableAt = (serviceId, locationId) => {
  const service = getServiceById(serviceId);
  return service ? service.availableAt.includes(locationId) : false;
};

/**
 * Get service availability status text
 */
export const getServiceAvailabilityText = (service, locationStatus) => {
  if (service.comingSoon) return 'Coming Soon';
  if (service.availability === '24_7') return 'Available 24/7';
  if (service.availability === 'store_hours') {
    return locationStatus === 'open' ? 'Available Now' : 'Available During Store Hours';
  }
  return 'Available';
};

// Featured services for homepage (6 items displayed)
export const SERVICES_FEATURED = SERVICES.filter(service => service.featured);

export default {
  SERVICES,
  SERVICES_FEATURED,
  SERVICE_CATEGORIES,
  getServiceById,
  getServicesByCategory,
  getServicesAtLocation,
  getAgeRestrictedServices,
  getComingSoonServices,
  getActiveServices,
  isServiceAvailableAt,
  getServiceAvailabilityText
};
