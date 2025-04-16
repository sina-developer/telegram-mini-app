'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { UserRole } from '@/enums';
import { AuthState, LoginCredentials, User } from '@/types';
import Cookies from 'js-cookie';

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

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
