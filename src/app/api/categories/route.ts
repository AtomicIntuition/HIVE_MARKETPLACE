import { NextRequest } from "next/server";
import { getAllCategoriesWithCounts } from "@/lib/data";
import { apiSuccess, apiError, handleCors, checkReadRateLimit } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const rateLimited = checkReadRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const categories = await getAllCategoriesWithCounts();
    return apiSuccess({ categories });
  } catch (e) {
    console.error("API /categories error:", e);
    return apiError("Failed to fetch categories", 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
