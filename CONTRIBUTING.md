# Contributing Guide

## Workflow
- Use feature branches: feature/<short-name>
- Small atomic commits with clear messages
- Open PRs with description, checklist, and screenshots if UI
- Require one review; CI must pass (quality + build)

## Setup
- Install Node LTS via nvm (use 24.x or latest LTS)
- npm install
- npm run check:quality
- npm run build

## Code Style
- React functional components; hooks for state/effects
- CSS variables for colors; follow tokens in `src/design/tokens.js`
- Accessibility: ARIA, focus states, skip links
- Comments: explain why, not what; keep concise

## Testing
- Run npm run check:quality before PR
- Smoke test pages: home, services, rocafe, locations, contact, about, accessibility

## Commit Messages
- Imperative style: "Fix footer selection logic"
- Include context and scope if needed

## PR Checklist
- [ ] Builds locally
- [ ] Passes quality checks
- [ ] Docs updated if needed
- [ ] No secrets in code