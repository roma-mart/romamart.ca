/**
 * FooterReviews.jsx
 * Google Reviews rating display for the Footer.
 */
import useGooglePlaceHours from '../hooks/useGooglePlaceHours';

const renderStars = (ratingValue) => {
  if (!ratingValue) return '\u2B50\u2B50\u2B50\u2B50\u2B50';
  const clampedRating = Math.min(5, Math.max(0, ratingValue));
  const roundedRating = Math.round(clampedRating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating - fullStars === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return '\u2B50'.repeat(fullStars) + (hasHalfStar ? '\u2BE8' : '') + '\u2606'.repeat(Math.max(0, emptyStars));
};

export default function FooterReviews({ currentLocation, locations }) {
  const { rating, userRatingCount } = useGooglePlaceHours(currentLocation?.google?.placeId || null);

  const ratingDisplay = rating ? Number(rating).toFixed(1) : null;
  const reviewCountDisplay = userRatingCount ? userRatingCount.toLocaleString() : null;

  const primaryLocation = locations?.find((loc) => loc.isPrimary) || locations?.[0];
  const mapLink = currentLocation?.google?.mapLink || primaryLocation?.google?.mapLink || '';

  // Don't render the review link if there's no valid map URL
  if (!mapLink) return null;

  return (
    <div className="mb-16 flex justify-center">
      <div
        className="w-full max-w-3xl mx-4 px-8 py-8 rounded-2xl shadow-lg"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <div className="text-center">
          {rating ? (
            <div className="mb-3">
              <div className="text-5xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>
                {ratingDisplay}
              </div>
              <div className="text-2xl mb-1">{renderStars(rating)}</div>
              {reviewCountDisplay && (
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Based on {reviewCountDisplay} reviews
                </p>
              )}
            </div>
          ) : (
            <div className="text-4xl mb-3">{'\u2B50\u2B50\u2B50\u2B50\u2B50'}</div>
          )}
          <p className="text-2xl font-bold mb-3 text-heading" style={{ color: 'var(--color-heading)' }}>
            See What Our Customers Say
          </p>
          <p className="text-base mb-6 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Read authentic reviews from our community on Google and discover why Roma Mart is Sarnia's favorite
            convenience destination.
          </p>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-heading"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 14px 0 rgba(228, 179, 64, 0.3)',
            }}
          >
            View All Reviews on Google
          </a>
        </div>
      </div>
    </div>
  );
}
