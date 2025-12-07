// src/config/navigation.js
// Central navigation config for Roma Mart 2.0
// Used by Navbar, Footer, Sitemap, etc.

/**
 * Main navigation links (site-wide)
 * Each item: { label, href, icon (optional), ariaLabel (optional), showIn: { navbar, footer, sitemap } }
 */
export const NAVIGATION_LINKS = [
  {
    label: 'Home',
    href: '/',
    ariaLabel: 'Go to homepage',
    showIn: { navbar: true, footer: true, sitemap: true }
  },
  {
    label: 'Services',
    href: '/services',
    ariaLabel: 'View services',
    showIn: { navbar: true, footer: true, sitemap: true }
  },
  {
    label: 'RoCafé',
    href: '/rocafe',
    ariaLabel: 'View RoCafe menu',
    showIn: { navbar: true, footer: true, sitemap: true }
  },
  {
    label: 'Locations',
    href: '/locations',
    ariaLabel: 'View store locations',
    showIn: { navbar: true, footer: true, sitemap: true }
  },
  {
    label: 'About',
    href: '/about',
    ariaLabel: 'Learn about Roma Mart',
    showIn: { navbar: true, footer: true, sitemap: true }
  },
  {
    label: 'Contact',
    href: '/contact',
    ariaLabel: 'Contact Roma Mart',
    showIn: { navbar: true, footer: true, sitemap: true }
  },
  // Legal & accessibility links (footer/sitemap only)
  {
    label: 'Accessibility',
    href: '/accessibility',
    ariaLabel: 'Accessibility information',
    showIn: { navbar: false, footer: true, sitemap: true }
  },
  {
    label: 'Privacy',
    href: '/privacy',
    ariaLabel: 'Privacy policy',
    showIn: { navbar: false, footer: true, sitemap: true }
  },
  {
    label: 'Terms',
    href: '/terms',
    ariaLabel: 'Terms of service',
    showIn: { navbar: false, footer: true, sitemap: true }
  },
  {
    label: 'Cookies',
    href: '/cookies',
    ariaLabel: 'Cookie policy',
    showIn: { navbar: false, footer: true, sitemap: true }
  }
];

// ...existing code...
