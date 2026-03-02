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

RATING CRITERIA — evaluate honestly based on these factors:
- Quality of documentation and examples
- Breadth and depth of features for its category
- Whether it's from a trusted/official source or community-maintained
- How production-ready it feels (error handling, security, edge cases)
- Whether the npm package exists and is well-maintained

5 stars = genuinely exceptional on all criteria. 1 star = fundamentally broken or useless. Rate honestly based on the tool's actual merits — don't inflate or deflate.

Review guidelines:
- Be specific — mention actual features and real limitations
- 2-4 sentences, honest, not promotional

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
                    "Honest star rating 1-5 based on docs quality, feature depth, maintainer trust, and production-readiness.",
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
    rating: 3,
    text: `${toolName} provides useful MCP integration capabilities. The tool covers its core use case adequately, though additional documentation and examples would improve the developer experience.`,
    authorName: CLAUDE_REVIEWER.displayName,
    authorUsername: CLAUDE_REVIEWER.username,
  };
}
