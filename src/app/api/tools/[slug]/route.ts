import { NextRequest } from "next/server";
import { getToolBySlug } from "@/lib/data";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) {
    return apiError("Tool not found", 404);
  }
  return apiSuccess(tool);
}

export async function OPTIONS() {
  return handleCors();
}
