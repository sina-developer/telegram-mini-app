import { UserRole, AuthStatus } from '@/enums';

export interface User {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  userRole: UserRole | null;
  loading: boolean;
}
