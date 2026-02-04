import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUserHour12Preference, setUserTimeFormatPreference, formatTimeFrom24h } from '../timeFormat';

const ORIGINAL_DATE_TIME_FORMAT = Intl.DateTimeFormat;

describe('timeFormat', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Intl.DateTimeFormat = ORIGINAL_DATE_TIME_FORMAT;
    vi.unstubAllGlobals();
  });

  it('respects stored 12-hour preference', () => {
    window.localStorage.setItem('timeFormat', '12');
    expect(getUserHour12Preference()).toBe(true);
  });

  it('respects stored 24-hour preference', () => {
    window.localStorage.setItem('timeFormat', '24');
    expect(getUserHour12Preference()).toBe(false);
  });

  it('uses locale preference when stored value is auto', () => {
    window.localStorage.setItem('timeFormat', 'auto');
    Intl.DateTimeFormat = vi.fn(() => ({
      resolvedOptions: () => ({ hour12: false })
    }));

    expect(getUserHour12Preference()).toBe(false);
  });

  it('defaults to 12-hour if storage fails and locale is unknown', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage error');
    });
    Intl.DateTimeFormat = vi.fn(() => ({
      resolvedOptions: () => ({})
    }));

    expect(getUserHour12Preference()).toBe(true);
  });

  it('handles SSR with window undefined', () => {
    vi.stubGlobal('window', undefined);
    Intl.DateTimeFormat = vi.fn(() => ({
      resolvedOptions: () => ({ hour12: false })
    }));

    expect(getUserHour12Preference()).toBe(false);
  });

  it('persists and clears time format preference', () => {
    setUserTimeFormatPreference('24');
    expect(window.localStorage.getItem('timeFormat')).toBe('24');

    setUserTimeFormatPreference('auto');
    expect(window.localStorage.getItem('timeFormat')).toBe(null);
  });

  it('formats 24-hour time when hour12Preference is false', () => {
    expect(formatTimeFrom24h(13, 5, false)).toBe('13:05');
  });

  it('formats 12-hour time when hour12Preference is true', () => {
    expect(formatTimeFrom24h(13, 5, true)).toBe('1:05 PM');
    expect(formatTimeFrom24h(0, 0, true)).toBe('12:00 AM');
  });

  it('uses stored preference when hour12Preference is undefined', () => {
    window.localStorage.setItem('timeFormat', '24');
    expect(formatTimeFrom24h(9, 5, undefined)).toBe('09:05');
  });
});
