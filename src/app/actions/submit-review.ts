"use server";

import { z } from "zod/v4";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const reviewSchema = z.object({
  toolId: z.string().min(1),
  toolSlug: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

export interface ReviewState {
  error?: string;
  success?: boolean;
}

export async function submitReview(
  _prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to leave a review." };
  }

  const raw = {
    toolId: formData.get("toolId") as string,
    toolSlug: formData.get("toolSlug") as string,
    rating: formData.get("rating") as string,
    text: formData.get("text") as string,
  };

  const result = reviewSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  const authorName = profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous";
  const authorUsername = profile?.username || user.user_metadata?.user_name || user.email?.split("@")[0] || "anonymous";

  const reviewId = `review-${user.id}-${data.toolId}-${Date.now()}`;

  // Insert review
  const { error: insertError } = await supabase.from("reviews").insert({
    id: reviewId,
    tool_id: data.toolId,
    user_id: user.id,
    author_name: authorName,
    author_username: authorUsername,
    rating: data.rating,
    text: data.text,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "You have already reviewed this tool." };
    }
    return { error: `Failed to submit review: ${insertError.message}` };
  }

  // Recalculate tool's average rating and review count
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("tool_id", data.toolId);

  if (reviews && reviews.length > 0) {
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await supabase
      .from("tools")
      .update({
        rating: Math.round(avgRating * 10) / 10,
        review_count: reviews.length,
      })
      .eq("id", data.toolId);
  }

  revalidatePath(`/tools/${data.toolSlug}`);
  return { success: true };
}
