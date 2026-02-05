# Development Tooling Recommendations

> **Purpose:** Recommended tools and configurations to enhance developer productivity and code quality  
> **Status:** Optional but highly recommended  
> **Last Updated:** December 3, 2025

## Overview

This document provides recommendations for development tools that complement the Roma Mart 2.0 workflow. While not required, these tools significantly improve developer experience, code quality, and team consistency.

---

## 📦 Recommended NPM Packages

### Code Quality & Formatting

#### **Prettier** (Code Formatter)
**Status:** ⚠️ Not Currently Configured  
**Recommendation:** HIGH PRIORITY

**Why:**
- Automatic code formatting eliminates debates about style
- Ensures consistency across team members
- Integrates with editors for format-on-save
- Works alongside ESLint (handles formatting, ESLint handles quality)

**Installation:**
```bash
npm install --save-dev prettier
```

**Configuration:** Create `.prettierrc.json`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false
}
```

**Ignore File:** Create `.prettierignore`
```
dist/
build/
node_modules/
.vite/
coverage/
public/
*.md
package-lock.json
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css,md}\""
  }
}
```

**ESLint Integration:**
```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

Update `eslint.config.js`:
```javascript
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // ... existing config
  prettierConfig,
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error'
    }
  }
];
```

---

#### **EditorConfig**
**Status:** ⚠️ Not Currently Configured  
**Recommendation:** MEDIUM PRIORITY

**Why:**
- Maintains consistent coding styles across different editors
- Works out-of-the-box with most IDEs
- Lightweight configuration

**Configuration:** Create `.editorconfig`
```ini
# EditorConfig is awesome: https://EditorConfig.org

root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
max_line_length = 100

[*.{json,yml,yaml}]
indent_size = 2

[package.json]
indent_size = 2
```

---

### Git Hooks & Automation

#### **Husky** (Git Hooks Manager)
**Status:** ⚠️ Not Currently Configured  
**Recommendation:** HIGH PRIORITY

**Why:**
- Automates quality checks before commit/push
- Prevents bad code from entering the repository
- Enforces commit message conventions
- Reduces manual workflow overhead

**Installation:**
```bash
npm install --save-dev husky
npx husky install
npm pkg set scripts.prepare="husky install"
```

**Pre-Commit Hook:**
```bash
npx husky add .husky/pre-commit "npm run lint && npm run format:check && npm run check:quality"
chmod +x .husky/pre-commit
```

**Commit Message Hook:**
```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
chmod +x .husky/commit-msg
```

**Pre-Push Hook:**
```bash
npx husky add .husky/pre-push "npm run check:all && npm run build"
chmod +x .husky/pre-push
```

---

#### **Commitlint** (Commit Message Linter)
**Status:** ⚠️ Not Currently Configured  
**Recommendation:** MEDIUM PRIORITY

**Why:**
- Enforces Conventional Commits format
- Improves changelog generation
- Makes commit history more readable
- Enables automated versioning

**Installation:**
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**Configuration:** Create `.commitlintrc.json`
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert"
      ]
    ],
    "scope-enum": [
      2,
      "always",
      [
        "app",
        "rocafe",
        "locations",
        "services",
        "contact",
        "components",
        "hooks",
        "utils",
        "theme",
        "quality",
        "build",
        "deps"
      ]
    ],
    "subject-case": [2, "always", "sentence-case"],
    "header-max-length": [2, "always", 100]
  }
}
```

---

#### **Lint-Staged** (Run Linters on Staged Files)
**Status:** ⚠️ Not Currently Configured  
**Recommendation:** MEDIUM PRIORITY

**Why:**
- Only lints files being committed (faster)
- Reduces pre-commit hook time
- Allows incremental cleanup

**Installation:**
```bash
npm install --save-dev lint-staged
```

**Configuration:** Add to `package.json`
```json
{
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.css": [
      "stylelint --fix",
      "prettier --write"
    ],
    "*.md": [
      "prettier --write"
    ]
  }
}
```

**Update Husky pre-commit:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run check:quality
```

---

### Testing (Future)

#### **Vitest** (Testing Framework)
**Status:** ❌ Not Implemented  
**Recommendation:** HIGH PRIORITY (Future)

**Why:**
- Native Vite integration
- Fast test execution
- Jest-compatible API
- Built-in coverage reports

**Installation:**
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

**Configuration:** Update `vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
});
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

#### **React Testing Library**
**Status:** ❌ Not Implemented  
**Recommendation:** HIGH PRIORITY (Future)

**Why:**
- Best practices for testing React components
- Focuses on user behavior, not implementation
- Encourages accessible components

**Example Test:**
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

---

### Documentation Tools

#### **MarkdownLint**
**Status:** ⚠️ Not Currently Configured  
**Recommendation:** MEDIUM PRIORITY

**Why:**
- Enforces consistent markdown formatting
- Catches common markdown errors
- Improves documentation quality

**Installation:**
```bash
npm install --save-dev markdownlint-cli
```

**Configuration:** Create `.markdownlint.json`
```json
{
  "default": true,
  "MD013": { "line_length": 100 },
  "MD033": false,
  "MD041": false
}
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "docs:lint": "markdownlint '**/*.md' --ignore node_modules --ignore dist",
    "docs:fix": "markdownlint '**/*.md' --ignore node_modules --ignore dist --fix"
  }
}
```

---

#### **TypeDoc** (API Documentation)
**Status:** ❌ Not Applicable (No TypeScript)  
**Recommendation:** LOW PRIORITY

**Alternative for JavaScript:** JSDoc + documentation.js

```bash
npm install --save-dev documentation
```

**Generate HTML Docs:**
```bash
npx documentation build src/** -f html -o docs/api
```

---

### Dependency Management

#### **npm-check-updates**
**Status:** ⚠️ Manual Process  
**Recommendation:** LOW PRIORITY

**Why:**
- Easily check for outdated dependencies
- Update package.json safely
- Maintain current dependencies

**Installation:**
```bash
npm install -g npm-check-updates
```

**Usage:**
```bash
# Check for updates
ncu

# Update package.json
ncu -u

# Install updated dependencies
npm install
```

---

#### **Depcheck** (Find Unused Dependencies)
**Status:** ⚠️ Manual Process  
**Recommendation:** LOW PRIORITY

**Why:**
- Identifies unused dependencies
- Reduces bundle size
- Keeps package.json clean

**Installation:**
```bash
npm install -g depcheck
```

**Usage:**
```bash
depcheck
```

---

## 🔧 Editor Configuration

### VS Code Settings

**Recommended Extensions:**
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Stylelint (`stylelint.vscode-stylelint`)
- Markdown All in One (`yzhang.markdown-all-in-one`)
- EditorConfig (`editorconfig.editorconfig`)
- GitLens (`eamodio.gitlens`)
- Error Lens (`usernamehw.errorlens`)

**Workspace Settings:** Create `.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "stylelint.validate": [
    "css",
    "postcss"
  ],
  "[markdown]": {
    "editor.formatOnSave": true,
    "editor.wordWrap": "on"
  },
  "files.associations": {
    "*.css": "css"
  },
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single"
}
```

**Recommended Extensions List:** Create `.vscode/extensions.json`
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint",
    "yzhang.markdown-all-in-one",
    "editorconfig.editorconfig",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "github.copilot",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 🚀 CI/CD Enhancements

### GitHub Actions Workflows

#### **Quality Check Workflow**

Create `.github/workflows/quality.yml`
```yaml
name: Quality Checks

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run Stylelint
        run: npm run lint:css
      
      - name: Run Quality Checker
        run: npm run check:quality
      
      - name: Run Meta-Checker
        run: npm run check:integrity
      
      - name: Build
        run: npm run build
```

---

#### **Documentation Linting**

Create `.github/workflows/docs.yml`
```yaml
name: Documentation

on:
  pull_request:
    paths:
      - '**/*.md'
  push:
    branches: [main]
    paths:
      - '**/*.md'

jobs:
  lint-docs:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Lint Markdown
        uses: DavidAnson/markdownlint-cli2-action@v13
        with:
          globs: |
            **/*.md
            !node_modules
            !dist
```

---

## 📊 Monitoring & Analytics

### Bundle Analysis

**Rollup Plugin Visualizer:**
```bash
npm install --save-dev rollup-plugin-visualizer
```

Update `vite.config.js`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
});
```

---

## 📋 Implementation Priority

### Phase 1: Essential (Immediate)
1. ✅ **Prettier** - Code formatting consistency
2. ✅ **EditorConfig** - Editor consistency
3. ✅ **Husky** - Automated git hooks

### Phase 2: Quality (1-2 weeks)
4. ✅ **Commitlint** - Commit message enforcement
5. ✅ **Lint-Staged** - Faster pre-commit checks
6. ✅ **MarkdownLint** - Documentation quality

### Phase 3: Testing (1-2 months)
7. ⏳ **Vitest** - Unit testing framework
8. ⏳ **React Testing Library** - Component testing

### Phase 4: Advanced (As Needed)
9. ⏳ **Bundle Analyzer** - Performance monitoring
10. ⏳ **GitHub Actions** - CI/CD pipelines

---

## 🔄 Migration Path

### Step 1: Install Prettier
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

Create `.prettierrc.json` and `.prettierignore`

### Step 2: Format Existing Code
```bash
npm run format
```

Commit: `chore(tooling): add prettier and format codebase`

### Step 3: Setup EditorConfig
Create `.editorconfig`

Commit: `chore(tooling): add editorconfig`

### Step 4: Install Husky
```bash
npm install --save-dev husky
npx husky install
npm pkg set scripts.prepare="husky install"
```

Commit: `chore(tooling): add husky for git hooks`

### Step 5: Add Pre-Commit Hook
```bash
npx husky add .husky/pre-commit "npm run lint && npm run format:check && npm run check:quality"
```

Commit: `chore(tooling): add pre-commit quality checks`

### Step 6: Install Commitlint
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

Create `.commitlintrc.json`

Commit: `chore(tooling): enforce conventional commits`

### Step 7: Add Lint-Staged
```bash
npm install --save-dev lint-staged
```

Update `package.json` with lint-staged config

Update `.husky/pre-commit` to use lint-staged

Commit: `chore(tooling): add lint-staged for faster pre-commit`

---

## 📖 Resources

- [Prettier Documentation](https://prettier.io/docs/)
- [EditorConfig](https://editorconfig.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint](https://commitlint.js.org/)
- [Lint-Staged](https://github.com/okonet/lint-staged)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

---

## 💬 Questions?

- Review [CONTRIBUTING.md](../CONTRIBUTING.md)
- Check [Development Ethos](../docs/DEVELOPMENT_ETHOS.md)
- Open a discussion on GitHub

---

**Maintained by:** Roma Mart Development Team  
**Last Updated:** December 3, 2025  
**Status:** Living Document
