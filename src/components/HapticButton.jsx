/**
 * Haptic Feedback Button
 * Provides tactile feedback on mobile devices
 */

import React from 'react';
import { useVibration } from '../hooks/useBrowserFeatures';

const HapticButton = ({ 
  children, 
  onClick, 
  vibrationPattern = 10, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const { vibrate, canVibrate } = useVibration();

  const handleClick = (e) => {
    // Provide haptic feedback if supported
    if (canVibrate && !disabled) {
      vibrate(vibrationPattern);
    }
    
    // Call original onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default HapticButton;
