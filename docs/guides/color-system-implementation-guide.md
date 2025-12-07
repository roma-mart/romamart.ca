# Unified Color System Implementation Guide

## Overview
This guide outlines the steps to implement a unified color system for the Roma Mart website. The goal is to ensure consistent, accessible, and scalable color usage that complements the typography system and aligns with the brand's identity and development ethos.

## Objectives
1. **Consistency**:
   - Define a single source of truth for all colors in `src/design/tokens.js`.
   - Use semantic names for colors (e.g., `primary`, `secondary`, `background`, `text-primary`).
2. **Accessibility**:
   - Ensure all color combinations meet WCAG 2.2 AA+ contrast ratios.
   - Include high-contrast variants for accessibility modes.
3. **Scalability**:
   - Support light and dark modes using CSS variables.
   - Allow for easy addition of new colors or themes.
4. **Cohesion with Typography**:
   - Align color tokens with typography tokens (e.g., `text-primary` for headings, `text-muted` for body text).
   - Ensure background and surface colors complement typography styles.

## Implementation Plan

### Phase 1: Define Color Tokens
1. **Expand `src/design/tokens.js`**:
   - Add a `COLORS` object to define all brand colors.
   - Include light and dark mode variants for each color.
   ```javascript
   export const COLORS = {
     primary: '#FFD700', // Brand yellow
     secondary: '#020178', // Brand navy
     accent: '#FF5733', // Optional accent color
     background: {
       light: '#FFFFFF',
       dark: '#121212',
     },
     surface: {
       light: '#F5F5F5',
       dark: '#1E1E1E',
     },
     text: {
       primary: {
         light: '#020178',
         dark: '#FFFFFF',
       },
       muted: {
         light: '#6B7280',
         dark: '#9CA3AF',
       },
       heading: {
         light: '#020178',
         dark: '#FFD700',
       },
     },
     border: {
       light: '#E5E7EB',
       dark: '#374151',
     },
     icon: {
       light: '#6B7280',
       dark: '#9CA3AF',
     },
   };
   ```

2. **Map Tokens to CSS Variables**:
   - Update `src/index.css` to include color tokens as CSS variables.
   - Ensure variables adapt to `prefers-color-scheme`.
   ```css
   :root {
     --color-primary: #FFD700;
     --color-secondary: #020178;
     --color-accent: #FF5733;
     --color-bg-light: #FFFFFF;
     --color-bg-dark: #121212;
     --color-text-primary-light: #020178;
     --color-text-primary-dark: #FFFFFF;
     /* ...other variables... */
   }

   @media (prefers-color-scheme: dark) {
     :root {
       --color-bg: var(--color-bg-dark);
       --color-text-primary: var(--color-text-primary-dark);
       /* ...other dark mode variables... */
     }
   }
   ```

### Phase 2: Refactor Components
1. **Replace Hardcoded Colors**:
   - Identify components with hardcoded colors.
   - Replace with CSS variables or theme utilities.
   ```jsx
   <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
     Welcome to Roma Mart
   </div>
   ```

2. **Align Colors with Typography**:
   - Use `text-primary` for headings and `text-muted` for body text.
   - Ensure background and surface colors complement typography.

### Additional Examples for Refactoring Components

#### Example: Replacing Hardcoded Colors

Before (❌ Incorrect):
```jsx
<div style={{ backgroundColor: '#FFFFFF', color: '#020178' }}>
  Welcome to Roma Mart
</div>
```

After (✅ Correct):
```jsx
// Using CSS variables
<div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)' }}>
  Welcome to Roma Mart
</div>

// Using theme utilities
import { useThemeColors } from '../utils/theme';
const colors = useThemeColors();
<div style={colors.bg}>
  <h1 style={colors.heading}>Welcome to Roma Mart</h1>
</div>
```

#### Example: Aligning Colors with Typography

Before (❌ Incorrect):
```jsx
<h1 style={{ color: '#FFD700' }}>
  Our Values
</h1>
```

After (✅ Correct):
```jsx
<h1 style={{ color: 'var(--color-primary)' }}>
  Our Values
</h1>
// Or using theme hook
import { useThemeColors } from '../utils/theme';
const colors = useThemeColors();
<h1 style={colors.heading}>Our Values</h1>
```

### Phase 3: Automate Quality Checks
1. **Enhance `check-quality.js`**:
   - Add rules to flag hardcoded colors.
   - Validate token usage and contrast ratios.
   ```javascript
   if (/#[0-9A-Fa-f]{6}/.test(line)) {
     issues.push({
       severity: 'MEDIUM',
       message: `Hardcoded color found: ${line}`,
     });
   }
   ```

2. **Automate Contrast Validation**:
   - Ensure all text meets WCAG 2.2 AA+ contrast ratios.

### Expanded Automation Details
1. **Contrast Validation**:
   - Use tools like `axe-core` or `pa11y` to automate contrast checks.
   - Ensure all text meets a minimum contrast ratio of 4.5:1.

2. **Token Usage Validation**:
   - Enhance `check-quality.js` to flag hardcoded colors and validate token usage.
   ```javascript
   if (/#[0-9A-Fa-f]{6}/.test(line)) {
     issues.push({
       severity: 'MEDIUM',
       message: `Hardcoded color found: ${line}`,
     });
   }
   ```

3. **Responsive Testing**:
   - Validate that colors adapt correctly across breakpoints and themes (light/dark modes).

### Phase 4: Documentation
1. **Create Developer Guides**:
   - Document the color system and its benefits.
   - Include examples and best practices for implementing tokens.

2. **Maintain Living Documentation**:
   - Update guides as new tokens or styles are added.

## Validation
- Run `npm run check:all` to ensure quality compliance.
- Test all components in staging and production environments.
- Validate colors for accessibility, responsiveness, and brand consistency.

## Next Steps
1. Assign team members to specific tasks.
2. Establish a timeline for completing the implementation.
3. Monitor progress and ensure alignment with the development ethos.

By following this guide, the Roma Mart website will achieve a cohesive, accessible, and brand-aligned color system.