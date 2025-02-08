import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the admin dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true';
    
    if (!isAuthenticated) {
      // Redirect to admin login if not authenticated
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
