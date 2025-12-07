# Pages

- Routed views with `Helmet` for SEO.
- Keep content accessible and responsive.
- Lazy load page components.
- Use BASE_URL for internal links.
- **Color logic:** All pages now use CSS variables and design tokens for color, background, and border logic. No hardcoded colors remain; all interactive elements use accessible, theme-adaptive tokens.
- **Accessibility:** All CTAs, buttons, and navigation elements meet WCAG 2.2 AA standards for contrast and focus. Manual and automated checks pass.
- **Quality system:** All changes validated with `npm run check:quality` and `npm run check:integrity`.
- **Manual testing:** Pages tested in light/dark mode, keyboard navigation, and responsive breakpoints.
- **RoCafePage:** Allergen warning now uses semantic state tokens (warning, error) for future-proofing and accessibility. Menu cards, CTA, and stats use design tokens for color logic.
- AboutPage.jsx: Refactored all color logic to use design tokens and CSS variables. Removed COLORS object. Updated all UI elements, backgrounds, and accents to use semantic tokens.
- Accessibility: Added descriptive alt text to all images, ensured visible focus styles for buttons/links, and enabled keyboard navigation for carousel controls and CTAs. Verified semantic HTML and ARIA attributes.
- Quality: Passed universal quality and integrity checks with no errors.
- ContactPage.jsx: Refactored to remove COLORS object and use design tokens/CSS variables directly for all color logic. Verified accessibility and semantic usage.
- Ran quality and integrity checks: No errors, all standards passed.