import { NextRequest } from "next/server";
import { getAllTools, searchTools, getToolsByCategory } from "@/lib/data";
import { CategorySlug } from "@/lib/types";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q");
  const category = params.get("category") as CategorySlug | null;
  const pricing = params.get("pricing");
  const sort = params.get("sort") || "popular";
  const limit = parseInt(params.get("limit") || "50", 10);
  const offset = parseInt(params.get("offset") || "0", 10);

  let tools;

  if (q) {
    tools = await searchTools(q);
  } else if (category) {
    tools = await getToolsByCategory(category);
  } else {
    tools = await getAllTools();
  }

  if (pricing) {
    tools = tools.filter((t) => t.pricing.model === pricing);
  }

  switch (sort) {
    case "rating":
      tools.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      tools.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "name":
      tools.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "popular":
    default:
      tools.sort((a, b) => b.installCount - a.installCount);
      break;
  }

  const total = tools.length;
  tools = tools.slice(offset, offset + limit);

  return apiSuccess({ tools, total, limit, offset });
}

export async function OPTIONS() {
  return handleCors();
}
