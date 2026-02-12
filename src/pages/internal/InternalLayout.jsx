import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getQueueStatus, drainQueue, checkEviction } from '../../services/submitQueue';
import { compliancePost } from '../../services/api';
import { getInternalUrl, MANAGER_ONLY_PATHS } from '../../utils/internalRoutes';
import { useToast } from '../../components/ToastContainer';

/**
 * Internal Layout Shell -- Authenticated container for all /internal/* pages.
 *
 * - Desktop (>=768px): left sidebar + main content
 * - Mobile (<768px): full-width content + fixed bottom nav
 * - Auth guard: redirects unauthenticated users, checks role for manager-only routes
 * - Queue badge: pending=amber, failed=red, 0=hidden
 * - Safe-area insets for iPhone bottom nav
 *
 * @module pages/internal/InternalLayout
 */

// Navigation items for internal pages
const NAV_ITEMS = [
  { path: '/internal/dashboard', label: 'Dashboard', icon: '📊', sprint: 2 },
  { path: '/internal/logs', label: 'Logs', icon: '📋', sprint: 1 },
  { path: '/internal/signoff', label: 'Signoff', icon: '✅', managerOnly: true, sprint: 2 },
  { path: '/internal/alerts', label: 'Alerts', icon: '🔔', sprint: 2 },
  { path: '/internal/training', label: 'Training', icon: '📚', sprint: 3 },
];

function QueueBadge({ pending, failed }) {
  if (pending === 0 && failed === 0) return null;

  const hasFailed = failed > 0;
  const count = hasFailed ? failed : pending;

  return (
    <span
      className="inline-flex items-center justify-center text-xs font-bold rounded-full"
      style={{
        minWidth: '20px',
        height: '20px',
        padding: '0 6px',
        backgroundColor: hasFailed ? 'var(--internal-status-critical)' : 'var(--internal-status-warning)',
        color: hasFailed ? 'var(--internal-status-on-critical)' : 'var(--internal-status-on-warning)',
      }}
      aria-label={hasFailed ? `${failed} failed entries` : `${pending} pending entries`}
    >
      {count}
    </span>
  );
}

function NavItem({ item, isActive, onClick, queueBadge }) {
  return (
    <button
      onClick={() => onClick(item.path)}
      className="flex items-center gap-3 w-full px-3 rounded-lg transition-colors text-left"
      style={{
        minHeight: '44px',
        backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
        color: isActive ? 'var(--color-on-accent)' : 'var(--internal-text)',
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-lg" aria-hidden="true">
        {item.icon}
      </span>
      <span className="flex-1 text-sm font-medium">{item.label}</span>
      {item.label === 'Logs' && queueBadge}
      {item.managerOnly && (
        <span className="text-xs opacity-60" aria-label="Manager only">
          M
        </span>
      )}
    </button>
  );
}

function BottomNavItem({ item, isActive, onClick, queueBadge }) {
  return (
    <button
      onClick={() => onClick(item.path)}
      className="flex flex-col items-center justify-center flex-1 relative"
      style={{
        minHeight: '44px',
        color: isActive ? 'var(--color-accent)' : 'var(--internal-text-muted)',
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-lg relative" aria-hidden="true">
        {item.icon}
        {item.label === 'Logs' && queueBadge && <span className="absolute -top-1 -right-2">{queueBadge}</span>}
      </span>
      <span className="text-xs mt-0.5">{item.label}</span>
    </button>
  );
}

// Placeholder page for sprints not yet implemented
function PlaceholderPage({ label, sprint }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div
        className="text-center p-8 rounded-xl"
        style={{
          backgroundColor: 'var(--internal-surface)',
          border: '1px solid var(--internal-border)',
        }}
      >
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--internal-text)' }}
        >
          {label}
        </h2>
        <p style={{ color: 'var(--internal-text-muted)' }}>Coming in Sprint {sprint}</p>
      </div>
    </div>
  );
}

function DashboardStub({ user }) {
  return (
    <div className="p-4 md:p-6">
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--internal-text)' }}
      >
        Dashboard
      </h2>
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: 'var(--internal-surface)',
          border: '1px solid var(--internal-border)',
        }}
      >
        <p style={{ color: 'var(--internal-text)' }}>
          Welcome, <strong>{user?.name || 'Staff'}</strong>
          <span
            className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor:
                user?.role === 'manager' ? 'var(--internal-status-good-bg)' : 'var(--internal-status-neutral-bg)',
              color: user?.role === 'manager' ? 'var(--internal-status-good)' : 'var(--internal-status-neutral)',
            }}
          >
            {user?.role || 'staff'}
          </span>
        </p>
        <p className="mt-2" style={{ color: 'var(--internal-text-muted)' }}>
          Dashboard data will be available in Sprint 2.
        </p>
      </div>
    </div>
  );
}

export default function InternalLayout({ pathname }) {
  const { user, loading, isAuthenticated, logout, role, getAccessToken } = useAuth();
  const { showInfo } = useToast();
  const [queueStatus, setQueueStatus] = useState({ pending: 0, failed: 0 });
  const [authBanner, setAuthBanner] = useState(false);
  const lastPendingCountRef = useRef(0);

  // Determine active internal sub-path
  const subPath = useMemo(() => {
    const internalPrefix = '/internal';
    const idx = pathname.indexOf(internalPrefix);
    if (idx === -1) return '/internal/dashboard';
    const sub = pathname.substring(idx);
    return sub.replace(/\/+$/, '') || '/internal/dashboard';
  }, [pathname]);

  // Refresh queue status helper
  const refreshQueueStatus = useCallback(async () => {
    try {
      const status = await getQueueStatus();
      lastPendingCountRef.current = status.pending;
      setQueueStatus({ pending: status.pending, failed: status.failed });
    } catch {
      // Queue not available yet -- ignore
    }
  }, []);

  // Attempt to drain the queue and refresh status afterward
  const attemptDrain = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const result = await drainQueue(getAccessToken, compliancePost);
      if (result.authRequired) {
        setAuthBanner(true);
      }
      // Always refresh status after drain attempt
      await refreshQueueStatus();
    } catch {
      // Drain failed -- status will be refreshed on next poll
    }
  }, [isAuthenticated, getAccessToken, refreshQueueStatus]);

  // Poll queue status + eviction check on visibilitychange
  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (cancelled) return;
      await refreshQueueStatus();
    }

    check();
    const interval = setInterval(check, 10000); // Check every 10s

    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        // Check for unexpected eviction (Safari ITP, storage pressure)
        try {
          const evictionResult = await checkEviction(lastPendingCountRef.current);
          if (evictionResult.evictionDetected && import.meta.env.DEV) {
            console.warn('[InternalLayout] Queue eviction detected');
          }
        } catch {
          // Non-critical
        }
        await check();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshQueueStatus]);

  // Drain queue when connectivity is restored
  useEffect(() => {
    const handleOnline = () => {
      attemptDrain();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [attemptDrain]);

  // Navigate within internal routes
  const navigate = useCallback((path) => {
    const fullPath = getInternalUrl(path);
    window.history.pushState({}, '', fullPath);
    // Trigger a re-render by dispatching a popstate event
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const handleNavClick = useCallback(
    (path) => {
      // UX-only role check (HSC-04: security is backend-enforced)
      if (MANAGER_ONLY_PATHS.includes(path) && role !== 'manager') {
        showInfo('This section is restricted to managers.');
        navigate('/internal/dashboard');
        return;
      }
      navigate(path);
    },
    [navigate, role, showInfo]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    window.location.assign(getInternalUrl('/internal/login'));
  }, [logout]);

  // Auth guard: redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.assign(getInternalUrl('/internal/login'));
    }
  }, [loading, isAuthenticated]);

  // Auth guard: loading spinner
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--internal-bg)', color: 'var(--internal-text)' }}
      >
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--internal-border)', borderTopColor: 'var(--color-accent)' }}
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const queueBadge = <QueueBadge pending={queueStatus.pending} failed={queueStatus.failed} />;

  // Render the appropriate sub-page
  const renderContent = () => {
    switch (subPath) {
      case '/internal/dashboard':
      case '/internal':
        return <DashboardStub user={user} />;
      case '/internal/logs':
        return <PlaceholderPage label="Compliance Logs" sprint={1} />;
      case '/internal/signoff':
        return <PlaceholderPage label="Daily Signoff" sprint={2} />;
      case '/internal/alerts':
        return <PlaceholderPage label="Alerts" sprint={2} />;
      case '/internal/training':
        return <PlaceholderPage label="Training Matrix" sprint={3} />;
      default:
        return <DashboardStub user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--internal-bg)', color: 'var(--internal-text)' }}>
      {/* Desktop sidebar (hidden on mobile) */}
      <aside
        className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 p-4"
        style={{
          backgroundColor: 'var(--internal-surface)',
          borderRight: '1px solid var(--internal-border)',
        }}
      >
        {/* Brand header */}
        <div className="mb-6">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--internal-text)' }}
          >
            Roma Mart
          </h2>
          <p className="text-xs" style={{ color: 'var(--internal-text-muted)' }}>
            Compliance System
          </p>
        </div>

        {/* User info */}
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--internal-bg)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--internal-text)' }}>
            {user?.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--internal-text-muted)' }}>
            {user?.role === 'manager' ? 'Manager' : 'Staff'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1" aria-label="Internal navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isActive={subPath === item.path}
              onClick={handleNavClick}
              queueBadge={item.label === 'Logs' ? queueBadge : null}
            />
          ))}
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full px-3 rounded-lg text-sm font-medium transition-colors text-left"
          style={{
            minHeight: '44px',
            color: 'var(--internal-status-critical)',
          }}
        >
          Sign Out
        </button>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header (hidden on desktop) */}
        <header
          className="md:hidden flex items-center justify-between px-4"
          style={{
            height: '56px',
            backgroundColor: 'var(--internal-surface)',
            borderBottom: '1px solid var(--internal-border)',
          }}
        >
          <div>
            <h2
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--internal-text)' }}
            >
              Roma Mart
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {queueBadge}
            <button
              onClick={handleLogout}
              className="text-sm font-medium"
              style={{ color: 'var(--internal-status-critical)', minHeight: '44px', minWidth: '44px' }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Auth re-login banner (shown when queue drain encounters expired session) */}
        {authBanner && (
          <div
            role="alert"
            className="mx-4 mt-2 p-3 rounded-lg text-sm flex items-center justify-between"
            style={{
              backgroundColor: 'var(--internal-status-warning-bg)',
              color: 'var(--internal-status-warning)',
              border: '1px solid var(--internal-status-warning)',
            }}
          >
            <span>Session expired. Please sign in again to sync pending entries.</span>
            <button
              onClick={() => setAuthBanner(false)}
              className="ml-2 font-bold text-base"
              style={{ minWidth: '44px', minHeight: '44px', color: 'var(--internal-status-warning)' }}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">{renderContent()}</main>

        {/* Mobile bottom nav (hidden on desktop) */}
        <nav
          className="md:hidden flex items-center justify-around"
          style={{
            backgroundColor: 'var(--internal-surface)',
            borderTop: '1px solid var(--internal-border)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            minHeight: '56px',
          }}
          aria-label="Internal navigation"
        >
          {NAV_ITEMS.map((item) => (
            <BottomNavItem
              key={item.path}
              item={item}
              isActive={subPath === item.path}
              onClick={handleNavClick}
              queueBadge={item.label === 'Logs' ? queueBadge : null}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
