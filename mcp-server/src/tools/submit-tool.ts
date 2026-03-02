import { z } from "zod";
import { postToolSubmission } from "../lib/api-client.js";
import { trackEvent } from "../lib/analytics.js";

const envVarSchema = z.object({
  name: z.string().describe("Environment variable name (e.g., 'STRIPE_API_KEY')"),
  description: z.string().describe("What this env var is for"),
  required: z.boolean().describe("Whether this env var is required"),
  placeholder: z.string().optional().describe("Example value"),
});

export const submitToolSchema = z.object({
  name: z.string().min(2).max(100).describe("Tool display name (e.g., 'Stripe MCP')"),
  slug: z
    .string()
    .min(2)
    .max(100)
    .describe("URL-safe identifier, lowercase with hyphens (e.g., 'stripe-mcp')"),
  description: z
    .string()
    .min(10)
    .max(300)
    .describe("Short description (10-300 chars)"),
  longDescription: z
    .string()
    .min(50)
    .describe("Detailed description of the tool (min 50 chars)"),
  category: z
    .enum([
      "payments",
      "communication",
      "data",
      "devtools",
      "productivity",
      "ai-ml",
      "content",
      "analytics",
    ])
    .describe("Tool category"),
  tags: z.array(z.string()).describe("Tags for discovery (e.g., ['payments', 'api', 'billing'])"),
  features: z.array(z.string()).describe("List of key features"),
  version: z.string().describe("Current version (e.g., '1.0.0')"),
  compatibility: z
    .array(z.string())
    .describe("Supported clients (e.g., ['Claude Desktop', 'Cursor', 'Windsurf'])"),
  authorName: z.string().describe("Author display name"),
  authorUsername: z.string().describe("Author username"),
  npmPackage: z.string().optional().describe("npm package name (e.g., '@stripe/mcp')"),
  installCommand: z
    .enum(["npx", "uvx"])
    .optional()
    .describe("Install command type (default: npx)"),
  githubUrl: z.string().optional().describe("GitHub repository URL"),
  docsUrl: z.string().optional().describe("Documentation URL"),
  pricingModel: z
    .enum(["free", "per-call", "monthly"])
    .optional()
    .describe("Pricing model (default: free)"),
  pricingPrice: z.number().optional().describe("Price amount (if not free)"),
  pricingUnit: z.string().optional().describe("Price unit (e.g., 'call', 'month')"),
  envVars: z
    .array(envVarSchema)
    .optional()
    .describe("Environment variables the tool needs"),
});

export type SubmitToolResult =
  | { success: true; submission: unknown }
  | { success: false; error: string };

export async function submitToolHandler(
  params: z.infer<typeof submitToolSchema>
): Promise<SubmitToolResult> {
  const apiKey = process.env.HIVE_MARKET_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "HIVE_MARKET_API_KEY environment variable is not set. " +
        "Get an API key at https://market.hive.sh/dashboard and add it to your MCP server config.",
    };
  }

  const result = await postToolSubmission(params, apiKey);

  if (!result.ok) {
    return {
      success: false,
      error: `API error ${result.status}: ${result.message}`,
    };
  }

  trackEvent(params.slug, "mcp_request", { action: "submit-tool" });

  return { success: true, submission: result.data };
}
