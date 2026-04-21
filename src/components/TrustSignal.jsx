import React from 'react';
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';
import { PLACES_GLOBAL_KEY } from '../config/company_data';

export default function TrustSignal({ placeId, mapLink }) {
  const injected = typeof window !== 'undefined' ? window[PLACES_GLOBAL_KEY] : null;
  const { rating: hookRating, userRatingCount: hookCount } = useGooglePlaceHours(injected ? null : placeId);
  const rating = injected?.ratingValue ?? hookRating;
  const userRatingCount = injected?.reviewCount ?? hookCount;

  if (
    rating === null ||
    rating === undefined ||
    userRatingCount === null ||
    (userRatingCount === undefined) | (userRatingCount === null) ||
    userRatingCount === undefined ||
    !mapLink
  )
    return null;

  const ratingDisplay = Number(rating).toFixed(1);
  const countDisplay = Number(userRatingCount).toLocaleString();

  return (
    <a
      href={mapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
      style={{ color: 'var(--color-accent)' }}
      aria-label={`${ratingDisplay} stars from ${countDisplay} Google reviews — view on Google Maps`}
    >
      <span aria-hidden="true">&#9733;</span>
      {ratingDisplay} &middot; {countDisplay} Google reviews
    </a>
  );
}
