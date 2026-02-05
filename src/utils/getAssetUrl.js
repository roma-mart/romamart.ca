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
 * Returns a path for static assets using Vite's BASE_URL
 * Properly handles the base path configured in vite.config.js
 *
 * Example:
 * - base: "/" in vite.config.js
 *   getAssetUrl("/rocafe-logo.png") => "/rocafe-logo.png"
 * - base: "/romamart.ca/" in vite.config.js
 *   getAssetUrl("/rocafe-logo.png") => "/romamart.ca/rocafe-logo.png"
 *
 * @param {string} path - Asset path (with or without leading slash)
 * @returns {string} Full asset URL with correct base path
 */
export function getAssetUrl(path) {
  // Get the base URL from Vite's configuration
  const baseUrl = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';

  // Normalize the path to ensure it starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Remove trailing slash from baseUrl, ensure no double slashes
  const cleanBase = baseUrl.replace(/\/$/, '');

  // If base is just "/", return the normalized path
  if (cleanBase === '' || cleanBase === '/') {
    return normalizedPath;
  }

  // Otherwise, combine base and path
  return `${cleanBase}${normalizedPath}`;
}
