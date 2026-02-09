# 🏗️ Universal Quality Assurance System

**Comprehensive standards enforcement across all development dimensions**

**Status:** ✅ Active  
**Date:** December 1, 2025  
**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [System Architecture](#system-architecture)
4. [Quality Dimensions](#quality-dimensions)
5. [Automated Checks](#automated-checks)
6. [Development Workflow](#development-workflow)
7. [Enforcement Strategy](#enforcement-strategy)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Resources](#resources)

---

## 🎯 Overview

### Problem Statement

Manual code reviews catch issues too late in the development cycle. Inconsistent standards lead to:
- **Accessibility violations** that exclude users
- **Dark mode incompatibility** harming user experience
- **Performance issues** from bloated bundles
- **Security vulnerabilities** from exposed secrets
- **SEO problems** reducing discoverability
- **Code quality drift** over time

### Solution

**Multi-layered automated quality assurance** that:
1. ✅ **Prevents** issues at code-time (editor warnings)
2. ✅ **Detects** issues at check-time (npm scripts)
3. ✅ **Blocks** issues at commit-time (git hooks)
4. ✅ **Enforces** standards at push-time (CI/CD)

### Philosophy

> **"Systems over spot fixes"**  
> Build comprehensive infrastructure that scales with your codebase, rather than reactive patches for individual bugs.

---

## 🧭 Core Principles

### 1. **Systematic Over Reactive**
- Build prevention systems, not quick fixes
- Address root causes, not symptoms
- Create reusable patterns and utilities

### 2. **Automated Over Manual**
- Tools enforce standards consistently
- Developers receive immediate feedback
- CI/CD catches issues before production

### 3. **Standards-Based**
- WCAG 2.2 AA for accessibility
- OWASP for security
- Core Web Vitals for performance
- Semantic HTML for SEO

### 4. **Developer-Friendly**
- Clear error messages with fix suggestions
- Comprehensive documentation
- Easy-to-use utilities and templates

### 5. **Incremental Adoption**
- Warnings before errors for new rules
- Gradual rollout of strict enforcement
- Backwards-compatible migrations

---

## 🏛️ System Architecture

### Layer 1: Editor Integration
**Real-time feedback while coding**

```
VS Code + ESLint + Extensions
          ↓
   Live error highlighting
   Auto-fix on save
   IntelliSense warnings
```

**Components:**
- `.vscode/settings.json` - Editor configuration
- `.vscode/extensions.json` - Recommended extensions
- `eslint.config.js` - Linting rules

### Layer 2: Development Scripts
**On-demand comprehensive checks**

```
npm run check:quality
          ↓
   9 quality dimensions
   Detailed reports
   Exit codes for CI
```

**Components:**
- `scripts/check-quality.js` - Universal checker (includes dark mode checks)
- `package.json` - Script definitions

### Layer 3: Git Hooks (Active -- Husky v9)
**Automated pre-commit validation**

```
git commit
          ↓
   lint-staged (ESLint + Stylelint)
   npm run check:quality
   npm run check:integrity
   Block if failures
```

**Components:**
- `.husky/pre-commit` - Quality suite (lint-staged + check:quality + check:integrity)
- `.husky/commit-msg` - Commitlint (Conventional Commits)
- Exit codes determine success/failure

### Layer 4: CI/CD Pipeline
**Final gate before deployment**

```
GitHub Actions
          ↓
   npm run build
   npm run check:all
   Deploy only if passing
```

**Components:**
- `.github/workflows/deploy.yml` (future)
- Production bundle validation
- Automated deployment

---

## 📊 Quality Dimensions

### 1. 🦾 Accessibility (WCAG 2.2 AA)

**What We Check:**
- ✅ Missing alt text on images
- ✅ Icon-only buttons/links without aria-label
- ✅ onClick without keyboard support
- ✅ Color contrast ratios
- ✅ Semantic HTML structure

**Standards:**
- Minimum 4.5:1 contrast for normal text
- Minimum 3:1 contrast for large text (18pt+)
- All interactive elements keyboard-accessible
- Screen reader compatibility

**Tools:**
- ESLint `jsx-a11y` plugin
- Manual contrast checkers
- NVDA/JAWS testing

**Example Fix:**
```jsx
// ❌ Bad
<button><IconComponent /></button>

// ✅ Good
<button aria-label="Close menu">
  <IconComponent />
</button>
```

### 2. 🌙 Dark Mode Compatibility

**What We Check:**
- ✅ Hardcoded Tailwind gray classes
- ✅ Hardcoded hex colors
- ✅ Fixed contrast assumptions
- ✅ CSS variable usage

**Standards:**
- All colors use CSS variables or theme utilities
- Maintain WCAG contrast in both modes
- Test all interactive states

**Tools:**
- Custom ESLint rules
- Universal quality checker (`check-quality.js` dark mode dimension)
- Theme utilities (`src/utils/theme.js`)

**Example Fix:**
```jsx
// ❌ Bad
<p className="text-gray-600">Muted text</p>

// ✅ Good
<p style={{ color: 'var(--color-text-muted)' }}>Muted text</p>

// ✅ Better
import { useThemeColors } from '../utils/theme';
const { textMuted } = useThemeColors();
<p style={textMuted}>Muted text</p>
```

### 3. ⚡ Performance

**What We Check:**
- ✅ Bundle size thresholds
- ✅ Lazy loading images
- ✅ Code splitting opportunities
- ✅ Wildcard imports
- ✅ Inline event handlers

**Standards:**
- Total JS bundle < 500KB (gzipped)
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Images lazy-loaded below fold

**Tools:**
- Vite bundle analyzer
- Lighthouse CI
- Custom performance checker

**Example Fix:**
```jsx
// ❌ Bad - Wildcard import
import * as icons from 'lucide-react';

// ✅ Good - Specific imports
import { Home, User, Settings } from 'lucide-react';

// ❌ Bad - No lazy loading
<img src="/large-image.jpg" alt="Hero" />

// ✅ Good - Lazy loaded
<LazyImage src="/large-image.jpg" alt="Hero" />
```

### 4. 🔒 Security

**What We Check:**
- ✅ Exposed API keys/secrets
- ✅ `dangerouslySetInnerHTML` usage
- ✅ `eval()` calls
- ✅ External links without `rel="noopener"`
- ✅ XSS vulnerabilities

**Standards:**
- Zero secrets in code
- Environment variables for keys
- Sanitize all user input
- Secure external link handling

**Tools:**
- Secret scanning regex patterns
- ESLint security rules
- Manual security audits

**Example Fix:**
```jsx
// ❌ Bad - Exposed key
const API_KEY = "sk_live_abc123xyz";

// ✅ Good - Environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

// ❌ Bad - XSS risk
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good - Sanitized
<div>{sanitize(userInput)}</div>

// ❌ Bad - Security risk
<a href={externalUrl} target="_blank">Link</a>

// ✅ Good - Secure
<a href={externalUrl} target="_blank" rel="noopener noreferrer">Link</a>
```

### 5. 🔎 SEO

**What We Check:**
- ✅ Missing `<Helmet>` meta tags
- ✅ Missing meta descriptions
- ✅ Missing canonical URLs
- ✅ Missing `sitemap.xml`
- ✅ Missing `robots.txt`

**Standards:**
- Every page has unique title
- Meta description 50-160 characters
- Canonical URL prevents duplicates
- Structured data where applicable

**Tools:**
- react-helmet-async
- Custom SEO checker
- Google Search Console

**Example Fix:**
```jsx
// ❌ Bad - No SEO
function AboutPage() {
  return <div>Content</div>;
}

// ✅ Good - Complete SEO
import { Helmet } from 'react-helmet-async';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Roma Mart</title>
        <meta name="description" content="Learn about Roma Mart's 30-year history..." />
        <link rel="canonical" href="https://romamart.ca/about" />
      </Helmet>
      <div>Content</div>
    </>
  );
}
```

### 6. 📝 Code Quality

**What We Check:**
- ✅ `console.log()` statements
- ✅ TODO/FIXME comments
- ✅ Deprecated React patterns
- ✅ Unused imports
- ✅ Missing PropTypes/TypeScript

**Standards:**
- No console logs in production
- Modern React patterns (hooks)
- Clean, documented code
- Consistent formatting

**Tools:**
- ESLint with custom rules
- Prettier for formatting
- Code review guidelines

**Example Fix:**
```jsx
// ❌ Bad - Debug logs
console.log('User data:', user);

// ✅ Good - Conditional logging
if (import.meta.env.DEV) {
  console.log('User data:', user);
}

// ❌ Bad - Deprecated lifecycle
componentWillMount() {
  this.fetchData();
}

// ✅ Good - Modern hooks
useEffect(() => {
  fetchData();
}, []);
```

### 7. 📱 Responsive Design

**What We Check:**
- ✅ Viewport meta tag
- ✅ Fixed widths > 1000px
- ✅ Mobile breakpoints
- ✅ Touch-friendly targets

**Standards:**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Minimum touch target: 44×44px
- Horizontal scrolling avoided

**Tools:**
- Tailwind responsive utilities
- Browser DevTools
- Real device testing

**Example Fix:**
```jsx
// ❌ Bad - Fixed width
<div style={{ width: '1200px' }}>Content</div>

// ✅ Good - Responsive
<div className="w-full max-w-7xl mx-auto px-4">Content</div>

// ❌ Bad - Desktop-only
<div className="grid-cols-4">Items</div>

// ✅ Good - Responsive grid
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">Items</div>
```

### 8. 🌐 Browser Compatibility

**What We Check:**
- ✅ Modern JS features usage
- ✅ CSS property support
- ✅ Polyfill requirements
- ✅ Fallback strategies

**Standards:**
- Support last 2 versions of major browsers
- Graceful degradation for older browsers
- Progressive enhancement approach

**Tools:**
- Browserslist configuration
- Can I Use database
- Cross-browser testing

**Example:**
```javascript
// Modern features used (transpiled by Vite):
- Optional chaining: obj?.prop
- Nullish coalescing: value ?? default
- Template literals: `Hello ${name}`
- Arrow functions: () => {}
```

---

## 🔍 Automated Checks

### Universal Quality Checker

**Command:**
```bash
npm run check:quality
```

**What It Does:**
1. Scans all `.js` and `.jsx` files in `src/`
2. Applies 9 quality dimension checks
3. Categorizes issues by severity
4. Provides detailed fix suggestions
5. Returns exit code (0 = pass, 1 = fail)

**Output Format:**
```
🔍 Checking accessibility...
🌙 Checking dark mode compatibility...
⚡ Checking performance...
🔒 Checking security...
🔎 Checking SEO...
📝 Checking code quality...
📱 Checking responsive design...
🌐 Checking browser compatibility...

📊 QUALITY REPORT

Total Issues: 15

🔴 CRITICAL (0)
🟡 HIGH (3)
🟠 MEDIUM (7)
🔵 LOW (5)
ℹ️  INFO (0)

[ACCESSIBILITY]
  src/components/Header.jsx:45
    Issue: Icon-only button missing aria-label
    Code: <button><MenuIcon /></button>
    Fix: Add aria-label="Open menu" to button

[DARK_MODE]
  src/pages/HomePage.jsx:120
    Issue: Hardcoded Tailwind gray class breaks dark mode
    Code: <p className="text-gray-600">Description</p>
    Fix: Use CSS variables: var(--color-text-muted)

...
```

**Exit Codes:**
- `0` - All checks passed
- `1` - Critical or high-priority issues found

### Integration with Git Hooks

**Pre-Commit Hook** (Husky v9 -- Comprehensive):
```bash
# Runs automatically on git commit via .husky/pre-commit
# 1. lint-staged (ESLint on *.{js,jsx}, Stylelint on *.css)
# 2. npm run check:quality (9 dimensions)
# 3. npm run check:integrity (meta-checker)
```

**Commit-Msg Hook** (Conventional Commits):
```bash
# Runs automatically via .husky/commit-msg
# Validates commit message format: <type>(<scope>): <description>
```

**Bypass Option:**
```bash
# Use sparingly, only when necessary
git commit --no-verify
git push --no-verify
```

---

## 🔄 Development Workflow

### Daily Development

1. **Code with Live Feedback**
   - Editor shows ESLint warnings in real-time
   - Auto-fix on save corrects simple issues
   - IntelliSense suggests proper patterns

2. **Check Before Commit**
   ```bash
   npm run check:quality
   ```
   - Review all issues
   - Fix critical and high-priority
   - Document intentional exceptions

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   - Husky pre-commit hook runs lint-staged + quality + integrity
   - Commit-msg hook validates Conventional Commits format
   - Blocks commit if violations found
   - Fast feedback loop

4. **Push to Remote**
   ```bash
   git push origin main
   ```
   - All checks already passed at commit time
   - CI/CD runs build validation on push

### Weekly Maintenance

1. **Full Audit**
   ```bash
   npm run check:all
   ```
   - Comprehensive report across all dimensions
   - Identify trends and patterns
   - Plan refactoring efforts

2. **Review TODO Comments**
   - Quality checker flags all TODOs
   - Convert to issue tracker items
   - Assign priorities and owners

3. **Update Dependencies**
   ```bash
   npm outdated
   npm update
   npm run check:all
   ```
   - Keep tools and libraries current
   - Verify no regressions
   - Update documentation

### Before Release

1. **Production Build**
   ```bash
   npm run build
   ```
   - Verify bundle size acceptable
   - Check for build warnings
   - Test prerendering

2. **Final Quality Check**
   ```bash
   npm run check:all
   npm run lint
   ```
   - Zero critical issues
   - Document any accepted warnings
   - Update changelog

3. **Manual Testing**
   - Cross-browser testing
   - Mobile device testing
   - Accessibility testing with screen readers
   - Performance testing with Lighthouse

---

## 🛡️ Enforcement Strategy

### Severity Levels

| Level | Action | Description |
|-------|--------|-------------|
| 🔴 **CRITICAL** | **Block deployment** | Security vulnerabilities, exposed secrets, eval() |
| 🟡 **HIGH** | **Fix before release** | Accessibility violations, security risks, broken dark mode |
| 🟠 **MEDIUM** | **Fix soon** | SEO issues, performance concerns, code smells |
| 🔵 **LOW** | **Nice to have** | Optimization opportunities, minor inconsistencies |
| ℹ️ **INFO** | **Informational** | Suggestions, best practices, educational notes |

### Progressive Enforcement

**Current State: Strict Enforcement (Active)**
- All medium+ rules are errors
- Husky v9 pre-commit hook blocks violations automatically
- Commit-msg hook enforces Conventional Commits
- `npm run check:all` required before merging

### Exception Process

When you need to bypass a rule:

1. **Document the reason**
   ```javascript
   // eslint-disable-next-line no-restricted-syntax
   // Exception: Third-party widget requires inline styles
   <div className="text-gray-500">Widget</div>
   ```

2. **Add to exception list**
   - Update `.eslintignore` or checker config
   - Document in code comments
   - Link to issue tracker if temporary

3. **Review regularly**
   - Exceptions reviewed in code reviews
   - Revisit every quarter
   - Remove when no longer needed

---

## 💡 Best Practices

### For Components

```jsx
/**
 * Component Template with Quality Standards
 */
import { useThemeColors } from '../utils/theme';
import { Helmet } from 'react-helmet-async';

function ExampleComponent({ title, description }) {
  const { text, textMuted, surface, border } = useThemeColors();
  
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{title} | Roma Mart</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <div style={surface}>
        {/* Accessibility: Semantic HTML */}
        <h1 style={text}>{title}</h1>
        
        {/* Dark Mode: CSS Variables */}
        <p style={textMuted}>{description}</p>
        
        {/* Accessibility: Alt text */}
        <LazyImage 
          src="/image.jpg" 
          alt="Descriptive alt text"
        />
        
        {/* Accessibility: Keyboard support */}
        <button
          aria-label="Close dialog"
          onClick={handleClose}
          style={{ borderColor: 'var(--color-border)' }}
        >
          <CloseIcon />
        </button>
      </div>
    </>
  );
}

export default ExampleComponent;
```

### For Styling


```jsx
// ✅ Theme Utilities (Best)
import { useThemeColors } from '../utils/theme';
const { text, surface } = useThemeColors();
<div style={surface}>
  <h1 style={text}>Title</h1>
</div>

// ✅ CSS Variables (Good)
<div style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
  Content
</div>

// ✅ Tailwind with CSS (Good)
<div className="p-4" style={{ color: 'var(--color-text)' }}>
  Content
</div>

// ❌ Hardcoded (Avoid)
<div style={{ color: '#020178', backgroundColor: '#fff' }}>
  Will break in dark mode
</div>
<div className="text-gray-600 bg-gray-100">
  Will break in dark mode
</div>
```

### For Performance

```jsx
// ✅ Specific imports
import { useState, useEffect } from 'react';
import { Home, User } from 'lucide-react';

// ✅ Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Image optimization
<LazyImage 
  src="/hero.jpg"
  alt="Hero"
  loading="lazy"
  width={1200}
  height={600}
/>

// ✅ useCallback for handlers (when needed)
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### For Security

```jsx
// ✅ Environment variables
const apiKey = import.meta.env.VITE_WEB3FORMS_KEY;

// ✅ Secure external links
<a 
  href={externalUrl} 
  target="_blank" 
  rel="noopener noreferrer"
>
  External Link
</a>

// ✅ Sanitize user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// ❌ Never expose secrets
// const SECRET_KEY = "abc123xyz"; // DON'T DO THIS
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "Quality check fails but I don't see problems"

**Solution:**
```bash
# Get detailed output
npm run check:quality 2>&1 | more

# Check specific file
npx eslint src/components/MyComponent.jsx

# Review all violations
npm run check:quality > quality-report.txt
```

#### Issue: "Pre-commit hook blocks my commit"

**Solution:**
```bash
# See what's blocking
npm run check:quality

# Fix the violations, then retry
git add .
git commit -m "feat: your message"

# Or bypass (not recommended)
git commit --no-verify -m "emergency fix"
```

#### Issue: "Too many false positives"

**Solution:**
1. Update checker filters in `scripts/check-quality.js`
2. Add exception patterns
3. Document intentional violations
4. Adjust severity levels

```javascript
// In check-quality.js, add filter:
if (line.includes('intentional-pattern')) return;
```

#### Issue: "Editor not showing ESLint warnings"

**Solution:**
1. Install ESLint extension: `dbaeumer.vscode-eslint`
2. Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
3. Check Output panel: `View` → `Output` → `ESLint`
4. Verify config: `npx eslint --print-config src/App.jsx`

#### Issue: "Git hooks not running"

**Solution:**
```bash
# Verify Husky is installed
ls .husky/pre-commit

# Re-install Husky hooks
npx husky install

# Check hook has correct content
cat .husky/pre-commit
# Should contain: npx lint-staged, npm run check:quality, npm run check:integrity
```

### Performance Issues

#### Quality Check is Slow

**Optimization:**
```bash
# Run lint only (fast)
npm run lint                # ~5 seconds

# Skip quality checks for commits (not recommended)
git commit -m "..." --no-verify

# Run full quality before push
npm run check:all
```

#### Build Takes Too Long

**Solutions:**
- Clear cache: `rm -rf node_modules/.vite`
- Use development build: `npm run dev`
- Check bundle size: Review dist/ folder
- Optimize images: Use WebP, reduce sizes

---

## 📚 Resources

### Internal Documentation

- **[COMPREHENSIVE_AUDIT_DEC2025.md](./COMPREHENSIVE_AUDIT_DEC2025.md)** - Initial codebase audit (98/100 score)
- **[DARK_MODE_SYSTEM.md](./DARK_MODE_SYSTEM.md)** - Dark mode system and patterns
- **[CONTENT_PHASE_PLAN.md](./CONTENT_PHASE_PLAN.md)** - Content requirements and specs
- **[WCAG_CERTIFICATION.md](./WCAG_CERTIFICATION.md)** - Accessibility compliance details

### External Standards

- **WCAG 2.2 AA:** https://www.w3.org/WAI/WCAG22/quickref/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Core Web Vitals:** https://web.dev/vitals/
- **React Best Practices:** https://react.dev/learn
- **Tailwind CSS:** https://tailwindcss.com/docs

### Tools Documentation

- **ESLint:** https://eslint.org/docs/latest/
- **Vite:** https://vitejs.dev/guide/
- **React Helmet:** https://github.com/staylor/react-helmet-async
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

### Recommended Extensions

Install via VS Code or `.vscode/extensions.json`:
- `dbaeumer.vscode-eslint` - ESLint integration
- `esbenp.prettier-vscode` - Code formatting
- `bradlc.vscode-tailwindcss` - Tailwind IntelliSense
- `usernamehw.errorlens` - Inline error display
- `dsznajder.es7-react-js-snippets` - React snippets

---

## 🎓 Training & Onboarding

### For New Developers

1. **Read this document** - Understand the quality philosophy
2. **Install extensions** - Get editor integration working
3. **Run checks locally** - `npm run check:quality`
4. **Review examples** - Study component templates
5. **Ask questions** - Team is here to help

### For Code Reviewers

1. **Automated checks first** - Trust the tools
2. **Focus on logic** - Let tools handle style
3. **Document exceptions** - When overriding rules
4. **Update standards** - Based on patterns and needs
5. **Share knowledge** - Teach best practices

---

## 🚀 Future Enhancements

### Planned Improvements

- [ ] **Visual Regression Testing** - Percy or Chromatic
- [ ] **Type Safety** - Migrate to TypeScript
- [ ] **Bundle Analysis** - Automated size tracking
- [x] **Test Coverage** - Vitest (260 tests across 18 files)
- [ ] **API Contract Testing** - Mock server validation
- [ ] **Internationalization** - i18n quality checks

### Continuous Improvement

This system is **living documentation**. As we discover new patterns and issues:
1. Update checker rules
2. Enhance documentation
3. Share learnings with team
4. Iterate on enforcement strategy

---

## 📝 Changelog

### Version 1.0.0 (December 1, 2025)
- ✅ Initial universal quality system
- ✅ 9 quality dimensions implemented (including brand consistency)
- ✅ Automated checker created
- ✅ Husky v9 git hooks configured
- ✅ Editor integration complete
- ✅ Comprehensive documentation
- ✅ Example templates provided

---

## 🙏 Acknowledgments

Built on foundation of:
- Dark mode system implementation
- Initial comprehensive audit
- WCAG 2.2 AA compliance work
- Team feedback and collaboration

**Philosophy:** "Build systems that honor our core development principles - accessibility, performance, security, and quality - systematically enforced at every level."

---

**Questions? Issues? Suggestions?**  
Open a discussion or update this documentation as we learn and grow.

**Let's build fluid, standards-based applications together! 🚀**
