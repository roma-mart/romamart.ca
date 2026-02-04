/**
 * GoogleReviews Component
 * 
 * Displays Google reviews fetched directly from Google Places API (New).
 * Follows Google's official documentation and best practices:
 * https://developers.google.com/maps/documentation/javascript/place-reviews
 * 
 * Features:
 * - Fetches reviews using Places API (New) with proper field masks
 * - Auto-rotating carousel with smooth animations
 * - Author attributions per Google's requirements (displayName, uri, photoURI)
 * - Star ratings with Material Design styling
 * - Review text with "Read more" expansion
 * - Relative time display (e.g., "a month ago")
 * - 24-hour caching to minimize API calls
 * - Responsive design (mobile + desktop)
 * - Dark mode support via CSS variables
 * - Keyboard accessible
 * 
 * @component
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useLocationContext } from '../hooks/useLocationContext';
import { circuitBreakers } from '../utils/apiCircuitBreaker';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (reviews don't change frequently)
const AUTO_ROTATE_INTERVAL = 6000; // 6 seconds per slide
const reviewsCache = new Map();

// Create a safe circuit breaker factory as fallback
function createSafeCircuitBreaker() {
  return {
    shouldAttemptCall: () => true,
    recordFailure: () => {},
    reset: () => {},
    getStatus: () => ({ state: 'CLOSED' })
  };
}

// Circuit breaker to prevent excessive API calls when quota is exceeded
const reviewsBreaker = circuitBreakers.reviews || createSafeCircuitBreaker();

/**
 * Fetch reviews from Google Places API (New)
 * 
 * OPTIMIZATION FEATURES:
 * - 24-hour in-memory cache (reviews rarely change)
 * - Circuit breaker protection (stops calls after 5 quota failures)
 * - Graceful degradation on errors
 * - Single API call per component mount
 * - Proper error handling to prevent retry storms
 * 
 * Uses the new Places API endpoint with proper field masking
 * https://developers.google.com/maps/documentation/places/web-service/place-details
 */
async function fetchGoogleReviews(placeId) {
  const cacheKey = `reviews_${placeId}`;
  const cached = reviewsCache.get(cacheKey);
  
  // Return cached data if still fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Check circuit breaker before making API call
  if (!reviewsBreaker.shouldAttemptCall()) {
    if (import.meta.env.DEV) {
      console.warn('Circuit breaker OPEN for reviews API - using cached/fallback data');
    }
    // Return stale cache if available, otherwise null
    return cached?.data || null;
  }

  try {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      if (import.meta.env.DEV) {
        console.warn('Google Places API key not configured');
      }
      return null;
    }

    // Use Places API (New) with minimal field mask to reduce costs
    const fields = 'reviews,rating,userRatingCount';
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': fields
      }
    });

    if (!response.ok) {
      // Record failure in circuit breaker (opens after 5 quota errors)
      reviewsBreaker.recordFailure(response.status);
      
      if (import.meta.env.DEV && (response.status === 429 || response.status === 403)) {
        console.error(`Google Places API quota error (${response.status}) - circuit breaker triggered`);
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the results for 24 hours
    reviewsCache.set(cacheKey, {
      data: data.reviews || [],
      timestamp: Date.now()
    });

    // Reset circuit breaker on successful call
    reviewsBreaker.reset();

    return data.reviews || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to fetch Google reviews:', error);
    }
    
    // Return stale cache if available
    if (cached?.data) {
      if (import.meta.env.DEV) {
        console.warn('Using stale cached reviews due to API error');
      }
      return cached.data;
    }
    
    return null;
  }
}

/**
 * Format relative time (e.g., "2 months ago")
 */
function formatRelativeTime(publishTime) {
  if (!publishTime) return '';
  
  const date = new Date(publishTime);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Star Rating Component
 * Follows Material Design guidelines for rating display
 */
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          className="transition-all"
          fill={star <= rating ? 'var(--color-accent)' : 'transparent'}
          stroke={star <= rating ? 'var(--color-accent)' : 'var(--color-on-footer-muted)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/**
 * Review Card Component
 * Displays individual review with author attribution per Google's requirements
 */
function ReviewCard({ review, prefersReducedMotion }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const reviewText = review.text?.text || review.text?.originalText || '';
  const needsTruncation = reviewText.length > maxLength;

  const displayText = isExpanded || !needsTruncation
    ? reviewText
    : `${reviewText.substring(0, maxLength)}...`;

  // Format relative time (Google requirement)
  const relativeTime = formatRelativeTime(review.publishTime);
  
  // Author attribution (required by Google)
  const authorName = review.authorAttribution?.displayName || 'Google User';
  const authorUri = review.authorAttribution?.uri;
  const authorPhoto = review.authorAttribution?.photoUri;

  return (
    <article 
      className="flex-shrink-0 w-full p-6 rounded-xl transition-all duration-300"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-soft)',
        willChange: 'transform',
        transform: 'translateZ(0)', // Hardware acceleration for smooth animations
        transitionDuration: prefersReducedMotion ? '0ms' : undefined
      }}
      onMouseEnter={(e) => {
        if (prefersReducedMotion) return;
        e.currentTarget.style.transform = 'scale(1.02) translateZ(0)';
      }}
      onMouseLeave={(e) => {
        if (prefersReducedMotion) return;
        e.currentTarget.style.transform = 'scale(1) translateZ(0)';
      }}
    >
      {/* Author Header */}
      <div className="flex items-start gap-3 mb-4">
        {authorPhoto && (
          <img 
            src={authorPhoto} 
            alt={`${authorName}'s profile`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
        )}
        {!authorPhoto && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)'
            }}
          >
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {authorUri ? (
            <a
              href={authorUri}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-base hover:underline truncate block"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {authorName}
            </a>
          ) : (
            <h3 
              className="font-semibold text-base truncate"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {authorName}
            </h3>
          )}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating || 5} />
            {relativeTime && (
              <span 
                className="text-xs"
                style={{ color: 'var(--color-on-surface-muted)' }}
              >
                {relativeTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review Text */}
      {reviewText && (
        <div className="mt-3">
          <p 
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--color-on-surface-muted)' }}
          >
            {displayText}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm font-medium hover:underline focus:outline-none focus:underline transition-all"
              style={{ color: 'var(--color-accent)' }}
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Main GoogleReviews Component
 * Modern carousel with smooth animations and proper accessibility
 * 
 * Automatically fetches reviews for the nearest location to the user,
 * or falls back to primary (HQ) location if user location unavailable.
 */
export default function GoogleReviews() {
  const { nearestLocation } = useLocationContext();
  const placeId = nearestLocation?.google?.placeId;

  const [reviews, setReviews] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!!placeId); // Only load if placeId exists
  const [error, setError] = useState(!placeId); // Error if no placeId
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const intervalRef = useRef(null);

  // Fetch reviews on mount
  useEffect(() => {
    if (!placeId) {
      // No placeId, already set error state in initialization
      return;
    }

    let isMounted = true;

    fetchGoogleReviews(placeId)
      .then(data => {
        if (!isMounted) return;
        
        if (data && data.length > 0) {
          // Filter and sort reviews: only text reviews, highest rated first
          const topReviews = data
            .filter(r => r.text?.text || r.text?.originalText)
            .sort((a, b) => {
              // Prioritize 5-star reviews, then by date
              if (b.rating !== a.rating) return b.rating - a.rating;
              return new Date(b.publishTime) - new Date(a.publishTime);
            })
            .slice(0, 10); // Limit to top 10 reviews
          
          setReviews(topReviews);
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  // Respect reduced motion preferences
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!reviews || reviews.length <= 1 || isPaused || prefersReducedMotion) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reviews, isPaused, prefersReducedMotion]);

  const goToNext = useCallback(() => {
    if (reviews && reviews.length > 1) {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }
  }, [reviews]);

  const goToPrev = useCallback(() => {
    if (reviews && reviews.length > 1) {
      setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
    }
  }, [reviews]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div 
          className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
          role="status"
          aria-label="Loading reviews"
        />
        <p 
          className="mt-4 text-base font-inter"
          style={{ color: 'var(--color-on-footer-muted)' }}
        >
          Loading reviews...
        </p>
      </div>
    );
  }

  // Error/fallback state
  if (error || !reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div 
          className="text-base font-inter"
          style={{ color: 'var(--color-on-footer-muted)' }}
        >
          <span>We value your feedback!&nbsp;</span>
          <a
            href={nearestLocation?.google?.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-accent)' }}
          >
            View our Google Reviews
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--color-on-footer)' }}
        >
          What Our Customers Say
        </h2>
        <p 
          className="text-sm md:text-base"
          style={{ color: 'var(--color-on-footer-muted)' }}
        >
          Read reviews from our valued customers
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-0 md:-left-16 top-1/2 z-10 p-3 rounded-full transition-all focus:outline-none hidden md:flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                boxShadow: 'var(--shadow-soft)',
                transform: 'translateY(-50%)',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (prefersReducedMotion) return;
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                if (prefersReducedMotion) return;
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-soft), var(--focus-ring)'; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}
              aria-label="Previous review"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 md:-right-16 top-1/2 z-10 p-3 rounded-full transition-all focus:outline-none hidden md:flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                boxShadow: 'var(--shadow-soft)',
                transform: 'translateY(-50%)',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (prefersReducedMotion) return;
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                if (prefersReducedMotion) return;
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-soft), var(--focus-ring)'; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}
              aria-label="Next review"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Reviews Display */}
        <div className="overflow-hidden rounded-xl" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
              willChange: 'transform',
              transitionDuration: prefersReducedMotion ? '0ms' : undefined
            }}
          >
            {reviews.map((review, idx) => (
              <div key={idx} className="w-full flex-shrink-0 px-2">
                <ReviewCard review={review} prefersReducedMotion={prefersReducedMotion} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8" aria-label="Review navigation">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  width: idx === currentIndex ? '32px' : '8px',
                  height: '8px',
                  backgroundColor: idx === currentIndex 
                    ? 'var(--color-accent)' 
                    : 'var(--color-on-footer-muted)',
                  opacity: idx === currentIndex ? 1 : 0.5
                }}
                aria-label={`Go to review ${idx + 1}`}
                aria-pressed={idx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <a
          href={nearestLocation?.google?.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all focus:outline-none"
          style={{ 
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-on-accent)',
            boxShadow: 'var(--shadow-soft)',
            textDecoration: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onFocus={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-soft), var(--focus-ring)'; }}
          onBlur={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}
        >
          View all reviews on Google
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
