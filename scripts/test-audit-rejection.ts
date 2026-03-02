/**
 * Test the AI audit rejection path — submit a suspicious-looking tool
 * and verify Haiku flags it for manual review.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;

const WELL_KNOWN_SCOPES = [
  "@modelcontextprotocol",
  "@anthropic-ai",
  "@openai",
  "@google",
  "@stripe",
  "@slack",
];

interface AuditResult {
  approved: boolean;
  flags: string[];
  summary: string;
}

async function auditTool(submission: {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  npmPackage?: string;
  githubUrl?: string;
  category: string;
}): Promise<AuditResult> {
  const client = new Anthropic({ apiKey: ANTHROPIC_KEY });

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
- Docs URL: not provided

Well-known trusted npm scopes: ${WELL_KNOWN_SCOPES.join(", ")}

Check for:
1. npm package name validity — does it look like a real package? Is it potentially typosquatting a well-known package?
2. Description quality — is it meaningful and descriptive, or is it spam/gibberish/too vague?
3. Suspicious patterns — suspicious URLs, names that impersonate well-known services, or content that looks like a scam/phishing attempt.
4. Category match — does the description reasonably match the selected category?

Use the review_tool to provide your assessment.`;

  const response = await client.messages.create(
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      tools: [
        {
          name: "review_tool",
          description: "Provide the review result for a tool submission",
          input_schema: {
            type: "object" as const,
            properties: {
              approved: {
                type: "boolean",
                description: "true if auto-approved, false if needs manual review",
              },
              flags: {
                type: "array",
                items: { type: "string" },
                description: "List of specific concerns. Empty array if none.",
              },
              summary: {
                type: "string",
                description: "Brief summary of the review decision",
              },
            },
            required: ["approved", "flags", "summary"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "review_tool" },
      messages: [{ role: "user", content: prompt }],
    },
    { timeout: 15000 }
  );

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (toolUse && toolUse.type === "tool_use") {
    return toolUse.input as AuditResult;
  }
  return { approved: true, flags: ["unexpected_format"], summary: "Unexpected" };
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  AI AUDIT REJECTION TEST");
  console.log("═══════════════════════════════════════════════════\n");

  // Test 1: Typosquatting attempt
  console.log("TEST 1: Typosquatting (@strlpe/mcp-server)");
  console.log("─────────────────────────────────────────────────");
  const result1 = await auditTool({
    name: "Strlpe Payments MCP",
    slug: "strlpe-mcp",
    description: "Process payments with Strlpe integration",
    longDescription: "Connect to Strlpe API for payment processing. Easy setup, fast integration.",
    npmPackage: "@strlpe/mcp-server",
    githubUrl: "https://github.com/str1pe-hacker/mcp",
    category: "payments",
  });
  console.log(`  Approved: ${result1.approved}`);
  console.log(`  Flags:    ${result1.flags.join("; ")}`);
  console.log(`  Summary:  ${result1.summary}`);
  console.log(`  ${result1.approved ? "UNEXPECTED APPROVE" : "CORRECTLY FLAGGED"}\n`);

  // Test 2: Spam/gibberish description
  console.log("TEST 2: Spam / gibberish description");
  console.log("─────────────────────────────────────────────────");
  const result2 = await auditTool({
    name: "Super Tool Pro Max",
    slug: "super-tool-pro-max",
    description: "best tool ever buy now free money click here amazing results guaranteed",
    longDescription: "This is the best tool. It does everything. You need this. Click here. Amazing. Free. Best. Number one. Top rated. Must have. Download now. Limited time offer.",
    npmPackage: "super-tool-pro-max-free",
    category: "ai-ml",
  });
  console.log(`  Approved: ${result2.approved}`);
  console.log(`  Flags:    ${result2.flags.join("; ")}`);
  console.log(`  Summary:  ${result2.summary}`);
  console.log(`  ${result2.approved ? "UNEXPECTED APPROVE" : "CORRECTLY FLAGGED"}\n`);

  // Test 3: Category mismatch
  console.log("TEST 3: Category mismatch");
  console.log("─────────────────────────────────────────────────");
  const result3 = await auditTool({
    name: "Recipe Manager MCP",
    slug: "recipe-manager-mcp",
    description: "Manage and search cooking recipes with AI assistance",
    longDescription: "A recipe management tool that helps you organize your cooking recipes, search by ingredient, and get AI-powered meal suggestions. Great for home cooks and food bloggers.",
    npmPackage: "recipe-manager-mcp",
    category: "payments",
  });
  console.log(`  Approved: ${result3.approved}`);
  console.log(`  Flags:    ${result3.flags.join("; ")}`);
  console.log(`  Summary:  ${result3.summary}`);
  console.log(`  ${result3.approved ? "UNEXPECTED APPROVE" : "CORRECTLY FLAGGED"}\n`);

  console.log("═══════════════════════════════════════════════════");
  console.log("  REJECTION TESTS COMPLETE");
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch(console.error);
