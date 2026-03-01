import { NextRequest } from "next/server";
import { getStackBySlug } from "@/lib/stacks";
import { getToolBySlug } from "@/lib/data";
import { generateMultiToolConfig } from "@/lib/mcp-config";
import { Tool } from "@/lib/types";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const stack = getStackBySlug(slug);
  if (!stack) {
    return apiError("Stack not found", 404);
  }

  const tools: Tool[] = [];
  for (const toolSlug of stack.toolSlugs) {
    const tool = await getToolBySlug(toolSlug);
    if (tool) tools.push(tool);
  }

  const configStr = generateMultiToolConfig(tools, "Claude Desktop");
  const config = JSON.parse(configStr);

  return apiSuccess({ stack, tools, config });
}

export async function OPTIONS() {
  return handleCors();
}
