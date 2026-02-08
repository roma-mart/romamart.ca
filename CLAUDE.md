# CLAUDE.md - Roma Mart 2.0 Project Context

> This file provides Claude Code with project context to reduce repeated instructions and improve code quality.
> Parallel file: `.github/copilot-instructions.md` (for GitHub Copilot). Keep both in sync.

## Project Overview

**App:** Roma Mart 2.0 -- React PWA for a multi-location convenience store chain (Sarnia, ON)
**Stack:** React 18.3.1, Vite 7, Tailwind CSS 3.4, Framer Motion, ESM modules
**Deployment:** GitHub Pages (staging at `https://roma-mart.github.io/romamart.ca/`), custom domain (production)
**Version:** 2.6.3 (see Versioning Convention below)
**Repo:** `roma-mart/romamart.ca`

### Current Status (Feb 2026)

An expert-consolidated audit (9 domain experts, 56 findings, 55 recommendations) drives an 8-sprint roadmap. Key docs:
- `docs/ROADMAP.md` -- Sprint plan, recommendations R1-R55, domain scorecard
- `docs/EXPERT_AUDIT_FEB_2026.md` -- Full audit findings
- `docs/API_MIGRATION_READINESS.md` -- Backend API spec
- GitHub Issues #98-#106 (sprint issues), #107 (backend API)
- Project board: RomaMart UI Roadmap (GitHub Projects)

---

## Critical Rules (Non-Negotiable)

1. **No hardcoded colors.** Use CSS variables (`var(--color-primary)`) or design tokens (`src/design/tokens.js`). Never `#020178` etc.
2. **Context providers for data.** Use `useMenu()`, `useServices()`, `useLocations()` -- never `import { SERVICES } from '../data/services'` directly.
3. **COMPANY_DATA is SSOT for HQ info.** All company name, address, phone, GST, social links come from `src/config/company_data.js`. No hardcoding.
4. **Navigation links from config.** Use `src/config/navigation.js` -- never hardcode URLs in components.
5. **Conventional Commits enforced.** Format: `<type>(<scope>): <description>`. Commitlint validates via Husky hook.
6. **All changes must pass `npm run check:all`** before commit (lint + quality + integrity).
7. **No suppressed warnings.** Fix root causes. Systems over spot fixes.
8. **Read before modifying.** Always read existing code and relevant docs before proposing changes.

---

## Development Ethos (Condensed)

25 principles in `docs/DEVELOPMENT_ETHOS.md`. The most critical:

| # | Principle | Implication |
|---|-----------|-------------|
| 1 | Systems over spot fixes | Build comprehensive solutions, not patches |
| 5 | Brand consistency | Design tokens, no hardcoded brand values |
| 6 | Accessibility first | WCAG 2.2 AA+, keyboard nav, ARIA, focus-visible |
| 7 | Dark mode resilience | CSS variables, high contrast, forced-colors |
| 9 | Security by default | No exposed secrets, XSS prevention, least privilege |
| 14 | Self-auditing quality | Universal checker + meta-checker |
| 17 | Data-driven content | Context providers, API-first with static fallback |
| 25 | Deep understanding first | Read all relevant code/docs before any changes |

**Lifecycle:** Discover > Validate > Plan > Implement > Verify > Document > Observe

---

## Architecture Quick Reference

```
src/
  main.jsx                    # Entry point
  App.jsx                     # Root component, routing, context providers
  index.css                   # Global styles, CSS variables, dark mode
  components/                 # Reusable UI components
  pages/                      # Route components (lazy loaded via React.lazy)
  config/                     # SSOT configs (company_data.js, navigation.js)
  data/                       # Static data (locations.js, services.jsx, rocafe-menu.js)
  contexts/                   # React Context providers
  hooks/                      # Custom hooks
  utils/                      # Utility functions
  schemas/                    # Schema.org JSON-LD builders
  design/                     # Design tokens (tokens.js)
  assets/                     # Static assets
public/
  sw.js                       # Service worker template
  manifest.webmanifest        # PWA manifest
scripts/
  prerender.js                # Static HTML generation
  check-quality.js            # Universal quality checker (1000+ rules)
  check-checker-integrity.js  # Meta-checker
```

### Component Patterns
- Functional components only (React 18.3.1 hooks)
- Pages lazy loaded: `const Page = lazy(() => import('./pages/Page'))`
- Every page has `<Helmet>` for SEO metadata
- `Button.jsx` -- unified button with variants (order, nav, action, navlink, icon, secondary, inverted, custom). Renders `<motion.button>`/`<motion.a>` for animated variants, plain `<button>`/`<a>` otherwise.
- `LocationButton.jsx` -- standalone geolocation button (NOT a Button variant)

---

## Data Management

### Architecture: API-first with static fallback

| Context | Hook | API Endpoint | Fallback |
|---------|------|-------------|----------|
| MenuContext | `useMenu()` | `https://romamart.netlify.app/api/public-menu` | Empty array |
| ServicesContext | `useServices()` | `https://romamart.netlify.app/api/public-services` | Static `SERVICES` from `src/data/services.jsx` |
| LocationsContext | `useLocations()` | `https://romamart.netlify.app/api/public-locations` | Static `LOCATIONS` from `src/data/locations.js` |
| LocationContext | `useLocationContext()` | N/A (client state) | N/A |

Each returns `{ data, loading, error, source }` (source = `'api'` or `'static'`).

```jsx
// CORRECT
const { services, loading, error } = useServices();

// WRONG -- bypasses API system
import { SERVICES } from '../data/services';
```

### SSOT Files
- `src/config/company_data.js` -- HQ address, hours, contact, GST, social, Web3Forms key
- `src/config/navigation.js` -- All nav links
- `src/data/locations.js` -- Store locations with hours, coordinates, amenities, Google Place IDs
- `src/data/services.jsx` -- 15 services with categories, features, availability
- `src/data/rocafe-menu.js` -- Menu items

---

## Design System

### Tokens & Variables
- **SSOT:** `src/design/tokens.js`
- **CSS variables** in `src/index.css` respond to `@media (prefers-color-scheme: dark)` automatically
- **Theme utilities:** `import { useThemeColors, CSS_VARS } from '../utils/theme'`

### Fonts
- **Headings:** Outfit (`--font-heading`)
- **Body:** Inter (`--font-body`)
- **Utility class:** `text-heading` applies heading font to non-heading elements
- **NEVER** put `var(--font-heading)` in a `className` -- use `style={{ fontFamily: 'var(--font-heading)' }}` for inline

### Colors (use variables, never hex)
```jsx
// Correct
<div style={{ color: 'var(--color-primary)' }}>
<div style={{ backgroundColor: CSS_VARS.surface }}>

// Wrong
<div style={{ color: '#020178' }}>
```

---

## Quality System

### Commands
```powershell
npm run check:all          # Lint + quality + integrity (run before every commit)
npm run check:quality      # Universal quality checker (1000+ rules, 9 dimensions)
npm run check:integrity    # Meta-checker (validates quality system itself)
npm run lint               # ESLint
npm run lint:css           # Stylelint
npm run build              # Production build + prerender
```

### Quality Dimensions
Accessibility, dark mode, performance, security, SEO, code quality, responsive design, browser compatibility, brand consistency.

### Git Hooks (Husky v9)
- **pre-commit:** lint-staged (ESLint on `*.{js,jsx}`, Stylelint on `*.css`) + check:quality + check:integrity
- **commit-msg:** commitlint (Conventional Commits)

### Pre-Commit Checklist
1. `npm run check:all` passes
2. `npm run build` succeeds
3. Test in both light and dark modes
4. Keyboard navigation works
5. Responsive breakpoints verified

---

## Testing

**Framework:** Vitest
**Tests:** 260 passing (as of v2.6.2)
**Coverage thresholds:** statements 60%, branches 50%, functions 60%, lines 60%

### Test Locations
- `src/utils/__tests__/` -- Utility function tests
- `src/contexts/__tests__/` -- Context provider tests
- `src/test/schemas/` -- Schema validation tests

### Running Tests
```powershell
npm run test               # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
npm run test:ui            # Vitest UI
```

---

## Git Workflow

### Branch Naming
- `feature/*` -- New features
- `bugfix/*` -- Bug fixes
- `hotfix/*` -- Critical production fixes
- `docs/*` -- Documentation
- `chore/*` -- Maintenance, deps, tooling
- Sprint branches follow roadmap: `fix/critical-bugs`, `perf/lcp-optimization`, `test/critical-coverage`, etc.

### Commit Format
```
<type>(<scope>): <description>
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### PR Title Format
```
<version> <type>(<scope>): <description>
```
Example: `2.6.1 test(sprint-7): critical coverage expansion + contact form fixes`

### PR Template
Located at `.github/PULL_REQUEST_TEMPLATE.md`. Includes sections for description, type, related issues, changes, and testing checklist.

---

## Versioning Convention

**SemVer** (`MAJOR.MINOR.PATCH`) with sprint-template mapping:

| Sprint Template | Version Bump | Examples |
|-----------------|-------------|----------|
| Bug Report (Critical/High) | MINOR | Sprint 1 Critical: 2.3.0, Sprint 3 A11y: 2.4.0 |
| Feature Request | MINOR | Sprint 6 UX: 2.6.0 |
| Maintenance | PATCH | Sprint 2 Perf: 2.3.3, Sprint 4 DevOps: 2.4.1, Sprint 7 Test: 2.6.1 |

Sprint templates are defined in `docs/ROADMAP.md` under Sprint Plan.

---

## Routing & Build

### Client-Side Routing
- Pathname matching in `App.jsx` (no router library)
- Base path: `/${REPO_NAME}/` for GitHub Pages, `/` for production
- Change `base` in `vite.config.js` for production cutover

### Build Process
1. `vite build --mode production` compiles React
2. `scripts/prerender.js` generates static HTML per route
3. Manual chunks: `react-vendor`, `icons`, `motion`
4. Output: `dist/`
5. Source maps disabled (Lucide React corruption)

### Deployment
- **Staging:** `npm run deploy` -- builds + pushes to `gh-pages` branch
- **Production:** Update `base: '/'` in vite.config.js, deploy `dist/` folder

---

## External APIs

| Service | Endpoint | Purpose | Notes |
|---------|----------|---------|-------|
| Web3Forms | `https://api.web3forms.com/submit` | Contact form | POST, access key from `COMPANY_DATA`, check `data.success` not `response.ok` |
| Google Places | Via `useGooglePlaceHours` hook | Live hours/ratings | 1hr IndexedDB cache, circuit breaker protection |
| hCaptcha | `@hcaptcha/react-hcaptcha` | Bot protection | `HCaptchaWidget.jsx` with forwardRef, tokens are single-use, must reset after submit |
| Menu API | `https://romamart.netlify.app/api/public-menu` | RoCafe menu | Live (200 OK) |
| Services API | `https://romamart.netlify.app/api/public-services` | Store services | Pending (#107), uses static fallback |
| Locations API | `https://romamart.netlify.app/api/public-locations` | Store locations | Pending (#107), uses static fallback |

### Circuit Breaker (`src/utils/apiCircuitBreaker.js`)
- Monitors 429/403/402 errors
- Opens after 5 failures, auto-resets after 1 hour
- `shouldAttemptCall()` / `recordFailure()` / `recordSuccess()` / `getStatus()`

---

## PWA

- **Service worker:** `public/sw.js` (source template), Vite injects hashed filenames at build
- **Caching:** Network-first for HTML/API, cache-first for static assets
- **Cache bounded:** `MAX_CACHE_ENTRIES = 100` with `trimCache()` eviction
- **`CACHE_VERSION`** controls cache invalidation
- **Hook:** `useServiceWorker()` returns `{ registration, updateAvailable, skipWaiting, isOnline }`
- **Components:** `PWAInstallPrompt` (engagement-based), `PWAUpdatePrompt` (update notification)

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `docs/ROADMAP.md` | Sprint plan, R1-R55 recommendations |
| `docs/DEVELOPMENT_ETHOS.md` | 25 core development principles |
| `docs/ARCHITECTURE.md` | System design and conventions |
| `docs/QUALITY_SYSTEM.md` | Quality standards (8 dimensions) |
| `docs/EXPERT_AUDIT_FEB_2026.md` | Full audit findings |
| `.github/BRANCHING_STRATEGY.md` | Git workflow, branch naming, PR process |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR format requirements |
| `src/design/tokens.js` | Design tokens SSOT |
| `src/config/company_data.js` | Company info SSOT |
| `src/config/navigation.js` | Navigation links SSOT |
| `src/utils/theme.js` | Theme utilities, CSS variable helpers |
| `src/utils/apiCircuitBreaker.js` | API protection pattern |
| `scripts/check-quality.js` | Universal quality checker |
| `scripts/check-checker-integrity.js` | Meta-checker |
| `vite.config.js` | Build config, base path, chunks |
| `public/sw.js` | Service worker template |
| `CHANGELOG.md` | Version history |

---

## AI Assistant Sync

This file (`CLAUDE.md`) is the Claude Code project context. A parallel `.github/copilot-instructions.md` exists for GitHub Copilot.

**Maintenance rules:**
- When updating project conventions, architecture, or workflows, update BOTH files
- Each file is optimized for its respective AI's context format
- If you notice drift between the files, flag it and propose corrections
- Last synced: February 8, 2026

---

**Last Updated:** February 8, 2026
**Maintained by:** Claude Code (keep in sync with `.github/copilot-instructions.md`)
**Codebase Version:** React 18.3.1 + Vite 7 (ESM)
