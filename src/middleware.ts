import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './enums';

const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard/new-post': [UserRole.ADMIN],
  '/dashboard/': [UserRole.USER, UserRole.ADMIN],
};

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('isAuthenticated');
  const userRole = request.cookies.get('userRole')?.value as UserRole;

  if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    const dashboardUrl =
      userRole === 'admin' ? '/dashboard/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard') && isAuthenticated) {
    const path = request.nextUrl.pathname;
    const allowedRoles = ROUTE_PERMISSIONS[path];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      const dashboardUrl =
        userRole === 'admin' ? '/dashboard/admin' : '/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
