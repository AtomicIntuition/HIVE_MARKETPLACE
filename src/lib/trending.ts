import "server-only";

interface TrendingScore {
  toolId: string;
  score: number;
  eventCount: number;
}

export async function calculateTrendingScores(
  days = 7
): Promise<TrendingScore[]> {
  if (!process.env.DATABASE_URL) return [];

  try {
    const { db } = await import("@/db");
    const { toolAnalytics } = await import("@/db/schema");
    const { gte, sql, count } = await import("drizzle-orm");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const results = await db
      .select({
        toolId: toolAnalytics.toolId,
        eventCount: count(),
      })
      .from(toolAnalytics)
      .where(gte(toolAnalytics.createdAt, since.toISOString()))
      .groupBy(toolAnalytics.toolId)
      .orderBy(sql`count(*) desc`);

    const maxCount = results.length > 0 ? results[0].eventCount : 1;

    return results.map((r) => ({
      toolId: r.toolId,
      score: Math.round((r.eventCount / maxCount) * 100),
      eventCount: r.eventCount,
    }));
  } catch {
    return [];
  }
}
