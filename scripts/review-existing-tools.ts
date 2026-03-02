#!/usr/bin/env tsx

/**
 * Batch AI Review Script for Hive Market
 *
 * Generates AI reviews (via Claude) for all tools.
 *
 * Usage:
 *   pnpm review-tools                    # Review all unreviewed tools
 *   pnpm review-tools --force            # Delete old Claude reviews and re-review ALL tools
 *   pnpm review-tools --dry-run          # Preview without inserting
 *   pnpm review-tools --limit=5          # Only review 5 tools
 *   pnpm review-tools --delay=2000       # 2s delay between reviews (default: 1000)
 */

import dotenv from "dotenv";
import path from "path";

// Load .env.local (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

// Inline the review generation to avoid Next.js import issues
import Anthropic from "@anthropic-ai/sdk";

const CLAUDE_REVIEWER_ID = "00000000-0000-0000-0000-000000claude1";
const CLAUDE_REVIEWER_USERNAME = "claude-reviewer";
const CLAUDE_REVIEWER_DISPLAY = "Claude";

interface ToolRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  features: string[] | null;
  tags: string[] | null;
  npm_package: string | null;
  github_url: string | null;
}

interface ReviewResult {
  rating: number;
  text: string;
}

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
const delayArg = args.find((a) => a.startsWith("--delay="));
const delay = delayArg ? parseInt(delayArg.split("=")[1], 10) : 1000;

async function generateReview(tool: ToolRow): Promise<ReviewResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      rating: 4,
      text: `${tool.name} provides solid MCP integration capabilities and covers its core use case well. A useful addition to any agent's toolkit.`,
    };
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are writing a review for an MCP tool on Hive Market, a marketplace for AI agent tools.

Tool to review:
- Name: ${tool.name}
- Category: ${tool.category}
- Description: ${tool.description}
- Details: ${(tool.long_description || "").slice(0, 600)}
- Features: ${tool.features?.join(", ") || "not listed"}
- Tags: ${tool.tags?.join(", ") || "not listed"}
- npm package: ${tool.npm_package || "not provided"}
- GitHub: ${tool.github_url || "not provided"}

RATING SCALE — use the full range like a real marketplace:
- 5 stars: Good tool that works well. Solid docs, reliable, covers its use case. Official tools from known companies (Stripe, GitHub, Supabase, Anthropic, etc.) with comprehensive features generally deserve 5 stars. Community tools with good docs and broad feature sets also qualify.
- 4 stars: Works well but has minor gaps — could use better docs, missing a few features, or rough edges.
- 3 stars: Functional but with notable limitations. Early stage, sparse docs, or missing important features.
- 2 stars: Significant problems. Poor documentation, unreliable, or missing core functionality.
- 1 star: Broken, abandoned, or fundamentally flawed.

Most well-maintained tools with decent documentation should land at 4-5 stars. Don't be stingy — a tool doesn't need to be perfect to earn 5 stars, it needs to do its job well.

Review guidelines:
- Be specific — mention actual features and strengths
- Note limitations honestly but don't nitpick
- 2-4 sentences, balanced and helpful

Use the write_review tool to submit your review.`;

  const response = await client.messages.create(
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      tools: [
        {
          name: "write_review",
          description: "Submit a review for an MCP tool",
          input_schema: {
            type: "object" as const,
            properties: {
              rating: {
                type: "integer",
                minimum: 1,
                maximum: 5,
                description:
                  "Star rating 1-5. Most solid, well-documented tools deserve 4-5. Official tools from major companies with good coverage are typically 5. Reserve 3 or below for tools with real issues.",
              },
              text: {
                type: "string",
                description:
                  "The review text, 2-4 sentences. Be specific and balanced.",
              },
            },
            required: ["rating", "text"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "write_review" },
      messages: [{ role: "user", content: prompt }],
    },
    { timeout: 15000 }
  );

  const toolUse = response.content.find((block) => block.type === "tool_use");

  if (toolUse && toolUse.type === "tool_use") {
    const result = toolUse.input as { rating: number; text: string };
    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating))),
      text: result.text,
    };
  }

  throw new Error("Unexpected response format from Claude");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Batch AI Review Script");
  console.log("======================");
  if (dryRun) console.log("MODE: dry-run (no writes)");
  if (force) console.log("MODE: force (re-review all tools)");
  if (limit < Infinity) console.log(`LIMIT: ${limit} tools`);
  console.log(`DELAY: ${delay}ms between reviews`);
  console.log();

  // Upsert claude-reviewer profile
  if (!dryRun) {
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: CLAUDE_REVIEWER_ID,
        username: CLAUDE_REVIEWER_USERNAME,
        display_name: CLAUDE_REVIEWER_DISPLAY,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("Failed to upsert claude-reviewer profile:", profileError.message);
      process.exit(1);
    }
  }

  // If --force, delete all existing Claude reviews
  if (force && !dryRun) {
    console.log("Deleting existing Claude reviews...");
    const { data: deleted, error: deleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("user_id", CLAUDE_REVIEWER_ID)
      .select("id");

    if (deleteError) {
      console.error("Failed to delete old reviews:", deleteError.message);
      process.exit(1);
    }

    console.log(`Deleted ${deleted?.length ?? 0} old Claude reviews.`);
    console.log();
  }

  // Fetch all tools
  const { data: allTools, error: toolsError } = await supabase
    .from("tools")
    .select("id, name, slug, description, long_description, category, features, tags, npm_package, github_url")
    .order("name");

  if (toolsError || !allTools) {
    console.error("Failed to fetch tools:", toolsError?.message);
    process.exit(1);
  }

  // Fetch existing claude-reviewer reviews (after potential deletion)
  const { data: existingReviews } = await supabase
    .from("reviews")
    .select("tool_id")
    .eq("user_id", CLAUDE_REVIEWER_ID);

  const reviewedToolIds = new Set((existingReviews ?? []).map((r) => r.tool_id));

  // Filter to unreviewed tools
  const toolsToReview = allTools
    .filter((t) => !reviewedToolIds.has(t.id))
    .slice(0, limit);

  console.log(`Total tools: ${allTools.length}`);
  console.log(`Already reviewed: ${reviewedToolIds.size}`);
  console.log(`To review: ${toolsToReview.length}`);
  console.log();

  if (toolsToReview.length === 0) {
    console.log("All tools already have AI reviews!");
    return;
  }

  let reviewed = 0;
  let failed = 0;
  const ratings: number[] = [];

  for (const tool of toolsToReview) {
    try {
      const review = await generateReview(tool);

      if (dryRun) {
        console.log(`[DRY RUN] ${tool.name}`);
        console.log(`  Rating: ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`);
        console.log(`  Review: ${review.text}`);
        console.log();
      } else {
        const reviewId = `review-ai-${tool.slug}-${Date.now()}`;

        const { error: insertError } = await supabase.from("reviews").insert({
          id: reviewId,
          tool_id: tool.id,
          user_id: CLAUDE_REVIEWER_ID,
          author_name: CLAUDE_REVIEWER_DISPLAY,
          author_username: CLAUDE_REVIEWER_USERNAME,
          rating: review.rating,
          text: review.text,
        });

        if (insertError) {
          console.error(`  FAILED to insert review for ${tool.name}: ${insertError.message}`);
          failed++;
          continue;
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

        console.log(`✓ ${tool.name} — ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`);
      }

      ratings.push(review.rating);
      reviewed++;

      // Rate limiting delay
      if (toolsToReview.indexOf(tool) < toolsToReview.length - 1) {
        await sleep(delay);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`✗ ${tool.name} — ${message}`);
      failed++;
    }
  }

  console.log();
  console.log("Done!");
  console.log(`  Reviewed: ${reviewed}`);
  if (failed > 0) console.log(`  Failed: ${failed}`);

  // Print rating distribution
  if (ratings.length > 0) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const dist = [0, 0, 0, 0, 0];
    for (const r of ratings) dist[r - 1]++;
    console.log();
    console.log("Rating Distribution:");
    for (let i = 5; i >= 1; i--) {
      const count = dist[i - 1];
      const bar = "█".repeat(count);
      console.log(`  ${i}★  ${bar} ${count}`);
    }
    console.log(`  Avg: ${avg.toFixed(1)}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
