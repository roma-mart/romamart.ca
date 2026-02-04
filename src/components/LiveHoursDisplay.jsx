/**
 * LiveHoursDisplay Component
 * 
 * Displays live opening hours fetched from Google Places API with circuit breaker protection.
 * Falls back silently to static hours if API fails. Errors only displayed on manual refresh.
 * 
 * Features:
 * - Circuit breaker pattern for API quota protection
 * - Silent fallback to static hours on initial error
 * - Manual refresh with error visibility
 * - 1-hour client-side caching
 * - Grouped day display (e.g., Mon-Fri)
 * 
 * @module components/LiveHoursDisplay
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Clock, RefreshCw, AlertCircle } from 'lucide-react';
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';
import { DAY_ORDER, groupDayMap } from '../utils/dateHelpers';

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

  return [];
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
 * @param {Object} props.fallbackHours - Fallback hours object
 * @param {Object|Array} props.fallbackHours.daily - Per-day hours (object with day keys or array of {day, hours})
 * @param {Array} [props.fallbackHours.exceptions] - Holiday/exception hours [{date, hours, reason}]
 * @param {Array} [props.fallbackHours.dayMap] - Pre-formatted day map
 * @param {boolean} props.showStatus - Show open/closed status badge
 * @param {boolean} props.compact - Compact display mode
 * @param {boolean} props.showIcon - Show clock icon
 * @param {boolean} props.showRefreshOnError - Show refresh button when API error occurs (allows manual retry)
 * @returns {JSX.Element}
 */
function LiveHoursDisplay({ placeId, fallbackHours, showStatus = true, compact = false, showIcon = true, showRefreshOnError = true }) {
  const { hours, isLoading, error, refetch, isOpenNow } = useGooglePlaceHours(placeId);

  const iconColor = useMemo(() => ({ color: 'var(--color-icon)' }), []);

  const fallbackDayMap = useMemo(() => buildFallbackDayMap(fallbackHours), [fallbackHours]);
  const fallbackGrouped = useMemo(() => groupDayMap(fallbackDayMap), [fallbackDayMap]);

  // Use live hours if available, otherwise fallback
  const displayHours = useMemo(() => hours?.display || {
    full: null,
    dayMap: fallbackDayMap,
    grouped: fallbackGrouped,
    allSame: fallbackDayMap.length > 0 && fallbackDayMap.every(entry => entry.hours === fallbackDayMap[0].hours)
  }, [hours?.display, fallbackDayMap, fallbackGrouped]);

  const renderGroupedLines = useCallback((groups) => (
    <div className="space-y-1">
      {groups.map(group => (
        <p key={group.label} className="font-inter" style={{ color: 'var(--color-text-muted)' }}>
          {group.label}: {group.hours}
        </p>
      ))}
    </div>
  ), []);

  const exceptionItems = useMemo(() => {
    const fromDisplay = normalizeExceptions(displayHours?.exceptions);
    const fromFallback = normalizeExceptions(fallbackHours?.exceptions);
    const combined = [...fromDisplay, ...fromFallback];
    const unique = new Map();
    combined.forEach(item => {
      const key = `${item.date}-${item.hours}-${item.reason || ''}`;
      if (!unique.has(key)) unique.set(key, item);
    });
    // Use local date (YYYY-MM-DD) to match exception date format
    // new Date().toISOString() uses UTC, which can be off by one day for users in negative offsets
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    return Array.from(unique.values())
      .filter(item => item.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map(item => ({
        ...item,
        isToday: item.date === today
      }));
  }, [displayHours?.exceptions, fallbackHours?.exceptions]);

  const renderExceptions = useCallback(() => {
    if (exceptionItems.length === 0) return null;
    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
          Holiday Hours
        </p>
        {exceptionItems.map(item => (
          <p key={`${item.date}-${item.hours}-${item.reason || ''}`} className="font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {item.isToday ? 'Today' : formatExceptionDate(item.date)}: {item.hours}
            {item.reason ? ` (${item.reason})` : ''}
          </p>
        ))}
      </div>
    );
  }, [exceptionItems]);

  const renderHoursContent = useCallback(() => {
    // If there's an error but we have fallback hours, show fallback silently (no error alert)
    // Error will only show after user explicitly refreshes and it fails again
    if (error && fallbackGrouped.length === 0) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2" style={{ color: 'var(--color-error)' }}>
            <AlertCircle size={16} />
            <span className="text-sm">Unable to load live hours</span>
          </div>
          {import.meta.env.DEV && error && (
            <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {typeof error === 'string' ? error : 'API error'}
            </p>
          )}
          {renderExceptions()}
        </div>
      );
    }

    // Show fallback hours (with or without error - error doesn't get priority display)
    if (error) {
      // Error exists but we have fallback - display fallback without the error alert
      const grouped = displayHours.grouped || [];
      return (
        <div className="space-y-1">
          {grouped.length > 0
            ? renderGroupedLines(grouped)
            : (
              <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Hours not available</p>
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
              <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Hours not available</p>
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
            <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Hours not available</p>
          )}
        {renderExceptions()}
      </div>
    );
  }, [error, isLoading, displayHours, showStatus, isOpenNow, fallbackGrouped, renderExceptions, renderGroupedLines]);

  const refreshButton = showRefreshOnError && error ? (
    <button
      type="button"
      onClick={() => refetch({ force: true })}
      className="mt-2 text-xs hover:underline flex items-center gap-1"
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
  /** Google Place ID for the location */
  placeId: PropTypes.string.isRequired,
  /** Fallback hours to display if API fails (shown silently) */
  fallbackHours: PropTypes.shape({
    display: PropTypes.string,
    daily: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    dayMap: PropTypes.array,
    exceptions: PropTypes.array
  }),
  /** Show "Live from Google" status badge */
  showStatus: PropTypes.bool,
  /** Use compact layout for smaller displays */
  compact: PropTypes.bool,
  /** Show clock icon in header */
  showIcon: PropTypes.bool,
  /** Show refresh button when API error occurs (allows manual retry) */
  showRefreshOnError: PropTypes.bool
};

export default LiveHoursDisplay;
