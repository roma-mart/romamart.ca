# Photo Placement Guide

> Guidelines for placing images in Roma Mart web pages

## Overview

Proper image placement ensures visual consistency, performance, and accessibility across the Roma Mart website.

## Image Locations

### Homepage

| Section | Image Type | Dimensions | Notes |
|---------|-----------|------------|-------|
| Hero | Store exterior | 1920x1080 | Primary brand shot |
| Services | Service icons | SVG | Vector graphics |
| Locations | Store photos | 800x600 | Per location |

### Location Pages

| Element | Image Type | Dimensions |
|---------|-----------|------------|
| Header | Store exterior | 1200x600 |
| Gallery | Interior shots | 800x600 |
| Map | Google Maps embed | Responsive |

### RoCafé Page

| Element | Image Type | Dimensions |
|---------|-----------|------------|
| Hero | Coffee bar | 1200x600 |
| Menu items | Product shots | 400x400 |
| Categories | Category icons | SVG |

## Technical Requirements

### File Formats

| Format | Use Case |
|--------|----------|
| WebP | All photos |
| SVG | Icons, logos |
| PNG | Transparency needed |
| JPG | Fallback only |

### Responsive Images

```jsx
<LazyImage
  src="/images/hero.webp"
  alt="Roma Mart storefront"
  className="w-full h-auto"
/>
```

### Lazy Loading

All images below the fold should use lazy loading:

```jsx
import { LazyImage } from '../components/LazyImage';

<LazyImage
  src="/images/product.webp"
  alt="Product description"
/>
```

## Accessibility

### Alt Text

Every image must have descriptive alt text:

```jsx
// Good
<img alt="Fresh produce display at Roma Mart Wellington location" />

// Bad
<img alt="image" />
<img alt="" /> // Only for decorative images
```

### Decorative Images

Images that are purely decorative should have empty alt:

```jsx
<img alt="" role="presentation" />
```

## Performance

### Optimization

- Compress all images before upload
- Use appropriate dimensions (don't scale down large images in CSS)
- Serve WebP with fallbacks

### File Size Targets

| Type | Max Size |
|------|----------|
| Hero | 200KB |
| Product | 50KB |
| Thumbnail | 20KB |
| Icon | 5KB |

## Directory Structure

```
public/
├── images/
│   ├── hero/
│   ├── locations/
│   ├── menu/
│   └── icons/
```

---

**Related:** [Store Photography](./store-photography.md) | [Menu Photography](./menu-photography.md)
