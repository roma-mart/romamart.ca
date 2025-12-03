# Deployment Guide - Roma Mart Website

This guide describes the minimal, secure process to build and deploy the Roma Mart site to GitHub Pages using the repository CI.

Prerequisites
- You must have repository admin or maintainer rights to set repository secrets and merge PRs.
- `WEB3FORMS_KEY` secret added to `Settings ? Secrets and variables ? Actions` (already done).
- `GTM_ID` secret (Google Tag Manager container ID, e.g. `GTM-XXXXXXX`) should be added to repository secrets to enable analytics in CI-built artifacts.

CI overview
- Workflow: `.github/workflows/accessibility-ci.yml` runs on PRs to `main` and pushes to `main`.
- Build step injects `VITE_WEB3FORMS_KEY` from `secrets.WEB3FORMS_KEY` and `VITE_GTM_ID` from `secrets.GTM_ID` so the contact form and GTM work in the built site.
- Publish step deploys `dist/` to GitHub Pages using `peaceiris/actions-gh-pages` when code is pushed to `main`.

How to deploy (recommended flow)
1. Work on a feature branch (e.g. `fix/quality-and-keys`).
2. Make changes, commit locally, push branch: `git push origin <branch>`.
3. Open a Pull Request targeting `main` using GitHub UI.
4. Wait for CI to complete (accessibility-lint, build, html-validation).
   - If the build fails, inspect logs in Actions ? workflow run ? job logs.
5. Download and inspect `dist` artifact (Build job artifacts) if you want a local preview before merge.
   - `npx http-server ./dist -p 8080` (serve downloaded artifact locally).
6. Merge the PR if checks pass. Merge triggers the `publish` job which builds and deploys to GitHub Pages.
7. After publish, verify site at the configured Pages domain (CNAME in workflow). If switching to a real domain, update Pages settings as final step.

GTM secret & verification
- Add secret `GTM_ID` (value example: `GTM-N4FWPSRF`) under repository Settings ? Secrets and variables ? Actions.
- CI will expose this as `VITE_GTM_ID` during the build so the built `index.html` includes GTM initialization.
- To verify post-build:
  - Download the `dist` artifact from the build job and open `dist/index.html`. Search for `googletagmanager.com/gtm.js` or the GTM ID.
  - Or serve `dist` locally: `npx http-server ./dist -p 8080` and verify in browser network tab that `gtm.js?id=GTM-...` is requested.

Local preview (with GTM)
- To include GTM and Web3Forms in a local production build, create a `.env.local` with the following (do NOT commit):
```
VITE_WEB3FORMS_KEY=your_web3forms_key_here
VITE_GTM_ID=GTM-XXXXXXX
```
- Then run:
```
npm run build
npx http-server ./dist -p 8080
```

Notes & security
- Do NOT commit secrets into code. Use repository secrets instead.
- `VITE_` env values become part of the built bundle (browser-visible). Only put keys in secrets if they are intended to be used client-side (Web3Forms key and GTM ID are client-facing by design).
- For truly secret functionality, use a server-side proxy or serverless endpoint.

Rollback
- To roll back, revert the merge commit on `main` or deploy a known-good commit to `main`.

Contact
- If CI shows unexpected failures, collect logs and open an issue in the repository for investigation.
