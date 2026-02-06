# Changelog

All notable changes to the Roma Mart 2.0 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- Prerender analysis archived
- Master plan updated with Step 3.1
- Removed outdated "frontend fixes needed" section from API documentation

**Commits:** e0279b9, 2b3dc70, 9823326, 5c0cefe, e803f30, ef04bca, ff4f30f, ce1f285, 2e463e8, 30767f7, 217a741, 69758a7, e5ac42e, 1865a90, 0f5b8e9, 530d1c9, 8f784db, d3cea71, 69a41f9, 69c6308, 13bd068, 2f66d83



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
