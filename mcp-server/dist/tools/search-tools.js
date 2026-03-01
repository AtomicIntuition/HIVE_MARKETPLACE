import { z } from "zod";
import { getTools } from "../lib/data-provider.js";
export const searchToolsSchema = z.object({
    query: z.string().optional().describe("Search query to filter tools by name, description, or tags"),
    category: z.string().optional().describe("Filter by category slug (payments, communication, data, devtools, productivity, ai-ml, content, analytics)"),
    pricing: z.string().optional().describe("Filter by pricing model (free, per-call, monthly, tiered)"),
    sort: z.string().optional().describe("Sort by: popular, rating, newest, name"),
    limit: z.number().optional().default(10).describe("Maximum number of results (default: 10)"),
});
export async function searchTools(params) {
    const tools = await getTools({
        q: params.query,
        category: params.category,
        pricing: params.pricing,
        sort: params.sort,
        limit: params.limit,
    });
    return tools.map((t) => ({
        name: t.name,
        slug: t.slug,
        description: t.description,
        rating: t.rating,
        installCount: t.installCount,
        pricing: t.pricing.model === "free"
            ? "Free"
            : `$${t.pricing.price}/${t.pricing.unit}`,
        verified: t.verified,
        category: t.category,
    }));
}
