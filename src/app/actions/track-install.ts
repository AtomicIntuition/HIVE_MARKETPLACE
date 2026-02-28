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
