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
  "/error/403",
  "/preview",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

function isEventRoute(pathname: string) {
  return (
    pathname === "/event" ||
    pathname === "/event/" ||
    pathname.startsWith("/event/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const response = NextResponse.next();
  if (!request.cookies.has("NEXT_LOCALE")) {
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if ((pathname === "/login" || pathname === "/signup") && token) {
    if (token.role === "user") {
      return NextResponse.redirect(new URL("/event", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token?.role === "user") {
    const allowed = isPublicRoute(pathname) || isEventRoute(pathname);

    if (!allowed) {
      return NextResponse.redirect(new URL("/event", request.url));
    }
  }

  if (pathname === "/" && token) {
    if (token.role === "user") {
      return NextResponse.redirect(new URL("/event", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|bmp|tiff)).*)",
  ],
};
