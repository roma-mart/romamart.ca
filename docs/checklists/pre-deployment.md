# Pre-Deployment Checklist

> Final verification before deploying to production

## Environment Setup

- [ ] All required secrets configured
  - [ ] `WEB3FORMS_KEY`
  - [ ] `GTM_ID`
- [ ] Environment variables verified in CI logs

## Code Quality

- [ ] All linting passes
  ```bash
  npm run lint
  npm run lint:css
  ```
- [ ] Quality checks pass
  ```bash
  npm run check:quality
  npm run check:integrity
  ```
- [ ] No console errors in development

## Build Verification

- [ ] Production build succeeds
  ```bash
  npm run build
  ```
- [ ] All routes prerendered
- [ ] Bundle size within limits
- [ ] No build warnings

## Local Testing

- [ ] Preview production build
  ```bash
  npm run preview
  ```
- [ ] All pages load correctly
- [ ] Forms functional
- [ ] PWA install works
- [ ] Offline mode works

## Visual Verification

- [ ] Light mode correct
- [ ] Dark mode correct
- [ ] Mobile layout correct
- [ ] Tablet layout correct
- [ ] Desktop layout correct

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces correctly
- [ ] Color contrast sufficient

## SEO & Analytics

- [ ] Meta tags present on all pages
- [ ] Open Graph images correct
- [ ] Structured data valid
- [ ] GTM container loading

## Security

- [ ] No secrets in code
- [ ] No console.log in production
- [ ] External links have `rel="noreferrer"`
- [ ] Forms have CSRF protection

## Documentation

- [ ] CHANGELOG updated
- [ ] README current
- [ ] Breaking changes documented

## Final Approval

| Check | Approver | Date |
|-------|----------|------|
| Code Review | | |
| QA Testing | | |
| Deployment | | |

---

**Ready to Deploy:** ☐ Yes ☐ No

**Related:** [Release Checklist](./release-checklist.md) | [Deployment Guide](../guides/deployment.md)
