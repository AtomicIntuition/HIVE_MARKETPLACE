#!/usr/bin/env tsx

/**
 * Batch AI Review Script for Hive Market
 *
 * Generates AI reviews (via Claude) for all tools that haven't been reviewed
 * by the claude-reviewer yet.
 *
 * Usage:
 *   pnpm review-tools                    # Review all unreviewed tools
 *   pnpm review-tools --dry-run          # Preview without inserting
 *   pnpm review-tools --limit=5          # Only review 5 tools
 *   pnpm review-tools --delay=2000       # 2s delay between reviews (default: 1000)
 */

import "dotenv/config";
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
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
const delayArg = args.find((a) => a.startsWith("--delay="));
const delay = delayArg ? parseInt(delayArg.split("=")[1], 10) : 1000;

async function generateReview(tool: ToolRow): Promise<ReviewResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      rating: 3,
      text: `${tool.name} provides useful MCP integration capabilities. The tool covers its core use case adequately, though additional documentation and examples would improve the developer experience.`,
    };
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are writing a review for an MCP tool on Hive Market, a marketplace for AI agent tools.

Review this tool honestly and helpfully:

- Name: ${tool.name}
- Category: ${tool.category}
- Description: ${tool.description}
- Details: ${(tool.long_description || "").slice(0, 600)}
- Features: ${tool.features?.join(", ") || "not listed"}
- Tags: ${tool.tags?.join(", ") || "not listed"}
- npm package: ${tool.npm_package || "not provided"}
- GitHub: ${tool.github_url || "not provided"}

Guidelines for your review:
- Be balanced and specific — mention what the tool does well and any limitations
- Most tools should get 3-4 stars. Only truly exceptional, well-documented tools with broad utility get 5 stars. Bare-minimum or poorly documented tools get 2 stars.
- Mention specific features or use cases
- Keep the review 2-4 sentences, natural and helpful
- Write as if you've evaluated the tool's documentation and capabilities
- Do NOT use generic filler — be specific to THIS tool

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
                type: "number",
                description:
                  "Star rating from 1 to 5. Most tools get 3-4. Only exceptional tools get 5.",
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

  // Fetch all tools
  const { data: allTools, error: toolsError } = await supabase
    .from("tools")
    .select("id, name, slug, description, long_description, category, features, tags, npm_package, github_url")
    .order("name");

  if (toolsError || !allTools) {
    console.error("Failed to fetch tools:", toolsError?.message);
    process.exit(1);
  }

  // Fetch existing claude-reviewer reviews
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
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
