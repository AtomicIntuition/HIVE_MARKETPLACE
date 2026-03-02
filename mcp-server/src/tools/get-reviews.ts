import { z } from "zod";
import { fetchReviews, type ReviewsResponse } from "../lib/api-client.js";
import { trackEvent } from "../lib/analytics.js";

export const getReviewsSchema = z.object({
  slug: z.string().describe("The tool slug (e.g., 'stripe-mcp', 'github-mcp')"),
});

export async function getReviewsHandler(
  params: z.infer<typeof getReviewsSchema>
): Promise<ReviewsResponse | null> {
  try {
    const result = await fetchReviews(params.slug);
    trackEvent(params.slug, "mcp_request", { action: "get-reviews" });
    return result;
  } catch {
    return null;
  }
}
