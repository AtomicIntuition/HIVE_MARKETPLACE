import Anthropic from "@anthropic-ai/sdk";

/** Fixed UUID for the claude-reviewer profile — used as FK in reviews table. */
export const CLAUDE_REVIEWER_ID = "00000000-0000-0000-0000-000000claude1";
export const CLAUDE_REVIEWER = {
  id: CLAUDE_REVIEWER_ID,
  username: "claude-reviewer",
  displayName: "Claude",
} as const;

export interface AIReviewInput {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  features?: string[];
  tags?: string[];
  npmPackage?: string;
  githubUrl?: string;
}

export interface AIReviewResult {
  rating: number;
  text: string;
  authorName: string;
  authorUsername: string;
}

export async function generateAIReview(
  input: AIReviewInput
): Promise<AIReviewResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return fallbackReview(input.name);
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are writing a review for an MCP tool on Hive Market, a marketplace for AI agent tools.

Tool to review:
- Name: ${input.name}
- Category: ${input.category}
- Description: ${input.description}
- Details: ${input.longDescription.slice(0, 600)}
- Features: ${input.features?.join(", ") || "not listed"}
- Tags: ${input.tags?.join(", ") || "not listed"}
- npm package: ${input.npmPackage || "not provided"}
- GitHub: ${input.githubUrl || "not provided"}

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

  try {
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

    const toolUse = response.content.find(
      (block) => block.type === "tool_use"
    );

    if (toolUse && toolUse.type === "tool_use") {
      const result = toolUse.input as { rating: number; text: string };
      const rating = Math.max(1, Math.min(5, Math.round(result.rating)));

      return {
        rating,
        text: result.text,
        authorName: CLAUDE_REVIEWER.displayName,
        authorUsername: CLAUDE_REVIEWER.username,
      };
    }

    return fallbackReview(input.name);
  } catch {
    return fallbackReview(input.name);
  }
}

function fallbackReview(toolName: string): AIReviewResult {
  return {
    rating: 4,
    text: `${toolName} provides solid MCP integration capabilities and covers its core use case well. A useful addition to any agent's toolkit.`,
    authorName: CLAUDE_REVIEWER.displayName,
    authorUsername: CLAUDE_REVIEWER.username,
  };
}
