import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import COMPANY_DATA from '../src/config/company_data.js';
import { buildMenuItemSchema } from '../src/schemas/menuItemSchema.js';
import { buildServiceListSchema } from '../src/schemas/serviceSchema.js';
import { buildLocationListSchema } from '../src/schemas/locationSchema.js';
import { buildFAQSchema } from '../src/schemas/faq.js';
import { writeRedirects } from './generate-redirects.js';
import { getAggregateRating } from './fetch-places-rating.js';
// Static fallbacks — plain-JS exports compatible with Node (no JSX).
// Used when the corresponding API is unreachable at build time so that
// prerendered HTML always contains meaningful content and JSON-LD schemas.
import { SERVICES_PLAIN as STATIC_SERVICES } from '../src/data/services-plain.js';
import { LOCATIONS as STATIC_LOCATIONS } from '../src/data/locations.js';
import { ROCAFE_FULL_MENU as STATIC_MENU } from '../src/data/rocafe-menu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When STRICT_PRERENDER=1 any API failure throws instead of falling back.
// Useful in CI to catch regressions in API availability early.
const STRICT_PRERENDER = process.env.STRICT_PRERENDER === '1';

// API endpoints — reads from VITE_API_BASE_URL env var, same as runtime contexts
const API_BASE = (process.env.VITE_API_BASE_URL || 'https://romamart.netlify.app').replace(/\/+$/, '');
const API_KEY = process.env.VITE_API_KEY;
const API_HEADERS = API_KEY ? { 'X-API-Key': API_KEY } : {};
const MENU_API_URL = `${API_BASE}/api/v1/public-menu`;
const SERVICES_API_URL = `${API_BASE}/api/v1/public-services`;
const LOCATIONS_API_URL = `${API_BASE}/api/v1/public-locations`;

// Routes to prerender
const BASE_URL = 'https://romamart.ca';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_TW_IMAGE = `${BASE_URL}/twitter-card.jpg`;
const DEFAULT_IMAGE_ALT = 'Roma Mart storefront and branding';

const routes = [
  {
    path: '/',
    title: 'Home',
    fullTitle: 'Roma Mart \u2014 Sarnia Convenience Store | Halal Meat, Bitcoin ATM, Coffee',
    description:
      "Sarnia's convenience store on Wellington St. Halal meat, Bitcoin ATM, global snacks, RoCaf\u00e9 coffee, lottery & tobacco. Open 7 days.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    sourceFile: 'src/pages/HomePage.jsx',
  },
  {
    path: '/services',
    title: 'Services',
    fullTitle: 'Services at Roma Mart Sarnia \u2014 ATM, Bitcoin, Lottery, Printing, Halal',
    description:
      '15 services in one stop in Sarnia: ATM, Bitcoin ATM, lottery, halal meat counter, printing, photocopying, and more. Open daily on Wellington St.',
    ogImage: `${BASE_URL}/images/romamart-interior1.png`,
    twitterImage: `${BASE_URL}/images/romamart-interior1.png`,
    imageAlt: 'Roma Mart interior showcasing products and services',
    sourceFile: 'src/pages/ServicesPage.jsx',
  },
  {
    path: '/rocafe',
    title: 'RoCaf\u00e9 Menu',
    fullTitle: 'RoCaf\u00e9 \u2014 Coffee, Matcha & Smoothies in Sarnia | Roma Mart',
    description:
      'Fresh espresso, matcha lattes, fruit smoothies and pastries at RoCaf\u00e9 inside Roma Mart Sarnia. Open daily on Wellington St.',
    ogImage: `${BASE_URL}/rocafe-logo.png`,
    twitterImage: `${BASE_URL}/rocafe-logo.png`,
    imageAlt: 'RoCaf\u00e9 logo and beverage branding',
    sourceFile: 'src/pages/RoCafePage.jsx',
  },
  {
    path: '/return-policy',
    title: 'Return Policy',
    fullTitle: 'Return Policy | Roma Mart Sarnia',
    description:
      'Roma Mart return policy: all sales final except faulty products reported within 24 hours of purchase.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    sourceFile: 'src/pages/ReturnPolicyPage.jsx',
  },
  {
    path: '/locations',
    title: 'Locations',
    fullTitle: 'Roma Mart Locations \u2014 189 Wellington St, Sarnia ON',
    description:
      'Find Roma Mart in Sarnia at 189 Wellington Street. Hours, parking, amenities, directions and photos. Wheelchair accessible with free Wi-Fi.',
    ogImage: `${BASE_URL}/images/romamart-opening1.png`,
    twitterImage: `${BASE_URL}/images/romamart-opening1.png`,
    imageAlt: 'Roma Mart storefront exterior',
    sourceFile: 'src/pages/LocationsPage.jsx',
  },
  {
    path: '/contact',
    title: 'Contact',
    fullTitle: 'Contact Roma Mart Sarnia \u2014 Phone, Email, Hours',
    description:
      'Call (382) 342-2000 or email contact@romamart.ca. Visit us at 189 Wellington Street, Sarnia ON. Open 7 days.',
    ogImage: `${BASE_URL}/images/romamart-interior2.png`,
    twitterImage: `${BASE_URL}/images/romamart-interior2.png`,
    imageAlt: 'Roma Mart interior with shelves and signage',
    sourceFile: 'src/pages/ContactPage.jsx',
  },
  {
    path: '/about',
    title: 'About Us',
    fullTitle: 'About Roma Mart \u2014 Sarnia\u2019s Community Convenience Store',
    description:
      'Family-owned convenience store serving Sarnia since 2025. Halal meat, Bitcoin ATM, RoCaf\u00e9 coffee, global snacks from South Asia and beyond.',
    ogImage: `${BASE_URL}/images/romamart-opening2.png`,
    twitterImage: `${BASE_URL}/images/romamart-opening2.png`,
    imageAlt: 'Roma Mart grand opening event',
    sourceFile: 'src/pages/AboutPage.jsx',
  },
  {
    path: '/accessibility',
    title: 'Accessibility',
    fullTitle: 'Accessibility Statement | Roma Mart Sarnia',
    description:
      'Roma Mart is committed to WCAG 2.2 Level AA compliance. Learn about our accessibility features and how to contact us with accommodation requests.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    sourceFile: 'src/pages/AccessibilityPage.jsx',
  },
  {
    path: '/privacy',
    title: 'Privacy',
    fullTitle: 'Privacy Policy | Roma Mart Sarnia',
    description:
      'Roma Mart Privacy Policy \u2014 how we collect, use, and protect your personal information when you visit our website or use our services.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    sourceFile: 'src/pages/PrivacyPage.jsx',
  },
  {
    path: '/terms',
    title: 'Terms',
    fullTitle: 'Terms of Service | Roma Mart Sarnia',
    description:
      'Roma Mart Terms of Service \u2014 the rules governing use of our website and in-store services at our Sarnia, ON location.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    sourceFile: 'src/pages/TermsPage.jsx',
  },
  {
    path: '/cookies',
    title: 'Cookies',
    fullTitle: 'Cookie Policy | Roma Mart Sarnia',
    description:
      'Roma Mart uses cookies to improve your experience and analyze traffic. Learn what we collect and how to manage your preferences.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TW_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    sourceFile: 'src/pages/CookiesPage.jsx',
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
 * Fetches menu data from API for prerendering ProductList schemas.
 * Falls back to STATIC_MENU (prices in dollars) when the API is unavailable.
 * @returns {Promise<{ items: Array, priceInCents: boolean }>}
 */
async function fetchMenuData() {
  // Normalize static menu items: static data uses a singular `category` string
  // while the API and buildStaticContent expect `categories` as an array.
  const normalizeStaticMenu = (items) =>
    items.map((item) => ({
      ...item,
      categories: item.categories ?? (item.category ? [item.category] : []),
    }));

  const useFallback = (reason) => {
    if (STRICT_PRERENDER) {
      throw new Error(`STRICT_PRERENDER: menu API failed — ${reason}`);
    }
    const normalized = normalizeStaticMenu(STATIC_MENU);
    console.warn(`[prerender] Menu API unavailable (${reason}), using static fallback (${normalized.length} items)`);
    return { items: normalized, priceInCents: false };
  };

  try {
    console.log('Fetching menu data from API for prerendering...');
    const response = await fetch(MENU_API_URL, { headers: API_HEADERS });

    if (!response.ok) {
      return useFallback(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const menuItems = data.menu || [];

    console.log(`✓ Fetched ${menuItems.length} menu items (${menuItems.filter((i) => i.featured).length} featured)`);
    return { items: menuItems, priceInCents: true };
  } catch (error) {
    return useFallback(error.message);
  }
}

/**
 * Fetches services data from API for prerendering ServiceList schemas.
 * Falls back to STATIC_SERVICES when the API is unavailable so that the
 * /services page always has a non-empty ServiceList JSON-LD graph node.
 * @returns {Promise<Array>} Services array
 */
async function fetchServicesData() {
  const useFallback = (reason) => {
    if (STRICT_PRERENDER) {
      throw new Error(`STRICT_PRERENDER: services API failed — ${reason}`);
    }
    console.warn(
      `[prerender] Services API unavailable (${reason}), using static fallback (${STATIC_SERVICES.length} services)`
    );
    return STATIC_SERVICES;
  };

  try {
    console.log('Fetching services data from API for prerendering...');
    const response = await fetch(SERVICES_API_URL, { headers: API_HEADERS });

    if (!response.ok) {
      return useFallback(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.services)) {
      return useFallback('invalid API response shape');
    }

    const services = data.services;
    console.log(
      `✓ Fetched ${services.length} services from API (${services.filter((s) => s.featured).length} featured)`
    );
    return services;
  } catch (error) {
    return useFallback(error.message);
  }
}

/**
 * Fetches locations data from API for prerendering LocationList schemas.
 * Falls back to STATIC_LOCATIONS when the API is unavailable so that the
 * /locations page always has a non-empty LocationList JSON-LD graph node.
 * @returns {Promise<Array>} Locations array
 */
async function fetchLocationsData() {
  const useFallback = (reason) => {
    if (STRICT_PRERENDER) {
      throw new Error(`STRICT_PRERENDER: locations API failed — ${reason}`);
    }
    console.warn(
      `[prerender] Locations API unavailable (${reason}), using static fallback (${STATIC_LOCATIONS.length} locations)`
    );
    return STATIC_LOCATIONS;
  };

  try {
    console.log('Fetching locations data from API for prerendering...');
    const response = await fetch(LOCATIONS_API_URL, { headers: API_HEADERS });

    if (!response.ok) {
      return useFallback(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.locations)) {
      return useFallback('invalid API response shape');
    }

    const locations = data.locations;
    console.log(`✓ Fetched ${locations.length} locations from API`);
    return locations;
  } catch (error) {
    return useFallback(error.message);
  }
}

/**
 * Builds ProductList schema for menu items
 * @param {Array} menuItems - Menu items to include
 * @param {boolean} featuredOnly - Only include featured items
 * @param {boolean} priceInCents - Whether size prices are in cents (API) or dollars (static)
 * @returns {Object|null} ProductList schema or null if no items
 */
function buildProductListSchema(menuItems, featuredOnly = false, priceInCents = true) {
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
        priceInCents, // API uses cents; static fallback uses dollars
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
  const { menuItems = [], services = [], locations = [], aggregateRating = null, menuPriceInCents = true } = apiData;
  const location = COMPANY_DATA.location;
  const address = location?.address || {};
  const contact = location?.contact || {};
  const coords = location?.google?.coordinates || {};
  const hours = location?.hours || {};

  const openingHoursSpecification = hours.daily
    ? Object.entries(hours.daily)
        .map(([day, timeRange]) => {
          if (!timeRange || timeRange === 'Closed' || !timeRange.includes('-')) return null;
          const { opens, closes } = parseHoursRange(timeRange);
          if (!opens || !closes) return null;
          return { '@type': 'OpeningHoursSpecification', dayOfWeek: [day], opens, closes };
        })
        .filter(Boolean)
    : [];

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
      priceRange: COMPANY_DATA.defaults.priceRange,
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
      ...(location?.google?.mapLink ? { hasMap: location.google.mapLink } : {}),
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
      currenciesAccepted: [COMPANY_DATA.defaults.currency, ...(COMPANY_DATA.defaults.cryptoCurrencies || [])].join(
        ', '
      ),
      areaServed: (() => {
        const cities =
          locations.length > 0 ? [...new Set(locations.map((loc) => loc.address?.city).filter(Boolean))] : null;
        return cities?.length > 0 ? cities.map((name) => ({ '@type': 'City', name })) : COMPANY_DATA.serviceArea;
      })(),
      ...(aggregateRating?.ratingValue != null && aggregateRating?.reviewCount != null
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: aggregateRating.ratingValue,
              reviewCount: aggregateRating.reviewCount,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
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
    const productListSchema = buildProductListSchema(menuItems, true, menuPriceInCents);
    if (productListSchema) {
      graph.push(productListSchema);
    }
  }

  // Add ProductList for RoCafé page (all menu items)
  if (routePath === '/rocafe' && menuItems.length > 0) {
    const productListSchema = buildProductListSchema(menuItems, false, menuPriceInCents);
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

const getGitLastMod = (sourceFile, fallback) => {
  try {
    const result = execFileSync('git', ['log', '-1', '--format=%cI', '--', sourceFile], { encoding: 'utf-8' }).trim();
    if (!result) {
      // Empty result usually means a shallow clone; fall back to build date
      console.warn(`[sitemap] git log returned empty for ${sourceFile} — shallow clone? Using build date fallback.`);
      return fallback;
    }
    return result.slice(0, 10);
  } catch {
    return fallback;
  }
};

const buildSitemapXml = (routeList, buildDate) => {
  const urls = routeList
    .map((route) => {
      const lastmod = route.sourceFile ? getGitLastMod(route.sourceFile, buildDate) : buildDate;
      // Trailing slash on all URLs to match canonical links and served dir/index.html structure
      const loc = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}/`;
      return `  <url>\n` + `    <loc>${loc}</loc>\n` + `    <lastmod>${lastmod}</lastmod>\n` + `  </url>`;
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
        `<h1>Sarnia Convenience Store \u2014 Roma Mart on Wellington St</h1>` +
        `<p>Your Sarnia convenience store for halal meat, Bitcoin ATM, RoCaf\u00e9 coffee, global snacks, lottery and tobacco. Open 7 days on Wellington Street.</p>` +
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
        `<h1>Services at Roma Mart \u2014 Sarnia Convenience Store</h1>` +
        `<p>15 services in one stop at our Sarnia convenience store: ATM, Bitcoin ATM, halal meat counter, lottery, printing, photocopying, money transfer, and more.</p>` +
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
        `<h1>Roma Mart Location \u2014 189 Wellington Street, Sarnia ON</h1>` +
        `<p>Find Roma Mart at 3-189 Wellington Street, Sarnia ON. Free parking, wheelchair accessible, open 7 days a week.</p>` +
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
  const [menuResult, services, locations, aggregateRating] = await Promise.all([
    fetchMenuData(),
    fetchServicesData(),
    fetchLocationsData(),
    getAggregateRating(),
  ]);
  const menuItems = menuResult.items;
  const menuPriceInCents = menuResult.priceInCents;
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
    const pageTitle = route.fullTitle || `Roma Mart - ${route.title} | Groceries, Coffee & More in Sarnia, ON`;
    const html = indexTemplate
      .replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`)
      .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${pageTitle}" />`)
      .replace(
        /<meta property="twitter:title" content="[^"]*" \/>/,
        `<meta property="twitter:title" content="${pageTitle}" />`
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
      .replace(/<\/head>/, () => {
        // Escape </script> within JSON strings to prevent premature script tag termination (XSS).
        const escapeJsonLd = (json) => json.replace(/<\/script>/gi, '<\\/script>');
        const mainSchema = `<script type="application/ld+json">${escapeJsonLd(buildStructuredData(route.path, { menuItems, services, locations, aggregateRating, menuPriceInCents }))}</script>`;
        const faqSchema =
          route.path === '/'
            ? `\n  <script type="application/ld+json">${escapeJsonLd(JSON.stringify(buildFAQSchema(COMPANY_DATA)))}</script>`
            : '';
        const placesScript =
          route.path === '/' && aggregateRating?.ratingValue
            ? `\n  <script>window.__PLACES__=${escapeJsonLd(JSON.stringify(aggregateRating))}</script>`
            : '';
        return `${mainSchema}${faqSchema}${placesScript}\n  </head>`;
      })
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

  writeRedirects(distPath);

  console.log('\n✓ Prerendering complete!');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
