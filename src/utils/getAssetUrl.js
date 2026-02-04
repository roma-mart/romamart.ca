// src/utils/getAssetUrl.js

/**
 * Returns a path for static assets, optionally prefixing with /<env-domain>/
 * Example:
 * - VITE_APP_DOMAIN = "romamart.ca"
 *   getAssetUrl("/rocafe-logo.png") => "/romamart.ca/rocafe-logo.png"
 * - VITE_APP_DOMAIN not set:
 *   getAssetUrl("/rocafe-logo.png") => "/rocafe-logo.png"
 */
export function getAssetUrl(path) {
    const domain = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_DOMAIN)
      ? import.meta.env.VITE_APP_DOMAIN
      : '';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (domain) {
      // Always prefix with a slash, never double it
      return `/${domain.replace(/^\//, '').replace(/\/$/, '')}${normalizedPath}`;
    }
    return normalizedPath;
  }
  