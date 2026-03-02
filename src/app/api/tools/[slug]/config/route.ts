import { NextRequest } from "next/server";
import { getToolBySlug } from "@/lib/data";
import { generateToolConfig, McpClient } from "@/lib/mcp-config";
import { apiSuccess, apiError, handleCors, checkReadRateLimit } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const rateLimited = checkReadRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const { slug } = await params;
    const client = (request.nextUrl.searchParams.get("client") || "Claude Desktop") as McpClient;

    const tool = await getToolBySlug(slug);
    if (!tool) {
      return apiError("Tool not found", 404);
    }

    if (!tool.npmPackage) {
      return apiError("Tool does not have an npm package configured", 400);
    }

    const configStr = generateToolConfig(tool, client);
    const config = JSON.parse(configStr);

    return apiSuccess({ tool: { name: tool.name, slug: tool.slug }, client, config });
  } catch (e) {
    console.error("API /tools/[slug]/config error:", e);
    return apiError("Failed to generate config", 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
