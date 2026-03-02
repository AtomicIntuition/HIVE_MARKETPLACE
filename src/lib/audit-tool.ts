import Anthropic from "@anthropic-ai/sdk";

export interface AuditResult {
  approved: boolean;
  flags: string[];
  summary: string;
}

interface AuditInput {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  npmPackage?: string;
  githubUrl?: string;
  docsUrl?: string;
  category: string;
}

const WELL_KNOWN_SCOPES = [
  "@modelcontextprotocol",
  "@anthropic-ai",
  "@openai",
  "@google",
  "@aws",
  "@azure",
  "@stripe",
  "@slack",
  "@notionhq",
  "@supabase",
  "@prisma",
  "@vercel",
  "@cloudflare",
];

export async function auditToolSubmission(
  submission: AuditInput
): Promise<AuditResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // No API key = skip audit, auto-approve with a flag
    return {
      approved: true,
      flags: ["audit_skipped: no API key configured"],
      summary: "AI audit skipped — no ANTHROPIC_API_KEY configured.",
    };
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are a security reviewer for an MCP tool marketplace called Hive Market.
Analyze this tool submission and determine if it should be automatically approved or flagged for manual review.

Tool submission:
- Name: ${submission.name}
- Slug: ${submission.slug}
- Category: ${submission.category}
- Description: ${submission.description}
- Long Description: ${submission.longDescription.slice(0, 500)}
- npm Package: ${submission.npmPackage || "not provided"}
- GitHub URL: ${submission.githubUrl || "not provided"}
- Docs URL: ${submission.docsUrl || "not provided"}

Well-known trusted npm scopes: ${WELL_KNOWN_SCOPES.join(", ")}

Check for:
1. npm package name validity — does it look like a real package? Is it potentially typosquatting a well-known package (e.g. "@strlpe/mcp" instead of "@stripe/mcp")?
2. Description quality — is it meaningful and descriptive, or is it spam/gibberish/too vague?
3. Suspicious patterns — suspicious URLs, names that impersonate well-known services, or content that looks like a scam/phishing attempt.
4. Category match — does the description reasonably match the selected category?

Use the review_tool to provide your assessment.`;

  try {
    const response = await client.messages.create(
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        tools: [
          {
            name: "review_tool",
            description:
              "Provide the review result for a tool submission",
            input_schema: {
              type: "object" as const,
              properties: {
                approved: {
                  type: "boolean",
                  description:
                    "true if the tool should be auto-approved, false if it needs manual review",
                },
                flags: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "List of specific concerns or issues found. Empty array if none.",
                },
                summary: {
                  type: "string",
                  description:
                    "Brief summary of the review decision (1-2 sentences)",
                },
              },
              required: ["approved", "flags", "summary"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "review_tool" },
        messages: [{ role: "user", content: prompt }],
      },
      { timeout: 10000 }
    );

    // Extract tool use result
    const toolUse = response.content.find(
      (block) => block.type === "tool_use"
    );

    if (toolUse && toolUse.type === "tool_use") {
      const input = toolUse.input as {
        approved: boolean;
        flags: string[];
        summary: string;
      };
      return {
        approved: input.approved,
        flags: input.flags,
        summary: input.summary,
      };
    }

    // Unexpected response shape — approve with flag
    return {
      approved: true,
      flags: ["audit_warning: unexpected response format"],
      summary: "AI audit returned unexpected format. Auto-approved with flag.",
    };
  } catch (error) {
    // Audit failure should never block submission — auto-approve with flag
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return {
      approved: true,
      flags: [`audit_error: ${message}`],
      summary: `AI audit failed (${message}). Auto-approved with flag.`,
    };
  }
}
