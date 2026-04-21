// src/config/storageKeys.js
//
// Single source of truth for all localStorage and sessionStorage key strings.
// Import from here instead of hardcoding key literals in components or hooks.
// Prevents silent key drift when the same storage slot is accessed from multiple files.

// --- Location ---

/** Nearest auto-detected location ID, cached in localStorage with timestamp. */
export const NEAREST_LOCATION_KEY = 'roma_mart_nearest_location';

/** User's manually selected location, persisted in localStorage. */
export const SELECTED_LOCATION_KEY = 'roma_mart_selected_location';

/** Flag in sessionStorage: geolocation was already requested this session. */
export const SESSION_LOCATION_REQUESTED_KEY = 'roma_mart_location_requested';

// --- Time Format ---

/** User's preferred time format ('12' | '24'), persisted in localStorage. */
export const TIME_FORMAT_KEY = 'timeFormat';

// --- PWA ---

/** Timestamp (ms) of when user last dismissed the install prompt, in localStorage. */
export const PWA_INSTALL_DISMISSED_KEY = 'pwa-install-dismissed';

/** Boolean flag in localStorage: user has installed the PWA. */
export const PWA_INSTALLED_KEY = 'pwa-installed';

/** Boolean flag in sessionStorage: install prompt was dismissed this session. */
export const PWA_DISMISSED_SESSION_KEY = 'pwa-dismissed-session';

/** Boolean flag in sessionStorage: SW update prompt was dismissed this session. */
export const PWA_UPDATE_DISMISSED_KEY = 'pwa-update-dismissed';
