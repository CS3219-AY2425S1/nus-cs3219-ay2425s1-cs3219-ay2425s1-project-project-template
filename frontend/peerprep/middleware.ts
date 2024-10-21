import { NextResponse } from 'next/server';

export function middleware(req:any) {
  const url = req.nextUrl.clone(); // Clone the URL
  const token = req.cookies.get('peerprep-session');

  console.log('Middleware token:', token);

  // Check if token is present
  if (!token) {
      url.pathname = '/sign-in'; // Redirect to login if not authenticated
      return NextResponse.redirect(url);
  }

  // If user is authenticated or accessing a public page, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/questions-management/:path*'], // Define protected routes
};
