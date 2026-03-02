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

Review this tool honestly and helpfully:

- Name: ${input.name}
- Category: ${input.category}
- Description: ${input.description}
- Details: ${input.longDescription.slice(0, 600)}
- Features: ${input.features?.join(", ") || "not listed"}
- Tags: ${input.tags?.join(", ") || "not listed"}
- npm package: ${input.npmPackage || "not provided"}
- GitHub: ${input.githubUrl || "not provided"}

Guidelines for your review:
- Be balanced and specific — mention what the tool does well and any limitations
- Most tools should get 3-4 stars. Only truly exceptional, well-documented tools with broad utility get 5 stars. Bare-minimum or poorly documented tools get 2 stars.
- Mention specific features or use cases
- Keep the review 2-4 sentences, natural and helpful
- Write as if you've evaluated the tool's documentation and capabilities
- Do NOT use generic filler — be specific to THIS tool

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
