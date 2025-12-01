/**
 * Network-Aware Adaptive Image Component
 * Serves appropriate image quality based on connection speed
 */

import React, { useMemo } from 'react';
import { useNetworkStatus } from '../hooks/useBrowserFeatures';
import LazyImage from './LazyImage';

const AdaptiveImage = ({ 
  src, 
  alt, 
  lowQualitySrc = null,
  mediumQualitySrc = null,
  className = '',
  ...props 
}) => {
  const { networkInfo } = useNetworkStatus();

  const imageSrc = useMemo(() => {
    // If no quality variants provided, return original
    if (!lowQualitySrc && !mediumQualitySrc) {
      return src;
    }

    const effectiveType = networkInfo.effectiveType || '4g';
    const saveData = networkInfo.saveData || false;

    // Force low quality if user has data saver enabled
    if (saveData && lowQualitySrc) {
      return lowQualitySrc;
    }

    // Serve based on connection type
    if ((effectiveType === '2g' || effectiveType === 'slow-2g') && lowQualitySrc) {
      return lowQualitySrc;
    } else if (effectiveType === '3g' && mediumQualitySrc) {
      return mediumQualitySrc;
    }

    // Default to high quality for 4g/wifi
    return src;
  }, [src, lowQualitySrc, mediumQualitySrc, networkInfo.effectiveType, networkInfo.saveData]);

  return (
    <LazyImage
      src={imageSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default AdaptiveImage;
