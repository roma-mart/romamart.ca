# Theming & Design Tokens

> Design token system and theming architecture

## Overview

Roma Mart uses a centralized design token system with CSS custom properties for consistent theming and dark mode support.

## Token Sources

### Design Tokens

**File:** `src/design/tokens.js`

```javascript
export const COLORS = {
  primary: '#020178',      // Navy
  secondary: '#E4B340',    // Yellow
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#1a1a1a',
  textMuted: '#6b7280',
};

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
    relaxed: 1.625,
    tight: 1.375,
  },
};

export const SPACING = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
};
```

### CSS Variables

**File:** `src/index.css`

```css
:root {
  /* Colors */
  --color-primary: #020178;
  --color-secondary: #E4B340;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  
  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-tight: 1.375;
  
  /* Spacing */
  --spacing-page: 1rem;
  --spacing-section: 4rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f0f0f;
    --color-surface: #1a1a1a;
    --color-text: #f0f0f0;
    --color-text-muted: #9ca3af;
  }
}
```

## Usage Patterns

### Theme Hook

**File:** `src/utils/theme.js`

```javascript
export const CSS_VARS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
};

export function useThemeColors() {
  return {
    text: { color: CSS_VARS.text },
    textMuted: { color: CSS_VARS.textMuted },
    background: { backgroundColor: CSS_VARS.background },
    surface: { backgroundColor: CSS_VARS.surface },
  };
}
```

### In Components

```jsx
// Direct CSS variable
<div style={{ color: 'var(--color-text)' }}>

// Using CSS_VARS
import { CSS_VARS } from '../utils/theme';
<div style={{ backgroundColor: CSS_VARS.surface }}>

// Using hook
const colors = useThemeColors();
<p style={colors.textMuted}>Muted text</p>
```

## Brand Colors

| Name | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| Primary | #020178 | #020178 | Brand, links |
| Secondary | #E4B340 | #E4B340 | Accents, CTAs |
| Background | #ffffff | #0f0f0f | Page background |
| Surface | #f8f9fa | #1a1a1a | Cards, sections |
| Text | #1a1a1a | #f0f0f0 | Body text |
| Text Muted | #6b7280 | #9ca3af | Secondary text |

## Tailwind Integration

Tailwind config extends with brand tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#020178',
          yellow: '#E4B340',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

## Anti-Patterns

### ❌ Don't Do

```jsx
// Hardcoded colors
<p style={{ color: '#333' }}>

// Tailwind gray classes
<p className="text-gray-600">
```

### ✅ Do Instead

```jsx
// CSS variables
<p style={{ color: 'var(--color-text)' }}>

// Theme hook
<p style={colors.text}>
```

## Recent Updates

### Typography Tokens

- **Font Families:** Added `heading` and `body` tokens for consistent typography.
- **Font Sizes:** Defined a scalable size system (`xs` to `3xl`).
- **Font Weights:** Introduced tokens for `normal`, `medium`, `semibold`, and `bold` weights.
- **Line Heights:** Added tokens for `normal`, `relaxed`, and `tight` spacing.

These tokens are mapped to CSS variables in `src/index.css` and are used across all components.

---

**Related:** [Dark Mode](../guides/dark-mode.md) | [Component System](./component-system.md)
