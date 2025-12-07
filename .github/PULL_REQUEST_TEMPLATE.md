<!-- 
Pull Request Title Format: <type>(<scope>): Brief description
Examples:
  - feat(rocafe): add nutritional information display
  - fix(locations): correct timezone handling  
  - docs(readme): enhance installation instructions
-->

## 📋 Description

### What changed?
- Centralized all company info and navigation links in config files
- Refactored Navbar, Footer, legal pages, and all components to use centralized data
- Updated documentation to require config usage in all code examples
- Fixed meta-checker doc compliance note

### Why?
- Ensures single source of truth for maintainability and brand consistency
- Resolves meta-checker documentation issue
- Aligns with development ethos and quality system

## 🏷️ Type of Change
- [x] ♻️ Refactor
- [x] 📚 Documentation
- [x] 🐛 Bug fix

## 🔗 Related Issues
- Closes #centralization
- Fixes #meta-checker-doc

## 📝 Changes Made
### Added
- Documentation notes for config usage
### Changed
- All navigation and company info now use config
- Updated README and docs for compliance
### Removed
- Hardcoded URLs and company info from all components/pages
### Fixed
- Meta-checker documentation compliance issue

## ✅ Testing Checklist
### Automated Tests
- [x] `npm run lint` passes
- [x] `npm run check:quality` passes (1000+ rules)
- [x] `npm run check:integrity` passes (meta-checker)
- [x] `npm run build` succeeds without errors
- [x] Bundle size within limits
### Manual Testing
- [x] ☀️ Light mode
- [x] 🌙 Dark mode
- [x] ⌨️ Keyboard navigation
- [x] 📱 Mobile
- [x] 💻 Tablet
- [x] 🖥️ Desktop
- [x] 🎯 Focus indicators
- [x] ❌ No console errors/warnings
### Browser Testing
- [x] Chrome/Edge
- [x] Firefox
- [x] Safari

## 🚀 Deployment Considerations
- [x] No deployment changes needed

## 🔒 Security Considerations
- [x] No security implications
- [x] No secrets or API keys in code

## ♿ Accessibility Checklist
- [x] Semantic HTML
- [x] Heading hierarchy
- [x] Images have `alt` text
- [x] Keyboard accessible
- [x] Focus indicators visible
- [x] Color contrast WCAG AA
- [x] ARIA labels
- [x] Form labels
- [x] No a11y violations

## 📖 Documentation
- [x] Code is self-documenting OR has JSDoc
- [x] README.md updated
- [x] Component README updated

## 💭 Notes for Reviewers
- All navigation and company info are now fully centralized
- Documentation is compliant with quality system and meta-checker
- No hardcoded URLs or company info remain

## 🎯 Review Focus Areas
- [x] Logic correctness
- [x] Brand/data centralization
- [x] Accessibility compliance
- [x] Documentation compliance
- [x] Code maintainability

---

_Thank you for contributing to Roma Mart 2.0! 🎉_