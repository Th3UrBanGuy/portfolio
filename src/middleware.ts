import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';

  // Protect all /admin routes except for /auth itself
  if (pathname.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // If the user is authenticated and tries to visit /auth, redirect to admin
  if (pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth'],
};
