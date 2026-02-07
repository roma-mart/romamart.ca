/**
 * FooterLinks.jsx
 * Navigation links grid for the Footer (Pages + Legal columns).
 */
import { NAVIGATION_LINKS } from '../config/navigation';
import COMPANY_DATA from '../config/company_data';

const LEGAL_SLUGS = ['privacy', 'terms', 'cookies', 'accessibility', 'return-policy'];

export default function FooterLinks() {
  const BASE_URL =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
      ? import.meta.env.BASE_URL
      : '/';

  const pageLinks = NAVIGATION_LINKS.filter((link) => {
    if (!link.showIn.footer) return false;
    const slug = (link.href || '').replace(/^\//, '').replace(/\/$/, '').toLowerCase();
    return !LEGAL_SLUGS.includes(slug);
  });

  const legalLinks = NAVIGATION_LINKS.filter((link) => {
    if (!link.showIn.footer) return false;
    const slug = (link.href || '').replace(/^\//, '').replace(/\/$/, '').toLowerCase();
    return LEGAL_SLUGS.includes(slug);
  });

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
      <div className="p-1">
        <p className="font-heading text-lg mb-6" style={{ color: 'var(--color-on-footer)' }}>
          Pages
        </p>
        <ul className="space-y-3 font-inter" style={{ color: 'var(--color-on-footer-muted)' }}>
          {pageLinks.map((link) => (
            <li key={link.href}>
              <a
                href={`${BASE_URL}${link.href.replace('/', '')}`}
                className="transition-colors"
                style={{ color: 'var(--color-on-footer-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-on-footer-muted)')}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={COMPANY_DATA.onlineStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition-colors"
              style={{ color: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            >
              Order Online
            </a>
          </li>
        </ul>
      </div>
      <div className="p-1">
        <p className="font-heading text-lg mb-6" style={{ color: 'var(--color-on-footer)' }}>
          Legal & Accessibility
        </p>
        <ul className="space-y-2 font-inter" style={{ color: 'var(--color-on-footer-muted)' }}>
          {legalLinks.map((link) => (
            <li key={link.href}>
              <a
                href={`${BASE_URL}${link.href.replace('/', '')}`}
                className="transition-colors"
                style={{ color: 'var(--color-on-footer-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-on-footer-muted)')}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`${BASE_URL}ai.txt`}
              className="transition-colors text-xs"
              style={{ color: 'var(--color-on-footer-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-on-footer-muted)')}
              title="AI Crawler Guidelines"
            >
              AI Guidelines
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
