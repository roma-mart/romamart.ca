# Branching Strategy & Git Workflow

> **Version:** 1.0  
> **Last Updated:** December 3, 2025  
> **Status:** Active

## Overview

This document defines the Git branching strategy and workflow for the Roma Mart 2.0 project. We follow a simplified Git Flow approach optimized for small teams with continuous deployment.

## Branch Structure

### Permanent Branches

#### `main`
- **Purpose:** Production-ready code
- **Protection:** Protected branch with required reviews
- **Deployment:** Auto-deploys to staging (GitHub Pages)
- **Merges from:** `feature/*`, `bugfix/*`, `hotfix/*` via PR only
- **Direct commits:** ❌ Not allowed

#### `develop` (Coming Soon)
- **Purpose:** Integration branch for ongoing work
- **Protection:** Protected with required checks
- **Merges from:** `feature/*`, `bugfix/*` branches
- **Merges to:** `main` via release PRs
- **Status:** Not yet implemented (direct to main for now)

### Temporary Branches

#### `feature/*`
**Purpose:** New features or enhancements

**Naming Convention:**
```
feature/<short-description>
feature/rocafe-menu-expansion
feature/location-search
feature/analytics-dashboard
```

**Lifecycle:**
```bash
# Create from main
git checkout main
git pull origin main
git checkout -b feature/your-feature

# Regular commits
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push origin feature/your-feature
# Open PR on GitHub

# After merge: Delete branch
git branch -d feature/your-feature
git push origin --delete feature/your-feature
```

**Branch Rules:**
- Branch from: `main`
- Merge to: `main` (via PR)
- Lifetime: Until feature complete and merged
- Delete: After successful merge

#### `bugfix/*`
**Purpose:** Non-urgent bug fixes

**Naming Convention:**
```
bugfix/<short-description>
bugfix/dark-mode-contrast
bugfix/location-hours-display
bugfix/mobile-menu-scroll
```

**Lifecycle:** Same as feature branches

#### `hotfix/*`
**Purpose:** Critical production fixes that can't wait

**Naming Convention:**
```
hotfix/<critical-issue>
hotfix/payment-gateway-down
hotfix/security-vulnerability
hotfix/site-crash
```

**Lifecycle:**
```bash
# Create from main (production)
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Quick fix
git add .
git commit -m "fix(scope)!: critical issue description"

# Immediate PR
git push origin hotfix/critical-issue
# Open PR with "HOTFIX" label
# Request expedited review

# After merge: Immediate deployment
```

**Branch Rules:**
- Branch from: `main`
- Merge to: `main` (via expedited PR)
- Review: Required but fast-tracked
- Deployment: Immediate after merge
- Lifetime: < 24 hours ideally

#### `docs/*`
**Purpose:** Documentation-only changes

**Naming Convention:**
```
docs/<area-or-doc>
docs/readme-enhancement
docs/api-documentation
docs/contributing-guide
```

**Branch Rules:**
- Branch from: `main`
- Merge to: `main` (via PR)
- Review: Optional for minor docs, required for major restructuring
- CI: Markdown linting must pass

#### `chore/*`
**Purpose:** Maintenance, dependency updates, tooling

**Naming Convention:**
```
chore/<task-description>
chore/dependency-updates
chore/eslint-config
chore/ci-optimization
```

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(rocafe): add nutritional info display` |
| `fix` | Bug fix | `fix(locations): correct timezone handling` |
| `docs` | Documentation only | `docs(readme): update installation steps` |
| `style` | Code style/formatting | `style(app): format with prettier` |
| `refactor` | Code restructuring | `refactor(theme): consolidate color utilities` |
| `perf` | Performance improvement | `perf(images): implement lazy loading` |
| `test` | Adding/updating tests | `test(utils): add theme utility tests` |
| `build` | Build system changes | `build(vite): update config for production` |
| `ci` | CI/CD changes | `ci(github): add docs linting workflow` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `revert` | Revert previous commit | `revert: feat(rocafe): remove nutritional info` |

### Breaking Changes
```
feat(api)!: change contact form endpoint

BREAKING CHANGE: Contact form now uses Web3Forms API.
Migration: Update VITE_WEB3FORMS_KEY environment variable.
```

### Examples

#### Good Commits ✅
```bash
feat(rocafe): add menu item customization options
fix(navbar): resolve mobile menu z-index issue
docs(contributing): add branching strategy guide
style(components): apply consistent formatting
refactor(locations): extract map logic to custom hook
perf(app): lazy load route components
test(theme): add dark mode utility tests
chore(deps): update react to 19.0.1
```

#### Bad Commits ❌
```bash
fixed stuff               # Not descriptive
WIP                       # Don't commit WIP to main branches
update                    # What was updated?
changes                   # What changed?
asdfasdf                  # Not a real message
```

## Pull Request Workflow

### 1. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature
```

### 2. Make Changes
```bash
# Make your changes
git add .
git commit -m "feat(scope): description"

# Push frequently
git push origin feature/your-feature
```

### 3. Keep Branch Updated
```bash
# Regularly sync with main
git checkout main
git pull origin main
git checkout feature/your-feature
git rebase main  # or merge main

# Resolve any conflicts
git push origin feature/your-feature --force-with-lease
```

### 4. Pre-PR Checklist
Before opening a PR, ensure:

- [ ] `npm run check:all` passes
- [ ] `npm run build` succeeds
- [ ] All commits follow conventional commit format
- [ ] Code is self-documented or has JSDoc comments
- [ ] No console.log statements in production code
- [ ] No secrets or API keys in code
- [ ] Changes tested in light AND dark mode
- [ ] Mobile responsive design verified
- [ ] Keyboard navigation works
- [ ] Documentation updated if needed

### 5. Create Pull Request
Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md):

**Title Format:**
```
<type>(<scope>): Brief description
```

**Examples:**
- `feat(rocafe): add nutritional information display`
- `fix(locations): correct opening hours timezone`
- `docs(readme): enhance installation instructions`

### 6. Code Review Process

**Automated Checks:**
- ESLint (code quality)
- Stylelint (CSS quality)
- Universal quality checker (1000+ rules)
- Build verification
- Bundle size check

**Review Requirements:**
- ✅ 1 approval required for most PRs
- ✅ 2 approvals for major architectural changes
- ✅ All CI checks must pass
- ✅ No unresolved conversations

**Review Timeline:**
- **Feature/Bugfix:** 24-48 hours
- **Hotfix:** < 4 hours (expedited)
- **Docs:** 12-24 hours

### 7. Addressing Feedback
```bash
# Make requested changes
git add .
git commit -m "refactor(component): address review feedback"
git push origin feature/your-feature

# Re-request review on GitHub
```

### 8. Merge Strategy

**Squash and Merge (Default):**
- Combines all commits into one
- Keeps main branch history clean
- Use for feature branches with many commits

**Rebase and Merge:**
- Preserves individual commits
- Use for well-structured commit history
- Good for hotfixes with single commit

**Merge Commit:**
- ❌ Generally not used
- Creates extra merge commits

### 9. Post-Merge Cleanup
```bash
# Update local main
git checkout main
git pull origin main

# Delete feature branch
git branch -d feature/your-feature
git push origin --delete feature/your-feature
```

## Branch Protection Rules

### `main` Branch Protection

**Settings:**
- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale reviews when new commits pushed
- ✅ Require status checks to pass
  - ESLint
  - Quality Checker
  - Build
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ❌ Allow force pushes: Never
- ❌ Allow deletions: Never

**Who can merge:**
- Project maintainers
- Contributors with write access (after approval)

## Special Scenarios

### Large Features (Multi-Week Work)

**Option 1: Long-Lived Feature Branch**
```bash
# Create feature branch
git checkout -b feature/large-feature

# Create sub-branches for components
git checkout -b feature/large-feature-component-a
# ... work and merge back to feature/large-feature

# When complete, merge feature/large-feature to main
```

**Option 2: Feature Flags**
```jsx
// Merge incomplete features behind flags
const ENABLE_NEW_FEATURE = import.meta.env.VITE_ENABLE_NEW_FEATURE === 'true';

function Component() {
  return ENABLE_NEW_FEATURE ? <NewFeature /> : <OldFeature />;
}
```

### Collaborative Features

**Multiple Contributors on Same Feature:**
```bash
# Create shared feature branch
git checkout -b feature/shared-feature

# Each contributor creates sub-branch
git checkout -b feature/shared-feature-contributor-a
# ... work

# PR to feature/shared-feature (not main)
# After all work done, PR feature/shared-feature to main
```

### Emergency Hotfixes

**Critical Production Issue:**
```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Fix and test immediately
# ... make fix

# Commit with urgency indication
git commit -m "fix(critical)!: resolve payment processing failure"

# Push and open PR with HOTFIX label
git push origin hotfix/critical-issue

# Tag maintainers for immediate review
# After merge, verify in production immediately
```

## Release Process

### Version Numbering
Follow [Semantic Versioning](https://semver.org/):

**Format:** `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes (2.0.0 → 3.0.0)
- **MINOR:** New features, backwards-compatible (2.1.0 → 2.2.0)
- **PATCH:** Bug fixes, backwards-compatible (2.1.0 → 2.1.1)

### Release Workflow

**1. Prepare Release**
```bash
# Update CHANGELOG.md
# Update version in package.json
# Update version in docs

git add .
git commit -m "chore(release): prepare v2.1.0"
```

**2. Create Release Tag**
```bash
git tag -a v2.1.0 -m "Release version 2.1.0"
git push origin v2.1.0
```

**3. GitHub Release**
- Create release on GitHub
- Use CHANGELOG content for release notes
- Attach build artifacts if needed

**4. Production Deployment**
```bash
# Update vite.config.js base path
# Deploy to production
# Verify analytics and functionality
```

## Git Hooks (Recommended)

### Pre-Commit Hook
```bash
#!/bin/sh
# .husky/pre-commit

npm run lint
npm run check:quality
```

### Commit Message Hook
```bash
#!/bin/sh
# .husky/commit-msg

# Validate conventional commit format
npx --no-install commitlint --edit "$1"
```

### Pre-Push Hook
```bash
#!/bin/sh
# .husky/pre-push

npm run check:all
npm run build
```

**Setup Husky:**
```bash
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional
npx husky install
npx husky add .husky/pre-commit "npm run check:quality"
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

## Best Practices

### DO ✅
- Keep branches short-lived (< 1 week)
- Commit frequently with meaningful messages
- Rebase before creating PR to avoid conflicts
- Write descriptive PR descriptions
- Respond to review comments promptly
- Delete branches after merge
- Keep commits atomic (one logical change)
- Test thoroughly before pushing

### DON'T ❌
- Force push to `main` (protected anyway)
- Commit directly to `main`
- Create mega-PRs (> 500 lines)
- Leave stale branches
- Ignore CI failures
- Merge without review (except hotfixes)
- Commit secrets or API keys
- Use generic commit messages

## Troubleshooting

### Merge Conflicts
```bash
# Update your branch with main
git checkout feature/your-branch
git fetch origin
git rebase origin/main

# If conflicts occur
# 1. Fix conflicts in editor
# 2. Mark as resolved
git add <conflicted-files>
git rebase --continue

# Push with force-with-lease
git push origin feature/your-branch --force-with-lease
```

### Accidentally Committed to Wrong Branch
```bash
# Move commits to new branch
git checkout -b feature/correct-branch
git push origin feature/correct-branch

# Reset old branch
git checkout wrong-branch
git reset --hard origin/wrong-branch
```

### Need to Update Branch After Review
```bash
# Make changes
git add .
git commit --amend  # Amend last commit if appropriate
# OR
git commit -m "fix: address review comments"

git push origin feature/your-branch --force-with-lease
```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## Questions?

- Review [CONTRIBUTING.md](../CONTRIBUTING.md)
- Check [Development Ethos](../DEVELOPMENT_ETHOS.md)
- Open a discussion on GitHub

---

**Maintained by:** Roma Mart Development Team  
**Version:** 1.0  
**Last Updated:** December 3, 2025
