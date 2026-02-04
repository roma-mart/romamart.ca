# Troubleshooting Guide

> Common issues and solutions for Roma Mart development

## Build Issues

### Build Fails with ESLint Errors

**Problem:** `npm run build` fails with linting errors.

**Solution:**

```bash
# Check specific errors
npm run lint

# Common fixes:
# - Add alt text to images
# - Add aria-label to icon buttons
# - Remove unused variables
```

### Stylelint Errors

**Problem:** CSS linting failures.

**Solution:**

```bash
npm run lint:css

# Common fixes:
# - Check comment spacing
# - Verify Tailwind @rules are recognized
# - Use proper CSS variable syntax
```

### Bundle Size Too Large

**Problem:** Build warns about large bundle size.

**Solution:**

- Check for unused dependencies
- Verify code splitting is working
- Import only needed icons: `import { Icon } from 'lucide-react'`

## Dark Mode Issues

### Colors Not Adapting

**Problem:** Elements don't change in dark mode.

**Solution:**

```jsx
// Wrong - hardcoded color
<p style={{ color: '#333' }}>

// Correct - CSS variable
<p style={{ color: 'var(--color-text)' }}>
```

### Quality Check Fails for Dark Mode

**Problem:** `check:quality` reports dark mode violations.

**Solution:**

- Replace `text-gray-*` with CSS variables
- Replace `bg-gray-*` with CSS variables
- Check `src/utils/theme.js` for proper usage

## Development Server Issues

### Port Already in Use

**Problem:** `npm run dev` fails with port error.

**Solution:**

```bash
# Find process on port 5173
lsof -i :5173

# Try graceful termination first
kill <PID>

# If that doesn't work, force kill
kill -9 <PID>
```

### Hot Reload Not Working

**Solution:**

1. Clear browser cache
2. Restart dev server
3. Check for syntax errors in edited file

## Deployment Issues

### GitHub Pages 404

**Problem:** Deployed site shows 404.

**Solution:**

- Verify `base` path in `vite.config.js`
- Check GitHub Pages settings
- Ensure `dist` folder was published

### Environment Variables Missing

**Problem:** Contact form or GTM not working in production.

**Solution:**

- Verify secrets are set in repository settings
- Check CI workflow injects variables correctly
- Rebuild and redeploy

## Quality Check Issues

### False Positives

**Problem:** Quality checker flags intentional patterns.

**Solution:**

- Check if pattern is in approved exceptions
- Review `scripts/check-quality.js` for filters
- Document exception if valid

### Check Takes Too Long

**Solution:**

- Run individual checks instead of `check:all`
- Check for infinite loops in quality scripts

## Getting Help

1. Check existing documentation
2. Search closed issues
3. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details

---

**Related:** [Quality System](./quality-system.md) | [Testing](./testing.md)
