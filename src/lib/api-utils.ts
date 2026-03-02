import { NextRequest, NextResponse } from "next/server";
import {
  readRateLimiter,
  READ_RATE_LIMIT,
  READ_RATE_WINDOW_MS,
} from "@/lib/rate-limiter";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: CORS_HEADERS });
}

export function handleCors() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Check read rate limit (100 req/min per IP). Returns a 429 response if
 * exceeded, or null if the request is allowed.
 */
export function checkReadRateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const result = readRateLimiter.check(ip, READ_RATE_LIMIT, READ_RATE_WINDOW_MS);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again shortly." },
      {
        status: 429,
        headers: {
          ...CORS_HEADERS,
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(READ_RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
