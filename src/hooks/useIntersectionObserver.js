/**
 * Intersection Observer Hook for Lazy Loading
 * Efficiently loads images as they approach viewport
 */

import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // Once intersected, mark as true permanently
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

/**
 * Hook for lazy loading images
 */
export const useLazyImage = (src, placeholder = '') => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '100px'
  });
  
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (hasIntersected && src && imageSrc !== src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setError(true);
      };
      
      img.src = src;
    }
  }, [hasIntersected, src, imageSrc]);

  return { elementRef, imageSrc, isLoaded, error };
};

export default useIntersectionObserver;
