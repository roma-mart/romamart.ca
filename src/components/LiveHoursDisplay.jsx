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

  // Use live hours if available, otherwise fallback
  const displayHours = useMemo(() => hours?.display || {
    weekdays: fallbackHours?.weekdays || 'Hours not available',
    weekends: fallbackHours?.weekends || 'Hours not available',
    full: null
  }, [hours?.display, fallbackHours?.weekdays, fallbackHours?.weekends]);

  const renderHoursContent = useCallback(() => {
    if (error) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <AlertCircle size={16} />
            <span className="text-sm">Unable to load live hours</span>
          </div>
          <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Mon-Fri: {fallbackHours?.weekdays}</p>
          <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Sat-Sun: {fallbackHours?.weekends}</p>
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
          <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Mon-Fri: {fallbackHours?.weekdays}</p>
          <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Sat-Sun: {fallbackHours?.weekends}</p>
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
        <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Mon-Fri: {displayHours.weekdays}</p>
        <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>Sat-Sun: {displayHours.weekends}</p>
      </div>
    );
  }, [error, isLoading, displayHours, showStatus, isOpenNow, fallbackHours]);

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
    display: PropTypes.string
  }),
  showStatus: PropTypes.bool,
  compact: PropTypes.bool,
  showIcon: PropTypes.bool,
  showRefresh: PropTypes.bool
};

export default LiveHoursDisplay;
