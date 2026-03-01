import { getAllCategoriesWithCounts } from "@/lib/data";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";

export async function GET() {
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
