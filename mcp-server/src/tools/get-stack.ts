import { z } from "zod";
import { getStack } from "../lib/data-provider.js";

export const getStackSchema = z.object({
  slug: z.string().describe("The stack slug (e.g., 'vibe-coder-starter', 'full-stack-dev')"),
});

export async function getStackHandler(
  params: z.infer<typeof getStackSchema>
) {
  return getStack(params.slug);
}
