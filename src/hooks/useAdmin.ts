import { useAuth } from './useAuth';

export function useAdmin() {
  const { userRole, loading } = useAuth();
  const isAdmin = userRole === 'admin';

  return { isAdmin, loading };
}
