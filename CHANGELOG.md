# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Phase 2: Structured Data Implementation
- **Product schemas** for menu items (homepage featured + /rocafe full menu)
  - Multi-size pricing with PriceSpecification
  - Dietary tag mapping to schema.org URIs
  - Allergen warnings and age-restricted flags
  - Dynamic data from Toolpad API (no static fallbacks)
- **Policy schemas** (Privacy, Return Policy)
  - PrivacyPolicy schema with PIPEDA compliance
  - ReturnPolicy schema with 24-hour faulty product exception
  - Return Policy page (`/return-policy`) with structured data
- **Organization schema** enhancements
  - NAICS code 4541 (Grocery Stores classification)
  - Complete business information (address, email, phone, GST#)
  - numberOfEmployees (3) from location metadata
  - Social media links (sameAs property)
- **Schema utilities** (`src/utils/schemaHelpers.js`)
  - CodeQL-hardened HTML sanitization (iterative regex + DOMParser)
  - Currency conversion (cents → dollars)
  - Address formatting for PostalAddress
  - AggregateRating placeholder for future reviews
- **Testing infrastructure**
  - Menu item schema tests (90%+ coverage)
  - Test fixtures for schema validation
  - Vitest configuration
- **Google Places API integration**
  - Migrated from Featurable (3rd-party) to official Google Places API
  - react-google-reviews component with carousel layout
  - Circuit breaker protection (5-failure threshold, 1-hour lockout)
  - Automatic fallback to static "View Google Reviews" link
  - API quota protection per api-quota-protection.md
- **Documentation**
  - STRUCTURED_DATA_MASTER_PLAN.md (Phase 2 complete, Phase 3 roadmap)
  - PHASE-2-WEEK-2-SUMMARY.md (410 lines implementation summary)
  - schema-validation.md (validation procedures)

### Changed
- **Privacy Policy** content updated (effective July 28, 2025)
  - Added PIPEDA rights (access, correction, deletion, complaint)
  - Data retention policies (CCTV auto-deletion, purchase history)
  - Consent clauses for in-store and checkout display
- **Footer** reviews integration
  - Removed proprietary Featurable embed
  - Now uses Google Places API with circuit breaker protection
  - Maintains dark theme, autoplay (5s speed), max 3 items
- **Homepage** structured data strategy
  - Featured menu items only (6-8 products)
  - Primary crawl target for Google indexing
- **RoCafé page** menu rendering
  - Removed static menu fallback (API-only strategy)
  - Full menu ItemList with Product schemas
- **Navigation**
  - Added Return Policy to footer legal section
  - Centralized in `src/config/navigation.js`

### Fixed
- **Security: CodeQL HIGH vulnerability**
  - Sanitization incomplete-loop issue resolved
  - Multi-character tag sequences now handled correctly
  - Both DOMParser and iterative regex fallback paths secured
- **Performance: API call deduplication**
  - useExcelMenu hoisted to App level
  - Passed as props to RoCafeSection
  - Eliminates duplicate Toolpad API fetch

### Security
- Circuit breaker prevents Google Places API quota exhaustion
- No Featurable API keys in codebase (migrated to Google)
- HTML sanitization hardened against multi-character injection

### Documentation
- Documentation system overhaul
  - New `/docs/` directory structure
  - Centralized guides, checklists, and architecture docs
  - CODE_OF_CONDUCT.md for community standards
  - SECURITY.md for security policy
  - CHANGELOG.md for version history
- Reorganized documentation for better discoverability
- Archived historical implementation summaries
- Consolidated duplicate documentation files

## [2.0.0] - 2025-12-03

### Added
- React 19 + Vite 7 architecture
- Progressive Web App (PWA) functionality
- Universal quality checker system (1000+ rules)
- Meta-checker for quality system validation
- Dark mode native support with CSS custom properties
- WCAG 2.2 Level AA accessibility compliance
- Multi-location management system
- RoCafé menu system
- Google Tag Manager integration
- Consent management system (Clickio CMP)
- Background sync for offline form submission
- Intersection Observer lazy loading
- Network-aware image quality
- Geolocation nearest store finder
- LocalBusiness structured data (JSON-LD)

### Changed
- Migrated from Create React App to Vite 7
- Refactored to functional components only (no class components)
- Centralized design token system
- Improved bundle splitting (react-vendor, icons, motion)

### Security
- Environment variable management for secrets
- CSP headers configuration
- Secret scanning in quality checks
- No exposed API keys in source code

## [1.x] - Legacy

Previous Create React App version. No longer supported.

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 2.0.0 | Dec 2025 | Major rewrite with React 19 + Vite 7 |
| 1.x | Legacy | Create React App version (deprecated) |

## How to Update

When making changes:

1. Add entry under `[Unreleased]` section
2. Use appropriate category (Added, Changed, Fixed, etc.)
3. On release, move entries to new version section
4. Update version in `package.json`

### Categories

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security-related changes
