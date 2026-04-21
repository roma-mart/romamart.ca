# Roma Mart 2.0 🔥

> Modern PWA for Sarnia's premier convenience store chain

[![React](https://img.shields.io/badge/React-18.3.1-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-green)](https://www.w3.org/TR/WCAG22/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📖 Documentation

- [Getting Started](./docs/guides/deployment.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Full Documentation](./docs/README.md)

## 🧩 Centralized Data & Navigation

All company info and navigation links are managed via:

- `src/config/company_data.js` — Single source of truth for brand, contact, GST, social links, order link
- `src/config/navigation.js` — Single source of truth for all navigation links (Navbar, Footer, Sitemap)

**Never use hardcoded URLs or company info in components/pages.**

**Pattern:**
```jsx
import COMPANY_DATA from '../config/company_data';
import { NAVIGATION_LINKS } from '../config/navigation';

// Example: Render navigation
{NAVIGATION_LINKS.filter(link => link.showIn.navbar).map(link => (
<a href={link.href}>{link.label}</a>
))}

// Example: Use company info
COMPANY_DATA.legalName
COMPANY_DATA.socialLinks.facebook
```

See [Architecture](./docs/ARCHITECTURE.md) and [Quality System](./docs/QUALITY_SYSTEM.md) for details.

## ✨ Features

- **Progressive Web App** - Installable, offline-capable
- **WCAG 2.2 AA Compliant** - Fully accessible
- **Dark Mode Native** - System preference detection
- **Multi-Location Management** - Store locator with geolocation
- **RoCafé Menu System** - Digital menu display
- **Real-time Analytics** - GTM with consent management

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18.3.1 | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| ESM Modules | JavaScript modules |

## 🌐 Environments

| Environment | URL |
|-------------|-----|
| Production | https://romamart.ca/ |
| Staging | https://roma-mart.github.io/romamart.ca/ |

## 📋 Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run check:all     # Run all quality checks
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

Before contributing, please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

## 🔒 Security

For security issues, please see our [Security Policy](./SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Live Site](https://romamart.ca)
- [Documentation](./docs/README.md)
- [Issue Tracker](https://github.com/roma-mart/romamart.ca/issues)
