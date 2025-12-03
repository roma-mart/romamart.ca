import React from 'react';
import { Logo } from './Logo';

export default function Footer() {
  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  return (
    <footer role="contentinfo" className="w-full mt-12" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid_cols-1 md:grid_cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Logo size={36} scheme="navy" />
          <span className="text-heading" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)', fontWeight: 700 }}>Roma Mart</span>
        </div>
        <div>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} Roma Mart Corp. All rights reserved.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <a href={`${BASE_URL}privacy`} className="text-body" style={{ color: 'var(--color-text)' }}>Privacy</a>
            <a href={`${BASE_URL}terms`} className="text-body" style={{ color: 'var(--color-text)' }}>Terms</a>
            <a href={`${BASE_URL}accessibility`} className="text-body" style={{ color: 'var(--color-text)' }}>Accessibility</a>
            <a href={`${BASE_URL}cookies`} className="text-body" style={{ color: 'var(--color-text)' }}>Cookies</a>
          </div>
        </div>
        <div>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>Contact: contact@romamart.ca</p>
        </div>
      </div>
    </footer>
  );
}
