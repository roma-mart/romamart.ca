# Quality System Guide

> Comprehensive quality assurance standards for Roma Mart 2.0

## Overview

The Roma Mart quality system provides multi-layered automated validation across 9 dimensions:

1. **Accessibility** - WCAG 2.2 AA compliance
2. **Dark Mode** - Theme compatibility
3. **Performance** - Bundle size and optimization
4. **Security** - Secret scanning and XSS prevention
5. **SEO** - Meta tags and structured data
6. **Code Quality** - Linting and best practices
7. **Responsive Design** - Mobile breakpoints
8. **Browser Compatibility** - Modern browser support
9. **Brand Consistency** - Design token usage

## Running Quality Checks

```bash
# Run all quality checks
npm run check:all

# Individual checks
npm run lint          # ESLint
npm run lint:css      # Stylelint
npm run check:quality # Universal quality checker (1000+ rules)
npm run check:integrity # Meta-checker validation
```

## Quality Dimensions

### Accessibility

- Missing `alt` text on images → HIGH severity
- Icon-only buttons without `aria-label` → HIGH severity
- Missing keyboard handlers → MEDIUM severity

### Dark Mode

Violation patterns detected:

- `text-gray-*` classes → HIGH severity
- `bg-gray-*` classes → HIGH severity
- Hardcoded hex colors → LOW severity

**Correct approach:**

```jsx
// Use CSS variables
<p style={{ color: 'var(--color-text-muted)' }}>Text</p>

// Or theme hook
const colors = useThemeColors();
<p style={colors.textMuted}>Text</p>
```

### Security

- Exposed API keys → CRITICAL severity
- `dangerouslySetInnerHTML` usage → HIGH severity
- `http://` links → MEDIUM severity

### Performance

- Bundle size analysis
- Inline function handlers → INFO severity
- Code splitting opportunities

## Severity Levels

| Level | Action Required | Examples |
|-------|----------------|----------|
| CRITICAL | Block merge | Exposed secrets |
| HIGH | Must fix | Missing alt text, hardcoded colors |
| MEDIUM | Should fix | Missing meta tags |
| LOW | Consider fixing | Console.log statements |
| INFO | Informational | Performance suggestions |

## Pre-Commit Checklist

1. `npm run check:all` passes
2. `npm run build` succeeds
3. Test in light and dark modes
4. Verify keyboard navigation
5. Check responsive breakpoints

## Meta-Checker

The meta-checker (`check:integrity`) validates the quality system itself:

- Ensures rules don't conflict
- Validates rule alignment with development ethos
- Detects rule overlap or contradictions

---

**Related:** [Development Ethos](../../DEVELOPMENT_ETHOS.md) | [Deployment](./deployment.md)
