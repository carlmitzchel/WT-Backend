import {
  apiKeys,
  generateApiKey,
  setTokenCookie,
  signToken,
} from "@/app/utils/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username !== "tomasinoweb" || password !== "tmsnw3btech") {
    return NextResponse.json(
      { success: false, message: null },
      { status: 401 }
    );
  }

  // Generate API Key
  const apiKey = generateApiKey();
  const apiKeyExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
  apiKeys.set(apiKey, { expiresAt: apiKeyExpiresAt });

  // Generate Access and Refresh tokens
  const accessToken = await signToken({ username }, "5m");
  const refreshToken = await signToken({ username }, "7d");

  // Set cookies
  setTokenCookie("accessToken", accessToken, 5 * 60); // 5 minutes
  setTokenCookie("refreshToken", refreshToken, 7 * 24 * 60 * 60); // 1 week

  return NextResponse.json({ success: true, apiKey });
}
