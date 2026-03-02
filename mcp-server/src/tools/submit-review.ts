import { z } from "zod";
import { postReview } from "../lib/api-client.js";
import { trackEvent } from "../lib/analytics.js";

export const submitReviewSchema = z.object({
  slug: z.string().describe("The tool slug (e.g., 'stripe-mcp', 'github-mcp')"),
  rating: z.number().min(1).max(5).describe("Rating from 1 to 5"),
  text: z.string().min(10).max(2000).describe("Review text (10-2000 characters)"),
  authorName: z.string().min(1).max(100).describe("Display name of the reviewer"),
  authorUsername: z.string().min(1).max(100).describe("Username of the reviewer"),
});

export type SubmitReviewResult =
  | { success: true; review: unknown }
  | { success: false; error: string };

export async function submitReviewHandler(
  params: z.infer<typeof submitReviewSchema>
): Promise<SubmitReviewResult> {
  const apiKey = process.env.HIVE_MARKET_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "HIVE_MARKET_API_KEY environment variable is not set. " +
        "Get an API key at https://market.hive.sh/dashboard and add it to your MCP server config.",
    };
  }

  const { slug, rating, text, authorName, authorUsername } = params;

  const result = await postReview(slug, { rating, text, authorName, authorUsername }, apiKey);

  if (!result.ok) {
    return {
      success: false,
      error: `API error ${result.status}: ${result.message}`,
    };
  }

  trackEvent(slug, "mcp_request", { action: "submit-review" });

  return { success: true, review: result.data };
}
