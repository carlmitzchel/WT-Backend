import { NextResponse } from "next/server";
import crypto from "crypto";

const apiKeys = new Map<string, { expiresAt: number }>();

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username !== "tomasinoweb" || password !== "tmsnw3btech") {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const apiKey = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

  apiKeys.set(apiKey, { expiresAt });

  return NextResponse.json({ success: true, apiKey });
}

export function validateApiKey(apiKey: string): boolean {
  const keyData = apiKeys.get(apiKey);
  if (!keyData) return false;
  if (Date.now() > keyData.expiresAt) {
    apiKeys.delete(apiKey);
    return false;
  }
  return true;
}
