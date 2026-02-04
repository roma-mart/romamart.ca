// src/utils/getAssetUrl.js

/**
 * Safely access environment variables with Node.js compatibility
 * Guards against import.meta.env being undefined in Node contexts
 * 
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value or default
 */
export function getEnvVar(key, defaultValue = '') {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    return import.meta.env[key];
  }
  return defaultValue;
}

/**
 * Returns a path for static assets, optionally prefixing with /<env-domain>/
 * Example:
 * - VITE_APP_DOMAIN = "romamart.ca"
 *   getAssetUrl("/rocafe-logo.png") => "/romamart.ca/rocafe-logo.png"
 * - VITE_APP_DOMAIN not set:
 *   getAssetUrl("/rocafe-logo.png") => "/rocafe-logo.png"
 */
export function getAssetUrl(path) {
    const domain = getEnvVar('VITE_APP_DOMAIN');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (domain) {
      // Always prefix with a slash, never double it
      return `/${domain.replace(/^\//, '').replace(/\/$/, '')}${normalizedPath}`;
    }
    return normalizedPath;
  }
  