# Content Guide - Roma Mart Website

Purpose
This document explains how to add content assets (images, menu items, logos) and update content without touching the codebase.

Assets to provide before launch
1. `public/og-image.png` — 1200x630 px (Social preview)
2. `public/logo.png` — 512x512 px (Structured data/icon)
3. `/public/images/` — store-front, interior, team photos, RoCafé menu images (optimize to <200KB)
4. RoCafé menu JSON (see ROCAFE_MENU_TEMPLATE.md)

How to add images
1. Optimize images with TinyPNG or Squoosh to reduce size.
2. Place images under `public/images/` using the naming conventions in `ROCAFE_MENU_TEMPLATE.md`.
3. Commit and push to a branch, open PR, verify CI, merge.

Updating menu data
- Add structured menu data to `src/data/rocafe.js` following the template.
- Ensure image paths point to `/public/images/`.

Legal & policy
- Update `src/pages/PrivacyPage.jsx` and `src/pages/TermsPage.jsx` if the business details change.

Testing
- After merging, verify social and structured data using: https://developers.facebook.com/tools/debug/, and https://search.google.com/test/rich-results

Editing on behalf of content team
- For non-dev users, prepare images and a CSV with menu items. Devs can ingest the CSV and create `src/data/rocafe.js` entries.
