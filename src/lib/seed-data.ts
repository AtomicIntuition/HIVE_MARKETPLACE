import { Tool, CategorySlug } from "./types";
import { CATEGORIES } from "./constants";
import toolsData from "@/data/tools.json";

const tools: Tool[] = toolsData as Tool[];

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: CategorySlug): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

export function getTrendingTools(): Tool[] {
  return tools.filter((t) => t.trending);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
  );
}

export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  return tools
    .filter((t) => t.id !== tool.id && t.category === tool.category)
    .sort((a, b) => b.installCount - a.installCount)
    .slice(0, limit);
}

export function getCategoryWithCount(slug: CategorySlug) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return undefined;
  const count = tools.filter((t) => t.category === slug).length;
  return { ...category, toolCount: count };
}

export function getAllCategoriesWithCounts() {
  return CATEGORIES.map((cat) => ({
    ...cat,
    toolCount: tools.filter((t) => t.category === cat.slug).length,
  }));
}

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
