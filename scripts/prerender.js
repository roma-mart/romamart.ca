import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
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
    description:
      'Roma Mart Convenience - Groceries, Global Snacks, Halal Meat, Coffee & More in Sarnia, ON. ATM, Bitcoin, Lottery, and Tobacco services available.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
  },
  {
    path: '/services',
    title: 'Services',
    description:
      'Explore Roma Mart services: ATM, Bitcoin ATM, printing, money transfer, lottery, and more in Sarnia, ON.',
    ogImage: `${BASE_URL}/images/romamart-interior1.png`,
    twitterImage: `${BASE_URL}/images/romamart-interior1.png`,
    imageAlt: 'Roma Mart interior showcasing products and services',
  },
  {
    path: '/rocafe',
    title: 'RoCafé Menu',
    description: 'Discover RoCafé coffee, bubble tea, matcha lattes, and signature drinks at Roma Mart in Sarnia, ON.',
    ogImage: `${BASE_URL}/rocafe-logo.png`,
    twitterImage: `${BASE_URL}/rocafe-logo.png`,
    imageAlt: 'RoCafé logo and beverage branding',
  },
  {
    path: '/return-policy',
    title: 'Return Policy',
    description: 'Roma Mart Return Policy - All sales final except for faulty products reported within 24 hours.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
  },
  {
    path: '/locations',
    title: 'Locations',
    description: 'Find Roma Mart locations, hours, and directions in Sarnia, Ontario.',
    ogImage: `${BASE_URL}/images/romamart-opening1.png`,
    twitterImage: `${BASE_URL}/images/romamart-opening1.png`,
    imageAlt: 'Roma Mart storefront exterior',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch with Roma Mart Convenience in Sarnia, ON. Phone, email, and directions.',
    ogImage: `${BASE_URL}/images/romamart-interior2.png`,
    twitterImage: `${BASE_URL}/images/romamart-interior2.png`,
    imageAlt: 'Roma Mart interior with shelves and signage',
  },
  {
    path: '/about',
    title: 'About Us',
    description: 'Learn about Roma Mart Convenience, our community focus, and services in Sarnia, ON.',
    ogImage: `${BASE_URL}/images/romamart-opening2.png`,
    twitterImage: `${BASE_URL}/images/romamart-opening2.png`,
    imageAlt: 'Roma Mart grand opening event',
  },
  {
    path: '/accessibility',
    title: 'Accessibility',
    description: 'Roma Mart Accessibility Statement - WCAG 2.2 Level AA compliance and accessibility commitments.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
  },
  {
    path: '/privacy',
    title: 'Privacy',
    description: 'Roma Mart Privacy Policy - How we collect, use, and protect your information.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
  },
  {
    path: '/terms',
    title: 'Terms',
    description: 'Roma Mart Terms of Service and usage policies.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
  },
  {
    path: '/cookies',
    title: 'Cookies',
    description: 'Roma Mart Cookie Policy and preferences.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
  },
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
  const parts = range.split('-').map((part) => part.trim());
  if (parts.length < 2) return { opens: null, closes: null };
  return { opens: to24h(parts[0]), closes: to24h(parts[1]) };
};

// ISO 3166-1 alpha-2 country codes
const VALID_COUNTRY_CODES = new Set([
  'AD',
  'AE',
  'AF',
  'AG',
  'AI',
  'AL',
  'AM',
  'AO',
  'AQ',
  'AR',
  'AS',
  'AT',
  'AU',
  'AW',
  'AX',
  'AZ',
  'BA',
  'BB',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BL',
  'BM',
  'BN',
  'BO',
  'BQ',
  'BR',
  'BS',
  'BT',
  'BV',
  'BW',
  'BY',
  'BZ',
  'CA',
  'CC',
  'CD',
  'CF',
  'CG',
  'CH',
  'CI',
  'CK',
  'CL',
  'CM',
  'CN',
  'CO',
  'CR',
  'CU',
  'CV',
  'CW',
  'CX',
  'CY',
  'CZ',
  'DE',
  'DJ',
  'DK',
  'DM',
  'DO',
  'DZ',
  'EC',
  'EE',
  'EG',
  'EH',
  'ER',
  'ES',
  'ET',
  'FI',
  'FJ',
  'FK',
  'FM',
  'FO',
  'FR',
  'GA',
  'GB',
  'GD',
  'GE',
  'GF',
  'GG',
  'GH',
  'GI',
  'GL',
  'GM',
  'GN',
  'GP',
  'GQ',
  'GR',
  'GS',
  'GT',
  'GU',
  'GW',
  'GY',
  'HK',
  'HM',
  'HN',
  'HR',
  'HT',
  'HU',
  'ID',
  'IE',
  'IL',
  'IM',
  'IN',
  'IO',
  'IQ',
  'IR',
  'IS',
  'IT',
  'JE',
  'JM',
  'JO',
  'JP',
  'KE',
  'KG',
  'KH',
  'KI',
  'KM',
  'KN',
  'KP',
  'KR',
  'KW',
  'KY',
  'KZ',
  'LA',
  'LB',
  'LC',
  'LI',
  'LK',
  'LR',
  'LS',
  'LT',
  'LU',
  'LV',
  'LY',
  'MA',
  'MC',
  'MD',
  'ME',
  'MF',
  'MG',
  'MH',
  'MK',
  'ML',
  'MM',
  'MN',
  'MO',
  'MP',
  'MQ',
  'MR',
  'MS',
  'MT',
  'MU',
  'MV',
  'MW',
  'MX',
  'MY',
  'MZ',
  'NA',
  'NC',
  'NE',
  'NF',
  'NG',
  'NI',
  'NL',
  'NO',
  'NP',
  'NR',
  'NU',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PF',
  'PG',
  'PH',
  'PK',
  'PL',
  'PM',
  'PN',
  'PR',
  'PS',
  'PT',
  'PW',
  'PY',
  'QA',
  'RE',
  'RO',
  'RS',
  'RU',
  'RW',
  'SA',
  'SB',
  'SC',
  'SD',
  'SE',
  'SG',
  'SH',
  'SI',
  'SJ',
  'SK',
  'SL',
  'SM',
  'SN',
  'SO',
  'SR',
  'SS',
  'ST',
  'SV',
  'SX',
  'SY',
  'SZ',
  'TC',
  'TD',
  'TF',
  'TG',
  'TH',
  'TJ',
  'TK',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'TW',
  'TZ',
  'UA',
  'UG',
  'UM',
  'US',
  'UY',
  'UZ',
  'VA',
  'VC',
  'VE',
  'VG',
  'VI',
  'VN',
  'VU',
  'WF',
  'WS',
  'YE',
  'YT',
  'ZA',
  'ZM',
  'ZW',
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
      console.warn(
        `Warning: Menu API returned ${response.status}. ProductList schemas will be skipped in static HTML.`
      );
      return [];
    }

    const data = await response.json();
    const menuItems = data.menu || [];

    console.log(`✓ Fetched ${menuItems.length} menu items (${menuItems.filter((i) => i.featured).length} featured)`);
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
      console.warn(
        `Warning: Services API returned ${response.status}. ServiceList schemas will use React client-side rendering.`
      );
      return [];
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.services)) {
      console.warn('Warning: Invalid services API response. ServiceList schemas will use React client-side rendering.');
      return [];
    }

    const services = data.services;
    console.log(
      `✓ Fetched ${services.length} services from API (${services.filter((s) => s.featured).length} featured)`
    );
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
      console.warn(
        `Warning: Locations API returned ${response.status}. LocationList schemas will use React client-side rendering.`
      );
      return [];
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.locations)) {
      console.warn(
        'Warning: Invalid locations API response. LocationList schemas will use React client-side rendering.'
      );
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

  const items = featuredOnly ? menuItems.filter((item) => item.featured === true) : menuItems;

  if (items.length === 0) {
    return null;
  }

  // Build Product schemas using same logic as StructuredData component
  const productSchemas = items
    .map((menuItem) =>
      buildMenuItemSchema(menuItem, 'https://romamart.ca/rocafe', {
        currency: 'CAD',
        priceInCents: true, // Menu API uses cents
      })
    )
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
      item: product,
    })),
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
          closes: weekday.closes,
        }
      : null,
    weekend.opens && weekend.closes
      ? {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: weekend.opens,
          closes: weekend.closes,
        }
      : null,
  ].filter(Boolean);

  // Build base @graph with LocalBusiness and WebSite
  const graph = [
    {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#business`,
      name: COMPANY_DATA.dba || COMPANY_DATA.legalName || 'Roma Mart Convenience',
      legalName: COMPANY_DATA.legalName || undefined,
      alternateName: COMPANY_DATA.dba ? COMPANY_DATA.legalName : 'Roma Mart',
      description:
        'Your daily stop & go convenience store in Sarnia, Ontario. Fresh RoCafé beverages, ATM, Bitcoin ATM, printing, and more.',
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
        addressCountry: normalizeCountry(address.country) || 'CA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: coords.lat || 42.970389,
        longitude: coords.lng || -82.404589,
      },
      openingHoursSpecification,
      sameAs: Object.values(COMPANY_DATA.socialLinks || {}),
      amenityFeature: (location?.amenities || []).map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.name,
        value: amenity.value,
      })),
      paymentAccepted: COMPANY_DATA.paymentMethods || [
        'Cash',
        'Credit Card',
        'Debit Card',
        'Interac',
        'Visa',
        'Mastercard',
        'American Express',
        'Bitcoin',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: COMPANY_DATA.dba || 'Roma Mart Convenience',
      description: 'Your daily stop & go convenience store in Sarnia, Ontario.',
      publisher: { '@id': `${BASE_URL}/#business` },
    },
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
    const featuredServices = services.filter((s) => s.featured === true);
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
    const primaryLocation = locations.find((loc) => loc.isPrimary) || locations[0];
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
    const activeLocations = locations.filter((loc) => loc.status === 'open');
    if (activeLocations.length > 0) {
      const locationListSchema = buildLocationListSchema(activeLocations, { companyData: COMPANY_DATA });
      if (locationListSchema) {
        graph.push(locationListSchema);
      }
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return JSON.stringify(schema);
};

const buildSitemapXml = (routeList, lastModDate) => {
  const urls = routeList
    .map((route) => {
      const priority = route.path === '/' ? '1.0' : '0.8';
      const changefreq = route.path === '/' || route.path === '/rocafe' ? 'weekly' : 'monthly';
      // Trailing slash on all URLs to match canonical links and served dir/index.html structure
      const loc = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}/`;
      return (
        `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${lastModDate}</lastmod>\n` +
        `    <changefreq>${changefreq}</changefreq>\n` +
        `    <priority>${priority}</priority>\n` +
        `  </url>`
      );
    })
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
};

/**
 * Inject hashed Vite bundle filenames into dist/sw.js precache list.
 * Replaces the `__VITE_BUNDLE_ASSETS__` placeholder with actual asset paths.
 * Gracefully degrades: logs a warning if placeholder or assets are missing.
 */
function injectServiceWorkerPrecache(distPath) {
  const swPath = path.join(distPath, 'sw.js');
  const assetsDir = path.join(distPath, 'assets');
  const PLACEHOLDER = '/* __VITE_BUNDLE_ASSETS__ */';

  if (!fs.existsSync(swPath)) {
    console.warn('⚠️  sw.js not found in dist — skipping precache injection');
    return;
  }

  let swContent = fs.readFileSync(swPath, 'utf-8');

  if (!swContent.includes(PLACEHOLDER)) {
    console.warn('⚠️  Precache placeholder not found in sw.js — skipping injection');
    return;
  }

  if (!fs.existsSync(assetsDir)) {
    console.warn('⚠️  dist/assets/ not found — skipping precache injection');
    return;
  }

  const assetFiles = fs
    .readdirSync(assetsDir)
    .filter((file) => /\.(js|css)$/.test(file))
    .map((file) => `  \`\${BASE_URL}assets/${file}\``)
    .join(',\n');

  if (!assetFiles) {
    console.warn('⚠️  No .js/.css assets found in dist/assets/ — skipping injection');
    return;
  }

  swContent = swContent.replace(PLACEHOLDER, assetFiles);

  // L7: Auto-generate cache version from asset hash
  const CACHE_VERSION_REGEX = /\/\*\s*__CACHE_VERSION__\s*\*\/\s*(['"])[^'"]*\1/;
  const cacheMatch = swContent.match(CACHE_VERSION_REGEX);
  if (cacheMatch) {
    const sortedAssets = fs
      .readdirSync(assetsDir)
      .filter((file) => /\.(js|css)$/.test(file))
      .sort()
      .join('\n');
    const hash = createHash('sha256').update(sortedAssets).digest('hex').slice(0, 8);
    const quote = cacheMatch[1];
    swContent = swContent.replace(CACHE_VERSION_REGEX, `/* __CACHE_VERSION__ */ ${quote}roma-mart-${hash}${quote}`);
    console.log(`\u2713 Cache version set to roma-mart-${hash}`);
  } else {
    console.warn('⚠️  Cache version placeholder not found in sw.js — skipping cache version injection');
  }

  fs.writeFileSync(swPath, swContent);

  const count = assetFiles.split('\n').length;
  console.log(`✓ Injected ${count} Vite bundle asset(s) into sw.js precache list`);
}

/**
 * Inject SSOT location data into dist/offline.html.
 * Replaces the __OFFLINE_LOCATIONS__ placeholder and id-anchored static content
 * with real data from COMPANY_DATA (sourced from src/data/locations.js).
 */
function injectOfflineLocationData(distPath) {
  const offlinePath = path.join(distPath, 'offline.html');

  if (!fs.existsSync(offlinePath)) {
    console.warn('⚠️  offline.html not found in dist — skipping location data injection');
    return;
  }

  let content = fs.readFileSync(offlinePath, 'utf-8');
  const loc = COMPANY_DATA.location;

  if (!loc) {
    console.warn('⚠️  No primary location in COMPANY_DATA — skipping offline injection');
    return;
  }

  const LOCATIONS_PLACEHOLDER = /\/\* __OFFLINE_LOCATIONS__ \*\/ \[[\s\S]*?\]/;

  if (!LOCATIONS_PLACEHOLDER.test(content)) {
    console.warn('⚠️  __OFFLINE_LOCATIONS__ placeholder not found in offline.html — skipping injection');
    return;
  }

  const phoneRaw = loc.contact.phone.replace(/[^+\d]/g, '');
  const locationsJson = JSON.stringify([
    {
      id: loc.id,
      name: loc.name,
      address: loc.address.formatted,
      phone: loc.contact.phone,
      coordinates: loc.google.coordinates,
      isPrimary: loc.isPrimary,
    },
  ]);

  // Replace JS LOCATIONS array
  content = content.replace(LOCATIONS_PLACEHOLDER, locationsJson);

  // Replace static HTML using id-anchored patterns (escape to prevent injection)
  content = content.replace(/(<h3 id="location-name">)[^<]*/, `$1${escapeHtml(loc.name)}`);
  content = content.replace(/(<span id="location-address">)[^<]*/, `$1${escapeHtml(loc.address.formatted)}`);
  content = content.replace(
    /<a href="tel:[^"]*" class="contact-link">[^<]*/,
    `<a href="tel:${phoneRaw}" class="contact-link">${escapeHtml(loc.contact.phone)}`
  );
  content = content.replace(/(<span id="location-hours">)[^<]*/, `$1${escapeHtml(loc.hours.display)}`);

  fs.writeFileSync(offlinePath, content);
  console.log('✓ Injected SSOT location data into offline.html');
}

/**
 * Escapes HTML special characters to prevent injection in static content.
 */
function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Builds static HTML content for <div id="root">.
 *
 * Crawlers that don't execute JavaScript (notably Bingbot) see only the
 * prerendered HTML shell. Without body content they report "missing h1"
 * and "insufficient content". This function generates lightweight,
 * semantic HTML per route so crawlers can index meaningful content.
 *
 * React uses createRoot() (not hydrateRoot), so it replaces this content
 * entirely on mount — no hydration mismatch issues.
 *
 * @param {string} routePath - Route path (e.g. '/', '/services')
 * @param {Object} apiData - Data fetched from APIs during prerendering
 * @returns {string} HTML string to inject inside <div id="root">
 */
function buildStaticContent(routePath, apiData = {}) {
  const { menuItems = [], services = [], locations: apiLocations = [] } = apiData;

  // API locations only — no static data import (migrating to API-only)
  // Falls back to COMPANY_DATA.location (SSOT) when API is unavailable
  const activeLocations = apiLocations.filter((l) => l.status === 'open');

  const loc = COMPANY_DATA.location;
  const contact = loc?.contact || {};
  const address = loc?.address || {};

  switch (routePath) {
    case '/': {
      const serviceList =
        services.length > 0
          ? services.map((s) => `<li>${escapeHtml(s.name)}</li>`).join('')
          : [
              'ATM',
              'Bitcoin ATM',
              'Gift Cards',
              'Printing Services',
              'Halal Meat',
              'Perfumes &amp; Fragrances',
              'Canadian Products',
              'International Products',
              'Pantry Essentials &amp; Groceries',
              'Snacks &amp; Confectionery',
              'Package Pickup &amp; Dropoff',
              'Money Transfer',
              'Tobacco &amp; Vape',
              'Lottery',
            ]
              .map((s) => `<li>${s}</li>`)
              .join('');
      return (
        `<header>` +
        `<h1>Your Daily Stop &amp; Go</h1>` +
        `<p>Experience Sarnia's newest convenience destination. From daily essentials to premium coffee, we have what you need.</p>` +
        `</header>` +
        `<main>` +
        `<section><h2>Our Services</h2><ul>${serviceList}</ul></section>` +
        `<section><h2>Visit Us</h2>` +
        `<p>${escapeHtml(address.formatted || '3-189 Wellington Street, Sarnia, ON N7T 1G6')}</p>` +
        `<p>Phone: ${escapeHtml(contact.phone || '+1 (382) 342-2000')}</p>` +
        `<p>Email: ${escapeHtml(contact.email || 'contact@romamart.ca')}</p>` +
        `<p>Hours: ${escapeHtml(loc?.hours?.display || 'Mon-Thu, Sat-Sun: 8:30 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM')}</p>` +
        `</section>` +
        `</main>`
      );
    }

    case '/services': {
      let serviceContent = '';
      if (services.length > 0) {
        serviceContent = services
          .map(
            (s) =>
              `<article><h2>${escapeHtml(s.name)}</h2>` +
              (s.description ? `<p>${escapeHtml(s.description)}</p>` : '') +
              `</article>`
          )
          .join('');
      }
      return (
        `<header>` +
        `<h1>Our Services</h1>` +
        `<p>Roma Mart is your one-stop convenience store offering a wide range of services to make your life easier. From financial services to everyday essentials, we've got you covered.</p>` +
        `</header>` +
        `<main>${serviceContent}</main>`
      );
    }

    case '/rocafe': {
      const categoryNames = [...new Set(menuItems.flatMap((item) => item.categories || []))];
      let menuSummary;
      if (categoryNames.length > 0) {
        const featuredItems = menuItems.filter((item) => item.featured);
        menuSummary =
          `<p>Browse our ${menuItems.length} menu items across ${categoryNames.length} categories: ` +
          `${categoryNames.map((c) => escapeHtml(c)).join(', ')}.</p>` +
          (featuredItems.length > 0
            ? `<h2>Featured Items</h2><ul>${featuredItems.map((item) => `<li>${escapeHtml(item.name)}${item.description ? ' — ' + escapeHtml(item.description) : ''}</li>`).join('')}</ul>`
            : '');
      } else {
        menuSummary = `<p>Explore our full menu of handcrafted beverages and treats.</p>`;
      }
      return (
        `<header>` +
        `<h1>RoCaf\u00e9 Menu</h1>` +
        `<p>Welcome to RoCaf\u00e9, where quality meets convenience. Enjoy our premium selection of beverages and food, crafted fresh daily with the finest ingredients.</p>` +
        `</header>` +
        `<main>${menuSummary}</main>`
      );
    }

    case '/locations': {
      let locationContent = '';
      if (activeLocations.length > 0) {
        locationContent = activeLocations
          .map(
            (l) =>
              `<article>` +
              `<h2>${escapeHtml(l.name)}</h2>` +
              `<p>${escapeHtml(l.address?.formatted || l.address?.street || '')}</p>` +
              (l.contact?.phone ? `<p>Phone: ${escapeHtml(l.contact.phone)}</p>` : '') +
              (l.hours?.display ? `<p>Hours: ${escapeHtml(l.hours.display)}</p>` : '') +
              (l.services && l.services.length > 0
                ? `<p>Services: ${l.services.map((s) => escapeHtml(s.replace(/_/g, ' '))).join(', ')}</p>`
                : '') +
              `</article>`
          )
          .join('');
      } else if (loc) {
        locationContent =
          `<article>` +
          `<h2>${escapeHtml(loc.name)}</h2>` +
          `<p>${escapeHtml(address.formatted || '')}</p>` +
          `<p>Phone: ${escapeHtml(contact.phone || '')}</p>` +
          `<p>Hours: ${escapeHtml(loc.hours?.display || '')}</p>` +
          `</article>`;
      }
      return (
        `<header>` +
        `<h1>Our Locations</h1>` +
        `<p>Visit us at any of our convenient locations. We're here to serve you with quality products and exceptional service.</p>` +
        `</header>` +
        `<main>${locationContent}</main>`
      );
    }

    case '/contact':
      return (
        `<header>` +
        `<h1>Contact Us</h1>` +
        `<p>Have a question or feedback? We'd love to hear from you! Reach out through any of the methods below.</p>` +
        `</header>` +
        `<main>` +
        `<p>${escapeHtml(address.formatted || '3-189 Wellington Street, Sarnia, ON N7T 1G6')}</p>` +
        `<p>Phone: ${escapeHtml(contact.phone || '+1 (382) 342-2000')}</p>` +
        `<p>Email: ${escapeHtml(contact.email || 'contact@romamart.ca')}</p>` +
        `<p>Hours: ${escapeHtml(loc?.hours?.display || '')}</p>` +
        `</main>`
      );

    case '/about':
      return (
        `<header>` +
        `<h1>About Roma Mart</h1>` +
        `<p>Roma Mart is your trusted neighborhood convenience store, proudly serving the Sarnia community. ` +
        `We're more than just a store \u2013 we're your local partners in convenience, quality, and service.</p>` +
        `</header>` +
        `<main>` +
        `<p>From our fresh RoCaf\u00e9 offerings to our comprehensive range of services, we strive to be your ` +
        `one-stop destination for everything you need, delivered with a smile.</p>` +
        `</main>`
      );

    case '/return-policy':
      return (
        `<header><h1>Return Policy</h1></header>` +
        `<main>` +
        `<p>At Roma Mart, all sales are final. Due to the nature of convenience store products (food, beverages, tobacco, lottery, and personal items), ` +
        `we are unable to accept returns or offer refunds or exchanges on purchased items.</p>` +
        `<p>If you receive a faulty or defective product, please report it within 24 hours of purchase with your receipt for review.</p>` +
        `</main>`
      );

    case '/accessibility':
      return (
        `<header><h1>Accessibility Statement</h1></header>` +
        `<main>` +
        `<p>Roma Mart is committed to ensuring digital accessibility for people with disabilities. ` +
        `We continually improve the user experience for everyone and apply the relevant accessibility standards ` +
        `to achieve WCAG 2.2 Level AA compliance.</p>` +
        `</main>`
      );

    case '/privacy':
      return (
        `<header><h1>Privacy Policy</h1></header>` +
        `<main>` +
        `<p>Roma Mart Convenience respects your privacy. This policy explains how we collect, use, and protect your personal information ` +
        `when you visit our website or use our services.</p>` +
        `</main>`
      );

    case '/terms':
      return (
        `<header><h1>Terms of Service</h1></header>` +
        `<main>` +
        `<p>Welcome to Roma Mart. By accessing or using our website and services, you agree to be bound by these terms and conditions. ` +
        `Please read them carefully before using our services.</p>` +
        `</main>`
      );

    case '/cookies':
      return (
        `<header><h1>Cookie Policy</h1></header>` +
        `<main>` +
        `<p>Roma Mart uses cookies and similar technologies to improve your browsing experience, ` +
        `analyze site traffic, and personalize content. This policy explains what cookies are, ` +
        `how we use them, and your choices regarding their use.</p>` +
        `</main>`
      );

    default:
      return '';
  }
}

async function prerender() {
  const distPath = path.resolve(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('Build output not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Inject hashed Vite bundle filenames into service worker precache list
  injectServiceWorkerPrecache(distPath);

  // Inject SSOT location data into offline page
  injectOfflineLocationData(distPath);

  // Fetch all API data in parallel for maximum efficiency
  console.log('\n📡 Fetching API data for prerendering...\n');
  const [menuItems, services, locations] = await Promise.all([
    fetchMenuData(),
    fetchServicesData(),
    fetchLocationsData(),
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
    // Non-root routes are served as dir/index.html so canonical URL needs trailing slash
    // Root route: BASE_URL + '/' to match <link rel="canonical" href="https://romamart.ca/" />
    const absoluteUrl = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}/`;
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
      .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${absoluteUrl}" />`)
      .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${absoluteUrl}" />`)
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
        /<\/head>/,
        `<script type="application/ld+json">${buildStructuredData(route.path, { menuItems, services, locations })}</script>\n  </head>`
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root">${buildStaticContent(route.path, { menuItems, services, locations })}</div>`
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

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
