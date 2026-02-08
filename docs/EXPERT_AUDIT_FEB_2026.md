# Roma Mart 2.0 -- Expert-Consolidated Project Audit

**Date:** February 6, 2026 | **Version:** 2.3.1 | **Branch:** `fix/seo-indexing-sitemap`
**Methodology:** Code-verified findings + 9 expert domain analyses
**Experts consulted:** Security, Testing, Performance, DevOps/CI, PWA, Accessibility/WCAG, SEO/Structured Data, UX/UI/Branding, Business Strategy

---

## 1. Executive Summary

Roma Mart 2.0 is a React 18.3.1 + Vite 7 PWA for a single-location Canadian convenience store (Roma Mart, Sarnia ON) with an in-store cafe sub-brand (RoCafe). The project has strong engineering foundations (SSOT patterns, API-first data, quality tooling, comprehensive structured data) but expert analysis reveals **critical issues across PWA reliability, performance bottlenecks, CI/CD waste, and a strategic over-engineering concern** relative to the current business stage.

| Domain | Grade | Key Finding |
|--------|-------|-------------|
| **Security** | B+ | No critical vulns; XLSX CVEs low-risk in context |
| **SEO** | B+ | Solid structured data; broken SearchAction, missing 404 page |
| **Accessibility** | B- | Phase 1 done but no focus traps on modals, form errors not announced |
| **UX/UI/Branding** | B- | Strong palette but font loading chaos, broken `var()` in classNames |
| **Testing** | C | 11 files / ~122 tests; critical business logic untested |
| **Performance** | D+ | Triple font loading, wrong LCP strategy, Framer Motion in critical path |
| **DevOps/CI** | D | 3-4x redundant builds per push, Husky completely broken |
| **PWA** | F | SW precaches wrong manifest filename; entire offline layer broken |
| **Business Alignment** | 4/10 | Enterprise-grade engineering for a 5-person family store that needs Google reviews more than schemas |

---

## 2. ALL PROBLEMS -- By Severity

### CRITICAL (4)

| # | Domain | Problem | Location |
|---|--------|---------|----------|
| C1 | PWA | **SW precaches `manifest.json` but file is `manifest.webmanifest`** -- entire precache fails silently, PWA offline broken | `public/sw.js` precache array |
| C2 | Performance | **Triple font loading** -- 2x `@import` in `index.css:1-5` + 1x `<link>` in `index.html:38` load same fonts 3 times (+800-1500ms LCP) | `src/index.css:1-5`, `index.html:38` |
| C3 | Performance | **Hero image `loading="lazy"`** -- LCP element deferred, directly hurts Core Web Vitals | `App.jsx:118` |
| C4 | Accessibility | **`--color-on-accent` used in 6 files, defined nowhere** -- unpredictable text contrast on accent backgrounds | `ContactPage:99,290`, `TermsPage:49`, `PrivacyPage:49`, `ReturnPolicyPage:59`, `CookiesPage:49` |

### HIGH (18)

| # | Domain | Problem | Location |
|---|--------|---------|----------|
| H1 | Performance | **Hero text `opacity:0` + 800ms Framer Motion animation** delays LCP | `App.jsx:81,116` |
| H2 | Performance | **Every `<Button>` = `<motion.button>`** -- FM (~50KB gz) in critical bundle for ALL buttons | `Button.jsx` |
| H3 | Performance | **Every Button calls `useGeolocation()`** regardless of variant | `Button.jsx` |
| H4 | DevOps | **Build runs 3-4 times per push** to main; ~6x `npm ci` | `accessibility-ci.yml`, `seo-check.yml` |
| H5 | DevOps | **Husky completely non-functional** -- 3 breakages: package missing, shim missing, v8 format | `.husky/pre-push`, `package.json` |
| H6 | DevOps | **`precommit`/`prepush` npm scripts are dead code** -- NOT lifecycle hooks | `package.json:19-20` |
| H7 | Accessibility | **Framer Motion ignores `prefers-reduced-motion`** -- fix is commented out | `App.jsx:81,116,651` |
| H8 | Accessibility | **Mobile nav: no focus trap, no `role="dialog"`, no Escape handler** | `Navbar.jsx:211-288` |
| H9 | Accessibility | **Contact form errors not announced** -- no `aria-live`, no `aria-invalid`, no `aria-describedby` | `ContactPage.jsx:199-271` |
| H10 | PWA | **`offline.html` references `/src/index.css`** -- doesn't exist in prod builds | `public/offline.html` |
| H11 | PWA | **Background sync dead code (~140 lines)** -- wrong feature detection, never registered | `public/sw.js`, `useServiceWorker.js` |
| H12 | PWA | **No Vite-hashed bundles in SW precache** -- offline app = blank page | `public/sw.js` precache array |
| H13 | SEO | **SearchAction targets `/search?q=` which doesn't exist** | `index.html` WebSite schema |
| H14 | Testing | **`calculateItemPrice` untested** -- customer-facing pricing | `src/utils/menuHelpers.js` |
| H15 | Testing | **`ApiCircuitBreaker` zero tests** -- reliability pattern untested | `src/utils/apiCircuitBreaker.js` |
| H16 | UX/UI | **`var(--font-heading)` used as CSS class name** instead of property -- does nothing, inconsistent typography | `App.jsx:85,132,298`, `RoCafePage.jsx:116`, `LocationsPage.jsx:106` |
| H17 | UX/UI | **ErrorBoundary shows raw stack traces** to customers -- trust-destroying experience | `ErrorBoundary.jsx:30-33` |
| H18 | UX/UI | **`--font-body` set to `'Outfit'` but docs/comments say `'Inter'`** -- brand identity contradiction at foundation | `index.css:216`, `tokens.js:46` |

### MEDIUM (22)

| # | Domain | Problem | Location |
|---|--------|---------|----------|
| M1 | Performance | **Navbar scroll handler: no throttle** -- 60 re-renders/sec while scrolling | `Navbar.jsx` |
| M2 | Performance | **FontAwesome 3 packages** (~30-40KB) for 5 social icons | `Footer.jsx` |
| M3 | Performance | **No WebP/AVIF, no `srcset`** | All images |
| M4 | Accessibility | **PWAInstallPrompt: no focus trap, no `aria-modal`, no Escape handler** | `PWAInstallPrompt.jsx:180-291` |
| M5 | Accessibility | **Footer social icons use `title` not `aria-label`** -- unreliable for AT | `Footer.jsx:265-278` |
| M6 | Accessibility | **No CookieConsent component** despite GTM analytics (PIPEDA/CASL concern) | N/A |
| M7 | DevOps | **SEO CI missing 2/3 secrets** | `seo-check.yml` |
| M8 | DevOps | **`check:integrity` not in CI** | CI gap |
| M9 | DevOps | **Non-deterministic prerender builds** | `prerender.js` |
| M10 | PWA | **Install state never persisted** | `PWAInstallPrompt.jsx` |
| M11 | PWA | **Dual `skipWaiting()`** -- race condition | `public/sw.js` |
| M12 | PWA | **Update notification silently discarded** | `App.jsx:615` |
| M13 | PWA | **No cache size management** | `public/sw.js` |
| M14 | Security | **XLSX 0.18.5 known CVEs** -- low risk in context | `package.json` |
| M15 | Security | **Google API key in client bundle** | `locations.js` |
| M16 | Testing | **API contexts zero tests** | `src/contexts/` |
| M17 | SEO | **No custom 404 page** | `App.jsx` routing |
| M18 | UX/UI | **Footer overloaded** -- 10+ modules (reviews, Trustpilot, location selector, time, social, links...) | `Footer.jsx` |
| M19 | UX/UI | **Duplicate contact form** with different fields/styling on homepage vs /contact | `App.jsx:392-600`, `ContactPage.jsx` |
| M20 | UX/UI | **Console.log in production** code | `App.jsx:633-634,681`, `RoCafePage.jsx:49-52,73` |
| M21 | Business | **"Coming Soon" services displayed** -- ATM, Bitcoin, Printing, Package, Money Transfer, Lottery shown with no delivery date | `services.jsx` |
| M22 | Business | **Friday hours anomaly (3 PM - 9 PM open)** -- loses morning rush, no explanation | `locations.js` |

### LOW (12)

| # | Domain | Problem | Location |
|---|--------|---------|----------|
| L1 | A11y | Yellow #E4B340 on white: 4.6:1 ratio (borderline AA) | Various |
| L2 | Security | No CSP (static hosting limitation) | `index.html` |
| L3 | Security | Web3Forms key in bundle (by design) | `ContactPage.jsx` |
| L4 | DevOps | checkout@v3 should be v4 | CI workflows |
| L5 | SEO | Missing `og:locale` | `index.html` |
| L6 | Testing | No coverage thresholds | `vitest.config.js` |
| L7 | PWA | Manual cache version string | `public/sw.js` |
| L8 | UX/UI | Unbranded Suspense fallback on sub-pages | `App.jsx:722` |
| L9 | UX/UI | "New In Town" badge will become stale | `App.jsx:83` |
| L10 | UX/UI | Inconsistent border-radius system | Multiple |
| L11 | Business | Multi-location infra for one store | Throughout |
| L12 | Business | 7 schema types has diminishing returns | `src/schemas/` |

---

## 3. ALL RECOMMENDATIONS -- Prioritized Action Plan

### P0: Fix Immediately (5 items -- all quick wins)

| # | Action | Fixes | Est. |
|---|--------|-------|------|
| **R1** | **Define `--color-on-accent`** in `index.css` `:root` and dark mode | C4 | 5 min |
| **R2** | **Fix SW precache: `manifest.json` -> `manifest.webmanifest`** | C1 | 2 min |
| **R3** | **Deduplicate font loading** -- remove 2 `@import` lines from `index.css`, keep single `<link>` in `index.html` | C2 | 10 min |
| **R4** | **Remove `loading="lazy"` from hero image**, add `fetchpriority="high"` | C3 | 2 min |
| **R5** | **Fix hero LCP** -- remove `initial={{ opacity: 0 }}` from hero text | H1 | 5 min |

### P1: High Priority (16 items)

| # | Action | Fixes | Est. |
|---|--------|-------|------|
| **R6** | **Fix reduced motion** -- uncomment `shouldReduceMotion` or use FM's `useReducedMotion()` | H7 | 15 min |
| **R7** | **Split Button** -- plain `<button>` for non-animated variants, `motion.button` only where needed; remove universal `useGeolocation()` | H2, H3 | 1-2 hrs |
| **R8** | **Fix Husky** -- `npm i -D husky && npx husky init`, update to v9 format, add pre-commit hook | H5, H6 | 20 min |
| **R9** | **Delete dead `precommit`/`prepush` npm scripts** | H6 | 5 min |
| **R10** | **Consolidate CI** -- merge workflows, share build via artifacts, eliminate redundant npm ci | H4 | 1-2 hrs |
| **R11** | **Fix/remove SearchAction** -- remove from schema or implement `/search` page | H13 | 15 min |
| **R12** | **Add `calculateItemPrice` tests** | H14 | 1 hr |
| **R13** | **Add `ApiCircuitBreaker` tests** | H15 | 2 hrs |
| **R14** | **Fix offline.html** -- inline critical CSS | H10 | 15 min |
| **R15** | **Fix or remove background sync** (~140 lines of dead code) | H11 | 30 min |
| **R16** | **Add Vite builds to SW precache** -- `vite-plugin-pwa` or workbox integration | H12 | 2-3 hrs |
| **R17** | **Fix `var(--font-heading)` class usage** -- replace with `style={{ fontFamily: 'var(--font-heading)' }}` or Tailwind class | H16 | 30 min |
| **R18** | **Make ErrorBoundary customer-friendly** -- branded error state, hide stack traces | H17 | 30 min |
| **R19** | **Resolve Outfit vs Inter body font** -- update `--font-body` to match actual usage, audit `font-inter` classes | H18 | 30 min |
| **R20** | **Add focus trap to mobile nav** -- `role="dialog"`, Escape handler, focus management | H8 | 1-2 hrs |
| **R21** | **Add `aria-live` to ContactPage form** -- error/success announcements, `aria-invalid` on fields | H9 | 30 min |

### P2: Medium Priority (18 items)

| # | Action | Fixes |
|---|--------|-------|
| **R22** | Throttle Navbar scroll handler (rAF) | M1 |
| **R23** | Replace FontAwesome with inline SVGs (5 icons) | M2 |
| **R24** | Add `aria-modal="true"` + focus trap + Escape to PWAInstallPrompt | M4 |
| **R25** | Replace `title` with `aria-label` on footer social links | M5 |
| **R26** | Fix SEO CI secrets | M7 |
| **R27** | Add `check:integrity` to CI | M8 |
| **R28** | Pin prerender API data or add `--offline` flag | M9 |
| **R29** | Fix PWA install state persistence | M10 |
| **R30** | Fix SW skipWaiting race | M11 |
| **R31** | Consume SW update notification in App.jsx | M12 |
| **R32** | Add cache eviction policy | M13 |
| **R33** | Add API context tests | M16 |
| **R34** | Create custom 404 page | M17 |
| **R35** | Decompose Footer into smaller components | M18 |
| **R36** | Unify contact form into reusable component | M19 |
| **R37** | Gate console.logs behind `import.meta.env.DEV` | M20 |
| **R38** | Clean up "Coming Soon" services -- hide or add notification signup | M21 |
| **R39** | Add CookieConsent banner -- required for GTM/analytics under PIPEDA/CASL | M6 |

### P3: Low Priority / Future (16 items)

| # | Action | Fixes |
|---|--------|-------|
| R40 | Add Prettier + commitlint + lint-staged + editorconfig | L-series |
| R41 | Set coverage thresholds | L6 |
| R42 | Auto-version SW cache from build hash | L7 |
| R43 | Use branded LoadingFallback for all Suspense boundaries | L8 |
| R44 | Replace "New In Town" with data-driven badge | L9 |
| R45 | Establish border-radius design token scale | L10 |
| R46 | Add `og:locale` meta tag (`en_CA`) | L5 |
| R47 | Update checkout@v3 to v4 in CI workflows | L4 |
| R48 | Add Dependabot config | -- |
| R49 | WebP/AVIF images with srcset | M3 |
| R50 | Evaluate XLSX replacement | M14 |
| R51 | React 19 upgrade or doc correction | -- |
| R52 | TypeScript migration (incremental) | -- |
| R53 | E2E tests with Playwright | -- |
| R54 | Lighthouse CI in pipeline | -- |
| R55 | `vite-plugin-pwa` full migration | -- |

### Business-Strategic Recommendations (from Business Advisor)

| Priority | Action | Rationale |
|----------|--------|-----------|
| **Immediate** | **Launch Google Reviews campaign** -- QR code at register, ask every customer. Goal: 50 reviews in 90 days. | Single highest-ROI marketing activity for local business. Zero cost. |
| **Immediate** | **Resolve Friday hours** -- if 3 PM open is intentional, explain it; if a data error, fix it | Direct revenue impact |
| **This month** | **Create separate Google Business Profile for RoCafe** as a "department" | Appear in both "convenience store" and "cafe" local searches |
| **This month** | **Implement basic loyalty** -- even physical punch cards for RoCafe drinks | Drive repeat visits |
| **This quarter** | **Fix NRS ordering URLs** -- UberEats/Skip/DoorDash links are generic placeholders | Half-configured ordering erodes trust |
| **Ongoing** | **Pause multi-location infrastructure work** until second location is signed | Engineering time better spent on customer-facing value |

---

## 4. Documentation vs Reality -- 10 Corrections

| # | Docs Said | Code Shows |
|---|-----------|------------|
| 1 | "React 19 + Vite 7" | **React 18.3.1**. Override only for `react-helmet-async` peer dep. |
| 2 | "Accessibility Phase 1 pending" | **All 5 items implemented** |
| 3 | "5 test files / 67 tests" | **11 files / ~122 tests** |
| 4 | ".env.local tracked in git" | **NOT tracked** -- `.gitignore` excludes it |
| 5 | "100+ PWA icons" | **67 icons** |
| 6 | "Husky partially working" | **Completely non-functional** (3 breakages) |
| 7 | "App.jsx is 36KB monolithic" | **779 lines**, 5 sections as separate functions |
| 8 | "Base path switches" | **Set to `'/'`** -- already configured |
| 9 | "No CONTRIBUTING.md" | **EXISTS** + CODE_OF_CONDUCT.md + SECURITY.md |
| 10 | "APIs ready" | Menu 200 OK; Services/Locations **404** (fallback works) |

---

## 5. Expert Domain Deep-Dives

### 5.1 Security (B+)
No critical vulnerabilities. XLSX CVEs low-risk client-side. Google API key exposure inherent to client-side Maps. Web3Forms key is public by design. No CSP but appropriate for static hosting. Overall posture: **good**.

### 5.2 Testing (C)
11 test files / ~122 tests across `src/test/schemas/` (5), `src/utils/__tests__/` (5), `src/hooks/__tests__/` (1). Schema builders well-tested. Critical gaps: `calculateItemPrice` (pricing), `ApiCircuitBreaker` (reliability), both API contexts (data layer), all page components (zero smoke tests).

### 5.3 Performance (D+)
Triple font loading, hero image lazy-loaded (should be eager), hero text invisible for 800ms, Framer Motion in every button's critical path, no scroll throttle, FontAwesome for 5 icons, no modern image formats. Combined fix estimate: 1-3 seconds improvement on 3G.

### 5.4 DevOps/CI (D)
3-4 builds per push to main, 6x npm ci, Husky completely broken (3 reasons), dead npm scripts creating false confidence, SEO workflow missing secrets, check:integrity not in CI, non-deterministic prerender builds.

### 5.5 PWA (F -- 3.5/10)
Wrong manifest filename in precache (breaks everything). No Vite bundles in precache (offline = blank page). offline.html CSS 404 in production. Background sync is ~140 lines of dead code. Wrong feature detection. Dual skipWaiting race condition. Install state never persisted. Update notifications discarded. No cache limits.

### 5.6 Accessibility (B- | est. ~78% WCAG 2.2 AA)
Phase 1 fundamentals solid (skip link, focus-visible, alt text, labels, headings, ARIA, high contrast, forced colors). Key gaps: `--color-on-accent` undefined (WCAG 1.4.3), FM ignores reduced motion (WCAG 2.3.3), mobile nav has no focus trap or dialog role (WCAG 2.1.2), contact form errors not announced (WCAG 4.1.3), PWAInstallPrompt missing `aria-modal` and focus management, no cookie consent component despite GTM usage. AODA: business is under 50-employee threshold but accessibility page shows proactive compliance.

### 5.7 SEO (B+)
Solid structured data with 7 schema builders and 13 types at prerender. robots.txt, sitemap (auto-generated), canonicals, meta descriptions all correct. Issues: SearchAction targets nonexistent `/search?q=` (HIGH), no 404 page (MEDIUM), missing `og:locale` (LOW). Schema duplication risk between prerendered HTML and client-side StructuredData component (schemas rendered twice on hydration).

### 5.8 UX/UI/Branding (B- | Scores: Brand 7/10, UX 7/10, Mobile 8/10)
**Strengths:** Distinctive navy/gold palette, dark mode as first-class, 8-variant Button system with clear hierarchy, well-structured IA, RoCafe sub-brand has its own identity, smart floating Order CTA with IntersectionObserver.

**Problems:** Triple font loading (C2), `--font-body` says 'Outfit' but tokens.js comment says 'Inter' (H18), `var(--font-heading)` used as CSS class name which does nothing (H16), ErrorBoundary exposes stack traces (H17), footer has 10+ modules (M18), duplicate contact forms (M19), console.logs in production (M20), unbranded Suspense fallback (L8), "New In Town" badge will go stale (L9).

### 5.9 Business Strategy (Alignment: 4/10)
**The core tension:** This is enterprise-grade engineering for a single 2,000 sq ft store with 5 family employees, open since November 2025. The developer is clearly talented, but the business would benefit more from 10 Google reviews than 10 schemas. Multi-location infrastructure, circuit breakers, background sync, battery-aware animations, and per-variant haptic vibration patterns are features that no customer will ever notice.

**What customers actually need:** Hours, location, menu, contact, ordering. These are all present and well-structured. The technical foundation is already strong enough.

**Highest-ROI actions are offline:** Google reviews campaign, Friday hours clarification, loyalty program, cleaning up "Coming Soon" services, and fixing the NRS ordering platform links.

---

## 6. Implementation Phases

### Phase 1: Critical Fixes (R1-R5)
Quick wins that fix actual breakage. All 5 are under 15 minutes each. Combined impact: PWA starts working, LCP improves by 1-2 seconds, accessibility contrast fixed.

### Phase 2: High Priority (R6-R21)
Structural improvements across all domains. Estimated total: 10-15 hours of focused work. Biggest wins: Button component split (perf), Husky/CI consolidation (DevOps), focus traps (a11y), font resolution (brand).

### Phase 3: Medium Priority (R22-R39)
Polish and expansion. Testing, documentation alignment, footer decomposition, PWA state fixes, 404 page, cookie consent. Estimated: 15-20 hours.

### Phase 4: Future (R40-R55)
TypeScript, Playwright, Lighthouse CI, full PWA migration. These are "when bandwidth allows" items.

---

## 7. Sprint Planning Guide

*For a solo dev doing DIY sprints with Red Bull -- here's how to group the work into logical branches and PRs.*

### Sprint 1: "Stop the Bleeding" (P0 fixes)
**Branch:** `fix/critical-bugs`
**Scope:** R1-R5 (all P0 items)
**PR description:** Fix 4 critical issues (undefined CSS var, wrong SW manifest filename, triple font loading, hero lazy-load) + hero LCP animation delay
**Estimated effort:** 1-2 hours
**Why one PR:** These are all small, independent fixes. Ship them together to get the biggest immediate improvement.

### Sprint 2: "Performance & LCP"
**Branch:** `perf/lcp-optimization`
**Scope:** R6 (reduced motion), R7 (Button split), R17 (font-heading fix), R19 (Outfit/Inter resolution), R22 (scroll throttle)
**PR description:** Split Button component, fix font system, throttle scroll handler
**Estimated effort:** 3-4 hours
**Why grouped:** All touch rendering performance and the CSS/font system. Button split is the big one here -- it affects every page.

### Sprint 3: "Accessibility Pass"
**Branch:** `a11y/focus-traps-and-forms`
**Scope:** R20 (mobile nav focus trap), R21 (form aria-live), R24 (PWA prompt a11y), R25 (footer social aria-labels)
**PR description:** Add focus traps to modals, announce form errors, fix social link accessibility
**Estimated effort:** 3-4 hours
**Why grouped:** All accessibility fixes that follow the same patterns (dialog role, focus management, ARIA attributes).

### Sprint 4: "DevOps Cleanup"
**Branch:** `chore/ci-and-husky`
**Scope:** R8 (fix Husky), R9 (delete dead scripts), R10 (consolidate CI), R26 (fix secrets), R27 (add integrity check), R47 (checkout@v4)
**PR description:** Fix Husky, consolidate CI workflows from 6x to 2x npm ci, add missing CI steps
**Estimated effort:** 3-4 hours
**Why grouped:** All CI/tooling changes. Test the full pipeline before merging.

### Sprint 5: "PWA Resurrection"
**Branch:** `fix/pwa-offline`
**Scope:** R14 (offline.html), R15 (remove dead sync code), R16 (Vite precache), R29-R32 (PWA state fixes)
**PR description:** Fix offline experience -- proper precache, remove dead code, fix state management
**Estimated effort:** 4-6 hours
**Why grouped:** The entire PWA layer needs to work together. Test offline mode end-to-end before shipping.

### Sprint 6: "UX Polish"
**Branch:** `ux/error-states-and-cleanup`
**Scope:** R18 (ErrorBoundary), R35 (Footer decomposition), R36 (unify contact form), R37 (console.logs), R39 (CookieConsent), R43 (branded Suspense)
**PR description:** Customer-friendly errors, clean up Footer, unify forms, remove console noise
**Estimated effort:** 3-4 hours
**Why grouped:** All user-facing polish. Good candidate for visual QA.

### Sprint 7: "Testing Expansion"
**Branch:** `test/critical-coverage`
**Scope:** R12 (calculateItemPrice), R13 (ApiCircuitBreaker), R33 (API contexts), R41 (coverage thresholds)
**PR description:** Test critical business logic, set coverage baseline
**Estimated effort:** 4-6 hours
**Why grouped:** All testing. Run full suite before and after to measure improvement.

### Sprint 8: "SEO & Content"
**Branch:** `seo/search-action-and-404`
**Scope:** R11 (fix SearchAction), R34 (404 page), R38 (Coming Soon cleanup), R46 (og:locale), R48 (Dependabot)
**PR description:** Fix broken schema, add 404 page, clean up service statuses
**Estimated effort:** 2-3 hours
**Why grouped:** All content/SEO related. Validate with Google Rich Results Test after merging.

### After all sprints: Documentation Update
**Branch:** `docs/audit-alignment`
**Scope:** Fix all 10 doc drift items from Section 4
**What to update:** React version (18 not 19), a11y Phase 1 as DONE, test counts, icon counts, API status, Husky status, remove stale test file references

### Business Tasks (Non-Code)
These don't need branches -- they're operational:
- Print Google Reviews QR code for register
- Verify/fix Friday hours
- Set up RoCafe as Google Business department
- Order physical loyalty punch cards
- Replace placeholder delivery platform URLs with real ones

---

## 8. Verification Commands

```bash
# Full quality suite
npm run check:all            # lint + quality + integrity

# Tests (11 files, ~122 tests)
npm run test                 # Vitest run
npm run test:coverage        # Coverage report

# Build + preview
npm run build && npm run preview

# Manual checks
# DevTools > inspect .color-on-accent elements
# DevTools > Rendering > prefers-reduced-motion: reduce
# DevTools > Application > Service Worker > Offline checkbox
# Google Rich Results Test: https://search.google.com/test/rich-results
# DevTools > Performance > record load > find LCP marker
# DevTools > Lighthouse > Performance + Accessibility audits
```

---

## 9. Post-Sprint Status (Updated Feb 8, 2026 -- v2.6.3)

All 55 recommendations were re-audited after 9 sprints of implementation work. Summary:

### Recommendation Status

| Status | Count | IDs |
|--------|-------|-----|
| **Fixed** | 49 | R1-R22, R24, R26-R36, R40-R48, R50 |
| **Fixed (Sprint 9)** | 7 | R23, R25, R37, R40, R44, R45, R50 |
| **Deferred (user decision)** | 1 | R38 (Coming Soon services left as-is) |
| **Handled externally** | 1 | R39 (Clickio CMP via GTM handles consent banner) |
| **Future / large scope** | 6 | R49, R51, R52, R53, R54, R55 |

### Problem Resolution

| Severity | Total | Fixed | Remaining |
|----------|-------|-------|-----------|
| Critical (C1-C4) | 4 | 4 | 0 |
| High (H1-H18) | 18 | 18 | 0 |
| Medium (M1-M22) | 22 | 19 | 3 (M3/R49 WebP, M14/R50 xlsx now fixed, M21/R38 deferred) |
| Low (L1-L12) | 12 | 12 | 0 |

### Updated Domain Grades

| Domain | Pre-Audit | Post-Sprint 9 | Key Improvements |
|--------|-----------|---------------|------------------|
| Security | B+ | A- | XLSX CVEs removed, consent via Clickio CMP |
| SEO | B+ | A | SearchAction fixed, 404 page, og:locale, IndexNow |
| Accessibility | B- | A- | Focus traps, ARIA live, reduced motion, PWA a11y |
| UX/UI/Branding | B- | B+ | ErrorBoundary, Footer decomp, unified forms, design tokens |
| Testing | C | B | 260 tests, 60% coverage thresholds |
| Performance | D+ | B+ | Font dedup, hero LCP, Button split, FontAwesome removed |
| DevOps/CI | D | B+ | Husky v9, Prettier, CI consolidated, Dependabot |
| PWA | F | B | SW precache, offline.html, cache eviction, update prompts |
| Business | 4/10 | 5/10 | Tech debt cleared; Coming Soon services still displayed |

### Remaining Work

| ID | Item | Status |
|----|------|--------|
| R38 | Clean up Coming Soon services | Deferred by user -- leave as-is |
| R39 | Cookie consent banner | Handled by Clickio CMP via GTM (not in codebase) |
| R49 | WebP/AVIF images with srcset | Future -- requires asset pipeline |
| R51 | React 19 upgrade or doc correction | Future -- documentation-only |
| R52 | TypeScript migration | Future -- multi-sprint initiative |
| R53 | E2E tests with Playwright | Future -- new test infrastructure |
| R54 | Lighthouse CI in pipeline | Future -- CI config |
| R55 | vite-plugin-pwa full migration | Future -- major architectural change |

---

*Post-sprint update: February 8, 2026. 49 of 55 recommendations implemented across 9 sprints (v2.3.0 through v2.6.3). 1 deferred by user decision. 1 handled externally (Clickio CMP). 4 deferred as future large-scope work.*
