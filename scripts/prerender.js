/* eslint-env node */
/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import COMPANY_DATA from '../src/config/company_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const serviceMap = {
  atm: { name: 'ATM Services', type: 'Service', description: 'Cash withdrawal and banking services available 24/7' },
  bitcoin_atm: { name: 'Bitcoin ATM', type: 'Service', description: 'Cryptocurrency buying and selling services' },
  rocafe: { name: 'RoCafé Coffee & Bubble Tea', type: 'Service', description: 'Fresh brewed coffee, signature bubble tea, matcha lattes, and fruit slushes' },
  halal_meat: { name: 'Halal Meat', type: 'Product', description: 'Certified Zabiha Halal meats' },
  printing: { name: 'Printing Services', type: 'Service', description: 'Document printing and copying' },
  package_pickup: { name: 'Package Services', type: 'Service', description: 'Shipping and package handling' },
  package_services: { name: 'Package Services', type: 'Service', description: 'Shipping and package handling' },
  money_transfer: { name: 'Money Transfer', type: 'Service', description: 'Send and receive money worldwide' },
  gift_cards: { name: 'Gift Cards', type: 'Product', description: 'Prepaid and gift cards for major brands' },
  perfumes: { name: 'Perfumes', type: 'Product', description: 'Imported and local fragrances' },
  tobacco: { name: 'Tobacco & Vape Products', type: 'Product', description: 'Wide selection for adult customers (19+)' },
  lottery: { name: 'OLG Lottery', type: 'Service', description: 'Lottery tickets and scratch cards' }
};

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

const normalizeCountry = (country) => {
  if (!country) return 'CA';
  if (country.toUpperCase() === 'CANADA') return 'CA';
  if (country.length === 2) return country.toUpperCase();
  return country;
};

const buildStructuredData = () => {
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

  const services = (location?.services || []).map(service => {
    const mapped = serviceMap[service] || { name: service, type: 'Service', description: '' };
    return {
      '@type': 'Offer',
      itemOffered: {
        '@type': mapped.type,
        name: mapped.name,
        description: mapped.description
      }
    };
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
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
        timeZone: hours.timezone || 'America/Toronto',
        sameAs: Object.values(COMPANY_DATA.socialLinks || {}),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services & Products',
          itemListElement: services
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Wheelchair Accessible', value: true }
        ],
        paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Interac', 'Visa', 'Mastercard', 'American Express', 'Bitcoin']
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
    ]
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
        `<script type="application/ld+json">${buildStructuredData()}</script>`
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
