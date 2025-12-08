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

## Conventions

---

## Company HQ & Location Data Sourcing

- All headquarters (HQ) info (address, hours, contact, GST, etc.) must only be sourced from `src/config/company_data.js` (`COMPANY_DATA`).
- No hardcoded or duplicated HQ info is allowed in any page or component.
- Dynamic location info for other stores must only be sourced from `src/data/locations.js` and its helpers.
- This ensures a single source of truth for overrides, fallbacks, and future scalability.