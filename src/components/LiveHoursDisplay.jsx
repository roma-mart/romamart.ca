/**
 * LiveHoursDisplay Component
 * 
 * Displays live opening hours fetched from Google Places API.
 * Falls back to static hours if API fails or is loading.
 * 
 * @module components/LiveHoursDisplay
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Clock, RefreshCw, AlertCircle } from 'lucide-react';
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun'
};

const groupDayMap = (dayMap) => {
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
};

const buildFallbackDayMap = (fallbackHours) => {
  if (!fallbackHours) return [];
  if (Array.isArray(fallbackHours.dayMap)) return fallbackHours.dayMap;

  const daily = fallbackHours.daily;
  if (Array.isArray(daily)) return daily;

  if (daily && typeof daily === 'object') {
    return DAY_ORDER.map(day => ({
      day,
      hours: daily[day] || daily[day.toLowerCase()] || 'Closed'
    }));
  }

  const monThu = fallbackHours.monThu || fallbackHours.weekdays || 'Hours not available';
  const friday = fallbackHours.friday || fallbackHours.weekdays || 'Hours not available';
  const saturday = fallbackHours.saturday || fallbackHours.weekends || 'Hours not available';
  const sunday = fallbackHours.sunday || fallbackHours.weekends || 'Hours not available';

  return [
    { day: 'Monday', hours: monThu },
    { day: 'Tuesday', hours: monThu },
    { day: 'Wednesday', hours: monThu },
    { day: 'Thursday', hours: monThu },
    { day: 'Friday', hours: friday },
    { day: 'Saturday', hours: saturday },
    { day: 'Sunday', hours: sunday }
  ];
};

const normalizeExceptions = (exceptions = []) => {
  if (!Array.isArray(exceptions)) return [];
  return exceptions
    .map(exception => ({
      date: exception?.date,
      hours: exception?.hours || exception?.time || 'Special hours',
      reason: exception?.reason || exception?.description || exception?.label || null
    }))
    .filter(exception => exception.date);
};

const formatExceptionDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
};

/**
 * Displays location hours with live Google Places data
 * 
 * @param {Object} props
 * @param {string} props.placeId - Google Place ID
 * @param {Object} props.fallbackHours - Fallback hours object { weekdays, weekends, display }
 * @param {boolean} props.showStatus - Show open/closed status badge
 * @param {boolean} props.compact - Compact display mode
 * @param {boolean} props.showIcon - Show clock icon
 * @param {boolean} props.showRefresh - Show refresh button when live hours/error are available
 * @returns {JSX.Element}
 */
function LiveHoursDisplay({ placeId, fallbackHours, showStatus = true, compact = false, showIcon = true, showRefresh = true }) {
  const { hours, isLoading, error, refetch, isOpenNow } = useGooglePlaceHours(placeId);

  const iconColor = useMemo(() => ({ color: 'var(--color-icon)' }), []);

  const fallbackDayMap = useMemo(() => buildFallbackDayMap(fallbackHours), [fallbackHours]);
  const fallbackGrouped = useMemo(() => groupDayMap(fallbackDayMap), [fallbackDayMap]);

  // Use live hours if available, otherwise fallback
  const displayHours = useMemo(() => hours?.display || {
    weekdays: fallbackHours?.weekdays || 'Hours not available',
    weekends: fallbackHours?.weekends || 'Hours not available',
    full: null,
    dayMap: fallbackDayMap,
    grouped: fallbackGrouped,
    allSame: fallbackDayMap.length > 0 && fallbackDayMap.every(entry => entry.hours === fallbackDayMap[0].hours)
  }, [hours?.display, fallbackHours?.weekdays, fallbackHours?.weekends, fallbackDayMap, fallbackGrouped]);

  const renderGroupedLines = (groups) => (
    <div className="space-y-1">
      {groups.map(group => (
        <p key={group.label} className="font-inter" style={{ color: 'var(--color-text-muted)' }}>
          {group.label}: {group.hours}
        </p>
      ))}
    </div>
  );

  const exceptionItems = useMemo(() => {
    const fromDisplay = normalizeExceptions(displayHours?.exceptions);
    const fromFallback = normalizeExceptions(fallbackHours?.exceptions);
    const combined = [...fromDisplay, ...fromFallback];
    const unique = new Map();
    combined.forEach(item => {
      const key = `${item.date}-${item.hours}-${item.reason || ''}`;
      if (!unique.has(key)) unique.set(key, item);
    });
    const today = new Date().toISOString().slice(0, 10);
    return Array.from(unique.values())
      .filter(item => item.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map(item => ({
        ...item,
        isToday: item.date === today
      }));
  }, [displayHours?.exceptions, fallbackHours?.exceptions]);

  const renderExceptions = () => {
    if (exceptionItems.length === 0) return null;
    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
          Holiday Hours
        </p>
        {exceptionItems.map(item => (
          <p key={`${item.date}-${item.hours}`} className="font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {item.isToday ? 'Today' : formatExceptionDate(item.date)}: {item.hours}
            {item.reason ? ` (${item.reason})` : ''}
          </p>
        ))}
      </div>
    );
  };

  const renderHoursContent = useCallback(() => {
    if (error) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <AlertCircle size={16} />
            <span className="text-sm">Unable to load live hours</span>
          </div>
          {fallbackGrouped.length > 0
            ? renderGroupedLines(fallbackGrouped)
            : (
              <>
                <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Mon-Fri: {fallbackHours?.weekdays}</p>
                <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Sat-Sun: {fallbackHours?.weekends}</p>
              </>
            )}
          {renderExceptions()}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading hours...</span>
          </div>
          {fallbackGrouped.length > 0
            ? renderGroupedLines(fallbackGrouped)
            : (
              <>
                <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Mon-Fri: {fallbackHours?.weekdays}</p>
                <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Sat-Sun: {fallbackHours?.weekends}</p>
              </>
            )}
          {renderExceptions()}
        </div>
      );
    }

    // Check if all days have same hours and we have valid full hours array
    if (displayHours.allSame && Array.isArray(displayHours.full) && displayHours.full.length > 0) {
      const firstLine = displayHours.full[0];
      const sameHours = typeof firstLine === 'string' && firstLine.includes(': ') ? firstLine.split(': ')[1] : null;
      
      // Guard against undefined hours - fall through to variable display
      if (sameHours) {
        return (
          <div className="space-y-1">
            {showStatus && isOpenNow !== null && (
              <span 
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mb-1"
                style={{
                  backgroundColor: isOpenNow ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                  color: isOpenNow ? 'var(--color-success)' : 'var(--color-error)'
                }}
                role="status"
                aria-label={isOpenNow ? 'Currently open' : 'Currently closed'}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isOpenNow ? 'var(--color-success)' : 'var(--color-error)',
                  display: 'inline-block'
                }} aria-hidden="true"></span>
                {isOpenNow ? 'Open Now' : 'Closed'}
              </span>
            )}
            <p className="font-inter font-semibold" style={{ color: 'var(--color-text)' }}>
              Open Daily: {sameHours}
            </p>
          </div>
        );
      }
    }

    const grouped = displayHours.grouped || [];
    return (
      <div className="space-y-1">
        {showStatus && isOpenNow !== null && (
          <span 
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mb-1"
            style={{
              backgroundColor: isOpenNow ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
              color: isOpenNow ? 'var(--color-success)' : 'var(--color-error)'
            }}
            role="status"
            aria-label={isOpenNow ? 'Currently open' : 'Currently closed'}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isOpenNow ? 'var(--color-success)' : 'var(--color-error)',
              display: 'inline-block'
            }} aria-hidden="true"></span>
            {isOpenNow ? 'Open Now' : 'Closed'}
          </span>
        )}
        {grouped.length > 0
          ? renderGroupedLines(grouped)
          : (
            <>
              <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Mon-Fri: {displayHours.weekdays}</p>
              <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Sat-Sun: {displayHours.weekends}</p>
            </>
          )}
        {renderExceptions()}
      </div>
    );
  }, [error, isLoading, displayHours, showStatus, isOpenNow, fallbackHours, fallbackGrouped, exceptionItems]);

  const refreshButton = showRefresh && (hours || error) ? (
    <button
      onClick={refetch}
      className={compact ? 'mt-2 text-xs hover:underline flex items-center gap-1' : 'mt-2 text-xs hover:underline flex items-center gap-1'}
      style={{ color: 'var(--color-accent)' }}
      aria-label="Refresh hours"
    >
      <RefreshCw size={12} />
      Refresh
    </button>
  ) : null;

  if (compact) {
    return (
      <div className="flex items-start gap-2">
        {showIcon ? (
          <Clock size={18} style={iconColor} className="flex-shrink-0 mt-0.5" />
        ) : null}
        <div className="flex-1">
          {renderHoursContent()}
          {refreshButton}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {showIcon ? (
        <Clock size={24} style={iconColor} className="flex-shrink-0 mt-1" />
      ) : null}
      <div className="flex-1">
        <h3 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>Hours</h3>
        {renderHoursContent()}
        {refreshButton}
      </div>
    </div>
  );
}

LiveHoursDisplay.propTypes = {
  placeId: PropTypes.string.isRequired,
  fallbackHours: PropTypes.shape({
    weekdays: PropTypes.string,
    weekends: PropTypes.string,
    display: PropTypes.string,
    monThu: PropTypes.string,
    friday: PropTypes.string,
    saturday: PropTypes.string,
    sunday: PropTypes.string,
    daily: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    dayMap: PropTypes.array,
    exceptions: PropTypes.array
  }),
  showStatus: PropTypes.bool,
  compact: PropTypes.bool,
  showIcon: PropTypes.bool,
  showRefresh: PropTypes.bool
};

export default LiveHoursDisplay;
