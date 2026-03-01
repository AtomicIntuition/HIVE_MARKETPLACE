import { getAllCategoriesWithCounts } from "@/lib/data";
import { apiSuccess, handleCors } from "@/lib/api-utils";

export async function GET() {
  const categories = await getAllCategoriesWithCounts();
  return apiSuccess({ categories });
}

export async function OPTIONS() {
  return handleCors();
}
