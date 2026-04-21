import fs from 'fs';
import path from 'path';

export const REDIRECTS = [
  { from: '/privacypolicy.html', to: '/privacy/' },
  { from: '/blogpage.html', to: '/' },
  { from: '/blogposts/post1.html', to: '/' },
  { from: '/blogposts/post2.html', to: '/' },
  { from: '/privacy', to: '/privacy/' },
  { from: '/cookies', to: '/cookies/' },
  { from: '/services', to: '/services/' },
  { from: '/rocafe', to: '/rocafe/' },
  { from: '/terms', to: '/terms/' },
  { from: '/contact', to: '/contact/' },
  { from: '/about', to: '/about/' },
  { from: '/accessibility', to: '/accessibility/' },
  { from: '/return-policy', to: '/return-policy/' },
  { from: '/locations', to: '/locations/' },
];

const buildStub = (to) =>
  `<!doctype html><html><head>` +
  `<meta charset="utf-8"><title>Redirecting\u2026</title>` +
  `<link rel="canonical" href="https://romamart.ca${to}">` +
  `<meta http-equiv="refresh" content="0; url=${to}">` +
  `<meta name="robots" content="noindex,follow">` +
  `</head><body><p>Redirecting to <a href="${to}">${to}</a>\u2026</p>` +
  `<script>location.replace('${to}')<\/script></body></html>\n`;

export function writeRedirects(distDir) {
  let written = 0;
  for (const { from, to } of REDIRECTS) {
    const isHtml = from.endsWith('.html');
    const outPath = isHtml
      ? path.join(distDir, from.replace(/^\//, ''))
      : path.join(distDir, from.replace(/^\//, ''), 'index.html');

    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Don't overwrite a real prerendered page (e.g. /services/index.html already exists)
    if (fs.existsSync(outPath)) {
      const existing = fs.readFileSync(outPath, 'utf-8');
      if (!existing.includes('noindex,follow')) {
        continue;
      }
    }

    fs.writeFileSync(outPath, buildStub(to));
    written++;
  }
  console.log(`✓ Wrote ${written} redirect stub(s)`);
}
