# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation system overhaul
  - New `/docs/` directory structure
  - Centralized guides, checklists, and architecture docs
  - CODE_OF_CONDUCT.md for community standards
  - SECURITY.md for security policy
  - CHANGELOG.md for version history

### Changed
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
