import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { complianceApi } from '../services/api';

/**
 * AuthContext -- Authentication state for compliance system (/internal/*).
 *
 * Implements the hybrid auth model (D18):
 * - httpOnly Secure SameSite=None cookie for session persistence (set by backend)
 * - Short-lived access token stored in JS memory only (HSC-01)
 *
 * Features:
 * - Silent refresh on mount via GET /auth/me (restores session after reload)
 * - BroadcastChannel multi-tab logout sync (HSC-08)
 * - Login with phone + PIN, rate-limit-aware
 * - Role state (staff | manager) for UX guards (not security -- HSC-04)
 *
 * @module contexts/AuthContext
 */
const AuthContext = createContext(null);

const BROADCAST_CHANNEL_NAME = 'roma-mart-internal-auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessTokenRef = useRef(null); // HSC-01: token in memory only
  const channelRef = useRef(null);
  const hasPersistedStorage = useRef(false);

  /**
   * Get current access token (for API service layer).
   * Never exposes token outside JS memory.
   */
  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  /**
   * Set auth state from a successful login/refresh response.
   */
  const setAuthState = useCallback((data) => {
    accessTokenRef.current = data.accessToken;
    setUser(data.employee);
    setError(null);
  }, []);

  /**
   * Clear all auth state.
   */
  const clearAuthState = useCallback(() => {
    accessTokenRef.current = null;
    setUser(null);
    setError(null);
  }, []);

  /**
   * Silent refresh -- restore session from httpOnly cookie via GET /auth/me.
   * Called on initial mount and when other tabs broadcast a login.
   */
  const silentRefresh = useCallback(async () => {
    try {
      const result = await complianceApi('/auth/me', { method: 'GET' });
      if (result.success && result.data) {
        setAuthState(result.data);
        return true;
      }
      clearAuthState();
      return false;
    } catch {
      clearAuthState();
      return false;
    }
  }, [setAuthState, clearAuthState]);

  /**
   * Login with phone + PIN.
   * Returns { success, error? } so the login page can display errors.
   */
  const login = useCallback(
    async (phone, pin) => {
      setError(null);

      const result = await complianceApi('/auth/login', {
        method: 'POST',
        body: { phone, pin },
      });

      if (result.success && result.data) {
        setAuthState(result.data);

        // Request persistent storage on first login (Safari eviction protection)
        if (!hasPersistedStorage.current && navigator.storage?.persist) {
          try {
            await navigator.storage.persist();
            hasPersistedStorage.current = true;
          } catch {
            // Non-critical -- log in dev only
            if (import.meta.env.DEV) {
              console.warn('[Auth] navigator.storage.persist() failed');
            }
          }
        }

        // Notify other tabs of login
        try {
          channelRef.current?.postMessage({ type: 'auth:login' });
        } catch {
          // BroadcastChannel may not be available
        }

        return { success: true };
      }

      // Login failed -- surface error
      const errObj = result.error || { code: 'UNKNOWN', message: 'Login failed' };
      setError(errObj);
      return { success: false, error: errObj };
    },
    [setAuthState]
  );

  /**
   * Logout -- clear session, notify server (best-effort), broadcast to tabs.
   */
  const logout = useCallback(async () => {
    // Best-effort server notification
    try {
      await complianceApi('/auth/logout', {
        method: 'POST',
        accessToken: accessTokenRef.current,
      });
    } catch {
      // Clear local state regardless
    }

    clearAuthState();

    // Broadcast to other tabs (HSC-08)
    try {
      channelRef.current?.postMessage({ type: 'auth:logout' });
    } catch {
      // BroadcastChannel may not be available
    }
  }, [clearAuthState]);

  // --- BroadcastChannel setup ---
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'auth:logout') {
          clearAuthState();
        } else if (event.data?.type === 'auth:login') {
          silentRefresh();
        }
      };

      return () => {
        channel.close();
        channelRef.current = null;
      };
    } catch {
      // BroadcastChannel not supported -- degrade gracefully (single-tab)
      return undefined;
    }
  }, [clearAuthState, silentRefresh]);

  // --- Initial silent refresh on mount ---
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      const result = await complianceApi('/auth/me', { method: 'GET' });

      if (cancelled) return;

      if (result.success && result.data) {
        setAuthState(result.data);
      } else {
        clearAuthState();
      }
      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [setAuthState, clearAuthState]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    getAccessToken,
    isAuthenticated: !!user,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export default AuthContext;
