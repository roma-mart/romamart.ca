/**
 * Time format utilities
 *
 * Provides locale-aware and user-preference-aware time formatting helpers.
 * If a user preference is set in localStorage under `timeFormat` ("12", "24", or "auto"),
 * it takes precedence. Otherwise, the browser locale default is used.
 */

const TIME_FORMAT_STORAGE_KEY = 'timeFormat';

const resolveLocaleHour12 = () => {
  try {
    const resolved = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
    return typeof resolved.hour12 === 'boolean' ? resolved.hour12 : undefined;
  } catch {
    return undefined;
  }
};

const readStoredPreference = () => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const stored = window.localStorage?.getItem(TIME_FORMAT_STORAGE_KEY);
    if (stored === '12' || stored === '24' || stored === 'auto') return stored;
  } catch {
    return 'auto';
  }
  return 'auto';
};

/**
 * Get user's hour12 preference.
 * @returns {boolean|undefined} true for 12-hour, false for 24-hour, undefined if unknown
 */
export const getUserHour12Preference = () => {
  const stored = readStoredPreference();
  if (stored === '12') return true;
  if (stored === '24') return false;

  const localePreference = resolveLocaleHour12();
  return typeof localePreference === 'boolean' ? localePreference : true;
};

/**
 * Persist user preference for time format.
 * @param {'12' | '24' | 'auto'} value
 */
export const setUserTimeFormatPreference = (value) => {
  if (typeof window === 'undefined') return;
  if (value !== '12' && value !== '24' && value !== 'auto') return;

  try {
    if (value === 'auto') {
      window.localStorage?.removeItem(TIME_FORMAT_STORAGE_KEY);
      return;
    }
    window.localStorage?.setItem(TIME_FORMAT_STORAGE_KEY, value);
  } catch {
    // no-op: storage might be unavailable
  }
};

/**
 * Format a time from 24-hour digits based on user/locale preference.
 * @param {number} rawHours - 0-23
 * @param {number} rawMinutes - 0-59
 * @param {boolean|undefined} hour12Preference
 * @returns {string}
 */
export const formatTimeFrom24h = (rawHours, rawMinutes, hour12Preference) => {
  const minutes = rawMinutes.toString().padStart(2, '0');
  const resolvedHour12 = typeof hour12Preference === 'boolean' ? hour12Preference : getUserHour12Preference();

  if (resolvedHour12 === false) {
    const hours24 = rawHours.toString().padStart(2, '0');
    return `${hours24}:${minutes}`;
  }

  const period = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = rawHours % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};
