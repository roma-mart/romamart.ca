/**
 * LoadingFallback.jsx
 * Branded loading spinner for Suspense fallback and lazy-loaded pages.
 */

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-accent)' }}></div>
      <p className="mt-4 font-inter" style={{ color: 'var(--color-text)' }}>Loading...</p>
    </div>
  </div>
);

export default LoadingFallback;
