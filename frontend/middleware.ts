import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // if (url.pathname.startsWith("/admin")) {
  //   // Admin authorization (can be expanded with your own checks)
  //   return NextResponse.next();
  // }

  // if (!accessToken && !refreshToken && !url.pathname.startsWith("/login")) {
  //   // Redirect to login if both tokens are missing and the user is not on the login page
  //   console.log("No access or refresh token, redirecting to login.");

  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  // if (accessToken) {
  //   // Try verifying the access token using the backend service
  //   // const response = verifyToken(accessToken);

  //   if (verifyResponse.ok) {
  //     // Token is valid, allow access
  //     return NextResponse.next();
  //   } else {
  //     console.log("Access token invalid or expired.");
  //   }
  // }

  // // If access token is invalid and refresh token exists, try to refresh
  // if (!accessToken && refreshToken) {
  //   const refreshResponse = await fetch(
  //     `${process.env.USER_SERVICE_URL}/refresh-token`,
  //     {
  //       headers: {
  //         Cookie: `refreshToken=${refreshToken}`,
  //       },
  //     },
  //   );

  //   if (refreshResponse.ok) {
  //     const data = await refreshResponse.json();

  //     // Set the new access token in the response
  //     const response = NextResponse.next();

  //     response.cookies.set("accessToken", data.newAccessToken, {
  //       httpOnly: true,
  //       maxAge: 15 * 60 * 1000, // 15 minutes
  //     });

  //     return response;
  //   } else {
  //     console.log("Refresh token invalid, redirecting to login.");

  //     return NextResponse.redirect(new URL("/login", req.nextUrl));
  //   }
  // }

  // // // Fallback: if both tokens are missing or invalid, redirect to login
  // // return NextResponse.redirect(new URL("/login", req.nextUrl));
}

// Apply middleware to specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|/).*)"],
};
