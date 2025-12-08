/**
 * ErrorBoundary.jsx
 * Site-wide error boundary for Roma Mart 2.0
 * Implements systematic, standards-based error handling (see DEVELOPMENT_ETHOS.md)
 * Usage: Wrap <App /> or critical components in <ErrorBoundary>
 */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Optionally log error to external service here
    // e.g., window.dataLayer?.push({ event: 'error', error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ color: 'var(--color-error)', background: 'var(--color-surface)', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem' }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && '\n' + this.state.errorInfo.componentStack}
          </pre>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
