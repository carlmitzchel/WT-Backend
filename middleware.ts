import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { validateApiKey, verifyToken } from "./app/utils/auth";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const apiKey = request.headers.get("X-API-Key");

  if (request.method === "GET" || request.nextUrl.pathname === "/api/login") {
    console.log("GET request");
    return NextResponse.next();
  }

  let isAuthenticated = false;

  if (accessToken) {
    // Session-based auth
    const payload = await verifyToken(accessToken);
    if (payload) isAuthenticated = true;
  } else if (apiKey) {
    // API Key auth
    if (validateApiKey(apiKey)) isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
