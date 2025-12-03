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

---

## Open Questions for Improvement

**For Collaborators:** Please review and answer these questions to enhance the instructions:

1. **Deployment workflow**: Should we add more details about the `gh-pages` deployment or CI/CD setup?
   - *AI Hint: Ask about any GitHub Actions workflows, automated deployment triggers, branch protection rules, or deployment verification steps*

2. **Testing strategy**: Should we document manual testing procedures, or is there a test suite to document?
   - *AI Hint: Check for test files in `src/**/*.test.{js,jsx}` or `__tests__/` directories. Ask about testing libraries (Jest, Vitest, React Testing Library), test coverage requirements, or critical user flows that need manual testing*

3. **API/Backend**: Are there backend services or APIs we should document integration patterns for?
   - *AI Hint: Search for API calls, fetch requests, or backend URLs in the codebase. Ask about authentication patterns, error handling strategies, API versioning, or rate limiting considerations*

4. **Additional tools**: Are there other development tools (Prettier, Husky, git hooks, etc.) that should be mentioned?
   - *AI Hint: Check for `.prettierrc`, `.huskyrc`, or `package.json` git hooks. Ask about code formatting preferences, pre-commit hooks, or editor configurations in `.vscode/` or `.editorconfig`*

5. **Team conventions**: Any specific code review practices, branching strategies, or communication patterns to document?
   - *AI Hint: Ask about PR templates, required reviewers, commit message conventions (Conventional Commits?), branch naming patterns (feature/*, bugfix/*), or merge vs rebase preferences*

**To update this file:** Edit `.github/copilot-instructions.md` and remove answered questions from this section.

---

**Last Updated:** December 3, 2025  
**Maintained by:** GitHub Copilot
