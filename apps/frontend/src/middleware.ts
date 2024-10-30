import { NextURL } from 'next/dist/server/web/next-url';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ["/login", "/register"];

async function isValidToken(TOKEN: string): Promise<boolean> {
  const { status } = await fetch(
    `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}auth/verify-token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  return status === 200;
}

export default async function middleware(request: NextRequest) {
  const REDIRECT_TO_LOGIN = NextResponse.redirect(new NextURL("/login", request.url));
  const TOKEN = request.cookies.get("TOKEN");
  if (TOKEN == undefined) {
    return REDIRECT_TO_LOGIN;
  }
  
  if (!await isValidToken(TOKEN.value)) {
    REDIRECT_TO_LOGIN.cookies.delete("TOKEN");
    return REDIRECT_TO_LOGIN;
  }

  return NextResponse.next();
  
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register).*)",
  // matcher: [
  //   "/matching",
  //   "/",
  //   "/profile",
  //   "/question",
  //   "/question/.*",
  // ],
}

