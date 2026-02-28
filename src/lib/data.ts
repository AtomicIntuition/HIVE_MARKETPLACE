import "server-only";
import { Tool, CategorySlug } from "./types";
import { CATEGORIES } from "./constants";

// Dynamic import to avoid requiring DATABASE_URL at build time
async function getDb() {
  const { db } = await import("@/db");
  return db;
}

// Fallback: use static JSON data when DATABASE_URL is not available (e.g. during build)
async function getToolsFromJson(): Promise<Tool[]> {
  const { default: toolsData } = await import("@/data/tools.json");
  return toolsData as Tool[];
}

function isDbAvailable(): boolean {
  return !!process.env.DATABASE_URL;
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
  };
}

export async function getAllTools(): Promise<Tool[]> {
  if (!isDbAvailable()) return getToolsFromJson();

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const rows = await db.select().from(tools);
  return rows.map(mapDbToolToTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.find((t) => t.slug === slug);
  }

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
  if (rows.length === 0) return undefined;
  return mapDbToolToTool(rows[0]);
}

export async function getToolsByCategory(category: CategorySlug): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.filter((t) => t.category === category);
  }

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.category, category));
  return rows.map(mapDbToolToTool);
}

export async function getFeaturedTools(): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.filter((t) => t.featured);
  }

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.featured, true));
  return rows.map(mapDbToolToTool);
}

export async function getTrendingTools(): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.filter((t) => t.trending);
  }

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(tools).where(eq(tools.trending, true));
  return rows.map(mapDbToolToTool);
}

export async function searchTools(query: string): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    const q = query.toLowerCase();
    return all.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );
  }

  const db = await getDb();
  const { tools } = await import("@/db/schema");
  const { or, ilike } = await import("drizzle-orm");
  const pattern = `%${query}%`;
  const rows = await db
    .select()
    .from(tools)
    .where(
      or(
        ilike(tools.name, pattern),
        ilike(tools.description, pattern),
        ilike(tools.category, pattern)
      )
    );
  return rows.map(mapDbToolToTool);
}

export async function getRelatedTools(tool: Tool, limit = 4): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all
      .filter((t) => t.id !== tool.id && t.category === tool.category)
      .sort((a, b) => b.installCount - a.installCount)
      .slice(0, limit);
  }

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

  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    const count = all.filter((t) => t.category === slug).length;
    return { ...category, toolCount: count };
  }

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
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return CATEGORIES.map((cat) => ({
      ...cat,
      toolCount: all.filter((t) => t.category === cat.slug).length,
    }));
  }

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

// sortTools and filterTools moved to @/lib/tool-utils.ts for client component compatibility
