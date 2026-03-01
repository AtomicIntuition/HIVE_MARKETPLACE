import { z } from "zod";
import { getTools } from "../lib/data-provider.js";
import { recommendTools } from "../lib/recommender.js";
export const recommendToolsSchema = z.object({
    useCase: z.string().describe("Description of what you need (e.g., 'I want to process payments and send email receipts')"),
    maxResults: z.number().optional().default(5).describe("Maximum number of recommendations (default: 5)"),
});
export async function recommendToolsHandler(params) {
    const tools = await getTools();
    return recommendTools(tools, params.useCase, params.maxResults);
}
