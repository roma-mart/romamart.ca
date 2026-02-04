# Component System Architecture

> Technical documentation for Roma Mart component architecture

## Overview

Roma Mart uses a React 19 functional component architecture with hooks for state management and side effects.

## Directory Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route-level page components
├── hooks/           # Custom React hooks
├── contexts/        # React context providers
├── data/            # Static data (locations, menu)
├── design/          # Design tokens and theme
└── utils/           # Utility functions
```

## Component Categories

### Page Components (`src/pages/`)

Full page layouts that correspond to routes:

- `AboutPage.jsx`
- `ContactPage.jsx`
- `LocationsPage.jsx`
- `RoCafePage.jsx`
- `ServicesPage.jsx`

### UI Components (`src/components/`)

Reusable interface elements:

- `Navbar.jsx` - Main navigation
- `Footer.jsx` - Site footer
- `LazyImage.jsx` - Optimized image loading
- `Toast.jsx` - Notification system
- `PWAInstallPrompt.jsx` - PWA installation

### Provider Components

Context providers for global state:

- `LocationProvider.jsx` - Location context
- `HelmetProvider` - SEO meta tags

## Component Patterns

### Functional Components

All components use functional syntax with hooks. **Always use centralized config for navigation and company info.**

```jsx
import { useState, useEffect } from 'react';
import COMPANY_DATA from '../config/company_data';
import { NAVIGATION_LINKS } from '../config/navigation';

export default function MyComponent() {
  const [state, setState] = useState('');

  return (
    <nav>
      {NAVIGATION_LINKS.filter(link => link.showIn.navbar).map(link => (
        <a href={link.href}>{link.label}</a>
      ))}
    </nav>
    <footer>
      <span>{COMPANY_DATA.legalName}</span>
    </footer>
  );
}
```

### Lazy Loading

Page components use React.lazy for code splitting:

```jsx
const AboutPage = lazy(() => import('./pages/AboutPage'));
```

### Props Pattern

Use destructuring with defaults:

```jsx
function Button({ 
  children, 
  variant = 'primary',
  onClick,
  disabled = false 
}) {
  // ...
}
```

## Styling

### CSS Variables

Use theme variables for colors:

```jsx
<div style={{ 
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)' 
}}>
```

### Tailwind Classes

Use for layout and spacing:

```jsx
<div className="flex items-center gap-4 p-6">
```

### Inline Styles

For dynamic or theme-dependent values:

```jsx
<p style={{ color: CSS_VARS.textMuted }}>
```

## State Management

### Local State

Use `useState` for component-level state:

```jsx
const [isOpen, setIsOpen] = useState(false);
```

### Context

Use for cross-component state:

```jsx
import { useLocationContext } from '../hooks/useLocationContext';

function MyComponent() {
  const { selectedLocation } = useLocationContext();
}
```

### Custom Hooks

Encapsulate reusable logic:

```jsx
import { useServiceWorker } from '../hooks/useServiceWorker';

function App() {
  const { isInstalled, promptInstall } = useServiceWorker();
}
```

## SEO

Use react-helmet-async for meta tags:

```jsx
import { Helmet } from 'react-helmet-async';

function Page() {
  return (
    <>
      <Helmet>
        <title>Page Title | Roma Mart</title>
        <meta name="description" content="..." />
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

---

**Related:** [Data Management](./data-management.md) | [Theming & Tokens](./theming-tokens.md)
