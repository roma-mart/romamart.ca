import React from 'react';
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';

export default function TrustSignal({ placeId, mapLink }) {
  const { rating, userRatingCount } = useGooglePlaceHours(placeId || null);

  if (!rating || !userRatingCount || !mapLink) return null;

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
