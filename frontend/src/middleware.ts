import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/api/user";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isTokenValid = token ? verifyToken(token) : false;
  if (!isTokenValid && request.nextUrl.pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdmin = request.cookies.get("isAdmin")?.value;
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/401', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/dashboard', '/user/me', '/collaboration', '/match'],
  unstable_allowDynamic: [
    '/node_modules/sweetalert2/**',
  ],
}