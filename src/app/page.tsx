import { Hero } from "@/components/landing/hero";
import { FeaturedTools } from "@/components/landing/featured-tools";
import { CategoryGrid } from "@/components/landing/category-grid";
import { McpConnect } from "@/components/landing/mcp-connect";
import { StacksPreview } from "@/components/landing/stacks-preview";
import {
  getTrendingTools,
  getFeaturedTools,
  getAllCategoriesWithCounts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trendingTools, featuredTools, categories] = await Promise.all([
    getTrendingTools(),
    getFeaturedTools(),
    getAllCategoriesWithCounts(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedTools trendingTools={trendingTools} featuredTools={featuredTools} />
      <CategoryGrid categories={categories} />
      <McpConnect />
      <StacksPreview />
    </>
  );
}
