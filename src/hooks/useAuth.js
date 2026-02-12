import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to access the compliance auth context.
 *
 * Returns:
 * - user: { id, name, role, locationId } | null
 * - loading: boolean (true during initial session restore)
 * - error: { code, message, retryAfter? } | null
 * - login(phone, pin): Promise<{ success, error? }>
 * - logout(): Promise<void>
 * - getAccessToken(): string | null (for API service layer)
 * - isAuthenticated: boolean
 * - role: 'staff' | 'manager' | null
 *
 * @module hooks/useAuth
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
