import { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getToolBySlug } from "@/lib/data";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";
import { validateApiKey } from "@/lib/api-keys";
import {
  reviewRateLimiter,
  REVIEW_RATE_LIMIT,
  REVIEW_RATE_WINDOW_MS,
} from "@/lib/rate-limiter";

/** Admin client that bypasses RLS — used for agent-submitted reviews */
function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

    const body = await request.json();
    const { rating, text, authorName, authorUsername } = body;

    // Validate required fields
    if (!rating || !text || typeof rating !== "number" || typeof text !== "string") {
      return apiError("Missing or invalid fields: rating (number 1-5) and text (string) are required", 400);
    }

    if (rating < 1 || rating > 5) {
      return apiError("Rating must be between 1 and 5", 400);
    }

    if (text.length < 10 || text.length > 2000) {
      return apiError("Review text must be between 10 and 2000 characters", 400);
    }

    // Check if this is an authenticated user (Supabase session) or an agent
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let reviewAuthorName: string;
    let reviewAuthorUsername: string;
    let reviewerId: string;

    if (user) {
      // Authenticated user — use their profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, display_name")
        .eq("id", user.id)
        .single();

      reviewAuthorName =
        profile?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Anonymous";
      reviewAuthorUsername =
        profile?.username ||
        user.user_metadata?.user_name ||
        user.email?.split("@")[0] ||
        "anonymous";
      reviewerId = user.id;
    } else {
      // Agent review — requires valid API key
      const authHeader = request.headers.get("authorization");
      const keyResult = await validateApiKey(authHeader);

      if (!keyResult.valid || !keyResult.userId || !keyResult.keyId) {
        return apiError(
          "Authentication required. Provide a Supabase session or Authorization: Bearer hm_sk_... API key.",
          401
        );
      }

      // Rate limit check
      const rateLimitResult = reviewRateLimiter.check(
        keyResult.keyId,
        REVIEW_RATE_LIMIT,
        REVIEW_RATE_WINDOW_MS
      );

      if (!rateLimitResult.allowed) {
        return apiError(
          `Rate limit exceeded. Try again after ${new Date(rateLimitResult.resetAt).toISOString()}`,
          429
        );
      }

      if (!authorName || !authorUsername || typeof authorName !== "string" || typeof authorUsername !== "string") {
        return apiError(
          "Agent reviews require authorName and authorUsername fields",
          400
        );
      }

      if (authorName.length < 1 || authorName.length > 100) {
        return apiError("authorName must be between 1 and 100 characters", 400);
      }

      if (authorUsername.length < 1 || authorUsername.length > 100) {
        return apiError("authorUsername must be between 1 and 100 characters", 400);
      }

      reviewAuthorName = authorName;
      reviewAuthorUsername = authorUsername;
      // Tie agent reviews to the API key owner so they can only review once per tool
      reviewerId = `agent-${keyResult.userId}-${authorUsername}`;
    }

    const admin = createAdminClient();

    // Upsert agent profile (so the FK constraint is satisfied)
    if (!user) {
      await admin.from("profiles").upsert(
        {
          id: reviewerId,
          username: reviewAuthorUsername,
          display_name: reviewAuthorName,
        },
        { onConflict: "id" }
      );
    }

    const reviewId = `review-${reviewerId}-${tool.id}-${Date.now()}`;

    const { error: insertError } = await admin.from("reviews").insert({
      id: reviewId,
      tool_id: tool.id,
      user_id: reviewerId,
      author_name: reviewAuthorName,
      author_username: reviewAuthorUsername,
      rating: Math.round(rating),
      text,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return apiError("This reviewer has already reviewed this tool", 409);
      }
      return apiError(`Failed to submit review: ${insertError.message}`, 500);
    }

    // Recalculate tool rating
    const { data: allReviews } = await admin
      .from("reviews")
      .select("rating")
      .eq("tool_id", tool.id);

    if (allReviews && allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await admin
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
        authorName: reviewAuthorName,
        authorUsername: reviewAuthorUsername,
        rating: Math.round(rating),
        text,
        toolSlug: tool.slug,
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
