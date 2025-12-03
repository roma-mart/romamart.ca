# Routing Architecture

> Client-side routing patterns in Roma Mart

## Overview

Roma Mart uses client-side routing with pathname matching in `App.jsx`, combined with static site generation (SSG) via Vite.

## Route Configuration

### App.jsx Routing

```jsx
function App() {
  const pathname = window.location.pathname;
  const basePath = import.meta.env.BASE_URL;
  
  // Normalize path
  const normalizedPath = pathname.replace(basePath, '/');
  
  // Route matching
  const renderPage = () => {
    switch (normalizedPath) {
      case '/':
        return <HomePage />;
      case '/services':
        return <ServicesPage />;
      case '/rocafe':
        return <RoCafePage />;
      case '/locations':
        return <LocationsPage />;
      case '/contact':
        return <ContactPage />;
      case '/about':
        return <AboutPage />;
      case '/accessibility':
        return <AccessibilityPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/cookies':
        return <CookiesPage />;
      default:
        return <NotFoundPage />;
    }
  };
  
  return (
    <div>
      <Navbar />
      <main>
        <Suspense fallback={<Loading />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Main landing page |
| `/services` | ServicesPage | Services overview |
| `/rocafe` | RoCafePage | RoCafé menu |
| `/locations` | LocationsPage | Store locations |
| `/contact` | ContactPage | Contact form |
| `/about` | AboutPage | About Roma Mart |
| `/accessibility` | AccessibilityPage | A11y statement |
| `/privacy` | PrivacyPage | Privacy policy |
| `/terms` | TermsPage | Terms of service |
| `/cookies` | CookiesPage | Cookie policy |

## Base Path Configuration

### Vite Config

```javascript
// vite.config.js
export default defineConfig({
  base: '/romamart.ca/', // GitHub Pages subpath
  // base: '/',          // Production domain
});
```

### Usage in Code

```jsx
// Get base URL
const basePath = import.meta.env.BASE_URL;

// Build link
<a href={`${basePath}services`}>Services</a>
```

## Prerendering

### SSG Script

**File:** `scripts/prerender.js`

Routes are prerendered at build time:

```javascript
const routes = [
  '/',
  '/services',
  '/rocafe',
  '/locations',
  '/contact',
  '/about',
  '/accessibility',
  '/privacy',
  '/terms',
  '/cookies',
];
```

### Output Structure

```
dist/
├── index.html          # /
├── services/
│   └── index.html      # /services
├── rocafe/
│   └── index.html      # /rocafe
├── locations/
│   └── index.html      # /locations
└── ...
```

## Navigation

### Internal Links

Use the Navbar component for navigation:

```jsx
<nav>
  <a href={`${basePath}`}>Home</a>
  <a href={`${basePath}services`}>Services</a>
  <a href={`${basePath}rocafe`}>RoCafé</a>
</nav>
```

### Programmatic Navigation

```javascript
// Redirect
window.location.href = `${basePath}contact`;

// Replace (no history entry)
window.location.replace(`${basePath}404`);
```

## Adding New Routes

1. Create page component in `src/pages/`
2. Add lazy import in `App.jsx`
3. Add case to route switch
4. Add path to `scripts/prerender.js`
5. Add link to Navbar/Footer as needed
6. Test prerendering

---

**Related:** [Component System](./component-system.md) | [Deployment](../guides/deployment.md)
