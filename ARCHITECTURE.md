# Architecture

## Stack
- Vite 7, React 19
- ESM modules
- CSS variables, Tailwind utility classes

## Structure
- src/components: reusable UI
- src/pages: routed pages with Helmet
- src/hooks: custom hooks (service worker, location)
- src/design: tokens, theming
- scripts: quality and integrity checkers
- public: static assets, manifest

## Routing
- Client-side routing by pathname; SSG via vite-ssg optional

## Theming
- Design tokens in `src/design/tokens.js`
- CSS variables in `src/index.css`

## Data
- Location data in `src/data/locations.js`

## Build
- Vite build; prerender script `scripts/prerender.js`
- Quality preflight before build

## Deployment
- gh-pages from `dist` via `npm run deploy`

## Conventions
- Use CSS vars, avoid raw hex
- Import only needed icons
- Lazy load pages
- Helmet for SEO