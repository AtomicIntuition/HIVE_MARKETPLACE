import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Authentication required", 401);
    }

    const { id } = await params;

    const result = await db
      .update(apiKeys)
      .set({ status: "revoked" })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)))
      .returning({ id: apiKeys.id });

    if (result.length === 0) {
      return apiError("API key not found", 404);
    }

    return apiSuccess({ id, status: "revoked" });
  } catch (e) {
    console.error("API /keys/[id] DELETE error:", e);
    return apiError("Failed to revoke API key", 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
