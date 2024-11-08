import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/auth/flags";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authjs.session-token");

  if (!token) {
    console.log(new Date().toLocaleTimeString(), " - middleware.ts - Unable to get token");
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  console.log(new Date().toLocaleTimeString(), " - middleware.ts - Got token");
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api/auth|_next/static|_next/image|images|favicon.ico).*)",
};
