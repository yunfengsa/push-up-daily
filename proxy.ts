import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are public
  const isPublicPath = 
    pathname === "/auth" || 
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") || 
    pathname.includes("favicon.ico") ||
    pathname.includes(".svg") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes("manifest.json") ||
    pathname.includes("sw.js");

  // Check for the session token in cookies
  // better-auth usually uses "better-auth.session_token"
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!isPublicPath && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isPublicPath && sessionCookie && pathname === "/auth") {
      return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (web manifest)
     * - sw.js (service worker)
     * - icons (png files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.png|.*\\.jpg).*)',
  ],
};