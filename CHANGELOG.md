# Changelog

All notable changes to the Roma Mart 2.0 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Features

- **Prerendered ProductList Schemas:**
  - Menu items (Product schemas) now prerendered into static HTML at build time
  - Homepage: 4 featured products in static HTML (detectable by validators)
  - RoCafé page: All 75 products in static HTML (detectable by validators)
  - Fixes Schema.org validator detection issue (schemas were only visible after JS hydration)
  - Zero runtime performance impact (schemas already in DOM)
  - Build time impact: ~2-3 seconds for API fetch

- **Consolidated API Fetching for Prerendering:**
  - Services and Locations APIs now fetched at build time (parallel with Menu API)
  - Single Promise.all call for maximum efficiency
  - Future-proof: Zero code changes when Services/Locations APIs go live
  - Graceful fallback: Empty arrays if APIs unavailable (client-side React uses static fallback)
  - Prerendered ServiceList and LocationList schemas when APIs available

- **Deployment Safety Improvements:**
  - Branch safety check prevents accidental production deploys from wrong branch
  - Staging (`/atlas`) and production (`/`) deployment separation
  - Environment-specific configuration validation

### Improvements

- **SEO & Schema Detection:**
  - ProductList schemas now detectable by Schema.org validator in static HTML
  - ServiceList and LocationList schemas ready for API prerendering
  - Fixed timing/hydration issue where validators couldn't see dynamically rendered schemas
  - Established reusable pattern for all future API-driven schema prerendering

- **LocationList Schema Accuracy:**
  - Homepage now includes only primary location in schema (matches actual display)
  - Was incorrectly including all locations (mismatch between schema and display)
  - Locations page correctly includes all active locations for SEO indexing
  - Display sorting (by distance/primary) intentionally differs from schema (UI convenience)

- **Documentation:**
  - Comprehensive prerender analysis created and archived (`docs/archive/PRERENDER_SYSTEMATIC_FIX_ANALYSIS.md`)
  - Master plan updated with consolidated API fetching strategy (Step 3.1)
  - Static fallback removal strategy documented (3-phase approach with stability requirements)
  - API migration readiness updated with Part 8: Static Fallback Removal Strategy
  - Clear timeline: DO NOT remove fallbacks until 1-2 months of proven API stability

### Fixes

- **Diagnostic Logging Cleanup:**
  - Resolved console.info eslint errors in diagnostic logging
  - ProductList rendering logs properly exempt from production restrictions
  - Preserved essential production diagnostics (MenuContext, API failures)

- **GitHub Pages Configuration:**
  - Restored base path for staging deployment (`/atlas`)
  - Fixed routing issues for GitHub Pages SPA
  - Environment-specific base URL handling

### Internal

- **Build-Time API Pattern Established:**
  - Menu API: Fetched at build, prerendered ✅
  - Services API: Fetched at build, graceful fallback ✅
  - Locations API: Fetched at build, graceful fallback ✅
  - Pattern ready for Company Data API when implemented
  - Estimated effort for future API migrations: 1-2 hours each (pattern proven)

- **Static Fallback Strategy Documented:**
  - Phase 1: Prerender (no static imports) - COMPLETE ✅
  - Phase 2: Context providers (remove static imports after API stability) - PLANNED
  - Phase 3: Archive static data files (keep for emergency rollback) - PLANNED
  - Requires: 1-2 months stability + monitoring + team consensus before removal

### Commits in this Release

- `e0279b9` - feat(seo): prerender ProductList schemas for homepage and RoCafé pages
- `2b3dc70` - feat(build): consolidate API fetching for Services and Locations in prerender
- `9823326` - fix(seo): correct LocationList prerender logic for homepage
- `5c0cefe` - docs(api): document static fallback removal strategy
- `e803f30` - docs: consolidate prerender analysis into master plan
- `ef04bca` - fix(lint): resolve console.info eslint errors in diagnostic logging
- `ff4f30f` - feat(deploy): add branch safety check to prevent accidental production deploys
- `ce1f285` - feat(deploy): add staging and production deployment separation
- `2e463e8` - fix(config): restore GitHub Pages base path for staging deployment
- `30767f7` - debug(schema): add comprehensive logging for ProductList rendering



## [2.3.0] - 2026-02-06

### Features

- **13 Schema Types Implemented:**
  - Product schemas (menu items with prices, images, categories)
  - Service schemas (15 services with proper categorization)
  - Location schemas (multi-location LocalBusiness with hours, coordinates, amenities)
  - LocalBusiness schema (complete business info with opening hours)
  - Organization schema (tax ID, employee count)
  - WebSite schema (with SearchAction for site search)
  - MerchantReturnPolicy schema (24-hour faulty product policy)
  - WebApplication schema (PWA discovery)
  - BreadcrumbList schemas (11 pages)

- **API-Driven Architecture:**
  - MenuContext for centralized menu data management (50% reduction in API calls)
  - ServicesContext with API fallback to static data
  - LocationsContext with API fallback to static data
  - Circuit breaker protection for Google Places API
  - 1-hour IndexedDB caching for live hours/ratings

- **100% API-Ready Components:**
  - App.jsx ServicesSection now uses context provider (not static SERVICES_FEATURED)
  - App.jsx Locations and ContactSection use context provider (not static helpers)
  - Footer.jsx uses LocationsContext (not static getActiveLocations)
  - Zero code changes needed when Services/Locations APIs go live

- **Google-Compliant Amenities System:**
  - Migrated from features object to amenities array
  - Direct pass-through architecture (zero mapping layers)
  - Google Business Profile compliant naming
  - Location-specific amenities support
  - API-ready data structure

- **Sitemap Enhancements:**
  - Added trailing slashes to all URLs for proper GitHub Pages routing
  - Prevents redirect overhead for crawlers

### Improvements

- **100% De-Hardcoding Achievement:**
  - Zero hardcoded business data across all schemas
  - All schemas pull from COMPANY_DATA (Single Source of Truth)
  - Enhanced COMPANY_DATA with schema endpoints, defaults, PWA config
  - Smart data boundaries (location-specific vs business-wide)

- **Schema Compliance Improvements (Phase 2-4):**
  - LocalBusiness: B → A (+15%)
  - Organization: B → A (+15%)
  - Product: B → A+ (+13%)
  - Service: B → A+ (+13%)
  - Location: B → A (+10%)
  - WebSite: C+ → A (+20%)
  - WebApplication: A → A+ (+5%)
  - Average: 88% (B+) → 98% (A+)

- **Phase 5 Schema Validation (100% Compliance):**
  - Fixed empty @id bug in Product, Service, Location schemas (prevented ItemList detection)
  - Removed invalid naicsCode property from Organization schema
  - Removed invalid PrivacyPolicy schema type (not recognized by Schema.org)
  - Removed invalid timeZone property from static LocalBusiness schema
  - Removed invalid availableAtOrFrom property from LocalBusiness schema
  - All 11 pages validated through Schema.org validator
  - Zero invalid properties or types remaining

- **Cross-Schema Linking:**
  - Added @id to all referenceable schemas
  - Organization ⟷ LocalBusiness linking
  - Product → MerchantReturnPolicy linking
  - Location → Organization parentOrganization linking
  - Complete schema graph connectivity

- **Enhanced Schema Fields:**
  - Brand property added to Product, Service, Location schemas
  - Category field added to Product schemas
  - Manufacturer field added to Product schemas (optional)
  - Broker field added to Service schemas (optional)
  - SearchAction added to WebSite schema

### Fixes

- **Phase 5 Critical Schema Validation Fixes:**
  - Empty @id fields causing duplicate IDs (ProductList not detected on homepage)
  - Organization naicsCode property not recognized by Schema.org
  - PrivacyPolicy invalid schema type (removed - 404 on schema.org)
  - LocalBusiness timeZone property not recognized by Schema.org
  - LocalBusiness availableAtOrFrom property not recognized by Schema.org

- **Phase 3-4 Schema Fixes:**
  - Invalid hasOfferCatalog in LocalBusiness (causing 4 Product snippet errors)
  - LocalBusiness schema duplication (static vs dynamic)
  - Prerender script hardcoded serviceMap (now imports from SSOT)
  - CodeQL sanitization vulnerability (iterative regex for XSS protection)

- **Test Quality:**
  - Added alt attributes to XSS test cases for quality checker compliance
  - Resolved 2 HIGH priority accessibility warnings in test files

### Documentation

- STRUCTURED_DATA_MASTER_PLAN.md v5.0.0 (comprehensive Phase 2-5 documentation)
- Phase 5 schema validation and bug fixes documented
- Page-by-page validation results documented (all 11 pages)
- Phase 4 schema audit integrated into master plan
- Amenities architecture migration documented
- Data management documentation updated with new amenities structure
- Schema audit archived for historical reference
- CHANGELOG.md updated with version 2.3.0

### Quality

- ESLint: 0 errors
- Quality checker: 0 HIGH priority issues
- Meta-checker integrity: Passes
- Build: All 11 routes prerendered successfully
- All schemas validated with Schema.org Markup Validator
- 90%+ test coverage for schema builders
- Zero hardcoded data violations
- SSOT principle enforced throughout
- 100% Schema.org compliance target achieved

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
