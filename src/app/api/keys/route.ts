import { NextRequest } from "next/server";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-keys";
import { db } from "@/db";
import { apiKeys, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Authentication required", 401);
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        keyPrefix: apiKeys.keyPrefix,
        name: apiKeys.name,
        status: apiKeys.status,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id))
      .orderBy(apiKeys.createdAt);

    return apiSuccess({ keys });
  } catch (e) {
    console.error("API /keys GET error:", e);
    return apiError("Failed to fetch API keys", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Authentication required", 401);
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name || name.length > 255) {
      return apiError("name is required (max 255 characters)", 400);
    }

    // Limit to 5 active keys per user
    const existing = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, user.id), eq(apiKeys.status, "active")));

    if (existing.length >= 5) {
      return apiError("Maximum of 5 active API keys allowed. Revoke an existing key first.", 400);
    }

    // Ensure profile exists (FK constraint on api_keys.userId → profiles.id)
    await db
      .insert(profiles)
      .values({
        id: user.id,
        username: user.email?.split("@")[0] ?? user.id.slice(0, 8),
        displayName: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
      })
      .onConflictDoNothing();

    const { key, hash, prefix } = generateApiKey();
    const id = `key-${crypto.randomUUID()}`;

    await db.insert(apiKeys).values({
      id,
      userId: user.id,
      keyHash: hash,
      keyPrefix: prefix,
      name,
    });

    // Return the full key ONCE — it cannot be retrieved again
    return apiSuccess(
      {
        id,
        key,
        prefix,
        name,
        message: "Store this key securely. It will not be shown again.",
      },
      201
    );
  } catch (e) {
    console.error("API /keys POST error:", e);
    return apiError("Failed to create API key", 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
