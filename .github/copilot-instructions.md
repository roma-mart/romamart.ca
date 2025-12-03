# GitHub Copilot Instructions - Roma Mart 2.0

## Project Overview

Roma Mart 2.0 is a **React 19 + Vite 7** progressive web app for a multi-location convenience store chain. Built with accessibility-first, dark-mode-native, and quality-enforced architecture.

**Stack:** React 19, Vite 7, Tailwind CSS, Framer Motion, ESM modules  
**Deployment:** GitHub Pages (staging), custom domain (production)

## Critical Architecture Principles

### 1. Systems Over Spot Fixes (DEVELOPMENT_ETHOS.md Principle #1)
- **Never** suppress warnings or make ad-hoc patches
- Build comprehensive, reusable solutions that scale
- Example: Don't fix one color; update the design token system

### 2. Deep Understanding Before Action (Principle #25)
- **ALWAYS** read `ARCHITECTURE.md`, `DEVELOPMENT_ETHOS.md`, and relevant docs before making changes
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

### Component Architecture
- **Functional components only** with hooks (React 19)
- Lazy load pages: `const Page = lazy(() => import('./pages/Page'))`
- Use `react-helmet-async` for SEO on all pages
- Follow structure: `src/components/` (reusable), `src/pages/` (routed)
- See component READMEs in each directory for specific conventions

### Data Management
- **Single source of truth:** `src/data/locations.js` for all store data
- Location types: convenience_store, minimart, vending_machine, atm_standalone, etc.
- Add locations by copying existing structure, don't create new schemas
- Use LocationContext (`src/contexts/LocationContext.js`) for location state

### Accessibility (WCAG 2.2 AA+)
- All interactive elements need `:focus-visible` styles
- Images require `alt` text
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Forms need proper `<label>` associations
- Skip links required for main navigation
- Test with keyboard-only navigation

### Dark Mode
- Uses CSS custom properties that respond to `@media (prefers-color-scheme: dark)`
- Supports high contrast mode and forced-colors
- Test all visual changes in both light/dark modes
- See `DARK_MODE_SYSTEM.md` for implementation details

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
- Clickio CMP handles consent (loaded via GTM)
- GA4, Trustpilot, Snap Pixel fire only after consent
- Update consent policy links to `/privacy` and `/cookies` before production cutover

### Service Worker (PWA)
- `public/sw.js` handles offline caching, install prompts
- Cache-first strategy for static assets
- Network-first for API calls (when implemented)
- Use `useServiceWorker` hook for registration

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
1. Open `src/data/locations.js`
2. Copy existing location object structure
3. Fill in all required fields (no nulls for critical data)
4. Add Google Place ID and coordinates
5. Specify services array (atm, bitcoin_atm, rocafe, etc.)
6. Test on Locations page

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
2. Update Clickio policy links to production URLs
3. Update GTM container settings
4. Verify with Tag Assistant Preview
5. Test all routes and analytics

## Troubleshooting

### Quality Check Failures
- Read the specific error message and severity level
- Fix CRITICAL and HIGH issues before committing
- Reference `QUALITY_SYSTEM.md` for remediation strategies
- Don't suppress warnings; fix root cause

### Dark Mode Issues
- Check CSS variable usage in `src/index.css`
- Test with DevTools: Toggle `prefers-color-scheme`
- Verify all colors use CSS variables, not hardcoded values
- See `DARK_MODE_SYSTEM.md` for patterns

### Build Failures
- Check for syntax errors with `npm run lint`
- Verify all imports resolve
- Check bundle size limits in quality checker
- Clear cache: `rm -rf dist node_modules && npm install`

## Key Files Reference

| File | Purpose |
|------|---------|
| `DEVELOPMENT_ETHOS.md` | 25 core principles guiding all development |
| `ARCHITECTURE.md` | High-level system design and conventions |
| `QUALITY_SYSTEM.md` | Comprehensive quality standards documentation |
| `src/design/tokens.js` | Single source of truth for design tokens |
| `src/data/locations.js` | All store locations data |
| `src/utils/theme.js` | Theme utilities and CSS variable helpers |
| `scripts/check-quality.js` | Universal quality checker (1000+ rules) |
| `scripts/check-checker-integrity.js` | Meta-checker for quality system |
| `vite.config.js` | Build configuration and base path |

## Additional Resources

- Accessibility audit: `ACCESSIBILITY_COMPLIANCE.md`
- Content guidelines: `CONTENT_GUIDE.md`
- Release checklist: `RELEASE_CHECKLIST.md`
- Contributing guide: `CONTRIBUTING.md`

## External API Integration

### Web3Forms Contact API
- **Endpoint:** `https://api.web3forms.com/submit`
- **Method:** POST with JSON body
- **Auth:** Access key from environment variable `VITE_WEB3FORMS_KEY`
- **Implementation:** `src/pages/ContactPage.jsx`
- **Error Handling:** Falls back to queuing in IndexedDB if offline
- **Rate Limiting:** None client-side; service handles rate limits

**Pattern for API calls:**
```jsx
const response = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ access_key: import.meta.env.VITE_WEB3FORMS_KEY, ...formData })
});
```

## Development Tooling & Code Style

### Code Formatting
- **No Prettier configured** - Manual formatting following ESLint rules
- **EditorConfig:** Not configured (consider adding for consistency)
- **ESLint:** Strict rules enforced via `npm run lint`
  - React Hooks compliance required
  - JSX accessibility (a11y) required
  - No unused variables, no console.log in production code

### Git Workflow
- **Branching strategy:** See [BRANCHING_STRATEGY.md](.github/BRANCHING_STRATEGY.md) for complete guide
- **Branch naming:**
  - `feature/*` - New features
  - `bugfix/*` - Bug fixes
  - `hotfix/*` - Critical production fixes
  - `docs/*` - Documentation updates
  - `chore/*` - Maintenance tasks
- **Commit conventions:** Follow [Conventional Commits](https://www.conventionalcommits.org/)
  - Format: `<type>(<scope>): <description>`
  - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Manual quality checks required** before commit: `npm run check:all`
- **Git hooks:** Not configured (see [TOOLING_RECOMMENDATIONS.md](.github/TOOLING_RECOMMENDATIONS.md) for Husky setup)
- **Pull requests:** Required for all changes to `main` (see [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md))

### Testing Strategy
- **No automated test suite** - Quality enforced via:
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
2. Update Clickio CMP policy links to production URLs
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
- Prefer WebP format with fallbacks
- Serve responsive images via `srcset` when applicable
- Placeholder images for development (replace with real assets)

### Critical Rendering Path
1. Inline critical CSS in `src/index.css`
2. Defer non-critical scripts
3. Preconnect to external domains (Google Maps, GTM)
4. Service worker caches assets for repeat visits

---

**Last Updated:** December 3, 2025  
**Maintained by:** GitHub Copilot  
**Codebase Version:** React 19 + Vite 7 (ESM)
