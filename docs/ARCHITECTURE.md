# Roma Mart 2.0 - System Architecture

> **Last Updated:** February 4, 2026  
> **Version:** 2.0 (React 19 + Vite 7)

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [Data Flow & API Integration](#data-flow--api-integration)
6. [Routing System](#routing-system)
7. [Theming & Design Tokens](#theming--design-tokens)
8. [Schema Builder System](#schema-builder-system)
9. [Build & Deployment](#build--deployment)
10. [Quality System](#quality-system)

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0 | UI framework with modern hooks |
| **Vite** | 7.0 | Lightning-fast build tool & dev server |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Framer Motion** | 11.x | Animation library |
| **react-helmet-async** | 2.x | SEO meta tag management |

### Key Libraries

- **Lucide React** - Icon system (specific imports only)
- **Font Awesome** - Supplementary icons
- **DOMPurify** - XSS sanitization
- **Google Maps API** - Location integration
- **Web3Forms API** - Contact form backend

### Development Tools

- **ESLint** - Code linting (React + accessibility rules)
- **Stylelint** - CSS linting
- **Vitest** - Unit testing framework
- **Custom Quality Checkers** - Multi-dimensional validation

---

## Project Structure

```
romamart.ca/
├── src/
│   ├── main.jsx                    # Application entry point
│   ├── App.jsx                     # Root component with routing
│   ├── index.css                   # Global styles + CSS variables
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── HCaptchaWidget.jsx
│   │   ├── LazyImage.jsx
│   │   ├── StandardizedItem.jsx   # Menu/service item display
│   │   └── CurrentLocalTime.jsx
│   │
│   ├── pages/                      # Route components (lazy loaded)
│   │   ├── HomePage.jsx
│   │   ├── RoCafePage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── LocationsPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── [legal pages]
│   │
│   ├── config/                     # Configuration (SSOT)
│   │   ├── company_data.js         # Company info, contact, GST, social
│   │   └── navigation.js           # All navigation links
│   │
│   ├── data/                       # Static data files
│   │   ├── locations.js            # All store locations
│   │   ├── services.js             # Services array
│   │   └── rocafe-menu.js          # Menu items
│   │
│   ├── schemas/                    # Schema.org JSON-LD builders
│   │   ├── menuItemSchema.js
│   │   ├── breadcrumbSchema.js
│   │   ├── webApplicationSchema.js
│   │   ├── returnPolicySchema.js
│   │   └── privacyPolicySchema.js
│   │
│   ├── contexts/                   # React Context providers
│   │   └── LocationContext.jsx     # Selected location state
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAppBadge.js
│   │   ├── useAutoLocation.js
│   │   ├── useBrowserFeatures.js
│   │   ├── useColorScheme.js
│   │   ├── useExcelMenu.js
│   │   ├── useGooglePlaceHours.js
│   │   ├── useIntersectionObserver.js
│   │   ├── useLocationContext.js
│   │   └── useServiceWorker.js
│   │
│   ├── utils/                      # Utility functions
│   │   ├── theme.js                # Theme utilities
│   │   ├── timeFormat.js           # Time formatting
│   │   ├── availability.js         # Availability logic
│   │   ├── sanitize.js             # Input sanitization
│   │   └── apiCircuitBreaker.js    # API protection
│   │
│   ├── design/                     # Design system
│   │   └── tokens.js               # Design tokens (SSOT)
│   │
│   ├── assets/                     # Static assets
│   │   └── [images, fonts]
│   │
│   └── test/                       # Test files
│       └── schemas/                # Schema tests
│
├── public/                         # Static public files
│   ├── manifest.webmanifest        # PWA manifest
│   ├── sw.js                       # Service worker
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── icons.json                  # Maskable icons metadata
│   └── [icon files]
│
├── scripts/                        # Build & quality scripts
│   ├── prerender.js                # Static HTML generation
│   ├── check-quality.js            # Universal quality checker
│   └── check-checker-integrity.js  # Meta-checker
│
├── docs/                           # Documentation
├── .github/                        # GitHub config
└── [config files]                  # ESLint, Vite, PostCSS, etc.
```

---

## Component Architecture

### Component Categories

#### 1. **Layout Components**
- `Navbar.jsx` - Top navigation with mobile hamburger menu
- `Footer.jsx` - Site footer with location selector, links, reviews
- Uses `config/navigation.js` for all links (SSOT)

#### 2. **Page Components**
- Lazy loaded via `React.lazy()`
- Each page includes `<Helmet>` for SEO
- Follow pattern: SEO metadata → main content → structured data

**Example Pattern:**
```jsx
import { Helmet } from 'react-helmet-async';
import { lazy } from 'react';

const Page = lazy(() => import('./pages/SomePage'));

// In SomePage.jsx:
function SomePage() {
  return (
    <>
      <Helmet>
        <title>Page Title | Roma Mart</title>
        <meta name="description" content="..." />
        <link rel="canonical" href="https://romamart.ca/page" />
      </Helmet>
      
      {/* Page content */}
      
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </>
  );
}
```

#### 3. **Utility Components**
- `StandardizedItem.jsx` - Displays menu items, services with availability
- `LazyImage.jsx` - Lazy-loaded images with fallback
- `HCaptchaWidget.jsx` - Reusable hCaptcha integration
- `CurrentLocalTime.jsx` - Live clock for selected location

#### 4. **Schema Components**
All schema builders in `src/schemas/`:
- Import data from SSOT (services.js, locations.js, rocafe-menu.js)
- Generate valid Schema.org JSON-LD
- Unit tested with Vitest (83 tests passing)

---

## State Management

### Approach: Minimal State with Context

**No Redux/Zustand** - Project uses React Context for shared state

### LocationContext
**Purpose:** Track selected location across components

**Provider:** Wraps entire app in `App.jsx`

**Usage:**
```jsx
import { useLocation } from './contexts/LocationContext';

function Component() {
  const { selectedLocation, setSelectedLocation } = useLocation();
  
  return (
    <select value={selectedLocation?.id} onChange={handleChange}>
      {locations.map(loc => <option key={loc.id}>{loc.name}</option>)}
    </select>
  );
}
```

### Local State Patterns
- Component state with `useState` for UI-only concerns
- `useEffect` for side effects (API calls, event listeners)
- Custom hooks for reusable stateful logic

---

## Data Flow & API Integration

### Single Source of Truth (SSOT)

**Configuration:**
- `config/company_data.js` - Company info, contact, GST, social links
- `config/navigation.js` - All navigation links

**Data:**
- `data/locations.js` - All store locations
- `data/services.js` - Services array
- `data/rocafe-menu.js` - Menu items

**Design:**
- `design/tokens.js` - Colors, spacing, typography

### API Integrations

#### 1. **Google Places API**
**Hook:** `useGooglePlaceHours.js`

**Features:**
- Fetches live hours, rating, review count
- Circuit breaker protection
- 1-hour cache (IndexedDB)
- Graceful fallback to static data

**Circuit Breaker:**
- Monitors 429/403/402 errors
- Stops after 5 failures
- Auto-resets after 1 hour
- Fail-fast pattern

#### 2. **Web3Forms API**
**Integration:** `ContactPage.jsx`

**Features:**
- Contact form submission
- Email notifications
- Offline queue (IndexedDB)
- hCaptcha verification

#### 3. **Excel Online (Future)**
**Hook:** `useExcelMenu.js`

**Status:** Implemented but not active
- Fetches menu from Excel Online
- Parses rows into structured data
- Ready for when Toolpad API available

### Data Flow Pattern

```
User Action
    ↓
Component Event Handler
    ↓
API Call (if needed) → Circuit Breaker → Cache Check
    ↓                       ↓                ↓
Update State          Fail Fast         Return Cached
    ↓                       ↓                ↓
Re-render            Fallback UI      Skip API Call
```

---

## Routing System

### Client-Side Routing

**Implementation:** Pathname matching in `App.jsx`

**Pattern:**
```jsx
const path = window.location.pathname.replace(BASE_PATH, '') || '/';

let content;
if (path === '/') content = <HomePage />;
else if (path === '/rocafe') content = <RoCafePage />;
else if (path === '/services') content = <ServicesPage />;
// ... etc
```

### Base Path Handling

**Development:** `/` (root)
**Staging (GitHub Pages):** `/romamart.ca/`
**Production:** `/` (custom domain)

**Configuration:** `vite.config.js`
```javascript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/romamart.ca/'  // Change to '/' after production cutover
    : '/'
});
```

### Prerendering

**Script:** `scripts/prerender.js`

**Process:**
1. Import route components
2. Render each to static HTML
3. Save to `dist/[route]/index.html`
4. Enables direct URL access + SEO

**Routes:**
- `/` → `dist/index.html`
- `/rocafe` → `dist/rocafe/index.html`
- `/services` → `dist/services/index.html`
- etc.

---

## Theming & Design Tokens

### Design Token System

**File:** `src/design/tokens.js`

**Structure:**
```javascript
export const DESIGN_TOKENS = {
  colors: {
    primary: { light: '#020178', dark: '#4444ff' },
    secondary: { light: '#c8102e', dark: '#ff4466' },
    // ...
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  typography: { fontFamily: "'Inter', sans-serif", ... },
  // ...
};
```

### CSS Variables

**File:** `src/index.css`

**Pattern:**
```css
:root {
  --color-primary: #020178;
  --color-text: #1a1a1a;
  --color-surface: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #4444ff;
    --color-text: #e5e5e5;
    --color-surface: #1a1a1a;
  }
}
```

### Theme Utilities

**File:** `src/utils/theme.js`

**Functions:**
- `useThemeColors()` - Returns theme-aware color objects
- `CSS_VARS` - Direct CSS variable access
- `getSystemTheme()` - Detect system preference

**Usage:**
```jsx
import { useThemeColors, CSS_VARS } from '../utils/theme';

// Hook approach (reactive)
const { text, surface, primary } = useThemeColors();
<div style={surface}>
  <h1 style={text}>Title</h1>
</div>

// Direct approach (static)
<div style={{ color: CSS_VARS.text }}>Content</div>
```

---

## Schema Builder System

### Architecture

**Location:** `src/schemas/`

**Philosophy:** Import data from SSOT, generate valid Schema.org JSON-LD

### Schema Builders

#### 1. **menuItemSchema.js**
- Generates `Product` schemas for menu items
- Sources: `rocafe-menu.js`
- Properties: name, description, price, image, availability

#### 2. **breadcrumbSchema.js**
- Generates `BreadcrumbList` for navigation
- Provides search engine context
- On all 10 pages

#### 3. **webApplicationSchema.js**
- Advertises PWA capabilities
- Homepage only
- Properties: name, url, browserRequirements, installUrl

#### 4. **returnPolicySchema.js** & **privacyPolicySchema.js**
- Legal page schemas
- References company data from `config/company_data.js`

### Testing

**Framework:** Vitest

**Coverage:** 83/83 tests passing

**Pattern:**
```javascript
import { describe, it, expect } from 'vitest';
import { createMenuItemSchema } from './menuItemSchema';

describe('menuItemSchema', () => {
  it('generates valid Product schema', () => {
    const schema = createMenuItemSchema(menuItem);
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe('Hot Coffee');
    // ...
  });
});
```

---

## Build & Deployment

### Build Process

**Command:** `npm run build`

**Steps:**
1. Vite bundles React app
2. Manual chunks: react-vendor, icons, motion
3. Prerender script generates static HTML
4. Output: `dist/` directory

**Chunk Strategy:**
```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'icons': ['lucide-react', '@fortawesome/fontawesome-svg-core'],
        'motion': ['framer-motion']
      }
    }
  }
}
```

### Quality Preflight

**Before build, run:**
```bash
npm run check:all  # Lint + quality + integrity
```

**Automated checks:**
- ESLint (0 errors required)
- Stylelint (CSS validation)
- Universal quality checker (1000+ rules)
- Meta-checker (validates quality system)

### Deployment Targets

#### Staging (GitHub Pages)
- **URL:** `https://roma-mart.github.io/romamart.ca/`
- **Base path:** `/romamart.ca/`
- **Deploy:** `npm run deploy` (gh-pages branch)
- **Auto-deploy:** GitHub Actions on push

#### Production (Custom Domain)
- **URL:** `https://romamart.ca/`
- **Base path:** `/`
- **Host:** TBD (after cutover)
- **Change required:** Update `base` in `vite.config.js`

### Environment Variables

**Required:**
- `VITE_WEB3FORMS_KEY` - Contact form API key
- `VITE_GOOGLE_MAPS_API_KEY` - Maps API (optional, can use key from locations.js)

**Optional:**
- `VITE_ENABLE_NEW_FEATURE` - Feature flags

---

## Quality System

### Multi-Layer Architecture

#### Layer 1: Editor Integration
- ESLint + extensions in VS Code
- Real-time feedback while coding
- Auto-fix on save

#### Layer 2: Development Scripts
- `npm run check:quality` - Universal checker (1000+ rules)
- `npm run check:integrity` - Meta-checker
- 8 quality dimensions: accessibility, dark mode, performance, security, SEO, code quality, responsive, browser compatibility

#### Layer 3: Git Hooks (Future)
- Pre-commit: Dark mode check
- Pre-push: Full quality suite
- Blocks bad commits

#### Layer 4: CI/CD (Future)
- GitHub Actions workflow
- Build + quality checks
- Deploy only if passing

### Quality Dimensions

1. **Accessibility** - WCAG 2.2 AA compliance
2. **Dark Mode** - No hardcoded colors, proper contrast
3. **Performance** - Bundle size, lazy loading
4. **Security** - No secrets, XSS prevention
5. **SEO** - Meta tags, structured data
6. **Code Quality** - No console.log, modern patterns
7. **Responsive** - Mobile-first breakpoints
8. **Browser Compatibility** - Modern features with fallbacks

---

## Conventions & Best Practices

### Data Sourcing Rules

**Company HQ & Info:**
- **MUST** use `config/company_data.js` (`COMPANY_DATA`)
- **NEVER** hardcode company name, address, phone, GST, social links
- Single source of truth for brand consistency

**Navigation Links:**
- **MUST** use `config/navigation.js` (`NAVIGATION_LINKS`)
- **NEVER** hardcode URLs in components
- Centralized management enables easy updates

**Location Data:**
- **MUST** use `data/locations.js`
- API integrations supplement, never replace
- Fallback to static data if API fails

### Component Patterns

**DO:**
- ✅ Use functional components with hooks
- ✅ Lazy load pages with `React.lazy()`
- ✅ Include `<Helmet>` on all pages
- ✅ Use CSS variables for colors
- ✅ Import specific icons: `import { Home } from 'lucide-react'`

**DON'T:**
- ❌ Use class components
- ❌ Hardcode colors or URLs
- ❌ Wildcard imports: `import * as Icons`
- ❌ Skip accessibility attributes
- ❌ Forget SEO meta tags

### File Naming

- Components: `PascalCase.jsx`
- Utilities: `camelCase.js`
- Data: `kebab-case.js`
- Configs: `snake_case.js` or `kebab-case.js`

---

## Related Documentation

- [Development Ethos](./DEVELOPMENT_ETHOS.md) - 25 core principles
- [Quality System](./QUALITY_SYSTEM.md) - Comprehensive quality standards
- [Structured Data Master Plan](./STRUCTURED_DATA_MASTER_PLAN.md) - SEO schema roadmap
- [Component System](./architecture/component-system.md) - Component details
- [Data Management](./architecture/data-management.md) - Data flow patterns
- [Circuit Breaker Pattern](./architecture/circuit-breaker-pattern.md) - API protection

---

**Last Updated:** February 4, 2026  
**Maintained By:** Roma Mart Development Team  
**Status:** Living Document