# Unified Typography System Implementation Guide

## Overview

This guide outlines the steps to implement a unified typography system for the Roma Mart website. The goal is to ensure consistent, scalable, and accessible typography that aligns with the brand's identity and development ethos.

## Objectives

1. **Consistency**:
   - Use Outfit for headings and Inter for body text.
   - Define typography tokens as the single source of truth.
2. **Accessibility**:
   - Ensure all typography adheres to WCAG 2.2 AA+ standards.
   - Validate contrast ratios and responsive scaling.
3. **Scalability**:
   - Simplify future updates to typography styles.
   - Support the addition of new font styles or sizes.

## Implementation Plan

### Phase 1: Define Typography Tokens

1. **Expand `src/design/tokens.js`**:
   - Add tokens for font families, sizes, weights, and line heights.
   - Use descriptive names (e.g., `heading-lg`, `body-sm`, `font-bold`).

   ```javascript
   export const TYPOGRAPHY = {
     fontFamily: {
       heading: 'Outfit, sans-serif',
       body: 'Inter, sans-serif',
     },
     fontSize: {
       xs: '0.75rem',
       sm: '0.875rem',
       base: '1rem',
       lg: '1.125rem',
       xl: '1.25rem',
       '2xl': '1.5rem',
       '3xl': '1.875rem',
     },
     fontWeight: {
       normal: 400,
       medium: 500,
       semibold: 600,
       bold: 700,
     },
     lineHeight: {
       normal: 1.5,
       relaxed: 1.75,
       tight: 1.25,
     },
   };
   ```

2. **Map Tokens to CSS Variables**:
   - Update `src/index.css` to include typography tokens as CSS variables.
   - Ensure variables adapt to responsive breakpoints.

   ```css
   :root {
     --font-heading: 'Outfit, sans-serif';
     --font-body: 'Inter, sans-serif';
     --font-size-base: 1rem;
     --line-height-normal: 1.5;
   }
   ```

### Phase 2: Refactor Components

1. **Replace Hardcoded Styles**:
   - Identify components with hardcoded font styles.
   - Replace with CSS variables or theme utilities.

   ```jsx
   <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)' }}>
     Welcome to Roma Mart
   </h1>
   ```

2. **Validate Components**:
   - Ensure all components use the unified typography system.
   - Test in both light and dark modes.

### Additional Examples for Refactoring Components

#### Example: Replacing Hardcoded Styles

Before:

```jsx
<h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>
  Welcome to Roma Mart
</h1>
```

After:

```jsx
<h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)' }}>
  Welcome to Roma Mart
</h1>
```

#### Example: Using Theme Utilities

Before:

```jsx
<p style={{ color: '#6B7280', lineHeight: '1.75' }}>
  Your trusted neighborhood convenience store.
</p>
```

After:

```jsx
<p style={{ color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)' }}>
  Your trusted neighborhood convenience store.
</p>
```

### Phase 3: Automate Quality Checks

1. **Enhance `check-quality.js`**:
   - Add rules to flag hardcoded font styles.
   - Validate token usage and accessibility compliance.

   ```javascript
   if (/fontFamily\s*:\s*['"][^'"]*['"]/.test(line)) {
     const font = line.match(/fontFamily\s*:\s*['"]([^'"]*)['"]/)[1];
     if (!['Outfit', 'Inter'].includes(font)) {
       issues.push({
         severity: 'MEDIUM',
         message: `Non-brand font family: ${font}`,
       });
     }
   }
   ```

2. **Automate Contrast Validation**:
   - Ensure all text meets WCAG 2.2 AA+ contrast ratios.

### Phase 4: Documentation

1. **Create Developer Guides**:
   - Document the unified typography system and its benefits.
   - Include examples and best practices for implementing tokens.

2. **Maintain Living Documentation**:
   - Update guides as new tokens or styles are added.

## Updated Findings and Recommendations

### Additional Observations

1. **CSS Variables Usage**:
   - Typography-related variables like `var(--color-heading)`, `var(--color-text)`, and `var(--color-surface)` are used consistently across components.
   - Dynamic colors (e.g., `COLORS.yellow`, `COLORS.navy`) are hardcoded in some places, which can be replaced with tokens.

2. **Inline Styles**:
   - Inline styles are used for dynamic theming, such as background colors and borders.
   - These can be refactored into reusable classes or tokens for better maintainability.

3. **Typography Tokens**:
   - Fonts like `var(--font-heading)` and `font-inter` are applied consistently, leveraging centralized tokenization for font sizes, weights, and line heights.

4. **Accessibility**:
   - The use of semantic HTML and ARIA attributes is consistent, aligning with WCAG 2.2 AA+ standards.

### Updated Implementation Plan

#### Phase 1: Define Typography Tokens

- Expand `src/design/tokens.js` to include tokens for dynamic colors like `COLORS.yellow` and `COLORS.navy`.
- Add tokens for common inline styles (e.g., borders, shadows).

#### Phase 2: Refactor Components

- Replace hardcoded dynamic colors with CSS variables.
- Extract common inline styles into reusable Tailwind utility classes or CSS modules.
- Refactor components to use centralized typography tokens.

#### Phase 3: Automate Quality Checks

- Enhance `check-quality.js` to flag hardcoded dynamic colors and inline styles.
- Add validation for token usage in typography and theming.

#### Phase 4: Comprehensive Review

- Analyze all site files (components, pages, etc.) to identify hardcoded styles and ensure adherence to the unified typography system.
- Validate typography for accessibility, responsiveness, and brand consistency.

### Next Steps

1. Assign team members to review specific files and components.
2. Establish a timeline for completing the refactor and validation.
3. Monitor progress and ensure alignment with the development ethos.

## Validation

- Run `npm run check:all` to ensure quality compliance.
- Test all components in staging and production environments.
- Validate typography for accessibility, responsiveness, and brand consistency.

## Next Steps

1. Assign team members to specific tasks.
2. Establish a timeline for completing the implementation.
3. Monitor progress and ensure alignment with the development ethos.

By following this guide, the Roma Mart website will achieve a cohesive, accessible, and brand-aligned typography system.

## Integration with Color System

The typography system is designed to work seamlessly with the unified color system. Key alignments include:

- **Text Colors:** Typography tokens like `heading` and `body` are paired with color tokens such as `text-primary` and `text-muted`.
- **Backgrounds and Surfaces:** Ensure that background colors (e.g., `surface`, `background`) complement typography styles for readability.
- **Contrast Validation:** Both systems adhere to WCAG 2.2 AA+ standards, ensuring accessible contrast ratios.

For detailed information on the color system, refer to the [Unified Color System Implementation Guide](./color-system-implementation-guide.md).
