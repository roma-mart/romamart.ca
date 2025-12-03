# Roma Mart Development Ethos

## Core Principles
1. Systems over spot fixes
2. Universal standards enforcement
3. Front-end and back-end quality cohesion
4. Fluid, automated development workflows
5. Brand consistency (color, typography, marks, pattern)
6. Accessibility first (WCAG 2.2 AA+ readiness)
7. Dark mode + high contrast + forced-colors resilience
8. Performance optimization and efficiency
9. Security by default (preventive, least privilege, zero exposed secrets)
10. Privacy & consent compliance (GTM gating, CMP readiness)
11. Progressive enhancement (works without JS; PWA upgrades when available)
12. Observability & analytics (events, vitals, installs, conversions)
13. Error resilience (graceful degradation, boundaries, offline support)
14. Self-auditing quality systems (universal checker + meta checker)
15. Prevent internal rule conflicts (meta integrity enforcement)
16. Cohesive design tokens (single source of truth)
17. Sustainable content integration (data-driven services & locations)
18. Minimal duplication (reuse components, avoid ad-hoc markup)
19. Explicit fallbacks (fonts, images, features)
20. Secure external integrations (whitelist domains, sanitize payloads)
21. Versioned configuration (easily rotate keys, update policies)
22. Transparent documentation (living, centralized, non-duplicative)
23. Future-proof routing & base paths (BASE_URL abstraction)
24. Resource budgeting (bundle size targets, image weight thresholds)
25. Continuous learning before execution (deep understanding precedes code changes)

## New Principle Added (Dec 1 2025)
**25. Deep Understanding Before Action**: The system or contributor must fully learn and absorb standards, implementation details, and project goals BEFORE planning or executing changes. No premature optimization or speculative refactors.

### Implementation of Principle 25
- On initialization, perform full repository crawl
- Summarize architecture prior to proposing modifications
- Reference existing standards docs before attempting new patterns
- Reject tasks if insufficient context until learning phase complete

## Keep Platform and Standards Current
- Prefer the latest stable releases of languages, frameworks, build tools, and libraries.
- Track and adopt current coding standards (security, accessibility, performance) and deprecate legacy APIs promptly.
- Schedule periodic dependency and tooling reviews to reduce tech debt and avoid incompatibilities.
- Pin versions only when necessary; otherwise follow semver stable ranges and maintain upgrade paths.

## Ethos Application Lifecycle
1. Discover (read all code & docs)
2. Validate (run quality + integrity checkers)
3. Plan (minimal, standardized change set)
4. Implement (atomic commits, small diff, fully linted)
5. Verify (rerun checkers + build)
6. Document (update relevant guides only)
7. Observe (analytics / vitals) & iterate

## Non-Goals
- Accidental framework rewrites
- Vendor lock-in without value
- Dark patterns in UX or consent
- Suppressing warnings instead of fixing root causes

---
Maintained by: GitHub Copilot
Last Updated: Dec 1 2025
