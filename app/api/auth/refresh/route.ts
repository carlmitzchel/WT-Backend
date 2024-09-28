import { setTokenCookie, signToken, verifyToken } from "@/app/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token provided" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(refreshToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Invalid refresh token" },
      { status: 401 }
    );
  }

  const newAccessToken = await signToken({ username: payload.username }, "5m");
  setTokenCookie("accessToken", newAccessToken, 5 * 60); // 5 minutes

  return NextResponse.json({ success: true });
}
