/**
 * LocationImageCarousel Component
 * Ethos-compliant, accessible image carousel for location cards
 * Shows primary, exterior, and interior images
 * Keyboard, ARIA, and lazy loading support
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LazyImage from './LazyImage';

const getImageList = (photos, locationName) => {
  const images = [];
  if (photos.primary) {
    images.push({ src: photos.primary, alt: `${locationName} exterior` });
  }
  if (Array.isArray(photos.exterior)) {
    photos.exterior.forEach((src, i) => {
      if (src) images.push({ src, alt: `${locationName} exterior ${i + 1}` });
    });
  }
  if (Array.isArray(photos.interior)) {
    photos.interior.forEach((src, i) => {
      if (src) images.push({ src, alt: `${locationName} interior ${i + 1}` });
    });
  }
  return images;
};

const LocationImageCarousel = ({ photos, locationName }) => {
  const images = useMemo(() => getImageList(photos, locationName), [photos, locationName]);
  const [current, setCurrent] = useState(0);

  // Memoize handleSelect to avoid inline function in event handler
  const handleSelect = useCallback(idx => {
    setCurrent(idx);
  }, []);

  // Auto-advance every 5s
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  // ...existing code...

  if (!images.length) return null;

  return (
    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
      {images.map((img, idx) => (
        <LazyImage
          key={idx}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={idx !== current}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={handleSelect.bind(null, idx)}
              className={`w-2 h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${idx === current ? 'w-6 bg-[var(--color-accent)]' : 'bg-[var(--color-surface)]'}`}
              aria-label={`View image ${idx + 1}`}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(idx); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationImageCarousel;
