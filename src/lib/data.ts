import "server-only";
import { Tool, ToolEnvVar, CategorySlug } from "./types";
import { CATEGORIES } from "./constants";

// Dynamic import to avoid requiring DATABASE_URL at build time
async function getDb() {
  const { db } = await import("@/db");
  return db;
}

// Helper to map a DB row to the Tool type the frontend expects
function mapDbToolToTool(row: Record<string, unknown>): Tool {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    longDescription: row.longDescription as string,
    category: row.category as CategorySlug,
    author: row.author as Tool["author"],
    pricing: row.pricing as Tool["pricing"],
    rating: row.rating as number,
    reviewCount: row.reviewCount as number,
    installCount: row.installCount as number,
    weeklyInstalls: row.weeklyInstalls as number,
    version: row.version as string,
    lastUpdated: row.lastUpdated as string,
    createdAt: row.createdAt as string,
    tags: row.tags as string[],
    features: row.features as string[],
    githubUrl: (row.githubUrl as string) || undefined,
    docsUrl: (row.docsUrl as string) || undefined,
    iconBg: row.iconBg as string,
    verified: row.verified as boolean,
    trending: row.trending as boolean,
    featured: row.featured as boolean,
    compatibility: row.compatibility as string[],
    npmPackage: (row.npmPackage as string) || undefined,
    installCommand: (row.installCommand as "npx" | "uvx") || "npx",
    envVars: (row.envVars as ToolEnvVar[]) || undefined,
  };
}

export async function getAllTools(): Promise<Tool[]> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const rows = await db.select().from(tools);
  return rows.map(mapDbToolToTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
  if (rows.length === 0) return undefined;
  return mapDbToolToTool(rows[0]);
}

export async function getToolsByCategory(category: CategorySlug): Promise<Tool[]> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.category, category));
  return rows.map(mapDbToolToTool);
}

export async function getFeaturedTools(): Promise<Tool[]> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.featured, true));
  return rows.map(mapDbToolToTool);
}

export async function getTrendingTools(): Promise<Tool[]> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.trending, true));
  return rows.map(mapDbToolToTool);
}

export async function searchTools(query: string): Promise<Tool[]> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { or, ilike, sql } = await import("drizzle-orm");
  const pattern = `%${query}%`;
  const rows = await db
    .select()
    .from(tools)
    .where(
      or(
        ilike(tools.name, pattern),
        ilike(tools.description, pattern),
        // category is a pgEnum — cast to text for ilike
        sql`${tools.category}::text ILIKE ${pattern}`
      )
    );
  return rows.map(mapDbToolToTool);
}

export async function getRelatedTools(tool: Tool, limit = 4): Promise<Tool[]> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq, ne, and, desc } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(tools)
    .where(and(eq(tools.category, tool.category), ne(tools.id, tool.id)))
    .orderBy(desc(tools.installCount))
    .limit(limit);
  return rows.map(mapDbToolToTool);
}

export async function getCategoryWithCount(slug: CategorySlug) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return undefined;

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq, count } = await import("drizzle-orm");
  const result = await db
    .select({ count: count() })
    .from(tools)
    .where(eq(tools.category, slug));
  return { ...category, toolCount: result[0].count };
}

export async function getAllCategoriesWithCounts() {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq, count } = await import("drizzle-orm");

  const counts = await Promise.all(
    CATEGORIES.map(async (cat) => {
      const result = await db
        .select({ count: count() })
        .from(tools)
        .where(eq(tools.category, cat.slug));
      return { ...cat, toolCount: result[0].count };
    })
  );
  return counts;
}

export async function getMarketplaceStats(): Promise<{
  toolCount: number;
  categoryCount: number;
}> {
  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { count } = await import("drizzle-orm");
  const result = await db.select({ count: count() }).from(tools);
  const toolCount = result[0]?.count ?? 0;
  return {
    toolCount,
    categoryCount: CATEGORIES.length,
  };
}

// sortTools and filterTools moved to @/lib/tool-utils.ts for client component compatibility
