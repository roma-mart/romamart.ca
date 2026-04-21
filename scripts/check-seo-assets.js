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

    // Validate all JSON-LD blocks are parseable
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let jsonLdMatch;
    while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
      try {
        JSON.parse(jsonLdMatch[1]);
      } catch (e) {
        throw new Error(`Invalid JSON-LD in ${route}: ${e.message}`);
      }
    }
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
