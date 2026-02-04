/**
 * CurrentLocalTime Component
 * 
 * Displays the current local time for a given location.
 * Updates every second to show real-time clock.
 * 
 * @param {Object} props
 * @param {Object} props.location - Location object with timezone info
 * @returns {JSX.Element}
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';

function CurrentLocalTime({ location }) {
  const [currentTime, setCurrentTime] = useState('');
  const isClientRef = useRef(false);

  useEffect(() => {
    // Mark that component has mounted on client
    isClientRef.current = true;
  }, []);

  useEffect(() => {
    if (!isClientRef.current || !location) return;

    const updateTime = () => {
      try {
        // Create formatter for location's timezone
        // Default to 'America/Toronto' if no timezone specified
        const timezone = location?.timezone || 'America/Toronto';
        
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        const formatted = formatter.format(new Date());
        setCurrentTime(formatted);
      } catch (error) {
        console.error('Error formatting local time:', error);
        setCurrentTime('');
      }
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [location]);

  if (!currentTime) {
    return null;
  }

  return (
    <p className="flex items-center justify-center gap-2 mt-2" style={{ color: 'var(--color-on-footer-subtle)' }}>
      <Clock size={16} />
      <span className="font-inter text-xs">
        Local time: <strong>{currentTime}</strong>
      </span>
    </p>
  );
}

CurrentLocalTime.propTypes = {
  location: PropTypes.shape({
    timezone: PropTypes.string,
    name: PropTypes.string
  })
};

export default CurrentLocalTime;
