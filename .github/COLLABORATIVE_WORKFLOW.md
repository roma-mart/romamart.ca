# Collaborative Workflow Guide

## Branch Strategy

### Main Branches
- `main` - Production-ready code, protected branch
- Feature branches follow pattern: `feature/description`, `fix/description`, `docs/description`

### Branch Naming Convention
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring without behavior changes
- `perf/` - Performance improvements
- `test/` - Adding or updating tests

**Examples:**
- `feature/add-new-location`
- `fix/color-system-inversions`
- `docs/update-contributing-guide`
- `refactor/simplify-theme-utilities`

## Workflow Steps

### 1. Start New Work

```powershell
# Make sure main is up to date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code following project conventions (see `DEVELOPMENT_ETHOS.md`)
- Use design tokens from `src/design/tokens.js`
- Make small, atomic commits with clear messages

```powershell
git add <files>
git commit -m "Clear description of what changed"
```

### 3. Pre-Push Quality Checks

**Always run before pushing:**

```powershell
npm run check:all          # Lint + quality + integrity
npm run build              # Ensure build succeeds
```

Test manually:
- Light and dark modes
- Keyboard navigation
- Responsive breakpoints
- No console errors

### 4. Push and Create Pull Request

```powershell
# Push branch to remote
git push -u origin feature/your-feature-name
```

GitHub will provide a link to create a PR. Follow the PR template.

### 5. PR Review Process

**Author Responsibilities:**
- Fill out PR template completely
- Respond to review comments promptly
- Run quality checks after making requested changes
- Keep PR focused (one feature/fix per PR)

**Reviewer Responsibilities:**
- Check code follows project conventions
- Verify quality checks pass
- Test changes locally if needed
- Provide constructive feedback
- Approve when satisfied

### 6. Merge and Cleanup

Once approved:

```powershell
# Merge via GitHub UI (use "Squash and merge" for clean history)

# After merge, update local main and delete branch
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

## Commit Message Guidelines

Use imperative mood (as if completing the sentence "This commit will..."):

**Good:**
- `Fix inverted color usage in RoCafé section`
- `Add new location to locations.js`
- `Update dark mode CSS variables`
- `Refactor theme utilities for clarity`

**Avoid:**
- `Fixed bug` (not specific enough)
- `Updates` (too vague)
- `WIP` (don't commit work in progress to shared branches)

## PR Size Best Practices

- **Small PRs** (< 200 lines changed) - Preferred, easier to review
- **Medium PRs** (200-500 lines) - Acceptable if cohesive
- **Large PRs** (> 500 lines) - Avoid unless necessary, consider splitting

If a PR gets too large, break it into multiple smaller PRs.

## Handling Conflicts

```powershell
# Update your branch with latest main
git checkout feature/your-branch
git fetch origin
git rebase origin/main

# Resolve conflicts in your editor
# After resolving each file:
git add <resolved-file>
git rebase --continue

# Force push (safe because it's your feature branch)
git push --force-with-lease
```

## Emergency Hotfixes

For critical production bugs:

```powershell
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b fix/critical-issue

# Make minimal fix
# Test thoroughly
# Create PR with "HOTFIX:" prefix in title
# Get expedited review and merge
```

## Branch Protection Rules (Recommended)

Configure on GitHub:
- **Require pull request reviews** before merging
- **Require status checks** to pass (CI/CD when implemented)
- **Require branches to be up to date** before merging
- **Do not allow bypassing** the above settings
- **Require linear history** (squash merges)

## Communication

- Use PR descriptions to explain "why" not just "what"
- Tag teammates for review using `@username`
- Use GitHub discussions for questions
- Link related issues/PRs in PR description

## Tips for Remote Collaboration

1. **Pull before starting work** - Avoid conflicts by starting with latest code
2. **Push frequently** - Backup your work and share progress
3. **Small commits** - Easier to review and revert if needed
4. **Descriptive PR titles** - Team can understand changes at a glance
5. **Respond to reviews promptly** - Keep momentum going
6. **Ask questions** - If unclear about conventions, ask in PR comments

---

**Last Updated:** December 3, 2025  
**Maintained by:** GitHub Copilot
