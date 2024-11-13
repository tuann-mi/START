import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/auth/flags";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  try {
    const token = request.cookies.get("authjs.session-token");
    if (pathname.startsWith("/api/")) {
      console.log(new Date().toLocaleTimeString(), " - middleware.ts - API Request");
    }
    if (!isProtectedPath(pathname)) {
      return NextResponse.next();
    }
    if (!token) {
      console.log(
        new Date().toLocaleTimeString(),
        " - middleware.ts - Unable to get token. Check that user is logged in.",
      );
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    console.log(new Date().toLocaleTimeString(), " - middleware.ts - Got token");
    return NextResponse.next();
  } catch (error) {
    console.error(new Date().toLocaleTimeString(), " - middleware.ts - Error getting token:", error);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
