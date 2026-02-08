/**
 * ErrorBoundary.jsx
 * Site-wide error boundary for Roma Mart 2.0
 * Implements systematic, standards-based error handling (see DEVELOPMENT_ETHOS.md)
 * Usage: Wrap <App /> or critical components in <ErrorBoundary>
 */
import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleReload = () => window.location.reload();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error);
    if (import.meta.env.DEV) {
      console.error('Component stack:', errorInfo.componentStack);
    }
    window.dataLayer?.push({
      event: 'error',
      error_message: error?.toString(),
      error_source: 'ErrorBoundary'
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-[60vh] flex items-center justify-center px-4"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-2xl text-center"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--color-error-bg, var(--color-surface))' }}
            >
              <span className="text-3xl" aria-hidden="true">!</span>
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{
                color: 'var(--color-heading)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Oops! Something went wrong
            </h2>
            <p
              className="mb-6"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Try refreshing the page or go back to the home page.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="inverted"
                onClick={this.handleReload}
              >
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                href={import.meta.env.BASE_URL || "/"}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
