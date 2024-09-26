import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateApiKey } from "./api/login/route";

export function middleware(request: NextRequest) {
  if (request.method === "GET" || request.nextUrl.pathname === "/api/login") {
    return NextResponse.next();
  }

  const apiKey = request.headers.get("X-API-Token");

  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // if (!apiKey && !request.nextUrl.pathname.startsWith("/")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // if (apiKey && request.nextUrl.pathname.startsWith("/")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
