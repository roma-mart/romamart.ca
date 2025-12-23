// src/hooks/useColorScheme.js
import { useEffect, useState } from 'react';

export function useColorScheme() {
  const getScheme = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  const [scheme, setScheme] = useState(
    typeof window !== 'undefined' ? getScheme() : 'light'
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = e => setScheme(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return scheme;
}
