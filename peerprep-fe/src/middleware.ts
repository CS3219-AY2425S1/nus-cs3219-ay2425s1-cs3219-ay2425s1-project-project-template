import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access-token');

  // Check if token exists
  if (token && token.value) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/signin', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - The root path "/"
     * - /signin and /signout paths
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    '/((?!signin|_next/static|_next/image|$|signup|.*\\.png$).*)',
  ],
};
