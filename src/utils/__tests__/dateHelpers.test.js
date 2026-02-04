import { describe, it, expect } from 'vitest';
import { groupDayMap, parse12hTo24h } from '../dateHelpers';

describe('dateHelpers', () => {
  describe('groupDayMap', () => {
    it('returns empty array for invalid input', () => {
      expect(groupDayMap([])).toEqual([]);
      expect(groupDayMap(null)).toEqual([]);
    });

    it('groups consecutive days and fills missing days as Closed', () => {
      const dayMap = [
        { day: 'Monday', hours: '9-5' },
        { day: 'Tuesday', hours: '9-5' },
        { day: 'Friday', hours: '10-2' }
      ];

      const grouped = groupDayMap(dayMap);

      expect(grouped).toEqual([
        { label: 'Mon–Tue', hours: '9-5' },
        { label: 'Wed–Thu', hours: 'Closed' },
        { label: 'Fri', hours: '10-2' },
        { label: 'Sat–Sun', hours: 'Closed' }
      ]);
    });

    it('collapses full week with same hours into one range', () => {
      const dayMap = [
        { day: 'Monday', hours: 'Open' },
        { day: 'Tuesday', hours: 'Open' },
        { day: 'Wednesday', hours: 'Open' },
        { day: 'Thursday', hours: 'Open' },
        { day: 'Friday', hours: 'Open' },
        { day: 'Saturday', hours: 'Open' },
        { day: 'Sunday', hours: 'Open' }
      ];

      const grouped = groupDayMap(dayMap);

      expect(grouped).toEqual([
        { label: 'Mon–Sun', hours: 'Open' }
      ]);
    });
  });

  describe('parse12hTo24h', () => {
    it('parses valid 12-hour times', () => {
      expect(parse12hTo24h('8:30 AM')).toBe('08:30');
      expect(parse12hTo24h('12:00 AM')).toBe('00:00');
      expect(parse12hTo24h('12:00 PM')).toBe('12:00');
      expect(parse12hTo24h('9:05 PM')).toBe('21:05');
    });

    it('returns null for invalid inputs', () => {
      expect(parse12hTo24h('13:00 PM')).toBe(null);
      expect(parse12hTo24h('9:7 AM')).toBe(null);
      expect(parse12hTo24h('')).toBe(null);
      expect(parse12hTo24h(null)).toBe(null);
    });
  });
});
