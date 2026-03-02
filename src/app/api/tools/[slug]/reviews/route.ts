import { NextRequest } from "next/server";
import { getToolBySlug } from "@/lib/data";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);

    if (!tool) {
      return apiError("Tool not found", 404);
    }

    const supabase = await createClient();
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, author_name, author_username, rating, text, created_at, helpful")
      .eq("tool_id", tool.id)
      .order("created_at", { ascending: false });

    const formatted = (reviews ?? []).map((r) => ({
      id: r.id,
      authorName: r.author_name,
      authorUsername: r.author_username,
      rating: r.rating,
      text: r.text,
      createdAt: r.created_at,
      helpful: r.helpful,
    }));

    return apiSuccess({
      tool: { id: tool.id, slug: tool.slug, name: tool.name },
      reviews: formatted,
      count: formatted.length,
    });
  } catch (e) {
    console.error("API /tools/[slug]/reviews GET error:", e);
    return apiError("Failed to fetch reviews", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);

    if (!tool) {
      return apiError("Tool not found", 404);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Authentication required", 401);
    }

    const body = await request.json();
    const { rating, text } = body;

    if (!rating || !text || typeof rating !== "number" || typeof text !== "string") {
      return apiError("Missing or invalid rating (number 1-5) and text (string)", 400);
    }

    if (rating < 1 || rating > 5) {
      return apiError("Rating must be between 1 and 5", 400);
    }

    if (text.length < 10 || text.length > 2000) {
      return apiError("Review text must be between 10 and 2000 characters", 400);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .single();

    const authorName =
      profile?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Anonymous";
    const authorUsername =
      profile?.username ||
      user.user_metadata?.user_name ||
      user.email?.split("@")[0] ||
      "anonymous";

    const reviewId = `review-${user.id}-${tool.id}-${Date.now()}`;

    const { error: insertError } = await supabase.from("reviews").insert({
      id: reviewId,
      tool_id: tool.id,
      user_id: user.id,
      author_name: authorName,
      author_username: authorUsername,
      rating,
      text,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return apiError("You have already reviewed this tool", 409);
      }
      return apiError(`Failed to submit review: ${insertError.message}`, 500);
    }

    // Recalculate tool rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("tool_id", tool.id);

    if (allReviews && allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await supabase
        .from("tools")
        .update({
          rating: Math.round(avgRating * 10) / 10,
          review_count: allReviews.length,
        })
        .eq("id", tool.id);
    }

    return apiSuccess(
      {
        id: reviewId,
        authorName,
        authorUsername,
        rating,
        text,
      },
      201
    );
  } catch (e) {
    console.error("API /tools/[slug]/reviews POST error:", e);
    return apiError("Failed to submit review", 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
