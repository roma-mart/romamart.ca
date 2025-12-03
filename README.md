# Roma Mart 2.0

This repo hosts the Roma Mart 2.0 site built with React + Vite + Tailwind.

## Environments
- Staging (GitHub Pages): `https://roma-mart.github.io/romamart.ca/`
- Production: `https://romamart.ca/`

## Build & Run
```powershell
npm install
npm run dev
npm run build
```

## GTM & Consent
- GTM container.
- Consent: Clickio CMP via GTM; Trustpilot/Snap/GA fire only after consent.

## Migration Notes
- Before cutover, update Clickio policy links to `/privacy` and `/cookies`.
- After cutover, change `vite.config.js` `base` from `"/romamart.ca/"` to `/` and rebuild.
- Verify GTM + Clickio with Tag Assistant Preview.
