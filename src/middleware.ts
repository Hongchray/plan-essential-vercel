import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List all public admin routes here
const PUBLIC_ADMIN_ROUTES = [
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
  "/admin/signup/verify-otp",
  "/admin/signup/set-password",
  "/admin/forgot-password/verify-otp",
  "/admin/forgot-password/set-password",
];

function isPublicAdminRoute(pathname: string) {
  return PUBLIC_ADMIN_ROUTES.some((route) => pathname === route);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  111111;

  // Allow all non-admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow public admin routes
  if (isPublicAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
