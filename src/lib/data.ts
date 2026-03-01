import "server-only";
import { Tool, ToolEnvVar, CategorySlug } from "./types";
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
    installCommand: (row.installCommand as "npx" | "uvx") || "npx",
    envVars: (row.envVars as ToolEnvVar[]) || undefined,
  };
}

export async function getAllTools(): Promise<Tool[]> {
  if (!isDbAvailable()) return getToolsFromJson();

  try {
    const db = await getDb();
    const { tools } = await import("@/db/schema");
    const rows = await db.select().from(tools);
    return rows.map(mapDbToolToTool);
  } catch (e) {
    console.error("getAllTools DB error, falling back to JSON:", e);
    return getToolsFromJson();
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.find((t) => t.slug === slug);
  }

  try {
    const db = await getDb();
    const { tools } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
    if (rows.length === 0) return undefined;
    return mapDbToolToTool(rows[0]);
  } catch (e) {
    console.error("getToolBySlug DB error, falling back to JSON:", e);
    const all = await getToolsFromJson();
    return all.find((t) => t.slug === slug);
  }
}

export async function getToolsByCategory(category: CategorySlug): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.filter((t) => t.category === category);
  }

  try {
    const db = await getDb();
    const { tools } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(tools).where(eq(tools.category, category));
    return rows.map(mapDbToolToTool);
  } catch (e) {
    console.error("getToolsByCategory DB error, falling back to JSON:", e);
    const all = await getToolsFromJson();
    return all.filter((t) => t.category === category);
  }
}

export async function getFeaturedTools(): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.filter((t) => t.featured);
  }

  try {
    const db = await getDb();
    const { tools } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(tools).where(eq(tools.featured, true));
    return rows.map(mapDbToolToTool);
  } catch (e) {
    console.error("getFeaturedTools DB error, falling back to JSON:", e);
    const all = await getToolsFromJson();
    return all.filter((t) => t.featured);
  }
}

export async function getTrendingTools(): Promise<Tool[]> {
  if (!isDbAvailable()) {
    const all = await getToolsFromJson();
    return all.filter((t) => t.trending);
  }

  try {
    const db = await getDb();
    const { tools } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(tools).where(eq(tools.trending, true));
    return rows.map(mapDbToolToTool);
  } catch (e) {
    console.error("getTrendingTools DB error, falling back to JSON:", e);
    const all = await getToolsFromJson();
    return all.filter((t) => t.trending);
  }
}

export async function searchTools(query: string): Promise<Tool[]> {
  const jsonFallback = async () => {
    const all = await getToolsFromJson();
    const q = query.toLowerCase();
    return all.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );
  };

  if (!isDbAvailable()) return jsonFallback();

  try {
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
  } catch (e) {
    console.error("searchTools DB error, falling back to JSON:", e);
    return jsonFallback();
  }
}

export async function getRelatedTools(tool: Tool, limit = 4): Promise<Tool[]> {
  const jsonFallback = async () => {
    const all = await getToolsFromJson();
    return all
      .filter((t) => t.id !== tool.id && t.category === tool.category)
      .sort((a, b) => b.installCount - a.installCount)
      .slice(0, limit);
  };

  if (!isDbAvailable()) return jsonFallback();

  try {
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
  } catch (e) {
    console.error("getRelatedTools DB error, falling back to JSON:", e);
    return jsonFallback();
  }
}

export async function getCategoryWithCount(slug: CategorySlug) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return undefined;

  const jsonFallback = async () => {
    const all = await getToolsFromJson();
    const count = all.filter((t) => t.category === slug).length;
    return { ...category, toolCount: count };
  };

  if (!isDbAvailable()) return jsonFallback();

  try {
    const db = await getDb();
    const { tools } = await import("@/db/schema");
    const { eq, count } = await import("drizzle-orm");
    const result = await db
      .select({ count: count() })
      .from(tools)
      .where(eq(tools.category, slug));
    return { ...category, toolCount: result[0].count };
  } catch (e) {
    console.error("getCategoryWithCount DB error, falling back to JSON:", e);
    return jsonFallback();
  }
}

export async function getAllCategoriesWithCounts() {
  const jsonFallback = async () => {
    const all = await getToolsFromJson();
    return CATEGORIES.map((cat) => ({
      ...cat,
      toolCount: all.filter((t) => t.category === cat.slug).length,
    }));
  };

  if (!isDbAvailable()) return jsonFallback();

  try {
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
  } catch (e) {
    console.error("getAllCategoriesWithCounts DB error, falling back to JSON:", e);
    return jsonFallback();
  }
}

// sortTools and filterTools moved to @/lib/tool-utils.ts for client component compatibility
