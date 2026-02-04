# Deployment Guide

> Complete deployment procedures for Roma Mart 2.0

## Overview

This guide describes the build and deployment process for the Roma Mart website to GitHub Pages.

## Prerequisites

- Repository admin or maintainer rights
- `WEB3FORMS_KEY` secret configured in repository settings
- `GTM_ID` secret configured for Google Tag Manager

## CI/CD Overview

**Workflow:** `.github/workflows/accessibility-ci.yml`

The workflow runs on:

- Pull requests to `main`
- Pushes to `main`

### Build Steps

1. **Accessibility Lint** - ESLint with jsx-a11y rules
2. **CSS Lint** - Stylelint validation
3. **Build** - Vite production build with environment variables
4. **HTML Validation** - W3C HTML validator
5. **Publish** - Deploy to GitHub Pages (on main branch only)

## Deployment Process

### Recommended Flow

1. Work on a feature branch (e.g., `feature/new-component`)
2. Commit changes and push: `git push origin <branch>`
3. Open a Pull Request targeting `main`
4. Wait for CI to complete (accessibility-lint, build, html-validation)
5. Download and inspect `dist` artifact if needed
6. Merge the PR when checks pass
7. Publish job automatically deploys to GitHub Pages

### Local Preview

```bash
# Build with environment variables
npm run build

# Serve locally
npx http-server ./dist -p 8080
```

### Environment Variables

Create `.env.local` for local development (do NOT commit):

```bash
VITE_WEB3FORMS_KEY=your_key_here
VITE_GTM_ID=GTM-XXXXXXX
```

## Verification

After deployment:

1. Verify site loads at GitHub Pages URL
2. Test contact form submission
3. Verify GTM events in analytics
4. Run rich results test for structured data

## Rollback

To roll back a deployment:

1. Revert the merge commit on `main`, or
2. Deploy a known-good commit to `main`

## Security Notes

- Never commit secrets to code
- Use repository secrets for environment variables
- `VITE_` prefixed variables are browser-visible

---

**Related:** [Release Checklist](../checklists/release-checklist.md) | [Quality System](./quality-system.md)
