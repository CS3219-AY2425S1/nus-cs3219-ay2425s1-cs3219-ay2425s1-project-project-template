import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
];

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const validateToken = async (accessToken: string | undefined): Promise<any> => {
  try {
    const response = await fetch(
      `${baseURL}/api/user-service/auth/verify-token`,
      {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Token validation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forget-password",
    "/reset-password",
  ];

  // Allow access to public routes without checking tokens
  if (publicRoutes.some((route) => url.pathname === route)) {
    return NextResponse.next();
  }

  // If both access token and refresh token are present, allow the user to proceed
  if (accessToken && refreshToken) {
    return NextResponse.next();
  }

  // If no access token and the user is not on a public route, redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
