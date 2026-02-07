<!--
Pull Request Title Format: <version semver: major.minor.patch><type>(<scope>): Brief description
Examples:
  - 1.2.1 feat(rocafe): add nutritional information display
  - 2.2.2 fix(locations): correct timezone handling
  - 1.5.1 docs(readme): enhance installation instructions
-->
#
## 📋 Description

### What changed?
<!-- Describe the changes made in this PR -->
-

### Why?
<!-- Explain the motivation and context for these changes -->
-

## 🏷️ Type of Change
<!-- Mark the applicable options with an [x] -->
- [ ] ✨ Feature
- [ ] 🐛 Bug fix
- [ ] ♻️ Refactor
- [ ] 📚 Documentation
- [ ] 🎨 Style
- [ ] ⚡ Performance
- [ ] ✅ Test
- [ ] 🔧 Chore

## 🔗 Related Issues
<!-- Link to related issues (e.g., Closes #123, Fixes #456) -->
-

## 📝 Changes Made

### Added
<!-- List new features or capabilities -->
-

### Changed
<!-- List changes to existing functionality -->
-

### Removed
<!-- List removed features or files -->
-

### Fixed
<!-- List bug fixes -->
-

## 📦 Version & Release
<!-- REQUIRED: Every PR must update version and changelog -->
- [ ] `package.json` version bumped (semver: major.minor.patch)
- [ ] `CHANGELOG.md` updated with all changes under new version heading

## ✅ Testing Checklist

### Automated Tests
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run check:quality` passes
- [ ] `npm run check:integrity` passes
- [ ] `npm run build` succeeds without errors
- [ ] Bundle size within limits

### Manual Testing
- [ ] ☀️ Light mode
- [ ] 🌙 Dark mode
- [ ] ⌨️ Keyboard navigation
- [ ] 📱 Mobile responsive
- [ ] 🖥️ Desktop
- [ ] 🎯 Focus indicators visible
- [ ] ❌ No console errors/warnings

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

## ♿ Accessibility (WCAG 2.2 AA)
<!-- Check all items relevant to your changes -->
- [ ] Semantic HTML (`nav`, `main`, `section`, `article`, etc.)
- [ ] Heading hierarchy (no skipped levels, logical nesting)
- [ ] Images have descriptive `alt` text (decorative images use `alt=""` or `aria-hidden`)
- [ ] Interactive elements keyboard accessible (Tab, Enter/Space, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets AA minimums (4.5:1 text, 3:1 UI)
- [ ] ARIA attributes correct (`aria-label`, `aria-describedby`, `aria-live`, roles)
- [ ] Form inputs have associated `<label>` or `aria-label`
- [ ] Form errors programmatically linked (`aria-invalid`, `aria-describedby`)
- [ ] Modal dialogs trap focus and restore on close
- [ ] Auto-updating content pausable (carousels, timers)
- [ ] `prefers-reduced-motion` respected for animations
- [ ] No AODA / WCAG 2.2 AA violations introduced

## 🔒 Security Considerations
- [ ] No secrets or API keys in code
- [ ] Input validation added/updated where needed
- [ ] No XSS vulnerabilities introduced
- [ ] No security implications OR concerns noted below:

## 🚀 Deployment Considerations
<!-- Note any deployment steps, config changes, or migration requirements -->
- [ ] No deployment changes needed
- [ ] Other:

## 📖 Documentation
- [ ] Code is self-documenting OR has JSDoc
- [ ] README / component docs updated (if applicable)
- [ ] copilot-instructions.md updated (if conventions changed)

## 💭 Notes for Reviewers
<!-- Any specific areas you'd like reviewers to focus on -->

## 🎯 Review Focus Areas
<!-- Mark the areas reviewers should pay special attention to -->
- [ ] Logic correctness
- [ ] Performance impact
- [ ] Accessibility compliance
- [ ] Code maintainability

---

_Thank you for contributing to Roma Mart 2.0! 🎉_
