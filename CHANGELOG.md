# Changelog

All notable changes to the Roma Mart 2.0 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.7.1] - 2026-02-17

### Fixed
- iOS PWA safe-area: pinned navbar to `top-0 inset-x-0` and removed redundant body `padding-top` that created a transparent gap above the navbar
- WCO: hid mobile hamburger in WCO mode (overflow dropdown handles all widths), preventing overlap with Windows minimize/maximize/close buttons
- WCO: increased button spacing from 8px to 12px gap and added link padding for the 600px+ tier
- Navbar: added 16px minimum gap between logo wordmark and navigation links at ~768px

### Changed
- Bumped `stylelint` 17.2.0 → 17.3.0 (17 bug fixes, 3x perf)
- Bumped `lucide-react` 0.563.0 → 0.564.0 (new icons, icon shape fixes)
- Bumped `jsdom` 28.0.0 → 28.1.0 (getComputedStyle specificity fix, perf)

## [2.7.0] - 2026-02-15

### Added
- WCO progressive collapse with 3-tier breakpoints (wide ≥600px, medium ≥450px, narrow <450px)
- WCO overflow dropdown for secondary nav links (Contact, About) with Framer Motion animation
- iOS standalone PWA safe-area support via `paddingTop: env(safe-area-inset-top)`
- `--shadow-lg` CSS variable for navbar overflow dropdown shadow
- `accent` color in Tailwind config mapped to `var(--color-accent)` for `ring-accent` utility

### Fixed
- WCO nav links: switched from label-based to href-based constants for stability
- WCO overflow: replaced `role="menu"` with disclosure pattern (`aria-expanded` + `aria-controls`)
- WCO click-outside handler: defensive null ref handling + auto-close when WCO deactivates
- Overflow items: added `focus-visible` outline ring
- Tailwind config: replaced hardcoded hex brand colors with CSS variable references

## [2.6.7] - 2026-02-12

### Changed
- Updated 10 dependencies to latest within-range versions
- Added Dependabot ignore rules for deferred major upgrades (React 19, Tailwind v4, hCaptcha v2)

### Removed
- Removed dead dependencies: `vite-ssg`, `vite-plugin-pages` (unused Vue SSG libraries)
- Removed dead `build:ssg` npm script

## [2.6.6] - 2026-02-10

### Added
- Partner service logos for NowPrepay (`public/images/NowPrepayLogo.webp`)
- Partner service logo for SmartHub (`public/images/logo-smarthub.png`)
- Partner service logo for RIA Money Transfer (`public/images/ria-logo.svg`)

### Changed
- Code formatting improvements in `src/data/services.jsx` (normalized imports, trailing commas, string literals)

## [2.6.5] - 2026-02-09

### Changed
- **Documentation:** Resolved all 10 documentation-vs-reality discrepancies from expert audit (Section 4)
- React version references corrected from 19 to 18.3.1 across all docs (14 files)
- Test counts updated from 83/122 to 18 files / 260 tests
- Quality dimensions updated from 8 to 9 (brand consistency added)
- Git hooks updated from "Future" to "Active -- Husky v9" with correct paths
- Base path documentation simplified to actual `base: '/'` config
- API status clarified: Menu live, Services/Locations pending (#107) with static fallback
- Stale `check-dark-mode.js` references removed (consolidated into check-quality.js)
- Progressive enforcement section updated to reflect current strict enforcement state
- ROADMAP.md, EXPERT_AUDIT_FEB_2026.md, STRUCTURED_DATA_MASTER_PLAN.md moved to `docs/archive/`
- All cross-references updated for archived files

## [2.6.4] - 2026-02-09

### Added
- Vite dev server proxy for `/api/*` routes (bypasses CORS when Vite auto-increments ports)
- Loading spinner and error state with retry on RoCafe menu page
- `refetch()` method on `useMenu()` for in-place retry without full page reload
- Static HTML content injection into prerendered pages for non-JS crawlers (h1, descriptions, structured content per route)
- `<h1>` presence assertion in SEO asset checker
- `dns-prefetch` hints for Netlify API and Google Places API
- ESM Stylelint config replacing CommonJS `.stylelintrc.cjs`

### Changed
- **Dependencies:** vite 7.2.6→7.3.1, framer-motion 12.23→12.33, lucide-react 0.554→0.563, globals 16.5→17.3, eslint 9.39→10.0, @eslint/js 9.39→10.0, eslint-plugin-react-refresh 0.4→0.5, stylelint 16.26→17.1, stylelint-config-standard 36→40, jsdom 27.3→28.0
- **GitHub Actions:** checkout v4→v6, setup-node v4→v6, upload-artifact v4→v6, download-artifact v4→v7
- Context providers use relative API URLs in dev mode (Vite proxy), full URLs in production
- `useGooglePlaceHours` hook uses camelCase `fields` parameter (fixes 400 errors)
- `StandardizedItem` narrowed CSS transitions (`transition-all` → `transition-colors`/`transition-transform`)
- Trailing slashes enforced on all sitemap URLs, canonical URLs, breadcrumb schemas, structured data URLs, IndexNow pings, and `COMPANY_DATA.endpoints`
- `escapeHtml()` applied to offline page location data injection

### Fixed
- 2 `no-useless-assignment` violations (new ESLint 10 rule)
- Stylelint 17 false positives for `window-controls-overlay` and `prefers-contrast: high`
- Missing `<h1>` and insufficient content for non-JS crawlers (Bing Webmaster issues)
- Trailing slash mismatch between sitemap/canonical URLs and served paths
- `/return-policy` missing from SEO asset checker routes

### Removed
- `.stylelintrc.cjs` (replaced by ESM config)
- Legacy `/* eslint-env node */` comments from scripts
- Static `LOCATIONS` import from prerender.js (aligned with API-only migration)

## [2.6.3] - 2026-02-08

### Added
- Prettier config, `.prettierignore`, format-on-commit via lint-staged
- Border-radius design tokens in `src/design/tokens.js`
- `heroBadge` field in `COMPANY_DATA` for data-driven hero badge text

### Changed
- Footer social icons use inline SVGs instead of FontAwesome
- Hero badge text sourced from `COMPANY_DATA.heroBadge`

### Fixed
- 10 ungated `console.warn` calls wrapped with `import.meta.env.DEV` guard

### Removed
- `xlsx` dependency (~230KB), unused `readExcelFile.js` and `MenuExcelHolder.jsx`
- FontAwesome packages (replaced with inline SVGs)
- Redundant `title` attribute on footer social links (screen reader double-announce)

## [2.6.2] - 2026-02-08

### Added
- Custom 404 page with branded display, nav links, breadcrumb schema, and noindex meta
- IndexNow protocol integration for Bing/Yandex instant indexing
- `og:locale` and `og:site_name` meta tags
- Service helper and NotFoundPage tests (260 tests total)

### Fixed
- Broken SearchAction removed from WebSite schema (nonexistent `/search` endpoint)
- Service helpers referenced nonexistent `.comingSoon` property
- Hardcoded URLs in `breadcrumbSchema.js` replaced with `COMPANY_DATA.baseUrl`
- TrustpilotWidget rewritten with `useRef` + `loadFromElement()` (replaces fragile 3s setTimeout)
- Route matching uses exact `switch` instead of `.includes()`
- Unknown routes now show 404 page instead of falling through to home

## [2.6.1] - 2026-02-08

### Added
- Test coverage for `calculateItemPrice`, `getDefaultSelections`, `getCaloriesForSize`, `validateSelections`, `ApiCircuitBreaker`, `MenuContext`, `ServicesContext`, `LocationsContext`
- Coverage thresholds: statements 60%, branches 50%, functions 60%, lines 60%

### Fixed
- FooterLinks hover color CSS specificity issue
- Contact form double submission when hCaptcha re-fires
- hCaptcha response check uses `data.success` instead of `response.ok`
- hCaptcha widget reset and token lifecycle (expire/error handlers)

## [2.6.0] - 2026-02-08

### Added
- Unified `ImageCarousel` with ARIA carousel pattern, 44px targets, auto-advance
- Unified `ContactForm` component with phone field and toast feedback
- `FooterReviews`, `FooterLinks`, `FooterLocation` sub-components
- `LoadingFallback` branded Suspense fallback
- Button `size` prop, `inverted` and `secondary` variants
- Google Consent Mode v2 defaults

### Changed
- `ErrorBoundary` rewritten with branded UI and Refresh/Go Home actions
- Footer decomposed into sub-components
- Button base styles unified with spring animation
- `LocationsContext` is now SSOT for selected location
- `LocationProvider` moved to root (`main.jsx`)
- `findNearestLocation` requires explicit locations list

### Fixed
- LocationsPage carousel arrow direction
- Production `console.log` in render paths
- Review count pluralization
- Double X close button in mobile navbar

### Removed
- `LocationImageCarousel` (replaced by unified `ImageCarousel`)
- Duplicate contact form code
- Dead `roma_mart_user_lat`/`roma_mart_user_lng` localStorage keys

## [2.5.0] - 2026-02-07

### Added
- PWA update notification with focus trap and ARIA dialog
- Build-time injection pipeline: Vite bundle precaching, SSOT location data, auto-versioned SW cache
- Apple PWA meta tags and modern manifest fields
- Navigation preload in service worker
- `trimCache()` with bounded cache entries

### Changed
- SW cache version auto-generated from build asset hash
- `skipWaiting()` now user-controlled via update prompt

### Fixed
- Broken `icon-192.svg` favicon reference
- Broken `/src/index.css` link in `offline.html`
- Offline page stale location data
- Dual `skipWaiting()` race condition

### Removed
- ~140 lines dead background sync code from `sw.js`
- `useBackgroundSync` hook (never functional)

## [2.4.1] - 2026-02-07

### Added
- `.editorconfig` for consistent editor settings
- Dependabot config for weekly dependency updates
- Commitlint with Conventional Commits enforcement
- lint-staged for scoped pre-commit linting

### Changed
- CI consolidated from 2 workflows to 1 (7 jobs → 4, 3 builds → 1)
- Build artifacts shared via upload-artifact
- Pre-commit hook uses lint-staged instead of full lint

### Fixed
- Husky v9 installed and configured (was completely non-functional)
- `check:integrity` added to CI pipeline

### Removed
- Dead `precommit` and `prepush` npm scripts
- Redundant `report` and `publish` CI jobs

## [2.4.0] - 2026-02-07

### Added
- `useFocusTrap` hook for WCAG-compliant keyboard focus management
- Focus traps on mobile nav menu and PWA install prompt
- Client-side form validation with ARIA attributes
- `autoComplete` attributes on contact form fields
- `aria-label` on social media links
- `role="status"`/`role="alert"` with `aria-live` on loading/error states
- Pause-on-hover/focus for carousels with `prefers-reduced-motion` support
- Accessibility page (`/accessibility`)

### Changed
- Heading hierarchy corrected across Footer, ContactPage, ServicesPage
- Muted text pattern uses `var(--color-text-muted)` instead of inline `opacity`
- Hardcoded colors replaced with CSS variables in AccessibilityPage

### Removed
- Hallucinated ISO/IEC 40500 and EN 301 549 references from Accessibility page

## [2.3.3] - 2026-02-06

### Changed
- Throttled Navbar scroll handler with `requestAnimationFrame` + `{ passive: true }`
- Extracted `LocationButton` from `Button` (geolocation hook only runs when needed)
- Non-animated Button variants render plain `<button>`/`<a>` instead of `<motion.button>`

### Fixed
- 72 instances of invalid `var(--font-heading)` in className attributes
- Body font corrected from Outfit to Inter
- Hero animations respect `prefers-reduced-motion`
- `LocationButton` wired to `LocationContext` for single source of truth
- Navbar RAF callback cancelled on unmount

### Removed
- Dead `useBatteryStatus` import
- `location` variant from Button component

## [2.3.1] - 2026-02-06

### Added
- ProductList, ServiceList, LocationList schemas prerendered at build time
- Consolidated API fetching in prerender.js with Promise.all

### Changed
- Services and Locations APIs fetched at build time for schemas

### Fixed
- Schema.org validator detection for ProductList schemas
- `StandardizedItem.jsx` uses ServicesContext instead of static import

## [2.3.0] - 2026-02-06

### Added
- 13 Schema.org types: Product, Service, Location, LocalBusiness, Organization, WebSite, MerchantReturnPolicy, WebApplication, BreadcrumbList
- MenuContext, ServicesContext, LocationsContext with API fallback
- Circuit breaker for Google Places API
- IndexedDB caching for live hours and ratings

### Fixed
- Empty @id bug in Product, Service, Location schemas
- Invalid fields in Organization and LocalBusiness schemas
- CodeQL sanitization vulnerability

## [2.2.0] - 2025-12-07

### Added
- Unified Button component with navlink/action/order/mini variants
- Centralized `company_data.js` and `navigation.js` configs
- Location-aware StandardizedItem component
- About page

### Changed
- All CTAs use unified Button component
- Navbar and Footer use centralized config
- Typography system: Outfit + Inter replace Poppins

### Fixed
- Navigation link accessibility
- Logo display in light/dark modes
- Footer responsive grid layout

## [2.1.0] - 2025-12-04

### Added
- RoCafe standardized menu system with dynamic pricing
- StandardizedItem component with expand/collapse
- Multi-size pricing with customization options
- Allergen warnings and dietary tags
- Featured menu items on homepage

### Fixed
- StandardizedItem accessibility and dark mode
- Zero price display handling

## [2.0.0] - 2025-12-03

### Added
- Complete rewrite: React 18 + Vite 7, ESM modules, manual chunking
- PWA with service worker, offline support, install prompts
- GitHub Pages deployment with prerendering
- Quality system: universal checker (1000+ rules), meta-checker, ESLint, Stylelint
- WCAG 2.2 AA: keyboard nav, screen reader optimization, focus indicators, skip links
- Dark mode, high contrast, forced-colors support via CSS custom properties
- Design token system (colors, typography, spacing)
- Multi-location management with auto-detection and Google Maps
- Contact form with offline queuing
- Toast notification system
- Google Tag Manager, GA4, Consent Mode, Trustpilot, Snap Pixel
- LocalBusiness structured data, meta tags, sitemap, robots.txt

[Unreleased]: https://github.com/roma-mart/romamart.ca/compare/v2.7.1...HEAD
[2.7.1]: https://github.com/roma-mart/romamart.ca/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/roma-mart/romamart.ca/compare/v2.6.7...v2.7.0
[2.6.7]: https://github.com/roma-mart/romamart.ca/compare/v2.6.6...v2.6.7
[2.6.6]: https://github.com/roma-mart/romamart.ca/compare/v2.6.5...v2.6.6
[2.6.5]: https://github.com/roma-mart/romamart.ca/compare/v2.6.4...v2.6.5
[2.6.4]: https://github.com/roma-mart/romamart.ca/compare/v2.6.3...v2.6.4
[2.6.3]: https://github.com/roma-mart/romamart.ca/compare/v2.6.2...v2.6.3
[2.6.2]: https://github.com/roma-mart/romamart.ca/compare/v2.6.1...v2.6.2
[2.6.1]: https://github.com/roma-mart/romamart.ca/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/roma-mart/romamart.ca/compare/v2.5.0...v2.6.0
[2.5.0]: https://github.com/roma-mart/romamart.ca/compare/v2.4.1...v2.5.0
[2.4.1]: https://github.com/roma-mart/romamart.ca/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/roma-mart/romamart.ca/compare/v2.3.3...v2.4.0
[2.3.3]: https://github.com/roma-mart/romamart.ca/compare/v2.3.1...v2.3.3
[2.3.1]: https://github.com/roma-mart/romamart.ca/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/roma-mart/romamart.ca/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/roma-mart/romamart.ca/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/roma-mart/romamart.ca/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/roma-mart/romamart.ca/releases/tag/v2.0.0
[1.x]: https://github.com/roma-mart/romamart.ca/releases/tag/v1.0.0
