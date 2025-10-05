import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Handle main admin panel authentication
  const isAdminAuthenticated = request.cookies.get('admin-auth')?.value === 'true';
  if (pathname === '/admin' && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  if (pathname === '/auth' && isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Handle link shortener authentication
  const isLinkerAuthenticated = request.cookies.get('link-auth')?.value === 'true';
   if (pathname === '/links' && !isLinkerAuthenticated) {
    return NextResponse.redirect(new URL('/links/auth', request.url));
  }
   if (pathname === '/links/auth' && isLinkerAuthenticated) {
    return NextResponse.redirect(new URL('/links', request.url));
  }


  // Let the slug-based redirect handler take care of the rest
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/'
  ],
};
