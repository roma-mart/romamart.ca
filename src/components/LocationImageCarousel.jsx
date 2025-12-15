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
    <div className="relative h-full min-h-[18rem] max-h-[28rem] rounded-2xl overflow-hidden shadow-lg mb-4">
      {/* Left/Right Scroll Buttons for Carousel */}
      {images.length > 1 && current > 0 && (
        <button
          type="button"
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)', color: 'var(--color-accent)' }} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      {images.length > 1 && current < images.length - 1 && (
        <button
          type="button"
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" style={{ color: 'var(--color-accent)' }} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
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
