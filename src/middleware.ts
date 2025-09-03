import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public admin routes (no login required)
const PUBLIC_ADMIN_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/signup/verify-otp",
  "/signup/set-password",
  "/forgot-password/verify-otp",
  "/forgot-password/set-password",
];

function isPublicAdminRoute(pathname: string) {
  return PUBLIC_ADMIN_ROUTES.some((route) => pathname === route);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Always ensure we have a NEXT_LOCALE cookie
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const response = NextResponse.next();

  if (!request.cookies.has("NEXT_LOCALE")) {
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // 2️⃣ Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isPublicAdminRoute(pathname)) {
      const token =
        request.cookies.get("next-auth.session-token")?.value ||
        request.cookies.get("__Secure-next-auth.session-token")?.value;

      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"], // apply everywhere except static/api
};
