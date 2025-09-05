import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/signup/verify-otp",
  "/signup/set-password",
  "/forgot-password/verify-otp",
  "/forgot-password/set-password",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Always set NEXT_LOCALE cookie
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const response = NextResponse.next();
  if (!request.cookies.has("NEXT_LOCALE")) {
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // 2️⃣ Protect everything except PUBLIC_ROUTES
  if (!isPublicRoute(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"], // run on all pages except Next.js internals
};
