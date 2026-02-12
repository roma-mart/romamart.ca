import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getInternalUrl } from '../../utils/internalRoutes';

/**
 * Internal Login Page -- Phone + 4-digit PIN authentication.
 *
 * Mobile-first, accessible (WCAG 2.2 AA), dark mode compatible.
 * Touch targets >= 44px. Rate limiting display with lockout countdown.
 *
 * @module pages/internal/LoginPage
 */

export default function LoginPage() {
  const { login, loading: authLoading, isAuthenticated } = useAuth();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const phoneRef = useRef(null);
  const lockoutTimerRef = useRef(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.assign(getInternalUrl('/internal/dashboard'));
    }
  }, [isAuthenticated, authLoading]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    lockoutTimerRef.current = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(lockoutTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(lockoutTimerRef.current);
  }, [lockoutSeconds]);

  // Focus phone input on mount
  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

  const isLocked = lockoutSeconds > 0;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      // Client-side validation
      if (!/^\d{10}$/.test(phone)) {
        setError({ code: 'VALIDATION_ERROR', message: 'Phone must be 10 digits' });
        return;
      }
      if (!/^\d{4}$/.test(pin)) {
        setError({ code: 'VALIDATION_ERROR', message: 'PIN must be 4 digits' });
        return;
      }

      setSubmitting(true);
      const result = await login(phone, pin);
      setSubmitting(false);

      if (result.success) {
        window.location.assign(getInternalUrl('/internal/dashboard'));
      } else if (result.error) {
        setError(result.error);
        if (result.error.code === 'RATE_LIMITED' && result.error.retryAfter) {
          setLockoutSeconds(result.error.retryAfter);
        }
      }
    },
    [phone, pin, login]
  );

  // Handle phone input -- digits only
  const handlePhoneChange = useCallback((e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  }, []);

  // Handle PIN input -- digits only
  const handlePinChange = useCallback((e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(digits);
  }, []);

  const formatLockoutTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--internal-bg)', color: 'var(--internal-text)' }}
      >
        <div className="text-center">
          <div
            className="inline-block w-8 h-8 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'var(--internal-border)',
              borderTopColor: 'var(--color-accent)',
            }}
            role="status"
            aria-label="Loading"
          />
          <p className="mt-4" style={{ color: 'var(--internal-text-muted)' }}>
            Restoring session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--internal-bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 shadow-lg"
        style={{
          backgroundColor: 'var(--internal-surface)',
          border: '1px solid var(--internal-border)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--internal-text)' }}
          >
            Roma Mart
          </h1>
          <p style={{ color: 'var(--internal-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Staff Compliance Portal
          </p>
        </div>

        {/* Error display */}
        <div aria-live="polite" aria-atomic="true">
          {error && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--internal-status-critical-bg)',
                color: 'var(--internal-status-critical)',
                border: '1px solid var(--internal-status-critical)',
              }}
            >
              {error.message || 'Login failed. Please try again.'}
            </div>
          )}
        </div>

        {/* Lockout display */}
        {isLocked && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg text-sm text-center"
            style={{
              backgroundColor: 'var(--internal-status-warning-bg)',
              color: 'var(--internal-status-warning)',
              border: '1px solid var(--internal-status-warning)',
            }}
          >
            <p className="font-semibold">Too many attempts</p>
            <p>Try again in {formatLockoutTime(lockoutSeconds)}</p>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="login-phone"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--internal-text)' }}
            >
              Phone Number
            </label>
            <input
              id="login-phone"
              ref={phoneRef}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              pattern="[0-9]{10}"
              placeholder="5191234567"
              value={phone}
              onChange={handlePhoneChange}
              disabled={submitting || isLocked}
              required
              aria-label="Phone number (10 digits)"
              aria-describedby="phone-hint"
              className="w-full rounded-lg px-4 text-base"
              style={{
                height: '48px',
                minHeight: '44px',
                backgroundColor: 'var(--internal-bg)',
                color: 'var(--internal-text)',
                border: '1px solid var(--internal-border)',
              }}
            />
            <p id="phone-hint" className="mt-1 text-xs" style={{ color: 'var(--internal-text-muted)' }}>
              10-digit phone number
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="login-pin"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--internal-text)' }}
            >
              PIN
            </label>
            <input
              id="login-pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              maxLength={4}
              pattern="[0-9]{4}"
              placeholder="••••"
              value={pin}
              onChange={handlePinChange}
              disabled={submitting || isLocked}
              required
              aria-label="4-digit PIN"
              aria-describedby="pin-hint"
              className="w-full rounded-lg px-4 text-base"
              style={{
                height: '48px',
                minHeight: '44px',
                backgroundColor: 'var(--internal-bg)',
                color: 'var(--internal-text)',
                border: '1px solid var(--internal-border)',
              }}
            />
            <p id="pin-hint" className="mt-1 text-xs" style={{ color: 'var(--internal-text-muted)' }}>
              4-digit numeric PIN
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || isLocked || phone.length !== 10 || pin.length !== 4}
            className="w-full rounded-lg font-semibold text-base transition-colors"
            style={{
              height: '48px',
              minHeight: '44px',
              backgroundColor: submitting || isLocked ? 'var(--internal-border)' : 'var(--color-accent)',
              color: submitting || isLocked ? 'var(--internal-text-muted)' : 'var(--color-on-accent)',
              cursor: submitting || isLocked ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'transparent', borderTopColor: 'currentColor' }}
                />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
