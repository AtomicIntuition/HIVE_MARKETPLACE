import { z } from "zod";
import { getToolConfig } from "../lib/data-provider.js";
import { trackEvent } from "../lib/analytics.js";
export const getToolConfigSchema = z.object({
    slug: z.string().describe("The tool slug (e.g., 'stripe-mcp')"),
    client: z
        .string()
        .optional()
        .describe("Target client: 'Claude Desktop', 'Cursor', 'Windsurf', or 'Claude Code'"),
});
export async function getToolConfigHandler(params) {
    const config = await getToolConfig(params.slug, params.client);
    if (config) {
        trackEvent(params.slug, "mcp_request", { action: "get-tool-config", client: params.client });
    }
    return config;
}
