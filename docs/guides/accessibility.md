# Accessibility Guide

> WCAG 2.2 AA compliance standards for Roma Mart 2.0

## Overview

Roma Mart is committed to WCAG 2.2 Level AA accessibility compliance, exceeding requirements for AODA (Ontario), ISO/IEC 40500, and EN 301 549 (EAA).

## Compliance Standards

| Standard | Requirement | Status |
|----------|-------------|--------|
| WCAG 2.2 AA | Full compliance | ✅ |
| AODA (Ontario) | WCAG 2.0 AA | ✅ Exceeds |
| ISO/IEC 40500 | WCAG 2.2 AA | ✅ |
| EN 301 549 (EAA) | WCAG 2.1 AA | ✅ Exceeds |

## Key Requirements

### Semantic HTML

```jsx
// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

// Use semantic elements
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
```

### Images

All images require descriptive `alt` text:

```jsx
<img src="/logo.png" alt="Roma Mart logo" />
<img src="/hero.jpg" alt="Fresh produce display at Roma Mart" />
```

### Interactive Elements

```jsx
// Buttons need accessible names
<button aria-label="Close menu">
  <XIcon />
</button>

// Links need descriptive text
<a href="/menu">View full RoCafé menu</a>
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Focus indicators must be visible (`:focus-visible`)
- Skip link to main content required
- Escape key closes modals/menus

### Forms

```jsx
<label htmlFor="email">Email address</label>
<input id="email" type="email" required />
```

### Color Contrast

- Text: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Focus indicators: 3:1 ratio against background

## Testing

### Automated

```bash
npm run lint  # ESLint jsx-a11y plugin
npm run check:quality  # Accessibility dimension
```

### Manual Testing Checklist

- [ ] Navigate entire site with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify focus indicators visible
- [ ] Check color contrast ratios
- [ ] Test at 200% zoom
- [ ] Verify reduced motion support

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [AODA Requirements](https://www.ontario.ca/page/accessibility-rules-businesses-and-non-profits)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Related:** [Quality System](./quality-system.md) | [Public Accessibility Page](/accessibility)
