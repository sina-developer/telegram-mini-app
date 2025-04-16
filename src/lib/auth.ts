import Cookies from 'js-cookie';

export type UserRole = 'user' | 'admin';

interface User {
  email: string;
  password: string;
  role: UserRole;
}

const DUMMY_USERS: User[] = [
  {
    email: 'test@gmail.com',
    password: '12345678',
    role: 'user',
  },
  {
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  },
];

interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = DUMMY_USERS.find(
    (user) =>
      user.email === credentials.email && user.password === credentials.password
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

    return true;
  }

  return false;
}

export function logout(): void {
  Cookies.remove('isAuthenticated', { path: '/' });
  Cookies.remove('userRole', { path: '/' });
}

export function isAuthenticated(): boolean {
  return Cookies.get('isAuthenticated') === 'true';
}

export function getUserRole(): UserRole | null {
  const role = Cookies.get('userRole') as UserRole;
  return role || null;
}

export function hasRole(requiredRole: UserRole): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (userRole === 'admin') return true;

  return userRole === requiredRole;
}
