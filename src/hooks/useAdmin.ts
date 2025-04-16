import { useAuth } from '@/contexts/auth.context';

export function useAdmin() {
  const { userRole, loading } = useAuth();
  const isAdmin = userRole === 'admin';

  return { isAdmin, loading };
}
