import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "tomasinoweb"
);

export async function signToken(
  payload: any,
  expiresIn: string
): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secretKey);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

export function setTokenCookie(name: string, token: string, maxAge: number) {
  cookies().set({
    name,
    value: token,
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export const apiKeys = new Map<string, { expiresAt: number }>();

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex");
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
