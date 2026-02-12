import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { resetMockState } from '../../services/mockApi';

/**
 * AuthContext tests -- validates auth lifecycle, login/logout, role state.
 * Uses the mock API (no VITE_API_URL set).
 */

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    resetMockState();
  });

  it('starts with loading=true then resolves to unauthenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for silent refresh to complete (will fail since no session)
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('login with staff credentials sets isAuthenticated and role', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('5191234567', '1234');
    });

    expect(loginResult.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.role).toBe('staff');
    expect(result.current.user.name).toBe('Test Staff');
  });

  it('login with manager credentials sets manager role', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.login('5199876543', '0000');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.role).toBe('manager');
  });

  it('login with wrong PIN returns error', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('5191234567', '9999');
    });

    expect(loginResult.success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('logout clears auth state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Login first
    await act(async () => {
      await result.current.login('5191234567', '1234');
    });
    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('getAccessToken returns token after login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Before login
    expect(result.current.getAccessToken()).toBeNull();

    await act(async () => {
      await result.current.login('5191234567', '1234');
    });

    // After login
    const token = result.current.getAccessToken();
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    spy.mockRestore();
  });
});
