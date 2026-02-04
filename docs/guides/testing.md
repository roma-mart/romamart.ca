# Testing Guide

> Testing strategies and workflows for Roma Mart 2.0

## Overview

Roma Mart uses a combination of automated quality checks and manual testing to ensure code quality and accessibility.

## Automated Testing

### Runtime Requirement

- Use Node 22.x for running Vitest (see .nvmrc). Node 24 currently triggers a Vitest runner error.

### Quality Checks

```bash
# Run all checks (recommended before commit)
npm run check:all

# Individual checks
npm run lint          # ESLint (code quality + accessibility)
npm run lint:css      # Stylelint (CSS quality)
npm run check:quality # Universal quality checker
npm run check:integrity # Meta-checker validation
```

### Build Verification

```bash
npm run build   # Production build with prerendering
npm run preview # Preview production build locally
```

## Manual Testing Checklist

### Functional Testing

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms submit successfully
- [ ] PWA install prompt appears
- [ ] Offline functionality works

### Visual Testing

- [ ] ☀️ Light mode appearance
- [ ] 🌙 Dark mode appearance
- [ ] 📱 Mobile breakpoint (< 768px)
- [ ] 💻 Tablet breakpoint (768px - 1024px)
- [ ] 🖥️ Desktop breakpoint (> 1024px)

### Accessibility Testing

- [ ] ⌨️ Keyboard navigation
- [ ] 🎯 Focus indicators visible
- [ ] 🔊 Screen reader compatibility
- [ ] 🎨 Color contrast ratios

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Test Pages

Critical paths to test:

1. **Homepage** → Services → Order CTA
2. **Locations** → View details → Get directions
3. **RoCafé** → Menu items → Full menu
4. **Contact** → Submit form (online/offline)
5. **PWA** → Install → Offline access

## CI/CD Testing

GitHub Actions runs on every PR:

1. ESLint accessibility checks
2. Stylelint CSS validation
3. Vite production build
4. HTML validation

PRs cannot merge if checks fail.

## Performance Testing

### Core Web Vitals

Monitor in production:

- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

### Bundle Size

Current targets (gzipped):

- JavaScript: < 150 KB
- CSS: < 10 KB
- Total: < 200 KB

---

**Related:** [Quality System](./quality-system.md) | [Deployment](./deployment.md)
