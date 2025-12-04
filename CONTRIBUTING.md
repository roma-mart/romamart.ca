# Contributing to Roma Mart 2.0

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 24.x LTS (via nvm recommended)
- Git
- GitHub account

### Setup

```bash
# Clone the repository
git clone https://github.com/roma-mart/romamart.ca.git
cd romamart.ca

# Install dependencies
npm install

# Verify setup
npm run check:all

# Start development server
npm run dev
```

## Development Workflow

### Branching Strategy

| Branch Type | Naming | Purpose |
|-------------|--------|---------|
| `feature/*` | `feature/add-menu-filter` | New features |
| `bugfix/*` | `bugfix/fix-navbar-scroll` | Bug fixes |
| `docs/*` | `docs/update-readme` | Documentation |
| `hotfix/*` | `hotfix/critical-fix` | Urgent production fixes |

### Creating a Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(rocafe): add nutritional information display
fix(locations): correct timezone handling
docs(readme): update installation instructions
```

## Coding Standards

### React & JavaScript

- **Functional components only** with hooks
- Import only needed icons: `import { Icon } from 'lucide-react'`
- Use async/await over promise chains

### Styling

- **Use CSS variables** for colors - never hardcode
- Tailwind for layout/spacing
- Test in both light and dark modes

```jsx
// ✅ Correct
<div style={{ color: 'var(--color-text)' }}>

// ❌ Wrong
<div style={{ color: '#333' }}>
```

### Accessibility

- WCAG 2.2 AA compliance required
- Semantic HTML elements
- Keyboard navigation support
- Proper ARIA labels

## Testing

### Before Submitting

```bash
# Run all quality checks
npm run check:all

# Build verification
npm run build
```

### Manual Testing Checklist

- [ ] ☀️ Light mode
- [ ] 🌙 Dark mode
- [ ] 📱 Mobile responsive
- [ ] ⌨️ Keyboard navigation
- [ ] 🔊 Screen reader compatible

## Pull Request Process

### Before Submitting

1. ✅ All quality checks pass: `npm run check:all`
2. ✅ Build succeeds: `npm run build`
3. ✅ Manual testing complete
4. ✅ Documentation updated (if needed)
5. ✅ Commits follow conventions

### PR Checklist

- [ ] Builds locally
- [ ] Passes all quality checks
- [ ] Tested in light and dark modes
- [ ] Keyboard accessible
- [ ] Documentation updated
- [ ] No secrets in code

### Review Process

1. Open PR targeting `main`
2. Automated checks run
3. Request review
4. Address feedback
5. Merge when approved

## Questions?

- Check the [documentation](./docs/README.md)
- Open an [issue](https://github.com/roma-mart/romamart.ca/issues)
- Review the [Development Ethos](./DEVELOPMENT_ETHOS.md)

---

**Thank you for contributing!** 🎉