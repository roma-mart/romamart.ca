# Release Checklist

> Pre-release verification for Roma Mart deployments

## Before Merging to Main

### 1. Code Quality

- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run lint:css` passes (0 errors)
- [ ] `npm run check:quality` passes
- [ ] No critical or high-severity issues

### 2. Build Verification

- [ ] `npm run build` succeeds
- [ ] Bundle size within targets
- [ ] All routes prerendered

### 3. Content Verification

- [ ] `public/og-image.png` present
- [ ] `public/logo.png` present
- [ ] RoCafé menu data current
- [ ] Location data accurate

### 4. Environment & Secrets

- [ ] `WEB3FORMS_KEY` set in repository secrets
- [ ] `GTM_ID` set in repository secrets

### 5. CI Verification

- [ ] Open PR and wait for CI to complete
- [ ] All workflow jobs pass
- [ ] Download `dist` artifact and verify locally

## Deployment

### 6. Merge & Deploy

- [ ] Merge PR to `main`
- [ ] Verify `publish` job succeeded
- [ ] Confirm deployment to GitHub Pages

### 7. Post-Deploy Verification

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Dark mode works
- [ ] Mobile responsive

### 8. Functionality Testing

- [ ] Contact form submits
- [ ] PWA install works
- [ ] Offline mode functional
- [ ] GTM events firing

### 9. SEO & Analytics

- [ ] GTM tracking active
- [ ] Structured data valid (Rich Results Test)
- [ ] Meta tags present
- [ ] Canonical URLs correct

### 10. Documentation

- [ ] CHANGELOG.md updated
- [ ] README.md current
- [ ] API docs updated (if applicable)

## Sign-off

| Role | Name | Date |
|------|------|------|
| Developer | | |
| Reviewer | | |
| QA | | |

---

**Related:** [Deployment Guide](../guides/deployment.md) | [Quality System](../guides/quality-system.md)
