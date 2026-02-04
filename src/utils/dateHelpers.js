/**
 * Date and time helper utilities
 * 
 * Centralized constants and functions for day/time formatting
 * to prevent duplication across components and hooks.
 * 
 * @module utils/dateHelpers
 */

/**
 * Standard day ordering (Monday-first, ISO 8601)
 */
export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Day name abbreviations
 */
export const DAY_SHORT = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun'
};

/**
 * Groups consecutive days with identical hours into ranges
 * 
 * @param {Array} dayMap - Array of { day, hours } objects
 * @returns {Array} Array of { label, hours } objects with grouped days
 * 
 * @example
 * groupDayMap([
 *   { day: 'Monday', hours: '9-5' },
 *   { day: 'Tuesday', hours: '9-5' },
 *   { day: 'Wednesday', hours: '9-5' }
 * ])
 * // Returns: [{ label: 'Mon–Wed', hours: '9-5' }]
 */
export function groupDayMap(dayMap) {
  if (!Array.isArray(dayMap) || dayMap.length === 0) return [];
  
  const byDay = new Map(dayMap.map(entry => [entry.day, entry.hours]));
  const ordered = DAY_ORDER.map(day => ({ day, hours: byDay.get(day) || 'Closed' }));

  const groups = [];
  let current = { start: ordered[0].day, end: ordered[0].day, hours: ordered[0].hours };

  for (let i = 1; i < ordered.length; i += 1) {
    const next = ordered[i];
    if (next.hours === current.hours) {
      current.end = next.day;
      continue;
    }
    groups.push({
      label: current.start === current.end
        ? DAY_SHORT[current.start]
        : `${DAY_SHORT[current.start]}–${DAY_SHORT[current.end]}`,
      hours: current.hours
    });
    current = { start: next.day, end: next.day, hours: next.hours };
  }

  groups.push({
    label: current.start === current.end
      ? DAY_SHORT[current.start]
      : `${DAY_SHORT[current.start]}–${DAY_SHORT[current.end]}`,
    hours: current.hours
  });

  return groups;
}

/**
 * Parse 12-hour time string to 24-hour format
 * 
 * @param {string} time12h - Time in 12-hour format (e.g., "8:30 AM", "9:00 PM")
 * @returns {string|null} Time in 24-hour format (HH:MM) or null if invalid
 * 
 * @example
 * parse12hTo24h("8:30 AM")  // "08:30"
 * parse12hTo24h("9:00 PM")  // "21:00"
 * parse12hTo24h("12:00 AM") // "00:00"
 * parse12hTo24h("12:00 PM") // "12:00"
 */
export function parse12hTo24h(time12h) {
  if (!time12h || typeof time12h !== 'string') return null;
  
  const trimmed = time12h.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  
  // Validate ranges
  if (hours < 1 || hours > 12) return null;
  if (parseInt(minutes, 10) < 0 || parseInt(minutes, 10) > 59) return null;
  
  // Convert to 24-hour
  if (period === 'AM') {
    if (hours === 12) hours = 0; // 12 AM = 00:xx
  } else { // PM
    if (hours !== 12) hours += 12; // 1 PM = 13:xx, but 12 PM stays 12:xx
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}
