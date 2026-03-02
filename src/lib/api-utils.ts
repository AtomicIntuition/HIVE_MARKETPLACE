import { NextResponse } from "next/server";

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
