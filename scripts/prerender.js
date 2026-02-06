/* eslint-env node */
/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import COMPANY_DATA from '../src/config/company_data.js';
import { buildMenuItemSchema } from '../src/schemas/menuItemSchema.js';
import { buildServiceListSchema } from '../src/schemas/serviceSchema.js';
import { buildLocationListSchema } from '../src/schemas/locationSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API endpoints - same as Context providers
const MENU_API_URL = 'https://romamart.netlify.app/api/public-menu';
const SERVICES_API_URL = 'https://romamart.netlify.app/api/public-services';
const LOCATIONS_API_URL = 'https://romamart.netlify.app/api/public-locations';

// Routes to prerender
const BASE_URL = 'https://romamart.ca';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_TW_IMAGE = `${BASE_URL}/twitter-card.jpg`;
const DEFAULT_IMAGE_ALT = 'Roma Mart storefront and branding';

const routes = [
  {
    path: '/',
    title: 'Home',
    description: 'Roma Mart Convenience - Groceries, Global Snacks, Halal Meat, Coffee & More in Sarnia, ON. ATM, Bitcoin, Lottery, and Tobacco services available.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT
  },
  {
    path: '/services',
    title: 'Services',
    description: 'Explore Roma Mart services: ATM, Bitcoin ATM, printing, money transfer, lottery, and more in Sarnia, ON.',
    ogImage: `${BASE_URL}/images/romamart-interior1.png`,
    twitterImage: `${BASE_URL}/images/romamart-interior1.png`,
    imageAlt: 'Roma Mart interior showcasing products and services'
  },
  {
    path: '/rocafe',
    title: 'RoCafé Menu',
    description: 'Discover RoCafé coffee, bubble tea, matcha lattes, and signature drinks at Roma Mart in Sarnia, ON.',
    ogImage: `${BASE_URL}/rocafe-logo.png`,
    twitterImage: `${BASE_URL}/rocafe-logo.png`,
    imageAlt: 'RoCafé logo and beverage branding'
  },
  {
    path: '/return-policy',
    title: 'Return Policy',
    description: 'Roma Mart Return Policy - All sales final except for faulty products reported within 24 hours.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT
  },
  {
    path: '/locations',
    title: 'Locations',
    description: 'Find Roma Mart locations, hours, and directions in Sarnia, Ontario.',
    ogImage: `${BASE_URL}/images/romamart-opening1.png`,
    twitterImage: `${BASE_URL}/images/romamart-opening1.png`,
    imageAlt: 'Roma Mart storefront exterior'
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch with Roma Mart Convenience in Sarnia, ON. Phone, email, and directions.',
    ogImage: `${BASE_URL}/images/romamart-interior2.png`,
    twitterImage: `${BASE_URL}/images/romamart-interior2.png`,
    imageAlt: 'Roma Mart interior with shelves and signage'
  },
  {
    path: '/about',
    title: 'About Us',
    description: 'Learn about Roma Mart Convenience, our community focus, and services in Sarnia, ON.',
    ogImage: `${BASE_URL}/images/romamart-opening2.png`,
    twitterImage: `${BASE_URL}/images/romamart-opening2.png`,
    imageAlt: 'Roma Mart grand opening event'
  },
  {
    path: '/accessibility',
    title: 'Accessibility',
    description: 'Roma Mart Accessibility Statement - WCAG 2.2 Level AA compliance and accessibility commitments.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT
  },
  {
    path: '/privacy',
    title: 'Privacy',
    description: 'Roma Mart Privacy Policy - How we collect, use, and protect your information.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT
  },
  {
    path: '/terms',
    title: 'Terms',
    description: 'Roma Mart Terms of Service and usage policies.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT
  },
  {
    path: '/cookies',
    title: 'Cookies',
    description: 'Roma Mart Cookie Policy and preferences.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT
  }
];

const to24h = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] || '00';
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

const parseHoursRange = (range) => {
  if (!range || typeof range !== 'string') return { opens: null, closes: null };
  const parts = range.split('-').map(part => part.trim());
  if (parts.length < 2) return { opens: null, closes: null };
  return { opens: to24h(parts[0]), closes: to24h(parts[1]) };
};

// ISO 3166-1 alpha-2 country codes
const VALID_COUNTRY_CODES = new Set([
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS',
  'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
  'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE',
  'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF',
  'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
  'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM',
  'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC',
  'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
  'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA',
  'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG',
  'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
  'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS',
  'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO',
  'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI',
  'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'
]);

const normalizeCountry = (country) => {
  if (!country || typeof country !== 'string') return 'CA';
  const trimmed = country.trim();
  if (!trimmed) return 'CA';
  const upper = trimmed.toUpperCase();
  if (upper === 'CANADA') return 'CA';
  if (upper.length === 2 && VALID_COUNTRY_CODES.has(upper)) {
    return upper;
  }
  // Fallback to default country to ensure structured data uses a valid code
  return 'CA';
};

/**
 * Fetches menu data from API for prerendering ProductList schemas
 * @returns {Promise<Array>} Menu items array
 */
async function fetchMenuData() {
  try {
    console.log('Fetching menu data from API for prerendering...');
    const response = await fetch(MENU_API_URL);

    if (!response.ok) {
      console.warn(`Warning: Menu API returned ${response.status}. ProductList schemas will be skipped in static HTML.`);
      return [];
    }

    const data = await response.json();
    const menuItems = data.menu || [];

    console.log(`✓ Fetched ${menuItems.length} menu items (${menuItems.filter(i => i.featured).length} featured)`);
    return menuItems;
  } catch (error) {
    console.warn('Warning: Failed to fetch menu data. ProductList schemas will be skipped in static HTML.');
    console.warn('  Error:', error.message);
    return [];
  }
}

/**
 * Fetches services data from API for prerendering ServiceList schemas
 * Returns empty array if API unavailable (services schemas handled by React client-side with static fallback)
 * @returns {Promise<Array>} Services array
 */
async function fetchServicesData() {
  try {
    console.log('Fetching services data from API for prerendering...');
    const response = await fetch(SERVICES_API_URL);

    if (!response.ok) {
      console.warn(`Warning: Services API returned ${response.status}. ServiceList schemas will use React client-side rendering.`);
      return [];
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.services)) {
      console.warn('Warning: Invalid services API response. ServiceList schemas will use React client-side rendering.');
      return [];
    }

    const services = data.services;
    console.log(`✓ Fetched ${services.length} services from API (${services.filter(s => s.featured).length} featured)`);
    return services;
  } catch (error) {
    console.warn('Warning: Failed to fetch services data. ServiceList schemas will use React client-side rendering.');
    console.warn('  Error:', error.message);
    return [];
  }
}

/**
 * Fetches locations data from API for prerendering LocationList schemas
 * Returns empty array if API unavailable (locations schemas handled by React client-side with static fallback)
 * @returns {Promise<Array>} Locations array
 */
async function fetchLocationsData() {
  try {
    console.log('Fetching locations data from API for prerendering...');
    const response = await fetch(LOCATIONS_API_URL);

    if (!response.ok) {
      console.warn(`Warning: Locations API returned ${response.status}. LocationList schemas will use React client-side rendering.`);
      return [];
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.locations)) {
      console.warn('Warning: Invalid locations API response. LocationList schemas will use React client-side rendering.');
      return [];
    }

    const locations = data.locations;
    console.log(`✓ Fetched ${locations.length} locations from API`);
    return locations;
  } catch (error) {
    console.warn('Warning: Failed to fetch locations data. LocationList schemas will use React client-side rendering.');
    console.warn('  Error:', error.message);
    return [];
  }
}

/**
 * Builds ProductList schema for menu items
 * @param {Array} menuItems - Menu items to include
 * @param {boolean} featuredOnly - Only include featured items
 * @returns {Object|null} ProductList schema or null if no items
 */
function buildProductListSchema(menuItems, featuredOnly = false) {
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    return null;
  }

  const items = featuredOnly
    ? menuItems.filter(item => item.featured === true)
    : menuItems;

  if (items.length === 0) {
    return null;
  }

  // Build Product schemas using same logic as StructuredData component
  const productSchemas = items
    .map(menuItem => buildMenuItemSchema(
      menuItem,
      'https://romamart.ca/rocafe',
      {
        currency: 'CAD',
        priceInCents: true // Menu API uses cents
      }
    ))
    .filter(Boolean);

  if (productSchemas.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productSchemas.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: product
    }))
  };
}

const buildStructuredData = (routePath = '/', apiData = {}) => {
  const { menuItems = [], services = [], locations = [] } = apiData;
  const location = COMPANY_DATA.location;
  const address = location?.address || {};
  const contact = location?.contact || {};
  const coords = location?.google?.coordinates || {};
  const hours = location?.hours || {};

  const weekday = parseHoursRange(hours.weekdays);
  const weekend = parseHoursRange(hours.weekends);

  const openingHoursSpecification = [
    weekday.opens && weekday.closes
      ? {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: weekday.opens,
          closes: weekday.closes
        }
      : null,
    weekend.opens && weekend.closes
      ? {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: weekend.opens,
          closes: weekend.closes
        }
      : null
  ].filter(Boolean);

  // Build base @graph with LocalBusiness and WebSite
  const graph = [
    {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#business`,
      name: COMPANY_DATA.dba || COMPANY_DATA.legalName || 'Roma Mart Convenience',
      legalName: COMPANY_DATA.legalName || undefined,
      alternateName: COMPANY_DATA.dba ? COMPANY_DATA.legalName : 'Roma Mart',
      description: 'Your daily stop & go convenience store in Sarnia, Ontario. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
      url: BASE_URL,
      telephone: contact.phone || '+1-382-342-2000',
      email: contact.email || 'contact@romamart.ca',
      priceRange: '$$',
      image: 'https://romamart.ca/images/store-front.jpg',
      logo: 'https://romamart.ca/logo.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street || '3-189 Wellington Street',
        addressLocality: address.city || 'Sarnia',
        addressRegion: address.province || 'ON',
        postalCode: address.postalCode || 'N7T 1G6',
        addressCountry: normalizeCountry(address.country) || 'CA'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: coords.lat || 42.970389,
        longitude: coords.lng || -82.404589
      },
      openingHoursSpecification,
      sameAs: Object.values(COMPANY_DATA.socialLinks || {}),
      amenityFeature: (location?.amenities || []).map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.name,
        value: amenity.value
      })),
      paymentAccepted: COMPANY_DATA.paymentMethods || ['Cash', 'Credit Card', 'Debit Card', 'Interac', 'Visa', 'Mastercard', 'American Express', 'Bitcoin']
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: COMPANY_DATA.dba || 'Roma Mart Convenience',
      description: 'Your daily stop & go convenience store in Sarnia, Ontario.',
      publisher: { '@id': `${BASE_URL}/#business` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  // Add ProductList for homepage (featured items only)
  if (routePath === '/' && menuItems.length > 0) {
    const productListSchema = buildProductListSchema(menuItems, true);
    if (productListSchema) {
      graph.push(productListSchema);
    }
  }

  // Add ProductList for RoCafé page (all menu items)
  if (routePath === '/rocafe' && menuItems.length > 0) {
    const productListSchema = buildProductListSchema(menuItems, false);
    if (productListSchema) {
      graph.push(productListSchema);
    }
  }

  // Add ServiceList for homepage (featured services only)
  if (routePath === '/' && services.length > 0) {
    const featuredServices = services.filter(s => s.featured === true);
    if (featuredServices.length > 0) {
      const serviceListSchema = buildServiceListSchema(featuredServices, { companyData: COMPANY_DATA });
      if (serviceListSchema) {
        graph.push(serviceListSchema);
      }
    }
  }

  // Add ServiceList for services page (all services)
  if (routePath === '/services' && services.length > 0) {
    const serviceListSchema = buildServiceListSchema(services, { companyData: COMPANY_DATA });
    if (serviceListSchema) {
      graph.push(serviceListSchema);
    }
  }

  // Add LocationList for homepage (primary location only - matches display)
  if (routePath === '/' && locations.length > 0) {
    // Homepage displays only primary location, schema should match
    const primaryLocation = locations.find(loc => loc.isPrimary) || locations[0];
    if (primaryLocation) {
      const locationListSchema = buildLocationListSchema([primaryLocation], { companyData: COMPANY_DATA });
      if (locationListSchema) {
        graph.push(locationListSchema);
      }
    }
  }

  // Add LocationList for locations page (all active locations for SEO)
  // Display sorts by distance/primary, but schema includes all active for indexing
  if (routePath === '/locations' && locations.length > 0) {
    const activeLocations = locations.filter(loc => loc.status === 'open');
    if (activeLocations.length > 0) {
      const locationListSchema = buildLocationListSchema(activeLocations, { companyData: COMPANY_DATA });
      if (locationListSchema) {
        graph.push(locationListSchema);
      }
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph
  };

  return JSON.stringify(schema);
};

const buildSitemapXml = (routeList, lastModDate) => {
  const urls = routeList.map(route => {
    const priority = route.path === '/' ? '1.0' : '0.8';
    const changefreq = route.path === '/' || route.path === '/rocafe' ? 'weekly' : 'monthly';
    return `  <url>\n` +
      `    <loc>${BASE_URL}${route.path}</loc>\n` +
      `    <lastmod>${lastModDate}</lastmod>\n` +
      `    <changefreq>${changefreq}</changefreq>\n` +
      `    <priority>${priority}</priority>\n` +
      `  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;
};

async function prerender() {
  const distPath = path.resolve(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('Build output not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Fetch all API data in parallel for maximum efficiency
  console.log('\n📡 Fetching API data for prerendering...\n');
  const [menuItems, services, locations] = await Promise.all([
    fetchMenuData(),
    fetchServicesData(),
    fetchLocationsData()
  ]);
  console.log('\n✓ API data fetching complete\n');

  const indexTemplate = fs.readFileSync(indexPath, 'utf-8');

  for (const route of routes) {
    console.log(`Prerendering ${route.path}...`);
    
    // For GitHub Pages SPA routing, create route-specific HTML
    let outputPath;
    if (route.path === '/') {
      outputPath = indexPath;
    } else {
      const routeDir = path.join(distPath, route.path.slice(1));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      outputPath = path.join(routeDir, 'index.html');
    }

    // Copy template with route-specific meta tags
    const absoluteUrl = `${BASE_URL}${route.path}`;
    const html = indexTemplate
      .replace(
        /<title>[^<]*<\/title>/,
        `<title>Roma Mart - ${route.title} | Groceries, Coffee & More in Sarnia, ON</title>`
      )
      .replace(
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="Roma Mart - ${route.title} | Groceries, Coffee & More in Sarnia, ON" />`
      )
      .replace(
        /<meta property="twitter:title" content="[^"]*" \/>/,
        `<meta property="twitter:title" content="Roma Mart - ${route.title} | Groceries, Coffee & More in Sarnia, ON" />`
      )
      .replace(
        /<meta name="description" content="[^"]*" \/>/,
        `<meta name="description" content="${route.description}" />`
      )
      .replace(
        /<link rel="canonical" href="[^"]*" \/>/,
        `<link rel="canonical" href="${absoluteUrl}" />`
      )
      .replace(
        /<meta property="og:url" content="[^"]*" \/>/,
        `<meta property="og:url" content="${absoluteUrl}" />`
      )
      .replace(
        /<meta property="og:description" content="[^"]*" \/>/,
        `<meta property="og:description" content="${route.description}" />`
      )
      .replace(
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${route.ogImage || DEFAULT_OG_IMAGE}" />`
      )
      .replace(
        /<meta property="og:image:alt" content="[^"]*" \/>/,
        `<meta property="og:image:alt" content="${route.imageAlt || DEFAULT_IMAGE_ALT}" />`
      )
      .replace(
        /<meta property="twitter:url" content="[^"]*" \/>/,
        `<meta property="twitter:url" content="${absoluteUrl}" />`
      )
      .replace(
        /<meta property="twitter:description" content="[^"]*" \/>/,
        `<meta property="twitter:description" content="${route.description}" />`
      )
      .replace(
        /<meta property="twitter:image" content="[^"]*" \/>/,
        `<meta property="twitter:image" content="${route.twitterImage || DEFAULT_TW_IMAGE}" />`
      )
      .replace(
        /<meta property="twitter:image:alt" content="[^"]*" \/>/,
        `<meta property="twitter:image:alt" content="${route.imageAlt || DEFAULT_IMAGE_ALT}" />`
      )
      .replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">${buildStructuredData(route.path, { menuItems, services, locations })}</script>`
      );

    fs.writeFileSync(outputPath, html);
    console.log(`  ✓ ${outputPath}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const sitemapXml = buildSitemapXml(routes, today);
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml);

  console.log('\n✓ Prerendering complete!');
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
