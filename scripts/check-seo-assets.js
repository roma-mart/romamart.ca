import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REDIRECTS } from './generate-redirects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://romamart.ca';
const ROUTES = [
  '/',
  '/services',
  '/rocafe',
  '/return-policy',
  '/locations',
  '/contact',
  '/about',
  '/accessibility',
  '/privacy',
  '/terms',
  '/cookies',
];

const distPath = path.resolve(__dirname, '../dist');
const publicPath = path.resolve(__dirname, '../public');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readFileSafe(filePath) {
  assert(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf-8');
}

function checkRobots() {
  const robotsPath = path.join(publicPath, 'robots.txt');
  const robots = readFileSafe(robotsPath);
  assert(robots.includes('User-agent:'), 'robots.txt missing User-agent directive');
  assert(robots.includes('Sitemap:'), 'robots.txt missing Sitemap directive');
  assert(robots.includes(`Sitemap: ${BASE_URL}/sitemap.xml`), `robots.txt Sitemap should be ${BASE_URL}/sitemap.xml`);
}

function checkSitemap() {
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  const sitemap = readFileSafe(sitemapPath);

  ROUTES.forEach((route) => {
    // All URLs use trailing slashes to match dir/index.html serving structure
    const url = route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml missing URL: ${url}`);
  });
}

// Per-route required schema @types.
// REQUIRED entries must be present or the check fails.
// WARN entries log a warning but do not fail.
//
// Note on naming conventions:
//   "ServiceList"  — shorthand for an ItemList whose items are @type Service.
//                    Detected by requiring both 'ItemList' and 'Service' @types.
//   "LocationList" — shorthand for an ItemList whose items are @type LocalBusiness.
//                    The /locations page is the only route where ItemList is required.
//   "ItemList"     — on /rocafe, denotes the menu ProductList (items are @type Product).
//
// The actual schema.org @type strings are 'ItemList', 'Service', 'Product', etc.
// buildServiceListSchema → ItemList + Service
// buildLocationListSchema → ItemList + LocalBusiness items
// buildProductListSchema → ItemList + Product items
const ROUTE_SCHEMA_REQUIREMENTS = {
  '/': {
    required: ['LocalBusiness', 'WebSite', 'FAQPage'],
    // Homepage SHOULD have a featured-item ItemList and a Service ItemList for richer snippets
    warn: ['ItemList', 'Service'],
  },
  '/services': {
    // ServiceList = ItemList (container) + Service (items)
    required: ['LocalBusiness', 'Service', 'ItemList'],
    warn: [],
  },
  '/rocafe': {
    // Menu ItemList = ItemList (container) + Product (items)
    required: ['LocalBusiness', 'ItemList', 'Product'],
    warn: [],
  },
  '/locations': {
    // LocationList = ItemList (container); LocalBusiness items are already asserted via 'LocalBusiness'
    required: ['LocalBusiness', 'ItemList'],
    warn: [],
  },
  // All other routes fall through to the default below
};
const DEFAULT_SCHEMA_REQUIREMENTS = { required: ['LocalBusiness', 'WebSite'], warn: [] };

function checkRouteHtml() {
  ROUTES.forEach((route) => {
    const filePath =
      route === '/' ? path.join(distPath, 'index.html') : path.join(distPath, route.slice(1), 'index.html');

    const html = readFileSafe(filePath);
    // All URLs use trailing slashes to match dir/index.html serving structure
    const canonical = route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}/`;

    assert(html.includes(`rel="canonical" href="${canonical}"`), `Missing canonical for ${route}`);
    assert(html.includes(`property="og:url" content="${canonical}"`), `Missing og:url for ${route}`);
    assert(html.includes(`property="twitter:url" content="${canonical}"`), `Missing twitter:url for ${route}`);
    assert(html.includes('application/ld+json'), `Missing JSON-LD for ${route}`);
    assert(/<h1[^>]*>/.test(html), `Missing <h1> in prerendered HTML for ${route}`);

    // Collect all @type values from every JSON-LD block on the page
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    const schemaTypes = new Set();
    let jsonLdMatch;
    while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
      let parsed;
      try {
        parsed = JSON.parse(jsonLdMatch[1]);
      } catch (e) {
        throw new Error(`Invalid JSON-LD in ${route}: ${e.message}`);
      }
      // Collect @type strings from the top-level object and any @graph array
      const collectTypes = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (obj['@type']) schemaTypes.add(obj['@type']);
        if (Array.isArray(obj['@graph'])) {
          obj['@graph'].forEach(collectTypes);
        }
        // Also recurse into itemListElement items
        if (Array.isArray(obj.itemListElement)) {
          obj.itemListElement.forEach((el) => collectTypes(el.item || el));
        }
      };
      collectTypes(parsed);
    }

    // Per-route schema @type assertions
    const { required, warn } = ROUTE_SCHEMA_REQUIREMENTS[route] || DEFAULT_SCHEMA_REQUIREMENTS;
    required.forEach((type) => {
      assert(
        schemaTypes.has(type),
        `Route ${route}: missing required schema @type "${type}" (found: ${[...schemaTypes].join(', ') || 'none'})`
      );
    });
    warn.forEach((type) => {
      if (!schemaTypes.has(type)) {
        console.warn(`[seo-check] Route ${route}: schema @type "${type}" not present (SHOULD include for SEO)`);
      }
    });

    // Non-empty <main> assertion — prerendered content must be substantive
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    const mainContent = mainMatch ? mainMatch[1].trim() : '';
    assert(
      mainContent.length > 100,
      `Route ${route}: <main> content is too short (${mainContent.length} chars) — prerender may have produced empty output`
    );
  });
}

function checkRedirectStubs() {
  for (const { from, to } of REDIRECTS) {
    const isHtml = from.endsWith('.html');
    const outPath = isHtml
      ? path.join(distPath, from.replace(/^\//, ''))
      : path.join(distPath, from.replace(/^\//, ''), 'index.html');

    assert(fs.existsSync(outPath), `Missing redirect output for ${from} -> ${to}: ${outPath}`);

    const content = fs.readFileSync(outPath, 'utf-8');

    // If the file has no redirect stub marker it's a real prerendered page — writeRedirects intentionally skipped it
    if (!content.includes('<!-- roma-mart-redirect-stub -->')) continue;

    assert(
      content.includes('<meta name="robots" content="noindex,follow">'),
      `Redirect stub for ${from} missing <meta name="robots" content="noindex,follow">`
    );
    assert(
      content.includes(`url=${to}`),
      `Redirect stub for ${from} has wrong meta refresh target (expected url=${to})`
    );
  }
}

try {
  checkRobots();
  checkSitemap();
  checkRouteHtml();
  checkRedirectStubs();
  console.log('✅ SEO assets check passed');
} catch (error) {
  console.error(`❌ SEO assets check failed: ${error.message}`);
  process.exit(1);
}
