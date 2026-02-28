import { Tool, CategorySlug } from "./types";

export function sortTools(
  toolList: Tool[],
  sort: "popular" | "newest" | "rating" | "name"
): Tool[] {
  const sorted = [...toolList];
  switch (sort) {
    case "popular":
      return sorted.sort((a, b) => b.installCount - a.installCount);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export function filterTools(
  toolList: Tool[],
  filters: {
    category?: CategorySlug;
    pricing?: string;
    minRating?: number;
    verified?: boolean;
  }
): Tool[] {
  let result = [...toolList];

  if (filters.category) {
    result = result.filter((t) => t.category === filters.category);
  }
  if (filters.pricing) {
    result = result.filter((t) => t.pricing.model === filters.pricing);
  }
  if (filters.minRating) {
    result = result.filter((t) => t.rating >= filters.minRating!);
  }
  if (filters.verified) {
    result = result.filter((t) => t.verified);
  }

  return result;
}

export function searchToolsClient(tools: Tool[], query: string): Tool[] {
  const q = query.toLowerCase();
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
  );
}
