import { z } from "zod";
import { getTool } from "../lib/data-provider.js";
import { trackEvent } from "../lib/analytics.js";
import type { Tool } from "../types.js";

export const getToolSchema = z.object({
  slug: z.string().describe("The tool slug (e.g., 'stripe-mcp', 'github-mcp')"),
});

export async function getToolHandler(
  params: z.infer<typeof getToolSchema>
): Promise<Tool | null> {
  const tool = await getTool(params.slug);
  if (tool) {
    trackEvent(params.slug, "mcp_request", { action: "get-tool" });
  }
  return tool;
}
