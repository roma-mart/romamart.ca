/**
 * ImageCarousel Component
 * Unified, accessible image carousel with auto-advance and proper WCAG
 * touch targets. Replaces inline carousel code in AboutPage and the old
 * LocationImageCarousel component.
 *
 * Fixes:
 * - Left arrow direction bug (was rotated wrong)
 * - "Same image" bug (LazyImage opacity conflicting with carousel opacity)
 * - Dot indicators now have 44px minimum touch targets
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({
  images = [],           // Array of { src, alt }
  autoAdvanceMs = 5000,
  className = '',
  overlay = null,        // Optional overlay element (e.g., gradient div)
}) => {
  const [current, setCurrent] = useState(0);
  const isPaused = useRef(false);

  // Auto-advance with reduced motion support
  useEffect(() => {
    if (images.length <= 1) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const timer = setInterval(() => {
      if (!isPaused.current) {
        setCurrent(prev => (prev + 1) % images.length);
      }
    }, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [images.length, autoAdvanceMs]);

  const goPrev = useCallback(() => {
    setCurrent(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % images.length);
  }, [images.length]);

  const selectHandlers = useMemo(
    () => images.map((_, idx) => () => setCurrent(idx)),
    [images]
  );

  if (!images.length) return null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
      onFocus={() => { isPaused.current = true; }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          isPaused.current = false;
        }
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Slides — opacity on wrapper div avoids LazyImage conflict */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${idx + 1} of ${images.length}`}
          aria-hidden={idx !== current}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Optional overlay (gradient, etc.) */}
      {overlay}

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              opacity: current === 0 ? 0 : 1,
              pointerEvents: current === 0 ? 'none' : 'auto',
            }}
            onClick={goPrev}
            tabIndex={current === 0 ? -1 : 0}
          >
            <ChevronLeft size={24} style={{ color: 'var(--color-accent)' }} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              opacity: current === images.length - 1 ? 0 : 1,
              pointerEvents: current === images.length - 1 ? 'none' : 'auto',
            }}
            onClick={goNext}
            tabIndex={current === images.length - 1 ? -1 : 0}
          >
            <ChevronRight size={24} style={{ color: 'var(--color-accent)' }} />
          </button>
        </>
      )}

      {/* Dot indicators with 44px min touch targets */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={selectHandlers[idx]}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded-full"
              aria-label={`View image ${idx + 1}`}
            >
              <span
                className={`block rounded-full transition-all ${
                  idx === current ? 'w-6 h-2' : 'w-2 h-2'
                }`}
                style={{
                  backgroundColor: idx === current
                    ? 'var(--color-accent)'
                    : 'var(--color-surface)',
                }}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
