/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://romamart.ca';
const ROUTES = [
  '/',
  '/services',
  '/rocafe',
  '/locations',
  '/contact',
  '/about',
  '/accessibility',
  '/privacy',
  '/terms',
  '/cookies'
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
  assert(
    robots.includes(`Sitemap: ${BASE_URL}/sitemap.xml`),
    `robots.txt Sitemap should be ${BASE_URL}/sitemap.xml`
  );
}

function checkSitemap() {
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  const sitemap = readFileSafe(sitemapPath);

  ROUTES.forEach(route => {
    const url = `${BASE_URL}${route}`;
    assert(
      sitemap.includes(`<loc>${url}</loc>`),
      `sitemap.xml missing URL: ${url}`
    );
  });
}

function checkRouteHtml() {
  ROUTES.forEach(route => {
    const filePath = route === '/'
      ? path.join(distPath, 'index.html')
      : path.join(distPath, route.slice(1), 'index.html');

    const html = readFileSafe(filePath);
    const canonical = `${BASE_URL}${route}`;

    assert(html.includes(`rel="canonical" href="${canonical}"`), `Missing canonical for ${route}`);
    assert(html.includes(`property="og:url" content="${canonical}"`), `Missing og:url for ${route}`);
    assert(html.includes(`property="twitter:url" content="${canonical}"`), `Missing twitter:url for ${route}`);
    assert(html.includes('application/ld+json'), `Missing JSON-LD for ${route}`);
  });
}

try {
  checkRobots();
  checkSitemap();
  checkRouteHtml();
  console.log('✅ SEO assets check passed');
} catch (error) {
  console.error(`❌ SEO assets check failed: ${error.message}`);
  process.exit(1);
}
