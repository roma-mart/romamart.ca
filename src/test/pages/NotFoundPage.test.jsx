import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import NotFoundPage from '../../pages/NotFoundPage';

const renderWithHelmet = (ui) =>
  render(<HelmetProvider>{ui}</HelmetProvider>);

describe('NotFoundPage', () => {
  it('should render the 404 heading', () => {
    renderWithHelmet(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render a Page Not Found title', () => {
    renderWithHelmet(<NotFoundPage />);
    expect(
      screen.getByRole('heading', { name: /page not found/i })
    ).toBeInTheDocument();
  });

  it('should render a Back to Home link', () => {
    renderWithHelmet(<NotFoundPage />);
    const homeLink = screen.getByRole('link', { name: /go back to homepage/i });
    expect(homeLink).toBeInTheDocument();
  });

  it('should render navigation links for main pages', () => {
    renderWithHelmet(<NotFoundPage />);
    const nav = screen.getByRole('navigation', { name: /site navigation/i });
    expect(nav).toBeInTheDocument();

    // Should have links for navbar pages excluding Home
    expect(screen.getByRole('link', { name: /view services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view rocafe menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view store locations/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact roma mart/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn about roma mart/i })).toBeInTheDocument();
  });

  it('should render explanatory body text', () => {
    renderWithHelmet(<NotFoundPage />);
    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });
});
