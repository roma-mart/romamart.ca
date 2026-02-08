# GitHub Copilot Instructions - Roma Mart 2.0

## Project Overview

Roma Mart 2.0 is a **React 18.3.1 + Vite 7** progressive web app for a multi-location convenience store chain. Built with accessibility-first, dark-mode-native, and quality-enforced architecture.

**Stack:** React 18.3.1, Vite 7, Tailwind CSS, Framer Motion, ESM modules
**Deployment:** GitHub Pages (staging), custom domain (production)

### Current Status (Feb 2026)

An expert-consolidated audit identified 56 problems and produced 55 recommendations organized into 8 sprints across 4 phases. See planning documents for details:
- **[docs/ROADMAP.md](../docs/ROADMAP.md)** -- Sprint plan, phase breakdown, domain scorecard
- **[docs/EXPERT_AUDIT_FEB_2026.md](../docs/EXPERT_AUDIT_FEB_2026.md)** -- Full audit findings and recommendations (R1-R55)
- **[docs/API_MIGRATION_READINESS.md](../docs/API_MIGRATION_READINESS.md)** -- Backend API spec for @Fern-Ali
- **GitHub Issues:** #98-#106 (sprint issues), #107 (backend API), tracked on [RomaMart UI Roadmap](https://github.com/orgs/roma-mart/projects/4) project board

## Critical Architecture Principles

### 1. Systems Over Spot Fixes (docs/DEVELOPMENT_ETHOS.md Principle #1)
- **Never** suppress warnings or make ad-hoc patches
- Build comprehensive, reusable solutions that scale
- Example: Don't fix one color; update the design token system

### 2. Deep Understanding Before Action (Principle #25)
- **ALWAYS** read `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_ETHOS.md`, and relevant docs before making changes
- Run `npm run check:quality` and `npm run check:integrity` to understand current state
- Crawl related files to understand context before proposing solutions

### 3. Universal Quality Enforcement
- All changes **must pass** automated quality checks before commit
- Run checks: `npm run check:all` (lint + quality + integrity)
- Quality system checks: accessibility, dark mode, performance, security, SEO, brand consistency
- See `QUALITY_SYSTEM.md` for comprehensive standards

## Essential Workflows

### Development Commands
```powershell
npm install                    # Initial setup
npm run dev                    # Start dev server
npm run check:quality          # Run universal quality checker (1000+ rules)
npm run check:integrity        # Validate quality system itself (meta-checker)
npm run check:all              # Lint + quality + integrity
npm run build                  # Production build + prerender
npm run preview                # Preview production build
```

### Pre-Commit Checklist
1. `npm run check:all` passes
2. `npm run build` succeeds
3. Test in both light and dark modes
4. Verify keyboard navigation works
5. Check responsive breakpoints (mobile, tablet, desktop)

## Project-Specific Conventions

### Design Tokens & Theming
- **NEVER use hardcoded colors** - use `src/design/tokens.js` or CSS variables
- All colors adapt to `prefers-color-scheme` automatically via `src/index.css`
- Import theme utilities: `import { useThemeColors, CSS_VARS } from '../utils/theme'`
- Example: Use `var(--color-primary)` not `#020178`
- **Fonts:** Outfit for headings, Inter for body text (`--font-heading`, `--font-body`)
- **Typography class:** Use `text-heading` utility class to apply heading font on non-heading elements. **NEVER** put `var(--font-heading)` in a `className` attribute -- it does nothing. For inline styles use `style={{ fontFamily: 'var(--font-heading)' }}`

### Component Architecture
- **Functional components only** with hooks (React 18.3.1)
- Lazy load pages: `const Page = lazy(() => import('./pages/Page'))`
- Use `react-helmet-async` for SEO on all pages
- Follow structure: `src/components/` (reusable), `src/pages/` (routed)
- **LocationButton** (`src/components/LocationButton.jsx`) is a standalone geolocation button -- do NOT use `Button variant="location"` (that variant was removed)
- **Button** (`src/components/Button.jsx`) renders plain `<button>`/`<a>` for non-animated variants and `<motion.button>`/`<motion.a>` for animated ones
- See component READMEs in each directory for specific conventions

### Data Management

**Architecture:** API-first with graceful fallback to static data

#### Context Providers (100% API-Ready)
- **MenuContext** (`src/contexts/MenuContext.jsx`) - RoCafé menu items
  - API: `https://romamart.netlify.app/api/public-menu`
  - Fallback: Empty array on error
  - Usage: `const { menuItems, loading, error } = useMenu()`

- **ServicesContext** (`src/contexts/ServicesContext.jsx`) - Services offered
  - API: `https://romamart.netlify.app/api/public-services`
  - Fallback: Static `SERVICES` from `src/data/services.jsx`
  - Usage: `const { services, loading, error, source } = useServices()`

- **LocationsContext** (`src/contexts/LocationsContext.jsx`) - Store locations
  - API: `https://romamart.netlify.app/api/public-locations`
  - Fallback: Static `LOCATIONS` from `src/data/locations.js`
  - Usage: `const { locations, loading, error, source } = useLocations()`

- **LocationContext** (`src/contexts/LocationContext.js`) - User location state
  - Manages selected location, geolocation, nearest location
  - Usage: `const { selectedLocation, userLocation } = useLocationContext()`

#### Critical Rules
- ✅ **DO:** Always use context providers (`useMenu()`, `useServices()`, `useLocations()`)
- ❌ **DON'T:** Import static data directly (e.g., `import { SERVICES } from './data/services'`)
- ✅ **DO:** Use helper functions that accept data as parameters
- ❌ **DON'T:** Use helper functions that import static data internally

#### Static Data Files (Fallback Only)
- `src/data/services.jsx` - 15 services with categories, features, availability
- `src/data/locations.js` - Store locations with hours, coordinates, amenities
- `src/data/rocafe-menu.js` - Menu items (fallback for MenuContext)
- Location types: convenience_store, minimart, vending_machine, atm_standalone, etc.

### Accessibility (WCAG 2.2 AA+)
- All interactive elements need `:focus-visible` styles
- Images require `alt` text
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Forms need proper `<label>` associations
- Skip links required for main navigation
- Test with keyboard-only navigation
- Hero animations respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion()` hook

### Dark Mode
- Uses CSS custom properties that respond to `@media (prefers-color-scheme: dark)`
- Supports high contrast mode and forced-colors
- Test all visual changes in both light/dark modes
- See `docs/guides/dark-mode.md` for implementation details

### Routing & Base Path
- Client-side routing via pathname matching in `App.jsx`
- Base path configured in `vite.config.js` (currently `/${REPO_NAME}/` for GitHub Pages)
- **IMPORTANT:** After production cutover, change `base` to `/` in `vite.config.js`
- Prerender script generates static HTML for each route in `scripts/prerender.js`

### Icon Usage
- Lucide React: Import specific icons, never wildcard imports
- Font Awesome: Load only needed icon packs
- Example: `import { MapPin, Coffee } from 'lucide-react'`

### CSS Approach
- Tailwind utility classes for layout/spacing
- CSS variables for colors/theming
- Global styles in `src/index.css`
- Component-specific styles use inline styles or CSS modules (rare)

## Integration Points

### Analytics & Consent
- Google Tag Manager container loads analytics/pixels
- Clickio CMP handles consent banner (configured as a GTM tag)
- Google Consent Mode v2 defaults set in `main.jsx` (all denied until Clickio upgrades on user accept)
- GA4, Microsoft Clarity, Snap Pixel fire only after consent granted
- No custom consent component in codebase — Clickio manages the entire consent UI

### Service Worker (PWA)
- `public/sw.js` is the source template; Vite copies it to `dist/` during build
- `scripts/prerender.js` injects hashed Vite bundle filenames into `dist/sw.js` via `/* __VITE_BUNDLE_ASSETS__ */` placeholder — enables offline app loading
- Cache strategies: network-first for HTML/API, cache-first for static assets (JS/CSS/images)
- Cache bounded by `MAX_CACHE_ENTRIES = 100` with `trimCache()` eviction
- `CACHE_VERSION` in `sw.js` controls cache invalidation — bump when changing caching behavior
- `self.skipWaiting()` is user-controlled via message handler only (not auto-called on install)
- **Hooks:** `useServiceWorker()` from `src/hooks/useServiceWorker.js` — returns `{ registration, updateAvailable, skipWaiting, isOnline }`
- **Components:**
  - `PWAInstallPrompt` — engagement-based install prompt with focus trap, persists install state to localStorage
  - `PWAUpdatePrompt` — persistent update notification card, wired in App.jsx with `updateAvailable`/`skipWaiting` from useServiceWorker

### External Services
- Google Maps embeds use Places API (API key in `locations.js`)
- Trustpilot widget loaded conditionally
- Bitcoin ATM integration (future)

## Quality System Architecture

### Automated Checks (`scripts/check-quality.js`)
Multi-dimensional validation across:
1. **Accessibility:** WCAG 2.2 AA compliance, ARIA patterns, keyboard navigation
2. **Dark Mode:** Color contrast, CSS variable usage, forced-colors support
3. **Performance:** Bundle size targets, lazy loading, image optimization
4. **Security:** No exposed secrets, no XSS vulnerabilities, CSP headers
5. **SEO:** Meta tags, structured data, sitemap, robots.txt
6. **Code Quality:** No console.log in production, no TODOs in main, deprecated API usage
7. **Responsive Design:** Mobile breakpoints, viewport meta tags
8. **Browser Compatibility:** Modern APIs with fallbacks
9. **Brand Consistency:** Design token usage, no hardcoded brand colors

### Meta-Checker (`scripts/check-checker-integrity.js`)
- Validates the quality system doesn't conflict with itself
- Ensures rules align with development ethos
- Detects rule overlap or contradictions
- Run: `npm run check:integrity`

### ESLint Configuration
- Enforces React Hooks rules
- JSX accessibility plugin (eslint-plugin-jsx-a11y)
- Separate configs for scripts (Node.js), service worker, and app code
- See `eslint.config.js` for full configuration

## Common Patterns

### Adding a New Page
1. Create component in `src/pages/PageName.jsx`
2. Add `<Helmet>` for SEO metadata
3. Import lazy in `App.jsx`: `const PageName = lazy(() => import('./pages/PageName'))`
4. Add route handler in `App.jsx` routing switch
5. Add to `scripts/prerender.js` routes array
6. Test with `npm run check:all`

### Adding a New Location
**Note:** Once the Locations API is live, locations should be added via the API backend, not by editing static files.

For now (static data period):
1. Open `src/data/locations.js`
2. Copy existing location object structure
3. Fill in all required fields (no nulls for critical data)
4. Add Google Place ID and coordinates
5. Specify services array (atm, bitcoin_atm, rocafe, etc.)
6. Add to amenities array (Google Business Profile compliant naming)
7. Test on Locations page

**All components will automatically use the new location via LocationsContext.**

### Creating a Component
1. Use functional component with hooks
2. Import theme utilities: `import { CSS_VARS } from '../utils/theme'`
3. Add JSDoc comment explaining purpose and props
4. Export as default
5. Follow accessibility patterns (keyboard nav, ARIA)
6. Test in light/dark modes

### Working with Colors
```jsx
// ✅ CORRECT
import { CSS_VARS } from '../utils/theme';
<div style={{ backgroundColor: CSS_VARS.surface }}>

// ✅ ALSO CORRECT
<div style={{ color: 'var(--color-primary)' }}>

// ❌ WRONG - Hardcoded color
<div style={{ color: '#020178' }}>
```

### Working with Data (API-First Pattern)
```jsx
// ✅ CORRECT - Use context providers
import { useServices } from '../contexts/ServicesContext';
import { useLocations } from '../contexts/LocationsContext';

function MyComponent() {
  const { services } = useServices();
  const { locations } = useLocations();

  // Filter or transform data as needed
  const activeServices = services.filter(s => s.status === 'available');

  return <div>{/* Use activeServices */}</div>;
}

// ❌ WRONG - Direct static import bypasses API
import { SERVICES } from '../data/services';
import { LOCATIONS } from '../data/locations';

// ❌ WRONG - Using helper that imports static data
import { getActiveLocations } from '../data/locations';
const locations = getActiveLocations(); // This uses static LOCATIONS internally

// ✅ CORRECT - Helper that accepts data parameter
import { getPreferredLocation } from '../data/locations';
const { locations } = useLocations();
const preferred = getPreferredLocation({ userCoords, locations });
```

## Build & Deployment

### Build Process
1. `vite build --mode production` compiles React app
2. `scripts/prerender.js` generates static HTML for each route
3. Manual chunks: react-vendor, icons, motion (see `vite.config.js`)
4. Output: `dist/` directory

### GitHub Pages Deployment
- Staging: `https://roma-mart.github.io/romamart.ca/`
- Run: `npm run deploy` (builds + pushes to gh-pages branch)
- Base path: `/${REPO_NAME}/` (configured in vite.config.js)

### Production Cutover
Before going live on custom domain:
1. Change `base: '/'` in `vite.config.js` (remove repo name)
2. Confirm Clickio CMP policy links are correct in GTM (privacy at `/privacy`, cookies at `/cookies`)
3. Update GTM container settings
4. Verify with Tag Assistant Preview
5. Test all routes and analytics

## Troubleshooting

### Quality Check Failures
- Read the specific error message and severity level
- Fix CRITICAL and HIGH issues before committing
- Reference `docs/guides/quality-system.md` for remediation strategies
- Don't suppress warnings; fix root cause

### Dark Mode Issues
- Check CSS variable usage in `src/index.css`
- Test with DevTools: Toggle `prefers-color-scheme`
- Verify all colors use CSS variables, not hardcoded values
- See `docs/guides/dark-mode.md` for patterns

### Build Failures
- Check for syntax errors with `npm run lint`
- Verify all imports resolve
- Check bundle size limits in quality checker
- Clear cache: `rm -rf dist node_modules && npm install`

## Key Files Reference

| File | Purpose |
|------|---------|
| `docs/ROADMAP.md` | Sprint plan and audit-driven roadmap |
| `docs/EXPERT_AUDIT_FEB_2026.md` | Expert-consolidated codebase audit |
| `docs/API_MIGRATION_READINESS.md` | Backend API specification for migration |
| `docs/DEVELOPMENT_ETHOS.md` | 25 core principles guiding all development |
| `docs/ARCHITECTURE.md` | High-level system design and conventions |
| `docs/QUALITY_SYSTEM.md` | Comprehensive quality standards documentation |
| `docs/README.md` | Documentation index and navigation |
| `src/design/tokens.js` | Single source of truth for design tokens |
| `src/data/locations.js` | All store locations data |
| `src/utils/theme.js` | Theme utilities and CSS variable helpers |
| `scripts/check-quality.js` | Universal quality checker (1000+ rules) |
| `scripts/check-checker-integrity.js` | Meta-checker for quality system |
| `vite.config.js` | Build configuration and base path |
| `public/sw.js` | Service worker source template (precache placeholder, caching strategies) |
| `src/components/PWAUpdatePrompt.jsx` | SW update notification card |
| `.github/dependabot.yml` | Automated dependency updates (npm weekly, GitHub Actions weekly) |

## Additional Resources

- Documentation index: `docs/README.md`
- Deployment guide: `docs/guides/deployment.md`
- Quality system guide: `docs/guides/quality-system.md`
- Dark mode guide: `docs/guides/dark-mode.md`
- Accessibility guide: `docs/guides/accessibility.md`
- Testing guide: `docs/guides/testing.md`
- Troubleshooting: `docs/guides/troubleshooting.md`
- Release checklist: `docs/checklists/release-checklist.md`
- Accessibility audit: `docs/checklists/accessibility-audit.md`
- Contributing guide: `CONTRIBUTING.md`
- Code of Conduct: `CODE_OF_CONDUCT.md`
- Security policy: `SECURITY.md`

## External API Integration

### Data APIs (Context Providers)

All data APIs follow the same pattern: API-first with graceful fallback to static data.

#### MenuContext API
- **Endpoint:** `https://romamart.netlify.app/api/public-menu`
- **Method:** GET
- **Response:** `{ success: boolean, menuItems: Array }`
- **Fallback:** Empty array on error
- **Implementation:** `src/contexts/MenuContext.jsx`
- **Consumer Components:** App.jsx, RoCafePage.jsx

#### ServicesContext API
- **Endpoint:** `https://romamart.netlify.app/api/public-services`
- **Method:** GET
- **Response:** `{ success: boolean, services: Array }`
- **Fallback:** Static `SERVICES` from `src/data/services.jsx`
- **Implementation:** `src/contexts/ServicesContext.jsx`
- **Consumer Components:** App.jsx (ServicesSection), ServicesPage.jsx
- **Required Fields:** `id`, `name`, `featured` (boolean for homepage filtering)

#### LocationsContext API
- **Endpoint:** `https://romamart.netlify.app/api/public-locations`
- **Method:** GET
- **Response:** `{ success: boolean, locations: Array }`
- **Fallback:** Static `LOCATIONS` from `src/data/locations.js`
- **Implementation:** `src/contexts/LocationsContext.jsx`
- **Consumer Components:** App.jsx (Locations, ContactSection), Footer.jsx, LocationsPage.jsx
- **Required Fields:** `id`, `status` (for filtering active locations)

#### API Pattern Example
```jsx
// ✅ CORRECT: Use context provider
import { useServices } from '../contexts/ServicesContext';

function MyComponent() {
  const { services, loading, error, source } = useServices();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />; // Fallback already applied

  return (
    <div>
      {services.map(service => <ServiceCard key={service.id} {...service} />)}
      {source === 'static' && <p>Using cached data</p>}
    </div>
  );
}

// ❌ WRONG: Direct static import bypasses API system
import { SERVICES } from '../data/services';
```

### Web3Forms Contact API
- **Endpoint:** `https://api.web3forms.com/submit`
- **Method:** POST with JSON body
- **Auth:** Access key from environment variable `VITE_WEB3FORMS_KEY`
- **Implementation:** `src/pages/ContactPage.jsx`
- **Error Handling:** Falls back to queuing in IndexedDB if offline
- **Rate Limiting:** None client-side; service handles rate limits

### Google Places API
- **Purpose:** Live hours and ratings for locations
- **Implementation:** `src/hooks/useGooglePlaceHours.js`
- **Caching:** 1-hour IndexedDB cache to reduce API calls
- **Circuit Breaker:** Protection against rate limiting
- **Fallback:** Uses static hours from location data

## Development Tooling & Code Style

### Code Formatting
- **No Prettier configured** - Manual formatting following ESLint rules
- **EditorConfig:** `.editorconfig` configured (2-space indent, LF line endings, UTF-8, trailing whitespace trimming)
- **ESLint:** Strict rules enforced via `npm run lint`
  - React Hooks compliance required
  - JSX accessibility (a11y) required
  - No unused variables, no console.log in production code
- **lint-staged:** Runs ESLint on `*.{js,jsx}` and Stylelint on `*.css` for staged files only (faster pre-commit)
- **commitlint:** Enforces [Conventional Commits](https://www.conventionalcommits.org/) format via `.husky/commit-msg` hook

### Git Workflow
- **Branching strategy:** See [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) for complete guide
- **Branch naming:**
  - `feature/*` - New features
  - `bugfix/*` - Bug fixes
  - `hotfix/*` - Critical production fixes
  - `docs/*` - Documentation updates
  - `chore/*` - Maintenance tasks, dependency updates, tooling
- **Commit conventions:** Follow [Conventional Commits](https://www.conventionalcommits.org/)
  - Format: `<type>(<scope>): <description>`
  - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Manual quality checks required** before commit: `npm run check:all`
- **Git hooks:** Husky v9 with pre-commit hook (lint-staged + check:quality + check:integrity) and commit-msg hook (commitlint)
- **Pull requests:** Required for all changes to `main` (see [PULL_REQUEST_TEMPLATE.md](PULL_REQUEST_TEMPLATE.md))
  - Comprehensive checklist: automated tests, manual testing, accessibility, security
  - Browser testing requirements: Chrome/Edge, Firefox, Safari
  - Light/dark mode verification required

### Issue Templates
- **Bug Report** (`.github/ISSUE_TEMPLATE/bug_report.yml`) - Detailed bug reports with severity, affected area, environment info
- **Feature Request** (`.github/ISSUE_TEMPLATE/feature_request.yml`) - New feature proposals with priority levels
- **Documentation** (`.github/ISSUE_TEMPLATE/documentation.yml`) - Documentation improvements
- **Maintenance** (`.github/ISSUE_TEMPLATE/maintenance.yml`) - Chore tasks, dependency updates, tooling improvements

### Testing Strategy
- **Vitest test suite:** 12 test files, 154 tests (schema validation, utilities, hooks)
- Quality also enforced via:
  1. ESLint + Stylelint (syntax & patterns)
  2. Universal quality checker (`check-quality.js` - 1000+ rules)
  3. Meta-checker (`check-checker-integrity.js` - validates quality system)
  4. Manual browser testing (light/dark mode, responsive, keyboard nav)

**Critical Manual Test Flows:**
1. Homepage → Navigate all sections → Order CTA
2. Locations page → View location details → Get directions
3. RoCafe menu → Expand items → View full menu
4. Contact form → Submit (online/offline) → Verify submission
5. PWA install prompt → Install → Test offline functionality
6. Dark mode toggle → Verify all pages render correctly
7. Mobile navigation → Hamburger menu → All links work

## Deployment Workflow

### GitHub Pages (Staging)
1. Run `npm run deploy` (builds + pushes to `gh-pages` branch)
2. Vite builds with `base: /romamart.ca/` for correct asset paths
3. `scripts/prerender.js` generates static HTML for each route
4. GitHub Actions automatically deploys `gh-pages` branch
5. Live at: `https://roma-mart.github.io/romamart.ca/`

### Production (Custom Domain)
1. Update `vite.config.js`: Change `base: '/'` (remove repo name)
2. Confirm Clickio CMP policy links are correct in GTM (privacy at `/privacy`, cookies at `/cookies`)
3. Update GTM container for production environment
4. Build: `npm run build`
5. Deploy `dist/` folder to hosting (manual or CI/CD)
6. Verify GTM + analytics with Tag Assistant Preview
7. Test all routes with new base path

**Deployment Checklist:**
- [ ] `npm run check:all` passes with 0 critical/high issues
- [ ] Build completes without errors
- [ ] All routes prerendered (check `dist/` for HTML files)
- [ ] Assets load correctly (check base path)
- [ ] Service worker registers successfully
- [ ] PWA manifest valid
- [ ] Analytics firing correctly
- [ ] Dark mode works on all pages

## Performance Considerations

### Bundle Optimization
- **Manual chunks configured** in `vite.config.js`:
  - `react-vendor`: React + ReactDOM
  - `icons`: Lucide React + Font Awesome
  - `motion`: Framer Motion
- **Code splitting:** All pages lazy loaded via `React.lazy()`
- **Source maps disabled** to avoid Lucide React corruption issues
- **Bundle size targets** enforced by quality checker

### Image Optimization
- Use `loading="lazy"` on all non-critical images
- **NEVER** use `loading="lazy"` on hero/LCP images -- they need `fetchpriority="high"` instead
- Prefer WebP format with fallbacks
- Serve responsive images via `srcset` when applicable
- Placeholder images for development (replace with real assets)

### Critical Rendering Path
1. Inline critical CSS in `src/index.css`
2. Defer non-critical scripts
3. Preconnect to external domains (Google Maps, GTM)
4. Service worker caches assets for repeat visits

---

## AI Assistant Sync

This file is the Copilot-specific project context. A parallel `CLAUDE.md` exists at the repo root for Claude Code. Both files should be kept in sync:
- When updating project conventions, architecture, or workflows, update BOTH files
- Each file is optimized for its respective AI's context format
- If you notice drift between the files, flag it and propose corrections
- Last synced: February 8, 2026

---

**Last Updated:** February 8, 2026
**Maintained by:** GitHub Copilot & Claude Code (keep in sync with `CLAUDE.md`)
**Codebase Version:** React 18.3.1 + Vite 7 (ESM)
**API Status:** Menu API live (200 OK); Services & Locations APIs pending (#107) -- frontend uses static fallback
