# Changelog

All notable changes to the Roma Mart 2.0 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.4.1] - 2026-02-07

### Changed
- CI consolidated from 2 workflow files (`accessibility-ci.yml` + `seo-check.yml`) into single `ci.yml` — 7 jobs reduced to 4, 7x `npm ci` reduced to 2x, 3 full builds reduced to 1
- Build artifacts shared via `actions/upload-artifact` — deploy job reuses build instead of rebuilding
- SEO validation folded into CI `validate` job (was a separate workflow with only 1/3 build secrets)
- `check:all` npm script now includes `check:integrity` in addition to lint, lint:css, and check:quality

### Fixed
- Husky v9 installed and configured with `pre-commit` hook running `npm run check:all` (was completely non-functional — package missing, shim missing, v8 format)
- `check:integrity` (meta-checker) added to CI pipeline — previously ran locally only
- All CI jobs now use `actions/checkout@v4` (was v3 in `html-validation` job)

### Removed
- Dead `precommit` and `prepush` npm scripts — npm does not auto-run these as lifecycle hooks, they created false confidence
- Redundant `report` CI job that re-ran lint and tests just for summary generation
- Redundant `publish` CI job rebuild — deploy now uses shared build artifact
- Broken `.husky/pre-push` hook (v8 format with missing shim file)

### Documentation
- Updated `.github/copilot-instructions.md` — Husky status corrected, test count updated to 12 files / 154 tests

## [2.4.0] - 2026-02-07

### Added
- `useFocusTrap` hook (`src/hooks/useFocusTrap.js`) for WCAG-compliant keyboard focus management in modal dialogs
- Focus trap on mobile navigation menu (`role="dialog"`, `aria-modal`, Tab cycling, Escape to close, focus restore)
- Focus trap on PWA install prompt with Escape handling
- Client-side form validation with `aria-invalid`, `aria-describedby` error messages, and `aria-live` error regions on both contact forms
- `autoComplete` attributes on contact form fields
- `aria-label` on all social media links in Footer
- `role="status"` and `aria-live="polite"` on loading spinners and success messages
- `role="alert"` and `aria-live="assertive"` on error messages
- `aria-describedby` helper text for Footer location selector
- Pause-on-hover/focus for LocationImageCarousel and AboutPage hero carousel auto-advance
- `prefers-reduced-motion` media query check to disable carousel auto-advance
- Accessibility page (`/accessibility`) with WCAG 2.2 AA and AODA compliance statement

### Changed
- Heading hierarchy corrected across Footer, ContactPage, and ServicesPage (h4 -> h3 where appropriate, non-semantic headings -> p)
- Breadcrumb styling standardized across all pages using `var(--color-text-muted)` and consistent hover classes
- Muted text pattern changed from inline `opacity: 0.7` to `var(--color-text-muted)` across 7 pages
- RoCafe sticker alt text improved from generic to descriptive
- `handleDismiss` in PWAInstallPrompt wrapped in `useCallback` to prevent focus trap effect churn
- `AccessibilityPage.jsx` moved from `src/components/` to `src/pages/` (correct directory)
- Hardcoded `color: 'white'` replaced with `var(--color-text-on-primary)` in AccessibilityPage
- Removed hallucinated ISO/IEC 40500 and EN 301 549 standards from Accessibility page (not applicable to Ontario business)
- Added decorative `aria-hidden="true"` to all Lucide and FontAwesome icons used decoratively

### Removed
- Unused `tokens` import from AccessibilityPage
- Redundant inline token styles on AccessibilityPage heading

### Documentation
- `docs/ACCESSIBILITY_COMPLIANCE.md` rewritten with correct WCAG 2.2 success criteria structure and self-audit results
- PR template updated with version/changelog section, improved accessibility checklist, and workflow improvements

## [2.3.3] - 2026-02-06

### Performance
- Throttled Navbar scroll handler with `requestAnimationFrame` + `{ passive: true }` to eliminate 60+ re-renders/sec (R22)
- Extracted `LocationButton` component from `Button` -- geolocation hook only runs when needed, not on every `<Button>` render (R7)
- Added plain `<button>`/`<a>` render path for non-animated Button variants instead of always using `<motion.button>` (R7)

### Fixed
- 72 instances of invalid `var(--font-heading)` in className attributes replaced with `text-heading` utility class or removed (CSS selectors already apply heading font to h1-h3) (R17)
- Body font `--font-body` corrected from Outfit to Inter to match design spec (R19)
- Hero animations now respect `prefers-reduced-motion` via Framer Motion `useReducedMotion()` hook (R6)
- `LocationButton` wired to `LocationContext` instead of independent `useGeolocation()` -- single source of truth for location state (R7)
- `CSS_VARS.heading` (a color variable) was incorrectly used as `fontFamily` in LocationButton -- replaced with `var(--font-heading)`
- `usePageVisibility()` returns a boolean but was destructured as object -- `isVisible` was always undefined
- Disabled `<a>` links now prevent navigation with `e.preventDefault()` and expose `aria-disabled`
- Removed `role="button"` from `<a>` elements to preserve native link semantics for screen readers
- Navbar `requestAnimationFrame` callback now cancelled on unmount to prevent stale state updates
- 5 missing-space class concatenation bugs (e.g. `text-headingtext-xl`) caught and fixed via Copilot review

### Removed
- Dead `useBatteryStatus` import and battery workaround code from App.jsx
- `location` variant from Button component (replaced by standalone LocationButton)
- Independent `useGeolocation()` from LocationButton (replaced by LocationContext)

### Documentation
- Updated `.github/copilot-instructions.md` with typography rules, LocationButton docs, hero image guidance, reduced-motion notes
- Marked `prefers-reduced-motion` as complete in `docs/ACCESSIBILITY_COMPLIANCE.md`
- Added Nice-to-Have section to `docs/ROADMAP.md` with battery-aware motion reduction idea
- Version bumped from 2.3.1 to 2.3.3

## [2.3.1] - 2026-02-06

### Added
- ProductList schemas prerendered into static HTML at build time
- Consolidated API fetching in prerender.js with Promise.all
- Branch safety check for production deployments
- Staging and production deployment separation
- Complete field enumerations in API_MIGRATION_READINESS.md

### Fixed
- Schema.org validator detection for ProductList schemas
- LocationList homepage schema to match display logic
- StandardizedItem.jsx now uses ServicesContext instead of static import
- Service count corrected from 15 to 14 in API documentation (again - final check)
- Service category values corrected in all examples ("food" not "food_beverage")
- Menu API featured field documentation (already exists in API, not missing)
- Frontend readiness status updated to 100% complete in API documentation
- console.info eslint errors in diagnostic logging
- GitHub Pages base path for staging deployment
- SPA routing on GitHub Pages

### Changed
- Services and Locations APIs fetched at build time
- ServiceList and LocationList schemas prerendered when APIs available
- Version bumped from 2.3.0 to 2.3.1
- CHANGELOG.md consolidated (removed verbose prose from 2.3.0 and 2.3.1)

### Documentation
- API_MIGRATION_READINESS.md completely rewritten with comprehensive field specifications
- Company Data API field enumerations added (all valid values for future implementation)
- Image Strategy & CDN Architecture section added (230+ lines covering all APIs)
- Image requirements clarified as CRITICAL for SEO (Google Product rich results require images)
- Deployment Strategy & Implementation Priorities consolidated into single section
- PR description reformatted to follow PULL_REQUEST_TEMPLATE.md structure
- Prerender analysis archived
- Master plan updated with Step 3.1
- Removed outdated "frontend fixes needed" section from API documentation

**Commits:** e0279b9, 2b3dc70, 9823326, 5c0cefe, e803f30, ef04bca, ff4f30f, ce1f285, 2e463e8, 30767f7, 217a741, 69758a7, e5ac42e, 1865a90, 0f5b8e9, 530d1c9, 8f784db, d3cea71, 69a41f9, 69c6308, 13bd068, 2f66d83, fd01980, 49c7826, 119adb6



## [2.3.0] - 2026-02-06

### Added
- 13 Schema.org types implemented: Product, Service, Location, LocalBusiness, Organization, WebSite, MerchantReturnPolicy, WebApplication, BreadcrumbList
- MenuContext for centralized API data management
- ServicesContext with API fallback
- LocationsContext with API fallback
- Circuit breaker for Google Places API
- IndexedDB caching for live hours and ratings
- Google-compliant amenities system
- Sitemap trailing slashes for GitHub Pages routing

### Improved
- Schema compliance: Average 88% → 98%
- All schemas now pull from COMPANY_DATA
- Enhanced COMPANY_DATA with schema endpoints and PWA config
- Cross-schema linking with @id fields
- Brand, category, manufacturer, broker fields added to schemas
- SearchAction added to WebSite schema

### Fixed
- Empty @id bug in Product, Service, Location schemas
- Invalid naicsCode in Organization schema
- Invalid PrivacyPolicy schema type
- Invalid timeZone in LocalBusiness schema
- Invalid availableAtOrFrom in LocalBusiness schema
- Invalid hasOfferCatalog in LocalBusiness
- LocalBusiness schema duplication
- CodeQL sanitization vulnerability
- XSS test accessibility warnings

### Documentation
- STRUCTURED_DATA_MASTER_PLAN.md v5.0.0
- Amenities architecture migration guide
- Schema audit archived

## [2.2.0] - 2025-12-07

### Features

- Unified Button component system with navlink/action/order/mini variants
- Centralized company data in `src/config/company_data.js`
- Centralized navigation links in `src/config/navigation.js`
- Dynamic GST/HST display from company data
- Location-aware StandardizedItem component
- About page with team section

### Improvements

- Refactored all CTAs to use unified Button component
- Navbar and Footer now use centralized config data
- Typography system: Outfit + Inter replace Poppins
- Improved mobile menu overlay with stronger drop shadow
- Enhanced order button animation system-wide

### Fixes

- Navigation link accessibility and ordering
- Mobile menu button responsiveness
- Logo display in light/dark modes
- Footer tag hierarchy and responsive grid layout
- Offline page text contrast

## [2.1.0] - 2025-12-04

### Features

- RoCafé standardized menu system with dynamic pricing
- StandardizedItem component with expand/collapse details
- Full menu data integration from Toolpad API
- Multi-size pricing display with customization options
- Allergen warnings and dietary tags
- Featured menu items on homepage
- Menu item helper utilities
- Services data consolidation

### Improvements

- RoCafé page uses full menu data (no static fallbacks)
- Extracted sub-components from StandardizedItem
- Centralized NRS ordering system
- Consolidated ordering URL to single source of truth

### Fixes

- StandardizedItem accessibility and dark mode
- Chevron icon click propagation
- Zero price display handling
- Phase 0 urgent quality fixes

### Documentation

- Comprehensive StandardizedItem analysis
- RoCafé menu implementation summary
- Menu photography and placement guides
- Excel menu integration guide

## [2.0.0] - 2025-12-03

### Initial Release

Roma Mart 2.0 launched with complete rewrite using modern React architecture.

### Core Architecture

- React 19 + Vite 7 build system
- ESM modules with manual chunking
- Progressive Web App (PWA) with service worker
- GitHub Pages deployment with prerendering

### Quality Systems

- Universal quality checker (1000+ rules)
- Meta-checker for quality system validation
- ESLint with React Hooks + JSX a11y plugins
- Stylelint for CSS validation

### Accessibility

- WCAG 2.2 Level AA compliance
- Keyboard navigation support
- Screen reader optimization
- Focus indicators
- Skip links
- Semantic HTML throughout

### Theming

- Dark mode native support (CSS custom properties)
- High contrast mode compatibility
- Forced-colors support
- Design token system (colors, typography, spacing)

### Features

- Multi-location management system
- Auto-location detection with geolocation
- Google Maps integration
- Business hours calculation
- Contact form with offline queuing
- Web Share API integration
- Clipboard API for copying
- Toast notification system
- PWA install prompts

### Analytics and Tracking

- Google Tag Manager integration
- Consent management (Clickio CMP)
- Google Analytics 4
- Trustpilot integration
- Snap Pixel tracking

### SEO

- LocalBusiness structured data (JSON-LD)
- Meta tags with react-helmet-async
- Sitemap generation
- robots.txt
- Prerendered static HTML

### Documentation

- Comprehensive `/docs/` structure
- Development ethos (25 principles)
- Architecture documentation
- Quality system guides
- Deployment guides
- Contributing guidelines
- Code of conduct
- Security policy
- Branching strategy
- PR templates

### Migration from v1

- Migrated from Create React App to Vite 7
- React 18 → React 19
- Class components → Functional components with Hooks
- Hardcoded values → Design token system
- Single file CSS → Modular Tailwind + CSS variables

### Performance

- Bundle splitting (react-vendor, icons, motion)
- Lazy loading for routes
- Intersection Observer for images
- Network-aware image quality
- Background sync for forms
- Service worker caching

### Security

- Environment variable management
- CSP headers configuration
- Secret scanning in quality checks
- No exposed API keys
- XSS prevention
- HTTPS enforcement

## [1.x] - 2025-11 (Legacy)

Initial Create React App implementation. Deprecated and replaced by v2.0.0.

---

## Version History

| Version | Date         | Description                           |
|---------|--------------|---------------------------------------|
| 2.4.1   | Feb 7, 2026  | DevOps cleanup: consolidated CI, fixed Husky v9 |
| 2.4.0   | Feb 7, 2026  | WCAG 2.2 AA: focus traps, form ARIA, heading hierarchy |
| 2.3.3   | Feb 6, 2026  | Performance & LCP optimization |
| 2.3.1   | Feb 6, 2026  | Prerendered schemas and API consolidation |
| 2.3.0   | Feb 6, 2026  | Schema validation and SEO improvements |
| 2.2.0   | Dec 7, 2025  | Unified components, centralized data  |
| 2.1.0   | Dec 4, 2025  | RoCafé menu system                    |
| 2.0.0   | Dec 3, 2025  | Major rewrite with React 19 + Vite 7  |
| 1.x     | Nov 2025     | Create React App version (deprecated) |

## How to Update

When making changes:

1. Add entry under `[Unreleased]` section
2. Use appropriate category (Features, Improvements, Fixes, etc.)
3. On release, move entries to new version section
4. Update version in `package.json`

### Categories

- **Features** - New features and capabilities
- **Improvements** - Enhancements to existing functionality
- **Fixes** - Bug fixes and corrections
- **Documentation** - Documentation updates
- **Security** - Security-related changes
- **Performance** - Performance improvements
- **Migration** - Breaking changes or migrations
