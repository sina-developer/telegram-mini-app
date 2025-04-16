import { useState, useEffect } from 'react';
import { UserRole } from '@/enums';
import { useAuth } from '@/contexts/auth.context';

export function useRequireAuth(requiredRole?: UserRole) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
      } else if (!requiredRole) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(userRole === 'admin' || userRole === requiredRole);
      }
    }
  }, [isAuthenticated, userRole, requiredRole, loading]);

  return { isAuthorized, loading };
}
