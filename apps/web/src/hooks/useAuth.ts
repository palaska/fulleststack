import { useSession } from '../lib/auth-client';

/**
 * Enhanced auth hook that extends useSession with additional fields
 * @returns The session data with additional convenience fields
 */
export function useAuth() {
  const _session = useSession();
  const { user, session } = _session.data ? _session.data : { session: null, user: null }

  return {
    // Original session properties
    user,
    session,
    error: _session.error,
    isPending: _session.isPending,
    refetch: _session.refetch,

    // Additional convenience properties
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
  };
}
