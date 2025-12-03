<!-- 
Pull Request Title Format: <type>(<scope>): Brief description
Examples:
  - feat(rocafe): add nutritional information display
  - fix(locations): correct timezone handling  
  - docs(readme): enhance installation instructions
-->

## 📋 Description

<!-- 
Provide a clear and concise description of what this PR accomplishes.
Include context, motivation, and any relevant background information.
-->

### What changed?


### Why?


## 🏷️ Type of Change

<!-- Check all that apply -->

- [ ] 🐛 **Bug fix** (non-breaking change fixing an issue)
- [ ] ✨ **New feature** (non-breaking change adding functionality)
- [ ] 💥 **Breaking change** (fix or feature causing existing functionality to break)
- [ ] 📚 **Documentation** (updates to documentation only)
- [ ] ⚡ **Performance** (performance improvement)
- [ ] ♻️ **Refactor** (code restructuring without behavior change)
- [ ] 🎨 **Style** (formatting, missing semi-colons, etc.)
- [ ] ✅ **Test** (adding or updating tests)
- [ ] 🔧 **Chore** (maintenance, dependency updates, tooling)
- [ ] 🔐 **Security** (security-related changes)

## 🔗 Related Issues

<!-- Link related issues using GitHub keywords -->

- Fixes #
- Closes #
- Related to #
- Part of #

## 📝 Changes Made

<!-- Provide a detailed list of changes -->

### Added
- 

### Changed
- 

### Removed
- 

### Fixed
- 

## ✅ Testing Checklist

### Automated Tests
- [ ] `npm run lint` passes
- [ ] `npm run lint:css` passes
- [ ] `npm run check:quality` passes (1000+ rules)
- [ ] `npm run check:integrity` passes (meta-checker)
- [ ] `npm run build` succeeds without errors
- [ ] Bundle size within limits

### Manual Testing
- [ ] ☀️ Tested in **light mode**
- [ ] 🌙 Tested in **dark mode**
- [ ] ⌨️ Tested **keyboard navigation** (Tab, Enter, Escape)
- [ ] 📱 Tested **mobile** breakpoint (< 768px)
- [ ] 💻 Tested **tablet** breakpoint (768px - 1024px)
- [ ] 🖥️ Tested **desktop** breakpoint (> 1024px)
- [ ] 🔍 Tested with **screen reader** (if UI changes)
- [ ] 🎯 Tested **focus indicators** visible
- [ ] ❌ No console errors or warnings

### Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if possible)

## 📸 Screenshots / Recordings

<!-- 
Add screenshots or screen recordings to demonstrate changes
Before/After comparisons are especially helpful for UI changes
-->

### Before


### After


## 🚀 Deployment Considerations

<!-- Check all that apply -->

- [ ] ✅ No deployment changes needed
- [ ] 🔑 Requires environment variable updates
- [ ] 🌐 Requires base path change (production cutover)
- [ ] 📊 Requires GTM/analytics updates
- [ ] 🗄️ Requires data migration
- [ ] ⚙️ Requires configuration changes
- [ ] 📦 Requires dependency installation

### Environment Variables
<!-- If applicable, list new or changed environment variables -->

```bash
# Example:
VITE_NEW_API_KEY=<value>
```

### Migration Steps
<!-- If applicable, describe any migration or deployment steps -->


## 🔒 Security Considerations

<!-- Check all that apply -->

- [ ] No security implications
- [ ] Reviewed for XSS vulnerabilities
- [ ] Reviewed for CSRF vulnerabilities  
- [ ] No secrets or API keys in code
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Security dependencies updated

## ♿ Accessibility Checklist

<!-- For UI changes only -->

- [ ] Semantic HTML elements used
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] All images have `alt` text
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (`:focus-visible`)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] ARIA labels where appropriate
- [ ] Form inputs have associated `<label>` elements
- [ ] No accessibility violations in dev tools

## 📖 Documentation

- [ ] Code is self-documenting OR has JSDoc comments
- [ ] README.md updated (if needed)
- [ ] CHANGELOG.md updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Component README updated (if needed)
- [ ] Migration guide added (if breaking change)

## 💭 Notes for Reviewers

<!-- 
Add any context, design decisions, or areas requiring special attention.
Highlight any trade-offs or technical debt incurred.
-->



## 🎯 Review Focus Areas

<!-- What should reviewers pay special attention to? -->

- [ ] Logic correctness
- [ ] Edge case handling
- [ ] Performance implications
- [ ] Security implications
- [ ] Accessibility compliance
- [ ] Code maintainability
- [ ] Test coverage

---

## ✅ Pre-Submission Checklist

<!-- Complete before requesting review -->

- [ ] Branch is up-to-date with `main`
- [ ] All commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] No merge conflicts
- [ ] Self-review completed
- [ ] No `console.log` statements (unless debugging hook)
- [ ] No commented-out code blocks
- [ ] No TODO comments (or tracked in issues)
- [ ] Follows [DEVELOPMENT_ETHOS.md](../DEVELOPMENT_ETHOS.md) principles
- [ ] Reviewed [BRANCHING_STRATEGY.md](.github/BRANCHING_STRATEGY.md)

---

## 👀 Reviewer Checklist

<!-- For reviewers - check during code review -->

### Code Quality
- [ ] Code follows project conventions (design tokens, CSS variables)
- [ ] No hardcoded colors (uses `src/design/tokens.js` or CSS vars)
- [ ] Proper error handling implemented
- [ ] No code duplication or could be refactored
- [ ] Functions are small and focused (< 50 lines)
- [ ] Variable/function names are descriptive

### Architecture & Design
- [ ] Changes align with existing architecture
- [ ] Appropriate component abstraction level
- [ ] Reuses existing utilities/components where possible
- [ ] No unnecessary dependencies added
- [ ] Follows React 19 + Hooks patterns (no class components)

### Testing & Quality
- [ ] All automated checks pass (lint, quality, build)
- [ ] Changes are testable
- [ ] Edge cases considered
- [ ] Error scenarios handled gracefully

### Accessibility & UX
- [ ] WCAG 2.2 AA standards maintained
- [ ] Dark mode compatibility verified
- [ ] Responsive design verified
- [ ] Keyboard navigation works
- [ ] Focus management appropriate

### Documentation
- [ ] Code changes are well-documented
- [ ] Complex logic has explanatory comments
- [ ] Public APIs have JSDoc comments
- [ ] Documentation updated if needed

### Security & Performance
- [ ] No security vulnerabilities introduced
- [ ] No secrets or sensitive data exposed
- [ ] No performance regressions
- [ ] Images optimized (lazy loading, compression)
- [ ] Bundle size impact acceptable

---

**Review Time Estimate:** <!-- Small / Medium / Large -->  
**Reviewers:** @<!-- Tag specific reviewers if needed -->

---

_Thank you for contributing to Roma Mart 2.0! 🎉_