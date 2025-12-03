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

4. CI
- [ ] Open PR and wait for `accessibility-ci` to complete
- [ ] Download `dist` artifact and spot-check pages locally

5. Deploy
- [ ] Merge PR to `main`
- [ ] Confirm `publish` job ran and deployed to Pages
- [ ] Smoke test live site

6. Post-Deploy
- [ ] Verify contact form submits
- [ ] Verify GTM if configured
- [ ] Run rich results test for structured data

Sign-off
- Deployer:
- QA:
- Date:
