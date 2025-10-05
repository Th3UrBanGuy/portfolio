import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle main admin panel authentication
  const isAdminAuthenticated = request.cookies.get('admin-auth')?.value === 'true';
  if (pathname.startsWith('/admin') && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  if (pathname.startsWith('/auth') && isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Handle link shortener authentication
  const isLinkerAuthenticated = request.cookies.get('link-auth')?.value === 'true';
  if (pathname.startsWith('/links') && !isLinkerAuthenticated && !pathname.startsWith('/links/auth') && pathname.split('/').length <= 3) {
     // Allow access to actual slug routes like /links/my-slug
     if (pathname.split('/').length === 2 || (pathname.split('/').length === 3 && pathname.endsWith('/'))) {
        return NextResponse.redirect(new URL('/links/auth', request.url));
     }
  }
   if (pathname.startsWith('/links/auth') && isLinkerAuthenticated) {
    return NextResponse.redirect(new URL('/links', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth', '/links/:path*'],
};
