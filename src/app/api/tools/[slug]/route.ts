import { NextRequest } from "next/server";
import { getToolBySlug } from "@/lib/data";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);
    if (!tool) {
      return apiError("Tool not found", 404);
    }
    return apiSuccess(tool);
  } catch (e) {
    console.error("API /tools/[slug] error:", e);
    return apiError("Failed to fetch tool", 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
