/**
 * Lazy Loading Image Component
 * Progressive image loading with skeleton placeholder
 */

import React from 'react';
import { useLazyImage } from '../hooks/useIntersectionObserver';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/svg%3E',
  ...props 
}) => {
  const { elementRef, imageSrc, isLoaded, error } = useLazyImage(src, placeholder);

  if (error) {
    return (
      <div
        ref={elementRef}
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={style}
        {...props}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <img
      ref={elementRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={style}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage;
