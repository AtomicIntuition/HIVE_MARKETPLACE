import { getStacks } from "../lib/data-provider.js";
export async function listStacksHandler() {
    const stacks = await getStacks();
    return stacks.map((s) => ({
        name: s.name,
        slug: s.slug,
        description: s.description,
        toolCount: s.toolSlugs.length,
        popular: s.popular,
    }));
}
