import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NAVIGATION_LINKS } from '../config/navigation';
import { buildBreadcrumbSchema, buildBreadcrumbArray } from '../schemas/breadcrumbSchema';
import COMPANY_DATA from '../config/company_data';
import Button from '../components/Button';
import StructuredData from '../components/StructuredData';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const BASE_URL =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
      ? import.meta.env.BASE_URL
      : '/';

  const breadcrumbs = buildBreadcrumbArray(
    'Page Not Found',
    `${COMPANY_DATA.baseUrl}/404`
  );
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  // Show main nav links (navbar items, excluding Home)
  const navLinks = NAVIGATION_LINKS.filter(
    (link) => link.showIn.navbar && link.href !== '/'
  );

  return (
    <>
      <Helmet>
        <title>Page Not Found | Roma Mart Convenience</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Navigate back to Roma Mart's homepage or explore our services."
        />
      </Helmet>

      {breadcrumbSchema && (
        <StructuredData type="BreadcrumbList" data={breadcrumbSchema} />
      )}

      <div
        className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <p
          className="text-8xl md:text-9xl font-bold mb-4"
          style={{ color: 'var(--color-accent)' }}
          aria-hidden="true"
        >
          404
        </p>

        <h1
          className="text-3xl md:text-4xl mb-4"
          style={{ color: 'var(--color-heading)' }}
        >
          Page Not Found
        </h1>

        <p
          className="font-inter text-lg max-w-md mb-10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved. Try one of the links below.
        </p>

        <div className="mb-10">
          <Button
            href={BASE_URL}
            variant="action"
            size="lg"
            icon={<Home size={20} />}
            aria-label="Go back to homepage"
          >
            Back to Home
          </Button>
        </div>

        <nav aria-label="Site navigation">
          <ul className="flex flex-wrap justify-center gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Button
                  href={`${BASE_URL}${link.href.slice(1)}`}
                  variant="secondary"
                  size="sm"
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NotFoundPage;
