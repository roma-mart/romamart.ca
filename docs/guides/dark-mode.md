# Dark Mode System

> Implementation guide for the Roma Mart dark mode theming system

## Overview

Roma Mart uses CSS custom properties that automatically respond to `prefers-color-scheme` for native dark mode support.

## Architecture

### CSS Variables

All theme colors are defined in `src/index.css`:

```css
:root {
  --color-primary: #020178;
  --color-secondary: #E4B340;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
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

### Design Tokens

Single source of truth in `src/design/tokens.js`:

```javascript
export const COLORS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  background: 'var(--color-background)',
  // ...
};
```

## Usage Guidelines

### ✅ Correct Patterns

```jsx
// Use CSS variables directly
<div style={{ backgroundColor: 'var(--color-surface)' }}>

// Use theme hook
import { useThemeColors } from '../utils/theme';
const colors = useThemeColors();
<p style={colors.text}>Content</p>

// Use design tokens
import { CSS_VARS } from '../utils/theme';
<div style={{ color: CSS_VARS.textMuted }}>
```

### ❌ Incorrect Patterns

```jsx
// NEVER hardcode colors
<div style={{ color: '#020178' }}>  // Wrong!

// NEVER use gray Tailwind classes
<p className="text-gray-600">  // Wrong!
```

## High Contrast Support

The system supports:
- `prefers-color-scheme: dark`
- `prefers-contrast: more`
- `forced-colors: active`

## Testing

1. Toggle dark mode in browser DevTools
2. Test with `prefers-color-scheme` emulation
3. Verify all text has sufficient contrast
4. Check focus indicators visibility

## Quality Checks

The quality checker validates:
- No hardcoded hex colors in components
- No `text-gray-*` or `bg-gray-*` Tailwind classes
- Proper CSS variable usage

---

**Related:** [Quality System](./quality-system.md) | [Design Tokens](../../src/design/README.md)
