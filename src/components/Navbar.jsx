import React from 'react';
import { Logo } from './Logo';

export default function Navbar() {
  const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  return (
    <header role="banner" className="w-full" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <nav aria-label="Primary" className="mx-auto max-w-6xl px-4 py-3 flex items-center justify_between">
        <a href={BASE_URL} className="flex items-center gap-3" aria-label="Roma Mart Home">
          <Logo size={36} scheme="navy" />
          <span className="text-heading" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)', fontWeight: 700 }}>Roma Mart</span>
        </a>
        <div className="flex items-center gap-4">
          <a href={`${BASE_URL}services`} className="text-body px-2 py-2" style={{ color: 'var(--color-text)' }}>Services</a>
          <a href={`${BASE_URL}rocafe`} className="text-body px-2 py-2" style={{ color: 'var(--color-text)' }}>RoCafé</a>
          <a href={`${BASE_URL}locations`} className="text-body px-2 py-2" style={{ color: 'var(--color-text)' }}>Locations</a>
          <a href={`${BASE_URL}contact`} className="text-body px-2 py-2" style={{ color: 'var(--color-text)' }}>Contact</a>
        </div>
      </nav>
    </header>
  );
}
