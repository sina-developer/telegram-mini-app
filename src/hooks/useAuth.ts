import { UserRole } from '@/enums';
import Cookies from 'js-cookie';
import { useState, useEffect, useCallback } from 'react';

interface User {
  email: string;
  password: string;
  role: UserRole;
}

const DUMMY_USERS: User[] = [
  {
    email: 'test@gmail.com',
    password: '12345678',
    role: UserRole.USER,
  },
  {
    email: 'admin@gmail.com',
    password: 'admin123',
    role: UserRole.ADMIN,
  },
];

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  userRole: UserRole | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    userRole: null,
    loading: true,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const role = Cookies.get('userRole') as UserRole | undefined;
    const isAuthenticated = Cookies.get('isAuthenticated') === 'true';

    setAuthState({
      userRole: role ?? null,
      loading: false,
    });
    setIsAuthenticated(isAuthenticated);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const user = DUMMY_USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      Cookies.set('isAuthenticated', 'true', {
        expires: 7,
        sameSite: 'strict',
        path: '/',
      });

      Cookies.set('userRole', user.role, {
        expires: 7,
        sameSite: 'strict',
        path: '/',
      });

      setIsAuthenticated(true);

      setAuthState({
        userRole: user.role,
        loading: false,
      });

      return true;
    }

    return false;
  };

  const logout = useCallback(() => {
    Cookies.remove('isAuthenticated', { path: '/' });
    Cookies.remove('userRole', { path: '/' });

    setIsAuthenticated(false);
    setAuthState({
      userRole: null,
      loading: false,
    });
  }, []);

  return {
    ...authState,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
