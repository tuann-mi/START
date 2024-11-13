import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/auth/flags";

const corsConfig = {
  origin: ["https://start-prod.vercel.app", process.env.NEXT_PUBLIC_API_URL],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", corsConfig.origin.join(", "));
    response.headers.set("Access-Control-Allow-Methods", corsConfig.methods.join(", "));
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }
  try {
    const token = request.cookies.get("authjs.session-token");
    if (pathname.startsWith("/api/")) {
      console.log(new Date().toLocaleTimeString(), " - middleware.ts - API Request");
      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", corsConfig.origin.join(", "));
      response.headers.set("Access-Control-Allow-Credentials", "true");
      console.log(new Date().toLocaleTimeString(), " - middleware.ts - Added CORS headers for API request");
      if (!token && isProtectedPath(pathname)) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: response.headers,
        });
      }
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
    "/api/:path*",
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
