# 📚 Roma Mart Documentation

> Comprehensive documentation for the Roma Mart 2.0 progressive web app

## 📖 Quick Navigation

### Getting Started

- [Main README](../README.md) - Project overview and quick start
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- [Architecture](./ARCHITECTURE.md) - System design overview
- [Development Ethos](./DEVELOPMENT_ETHOS.md) - Core principles
- [Quality System](./QUALITY_SYSTEM.md) - Universal quality standards
- [Dark Mode System](./DARK_MODE_SYSTEM.md) - Dark mode implementation

### System Documentation

| Document | Description |
|----------|-------------|
| [Accessibility Compliance](./ACCESSIBILITY_COMPLIANCE.md) | WCAG 2.2 AA compliance details |
| [Content Guide](./CONTENT_GUIDE.md) | Content creation standards |
| [Deployment Guide](./DEPLOYMENT_GUIDE.md) | Deployment procedures |
| [Meta-Checker System](./META_CHECKER_SYSTEM.md) | Quality checker validation |
| [Release Checklist](./RELEASE_CHECKLIST.md) | Pre-release verification |
| [Structured Data Master Plan](./archive/STRUCTURED_DATA_MASTER_PLAN.md) | SEO schema implementation (archived) |
| [Financial Case](./FINANCIAL_CASE.md) | Website valuation & ROI analysis |

### Guides

| Guide | Description |
|-------|-------------|
| [Deployment](./guides/deployment.md) | CI/CD and deployment procedures |
| [Quality System](./guides/quality-system.md) | Quality assurance standards |
| [Dark Mode](./guides/dark-mode.md) | Theme system implementation |
| [Accessibility](./guides/accessibility.md) | WCAG 2.2 compliance guide |
| [Testing](./guides/testing.md) | Testing strategies and workflows |
| [Troubleshooting](./guides/troubleshooting.md) | Common issues and solutions |

### Content Creation

| Guide | Description |
|-------|-------------|
| [Content Standards](./content/content-standards.md) | Content guidelines |
| [Store Photography](./content/store-photography.md) | Store photo guidelines |
| [Menu Photography](./content/menu-photography.md) | RoCafé menu photo guidelines |
| [Photo Placement](./content/photo-placement.md) | Image placement guide |
| [RoCafé Menu Template](./content/rocafe-menu-template.md) | Menu data template |

### Architecture

| Document | Description |
|----------|-------------|
| [Component System](./architecture/component-system.md) | Component architecture |
| [Data Management](./architecture/data-management.md) | Location & data systems |
| [Theming & Tokens](./architecture/theming-tokens.md) | Design token system |
| [Routing](./architecture/routing.md) | Client-side routing |
| [Quality Checkers](./architecture/quality-checkers.md) | Meta-checker system |
| [Circuit Breaker Pattern](./architecture/circuit-breaker-pattern.md) | API protection strategy |
| [Availability & Live Data System](./architecture/availability-live-data-system.md) | Live data with static fallback |

### Checklists

| Checklist | Description |
|-----------|-------------|
| [Release Checklist](./checklists/release-checklist.md) | Pre-release verification |
| [Accessibility Audit](./checklists/accessibility-audit.md) | A11y audit checklist |
| [Pre-Deployment](./checklists/pre-deployment.md) | Deployment verification |

### Archive

Historical implementation documents preserved for reference:

- [Archive Index](./archive/README.md)

## 🏗️ Documentation Structure

```
docs/
├── README.md                           # This file - documentation index
├── ARCHITECTURE.md                     # System design overview
├── DEVELOPMENT_ETHOS.md                # 25 core development principles
├── QUALITY_SYSTEM.md                   # Universal quality standards
├── DARK_MODE_SYSTEM.md                 # Dark mode implementation
├── ACCESSIBILITY_COMPLIANCE.md         # WCAG 2.2 AA compliance
├── CONTENT_GUIDE.md                    # Content creation standards
├── DEPLOYMENT_GUIDE.md                 # Deployment procedures
├── META_CHECKER_SYSTEM.md              # Meta-checker validation
├── RELEASE_CHECKLIST.md                # Pre-release verification
├── FINANCIAL_CASE.md                   # Website valuation & ROI
├── guides/                             # User & developer guides
├── content/                            # Content creation guides
├── architecture/                       # Deep technical documentation
├── checklists/                         # Operational checklists
├── implementation-notes/               # Development session notes
├── updates/                            # Project updates & releases
└── archive/                            # Historical/completed docs
    ├── ROADMAP.md                      # Sprint plan (completed)
    ├── EXPERT_AUDIT_FEB_2026.md        # Audit findings (completed)
    ├── STRUCTURED_DATA_MASTER_PLAN.md  # SEO schema roadmap (completed)
    └── [other archived docs]
```

## 📝 Documentation Standards

### File Naming

- Use lowercase with hyphens: `quality-system.md`
- Be descriptive but concise
- Use `.md` extension for all documentation

### Content Format

- Start with H1 title
- Include brief description
- Use markdown tables for structured data
- Include code examples where applicable

### Code Example Compliance

- **All code examples must use centralized config:**
  - Navigation: `import { NAVIGATION_LINKS } from '../config/navigation'`
  - Company info: `import COMPANY_DATA from '../config/company_data'`
- **Do not use hardcoded URLs, company names, or social links.**
- **Breadcrumbs and canonical links may be page-specific, but navigation and company info must always use config.**

**Example (Compliant):**

```jsx
import { NAVIGATION_LINKS } from '../config/navigation';
import COMPANY_DATA from '../config/company_data';

<nav>
  {NAVIGATION_LINKS.filter(link => link.showIn.navbar).map(link => (
    <a href={link.href}>{link.label}</a>
  ))}
</nav>

<footer>
  <span>{COMPANY_DATA.legalName}</span>
</footer>
```

- Link to related documentation

### Updates

- Keep documentation current with code changes
- Date major updates in document footer
- Archive rather than delete outdated content

## 🔗 Quick Links

- **Repository:** [github.com/roma-mart/romamart.ca](https://github.com/roma-mart/romamart.ca)
- **Live Site:** [romamart.ca](https://romamart.ca)
- **Staging:** [roma-mart.github.io/romamart.ca](https://roma-mart.github.io/romamart.ca/)

---

**Last Updated:** February 4, 2026
