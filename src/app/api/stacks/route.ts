import { NextRequest } from "next/server";
import { getAllStacks } from "@/lib/stacks";
import { apiSuccess, handleCors, checkReadRateLimit } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const rateLimited = checkReadRateLimit(request);
  if (rateLimited) return rateLimited;

  const stacks = getAllStacks();
  return apiSuccess({ stacks });
}

export async function OPTIONS() {
  return handleCors();
}
