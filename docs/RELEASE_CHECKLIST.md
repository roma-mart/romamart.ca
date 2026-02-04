# Release Checklist - Roma Mart Website

Before merging to `main` and publishing:

1. Code
- [ ] All lint checks pass (`npm run lint`, `npm run lint:css`).
- [ ] Quality checks pass (`npm run check:quality`).
- [ ] No critical or high-severity issues in audit.

2. Content
- [ ] `public/og-image.png` present
- [ ] `public/logo.png` present
- [ ] RoCafé menu data updated

3. Secrets
- [ ] `WEB3FORMS_KEY` set in repository secrets
- [ ] `GTM_ID` set in repository secrets (for analytics in CI builds)

4. CI
- [ ] Open PR and wait for `accessibility-ci` to complete
- [ ] Download `dist` artifact and spot-check pages locally
- [ ] Verify GTM loaded in built `dist/index.html` (search for `gtm.js?id=` or the container ID)

5. Deploy
- [ ] Merge PR to `main`
- [ ] Confirm `publish` job ran and deployed to Pages
- [ ] Smoke test live site

6. Post-Deploy
- [ ] Verify contact form submits
- [ ] Verify GTM events (order_cta_click/contact_form_submit) in analytics
- [ ] Run rich results test for structured data
- [ ] Ensure documentation files are up to date on GitHub (DEPLOYMENT_GUIDE.md, CONTENT_GUIDE.md, RELEASE_CHECKLIST.md)

Sign-off
- Deployer:
- QA:
- Date:
