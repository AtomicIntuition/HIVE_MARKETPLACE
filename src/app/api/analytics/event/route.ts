import { NextRequest } from "next/server";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolSlug, eventType, source, metadata } = body;

    if (!toolSlug || !eventType) {
      return apiError("toolSlug and eventType are required", 400);
    }

    const validEventTypes = ["install", "config_copy", "api_view", "mcp_request"];
    if (!validEventTypes.includes(eventType)) {
      return apiError(`Invalid eventType. Must be one of: ${validEventTypes.join(", ")}`, 400);
    }

    const validSources = ["web", "mcp-server", "api"];
    const eventSource = validSources.includes(source) ? source : "api";

    // Fire and forget — try to insert, but never fail the response
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/db");
        const { toolAnalytics, tools } = await import("@/db/schema");
        const { eq } = await import("drizzle-orm");

        // Look up tool ID from slug
        const toolRows = await db
          .select({ id: tools.id })
          .from(tools)
          .where(eq(tools.slug, toolSlug))
          .limit(1);

        if (toolRows.length > 0) {
          const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          await db.insert(toolAnalytics).values({
            id,
            toolId: toolRows[0].id,
            eventType,
            source: eventSource,
            metadata: metadata || null,
          });
        }
      } catch {
        // Silently fail
      }
    }

    return apiSuccess({ received: true }, 201);
  } catch {
    return apiSuccess({ received: true }, 201);
  }
}

export async function OPTIONS() {
  return handleCors();
}
