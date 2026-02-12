/**
 * Internal route utilities -- shared helpers for /internal/* URL construction.
 *
 * Used by LoginPage, InternalLayout, and any future internal pages.
 * Handles GitHub Pages base path (/romamart.ca/) vs production (/).
 *
 * @module utils/internalRoutes
 */

const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/';

/**
 * Build a full URL path for an internal route, respecting the Vite base path.
 *
 * @param {string} path - Internal path, e.g. '/internal/dashboard'
 * @returns {string} Full path with base, e.g. '/romamart.ca/internal/dashboard'
 */
export function getInternalUrl(path) {
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${base}${path}`;
}

/** Manager-only routes (UX guard, not security -- HSC-04) */
export const MANAGER_ONLY_PATHS = ['/internal/signoff', '/internal/employees'];
