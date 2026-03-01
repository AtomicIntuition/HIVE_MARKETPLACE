"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackInstall(toolId: string) {
  try {
    const supabase = await createClient();

    // Increment install count using raw SQL via Supabase
    const { data: tool } = await supabase
      .from("tools")
      .select("install_count")
      .eq("id", toolId)
      .single();

    if (tool) {
      await supabase
        .from("tools")
        .update({ install_count: (tool.install_count ?? 0) + 1 })
        .eq("id", toolId);
    }

    // Record analytics event
    try {
      const { db } = await import("@/db");
      const { toolAnalytics } = await import("@/db/schema");
      const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await db.insert(toolAnalytics).values({
        id,
        toolId,
        eventType: "install",
        source: "web",
      });
    } catch {
      // Analytics is fire-and-forget
    }

    // If user is signed in, record the connection
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("user_connections")
        .upsert(
          { user_id: user.id, tool_id: toolId },
          { onConflict: "user_id,tool_id" }
        );
    }
  } catch {
    // Silently fail if DB not available
  }
}
