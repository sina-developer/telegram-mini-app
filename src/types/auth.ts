import { UserRole, AuthStatus } from '@/enums';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  status: AuthStatus;
  user: User | null;
}
