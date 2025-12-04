# Accessibility Audit Checklist

> WCAG 2.2 AA compliance verification

## Perceivable

### 1.1 Text Alternatives

- [ ] All images have descriptive `alt` text
- [ ] Decorative images have empty `alt=""`
- [ ] Complex images have extended descriptions
- [ ] Icons have accessible names

### 1.2 Time-based Media

- [ ] Videos have captions (if applicable)
- [ ] Audio has transcripts (if applicable)

### 1.3 Adaptable

- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Lists use proper markup (`<ul>`, `<ol>`)
- [ ] Tables have proper headers
- [ ] Reading order is logical

### 1.4 Distinguishable

- [ ] Text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] No information conveyed by color alone
- [ ] Text resizable to 200%
- [ ] No horizontal scrolling at 320px width

## Operable

### 2.1 Keyboard Accessible

- [ ] All functions available via keyboard
- [ ] No keyboard traps
- [ ] Skip link to main content
- [ ] Focus order is logical

### 2.2 Enough Time

- [ ] No time limits (or can be extended)
- [ ] Auto-updating can be paused

### 2.3 Seizures

- [ ] No content flashes > 3 times/second

### 2.4 Navigable

- [ ] Page has descriptive title
- [ ] Focus indicator visible
- [ ] Link purpose clear from text
- [ ] Multiple ways to find pages

### 2.5 Input Modalities

- [ ] Touch targets ≥ 44x44px
- [ ] No motion-only activation

## Understandable

### 3.1 Readable

- [ ] Page language declared (`lang="en"`)
- [ ] Unusual words explained

### 3.2 Predictable

- [ ] No unexpected context changes
- [ ] Consistent navigation
- [ ] Consistent identification

### 3.3 Input Assistance

- [ ] Error messages are clear
- [ ] Labels for all inputs
- [ ] Error prevention for important actions

## Robust

### 4.1 Compatible

- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Status messages announced

## Testing Tools

- [ ] ESLint jsx-a11y (automated)
- [ ] axe DevTools (browser extension)
- [ ] WAVE (web accessibility evaluation)
- [ ] Screen reader (manual)
- [ ] Keyboard only (manual)

## Sign-off

| Tester | Date | Result |
|--------|------|--------|
| | | Pass / Fail |

---

**Related:** [Accessibility Guide](../guides/accessibility.md) | [Quality System](../guides/quality-system.md)
