"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { Star, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { submitReview, ReviewState } from "@/app/actions/submit-review";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/hooks/use-user";

interface ReviewData {
  id: string;
  authorName: string;
  authorUsername: string;
  avatarUrl?: string | null;
  rating: number;
  text: string;
  createdAt: string;
}

interface ToolReviewsProps {
  toolId: string;
  toolSlug: string;
  toolName: string;
  reviews: ReviewData[];
  userHasReviewed: boolean;
}

export function ToolReviews({
  toolId,
  toolSlug,
  toolName,
  reviews,
  userHasReviewed,
}: ToolReviewsProps) {
  const { user } = useUser();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [state, formAction, isPending] = useActionState<ReviewState, FormData>(
    submitReview,
    {}
  );

  const showForm = user && !userHasReviewed && !state.success;

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {/* Review form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border/50 bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Write a review for {toolName}
          </h3>

          {state.error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <form action={formAction}>
            <input type="hidden" name="toolId" value={toolId} />
            <input type="hidden" name="toolSlug" value={toolSlug} />
            <input type="hidden" name="rating" value={selectedRating} />

            {/* Star rating selector */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-muted-foreground">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        (hoverRating || selectedRating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review text */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-muted-foreground">
                Review
              </label>
              <textarea
                name="text"
                className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                rows={4}
                placeholder="Share your experience with this tool..."
                required
                minLength={10}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || selectedRating === 0}
              className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        </div>
      )}

      {state.success && (
        <div className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          Review submitted successfully!
        </div>
      )}

      {!user && (
        <div className="mb-6 rounded-xl border border-border/50 bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/auth/login" className="text-violet-400 hover:text-violet-300">
              Sign in
            </a>{" "}
            to leave a review.
          </p>
        </div>
      )}

      {userHasReviewed && !state.success && (
        <div className="mb-6 rounded-lg border border-violet-500/20 bg-violet-500/10 p-3 text-sm text-violet-400">
          You&apos;ve already reviewed this tool.
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review {toolName}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {review.avatarUrl ? (
                    <Image
                      src={review.avatarUrl}
                      alt={review.authorName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/20 text-xs font-medium text-violet-400">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      {review.authorName}
                      {(review.authorUsername === "claude-ai" || review.authorUsername === "claude-reviewer") && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-400">
                          <Bot className="h-2.5 w-2.5" />
                          AI Review
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{review.authorUsername}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <RatingStars rating={review.rating} size="sm" />
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
