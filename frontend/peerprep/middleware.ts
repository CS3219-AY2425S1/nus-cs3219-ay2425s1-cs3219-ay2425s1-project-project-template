import { NextResponse } from 'next/server';
import { getSession } from './app/api/auth/actions';

export async function middleware(req:any) {
  const url = req.nextUrl.clone(); // Clone the URL
  const session = await getSession();
  const token = session.accessToken; // Get the access token from the session
  const isAdmin = session.isAdmin; // Check if the user is an admin

  // Check if token is present
  if (!token) {
      url.pathname = '/sign-in'; // Redirect to login if not authenticated
      return NextResponse.redirect(url);
  }

  if (!isAdmin && url.pathname.startsWith('/questions-management')) {
    url.pathname = '/forbidden'; // Redirect to a 403 Forbidden page
    return NextResponse.redirect(url);
  }

  // If user is authenticated or accessing a public page, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/questions-management/:path*'], // Define protected routes
};
