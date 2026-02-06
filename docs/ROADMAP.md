# Roma Mart 2.0 -- Project Roadmap

> Derived from the Expert-Consolidated Project Audit (Feb 6, 2026).
> 9 domain experts consulted. 56 code-verified findings. 55 recommendations.

**Current State:** React 18.3.1 + Vite 7 PWA | Single location (Sarnia, ON) | GitHub Pages
**Overall Health:** Solid foundations with critical gaps in PWA, performance, and CI/CD

---

## Phase 1: Critical Fixes

**Goal:** Stop active breakage. These are all quick wins under 15 minutes each.

| ID | Fix | Impact |
|----|-----|--------|
| R1 | Define `--color-on-accent` CSS variable | Unpredictable text contrast on 6 pages |
| R2 | Fix SW precache: `manifest.json` -> `manifest.webmanifest` | Entire PWA offline broken |
| R3 | Deduplicate font loading (remove 2 `@import`, keep `<link>`) | +800-1500ms LCP penalty |
| R4 | Remove `loading="lazy"` from hero image, add `fetchpriority="high"` | LCP element deferred |
| R5 | Remove `initial={{ opacity: 0 }}` from hero text | 800ms invisible text |

**Combined impact:** PWA starts working, LCP improves 1-2 seconds, contrast fixed.

---

## Phase 2: High Priority

**Goal:** Structural improvements across performance, accessibility, DevOps, UX, and PWA.

| ID | Fix | Domain |
|----|-----|--------|
| R6 | Fix `prefers-reduced-motion` (uncommented code) | Accessibility |
| R7 | Split Button: plain `<button>` for non-animated, remove universal `useGeolocation()` | Performance |
| R8 | Fix Husky: install, init v9, add pre-commit hook | DevOps |
| R9 | Delete dead `precommit`/`prepush` npm scripts | DevOps |
| R10 | Consolidate CI: merge workflows, share build artifacts | DevOps |
| R11 | Fix/remove SearchAction (targets nonexistent `/search`) | SEO |
| R12 | Add `calculateItemPrice` tests | Testing |
| R13 | Add `ApiCircuitBreaker` tests | Testing |
| R14 | Fix `offline.html` -- inline critical CSS | PWA |
| R15 | Remove background sync dead code (~140 lines) | PWA |
| R16 | Add Vite-hashed builds to SW precache | PWA |
| R17 | Fix `var(--font-heading)` used as CSS class name | UX/UI |
| R18 | Make ErrorBoundary customer-friendly, hide stack traces | UX/UI |
| R19 | Resolve Outfit vs Inter body font contradiction | UX/UI |
| R20 | Add focus trap to mobile nav (dialog role, Escape handler) | Accessibility |
| R21 | Add `aria-live` to ContactPage form errors | Accessibility |

---

## Phase 3: Medium Priority

**Goal:** Polish, testing expansion, component cleanup, compliance.

| ID | Fix | Domain |
|----|-----|--------|
| R22 | Throttle Navbar scroll handler (rAF) | Performance |
| R23 | Replace FontAwesome with inline SVGs (5 icons) | Performance |
| R24 | Add `aria-modal` + focus trap + Escape to PWAInstallPrompt | Accessibility |
| R25 | Replace `title` with `aria-label` on footer social links | Accessibility |
| R26 | Fix SEO CI secrets | DevOps |
| R27 | Add `check:integrity` to CI | DevOps |
| R28 | Pin prerender API data or add `--offline` flag | DevOps |
| R29 | Fix PWA install state persistence | PWA |
| R30 | Fix SW `skipWaiting` race condition | PWA |
| R31 | Consume SW update notification in App.jsx | PWA |
| R32 | Add cache eviction policy | PWA |
| R33 | Add API context tests | Testing |
| R34 | Create custom 404 page | SEO |
| R35 | Decompose Footer into smaller components | UX/UI |
| R36 | Unify contact form into reusable component | UX/UI |
| R37 | Gate console.logs behind `import.meta.env.DEV` | UX/UI |
| R38 | Clean up "Coming Soon" services | Business |
| R39 | Add CookieConsent banner (PIPEDA/CASL) | Accessibility |

---

## Phase 4: Future

**Goal:** Long-term improvements, tooling upgrades, modernization.

| ID | Fix | Domain |
|----|-----|--------|
| R40 | Add Prettier + commitlint + lint-staged + editorconfig | DevOps |
| R41 | Set coverage thresholds | Testing |
| R42 | Auto-version SW cache from build hash | PWA |
| R43 | Branded LoadingFallback for all Suspense boundaries | UX/UI |
| R44 | Replace "New In Town" with data-driven badge | UX/UI |
| R45 | Establish border-radius design token scale | UX/UI |
| R46 | Add `og:locale` meta tag (`en_CA`) | SEO |
| R47 | Update checkout@v3 to v4 in CI workflows | DevOps |
| R48 | Add Dependabot config | DevOps |
| R49 | WebP/AVIF images with srcset | Performance |
| R50 | Evaluate XLSX replacement | Security |
| R51 | React 19 upgrade or doc correction | Core |
| R52 | TypeScript migration (incremental) | Core |
| R53 | E2E tests with Playwright | Testing |
| R54 | Lighthouse CI in pipeline | DevOps |
| R55 | `vite-plugin-pwa` full migration | PWA |

---

## Sprint Plan

Work is grouped into 8 logical sprints based on domain alignment, dependency relationships, and testability. Each sprint maps to one branch and one PR.

### Sprint 1: "Stop the Bleeding"
- **Branch:** `fix/critical-bugs`
- **Scope:** R1-R5
- **Template:** Bug Report (Critical)
- **Labels:** `bug`, `priority-high`
- **Effort:** 1-2 hours

### Sprint 2: "Performance & LCP"
- **Branch:** `perf/lcp-optimization`
- **Scope:** R6, R7, R17, R19, R22
- **Template:** Maintenance
- **Labels:** `performance`, `priority-high`
- **Effort:** 3-4 hours

### Sprint 3: "Accessibility Pass"
- **Branch:** `a11y/focus-traps-and-forms`
- **Scope:** R20, R21, R24, R25
- **Template:** Bug Report (High)
- **Labels:** `accessibility`, `priority-high`
- **Effort:** 3-4 hours

### Sprint 4: "DevOps Cleanup"
- **Branch:** `chore/ci-and-husky`
- **Scope:** R8, R9, R10, R26, R27, R47
- **Template:** Maintenance
- **Labels:** `devops`, `priority-medium`
- **Effort:** 3-4 hours

### Sprint 5: "PWA Resurrection"
- **Branch:** `fix/pwa-offline`
- **Scope:** R14, R15, R16, R29-R32
- **Template:** Bug Report (Critical)
- **Labels:** `pwa`, `bug`, `priority-high`
- **Effort:** 4-6 hours

### Sprint 6: "UX Polish"
- **Branch:** `ux/error-states-and-cleanup`
- **Scope:** R18, R35, R36, R37, R39, R43
- **Template:** Feature Request
- **Labels:** `ux-ui`, `enhancement`, `priority-medium`
- **Includes:** Audit sitewide button implementations for consistency (16 Button component usages, 24 raw `<button>` elements). Review whether raw buttons in carousel/accordion/utility contexts should share baseline styles or tokens with the Button component. Not a full unification — just identify and resolve any styling/a11y inconsistencies.

### Sprint 7: "Testing Expansion"
- **Branch:** `test/critical-coverage`
- **Scope:** R12, R13, R33, R41
- **Template:** Maintenance
- **Labels:** `testing`, `priority-medium`
- **Effort:** 4-6 hours

### Sprint 8: "SEO & Content"
- **Branch:** `seo/search-action-and-404`
- **Scope:** R11, R34, R38, R46, R48
- **Template:** Maintenance
- **Labels:** `seo`, `priority-medium`
- **Effort:** 2-3 hours

### Post-Sprint: Documentation Update
- **Branch:** `docs/audit-alignment`
- **Scope:** Fix 10 documentation-vs-reality discrepancies
- **Labels:** `documentation`

### Nice-to-Have (Low Priority)
These are non-critical enhancements to consider after all sprints are complete:

| Idea | Detail | Notes |
|------|--------|-------|
| Battery-aware motion reduction | Combine `useBatteryStatus()` with `useReducedMotion()` to disable animations when battery < 15% and not charging | Battery Status API is Chromium-only (removed from Firefox over privacy/fingerprinting concerns) -- requires graceful fallback |

---

## Business Tasks (Non-Code)

These are operational actions, not code changes:

| Priority | Action | Notes |
|----------|--------|-------|
| Immediate | Launch Google Reviews campaign (QR at register) | Highest ROI for local business |
| Immediate | Verify/fix Friday hours (3 PM open?) | Direct revenue impact |
| This month | Create Google Business Profile for RoCafe | Appear in cafe searches |
| This month | Implement loyalty program (punch cards) | Drive repeat visits |
| This quarter | Fix NRS ordering URLs (placeholders active) | Erodes customer trust |
| Ongoing | Pause multi-location infrastructure work | Until second location is signed |

---

## Domain Scorecard

| Domain | Current | Target (Post-Phase 2) |
|--------|---------|----------------------|
| Security | B+ | A- |
| SEO | B+ | A |
| Accessibility | B- (~78% WCAG 2.2 AA) | A- (~90%) |
| UX/UI/Branding | B- | B+ |
| Testing | C | B- |
| Performance | D+ | B+ |
| DevOps/CI | D | B |
| PWA | F (3.5/10) | B (7/10) |
| Business Alignment | 4/10 | 7/10 |

---

## Tracking

- **Issues:** Each sprint tracked as a GitHub Issue with task checklist
- **Project Board:** Roma Mart UI (GitHub Projects)
- **Audit Source:** Expert-Consolidated Project Audit (Feb 6, 2026)

---

*Last updated: February 6, 2026*
