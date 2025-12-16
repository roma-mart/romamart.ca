/* eslint-env node */
/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to prerender
const routes = [
  { path: '/', title: 'Home' },
  { path: '/services', title: 'Services' },
  { path: '/rocafe', title: 'RoCafé Menu' },
  { path: '/locations', title: 'Locations' },
  { path: '/contact', title: 'Contact' },
  { path: '/about', title: 'About Us' },
  { path: '/accessibility', title: 'Accessibility' },
  { path: '/privacy', title: 'Privacy' },
  { path: '/terms', title: 'Terms' },
  { path: '/cookies', title: 'Cookies' }
];

const REPO_NAME = 'romamart.ca';
const BASE_PATH = `/`;

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
    const html = indexTemplate
      .replace(
        /<title>[^<]*<\/title>/,
        `<title>Roma Mart - ${route.title} | Groceries, Coffee & More in Sarnia, ON</title>`
      )
      .replace(
        /<meta property="og:url" content="[^"]*" \/>/,
        `<meta property="og:url" content="${BASE_PATH}${route.path.slice(1)}" />`
      );

    fs.writeFileSync(outputPath, html);
    console.log(`  ✓ ${outputPath}`);
  }

  console.log('\n✓ Prerendering complete!');
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
