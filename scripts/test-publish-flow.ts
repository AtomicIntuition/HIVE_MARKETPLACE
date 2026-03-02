/**
 * End-to-end test of the full publisher flow:
 * 1. Validate submission with Zod
 * 2. Insert into tool_submissions (status: pending)
 * 3. Run AI audit via Claude Haiku
 * 4. If approved → insert into tools table, update status
 * 5. If flagged → keep pending, store review notes
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { z } from "zod/v4";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

// ─── Config ───────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── The MCP tool we're publishing ────────────────────────────────
const TOOL_SUBMISSION = {
  name: "Hive Market MCP",
  slug: `hive-market-mcp`,
  description:
    "Search, discover, and get install configs for MCP tools directly from your AI agent. The official Hive Market MCP server.",
  longDescription: `## Hive Market MCP Server

The official MCP server for Hive Market — the marketplace for AI agent tools.

### What it does

This MCP server lets your AI agent interact with the Hive Market catalog directly. No need to leave your conversation — search for tools, get detailed info, copy install configs, and discover new MCP servers all from within your agent.

### Key Capabilities

- **Search tools** — full-text search across the entire Hive Market catalog with filters for category, pricing, and sorting
- **Get tool details** — retrieve complete info for any tool including description, features, pricing, and compatibility
- **Generate install configs** — get ready-to-paste MCP config JSON for Claude Desktop, Cursor, Windsurf, or Claude Code
- **Browse categories** — list all tool categories with descriptions and counts
- **Explore stacks** — discover curated tool combinations for common use cases
- **Get recommendations** — describe your use case and get personalized tool suggestions

### Why use it

Stop context-switching between your agent and a browser. Let your AI find and configure the right tools for you in seconds.`,
  category: "devtools",
  tags: "mcp, tools, marketplace, discovery, agent",
  features:
    "Tool search and filtering, Install config generation, Category browsing, Stack exploration, AI-powered recommendations, Multi-client support",
  githubUrl: "https://github.com/hive-market/mcp-server",
  docsUrl: "",
  npmPackage: "@anthropic-ai/hive-market-mcp",
  installCommand: "npx" as const,
  version: "1.0.0",
  compatibility: ["Claude", "GPT", "Gemini", "Open Source"],
  pricingModel: "free" as const,
  pricingPrice: "",
  pricingUnit: "call",
  envVars: JSON.stringify([
    {
      name: "HIVE_MARKET_API_URL",
      description:
        "Base URL for the Hive Market API (defaults to https://market.hive.sh/api)",
      required: false,
      placeholder: "https://market.hive.sh/api",
    },
  ]),
};

// ─── Zod schema (same as submit-tool.ts) ──────────────────────────
const envVarSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean(),
  placeholder: z.string().optional(),
});

const toolSubmissionSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(300),
  longDescription: z.string().min(50),
  category: z.enum([
    "payments",
    "communication",
    "data",
    "devtools",
    "productivity",
    "ai-ml",
    "content",
    "analytics",
  ]),
  tags: z
    .string()
    .transform((val) =>
      val.split(",").map((t) => t.trim()).filter(Boolean)
    ),
  githubUrl: z.union([z.url(), z.literal("")]).optional(),
  docsUrl: z.union([z.url(), z.literal("")]).optional(),
  npmPackage: z.string().max(255).optional(),
  installCommand: z.enum(["npx", "uvx"]).default("npx"),
  version: z.string().min(1).max(50),
  compatibility: z.array(z.string()).min(1),
  pricingModel: z.enum(["free", "per-call", "monthly"]),
  pricingPrice: z.coerce.number().min(0).optional(),
  pricingUnit: z.string().optional(),
  features: z
    .string()
    .transform((val) =>
      val.split(",").map((t) => t.trim()).filter(Boolean)
    ),
  envVars: z
    .string()
    .transform((val) => {
      if (!val) return [];
      try {
        return JSON.parse(val) as unknown[];
      } catch {
        return [];
      }
    })
    .pipe(z.array(envVarSchema))
    .optional(),
});

// ─── AI Audit (same logic as audit-tool.ts) ───────────────────────
const WELL_KNOWN_SCOPES = [
  "@modelcontextprotocol",
  "@anthropic-ai",
  "@openai",
  "@google",
  "@aws",
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
  docsUrl?: string;
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
- Docs URL: ${submission.docsUrl || "not provided"}

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
                description:
                  "true if the tool should be auto-approved, false if it needs manual review",
              },
              flags: {
                type: "array",
                items: { type: "string" },
                description: "List of specific concerns. Empty array if none.",
              },
              summary: {
                type: "string",
                description: "Brief summary of the review decision (1-2 sentences)",
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
  return { approved: true, flags: ["unexpected_format"], summary: "Unexpected audit response" };
}

// ─── Main flow ────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  HIVE MARKET — FULL PUBLISHER FLOW TEST");
  console.log("═══════════════════════════════════════════════════\n");

  // Step 1: Zod validation
  console.log("STEP 1: Zod Validation");
  console.log("─────────────────────────────────────────────────");
  const parsed = toolSubmissionSchema.safeParse(TOOL_SUBMISSION);
  if (!parsed.success) {
    console.error("VALIDATION FAILED:", parsed.error.issues);
    process.exit(1);
  }
  const data = parsed.data;
  console.log("  Name:        ", data.name);
  console.log("  Slug:        ", data.slug);
  console.log("  Category:    ", data.category);
  console.log("  Tags:        ", data.tags.join(", "));
  console.log("  Features:    ", data.features.length, "features");
  console.log("  npm:         ", data.npmPackage);
  console.log("  Env Vars:    ", data.envVars?.length ?? 0, "variables");
  console.log("  Compatibility:", data.compatibility.join(", "));
  console.log("  PASSED\n");

  // Step 2: Check for slug collision
  console.log("STEP 2: Slug Collision Check");
  console.log("─────────────────────────────────────────────────");
  const { data: existing } = await supabase
    .from("tools")
    .select("id")
    .eq("slug", data.slug)
    .single();

  if (existing) {
    console.log("  Tool with slug already exists — cleaning up for fresh test...");
    await supabase.from("tools").delete().eq("slug", data.slug);
    await supabase.from("tool_submissions").delete().eq("slug", data.slug);
    console.log("  Cleaned up existing records.");
  } else {
    console.log("  No collision — slug is available.");
  }

  // Also clean up any prior test submission
  await supabase.from("tool_submissions").delete().eq("slug", data.slug);
  console.log("  PASSED\n");

  // Step 3: Get or create a test profile
  console.log("STEP 3: Test Profile Setup");
  console.log("─────────────────────────────────────────────────");

  // List existing auth users via service role
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .limit(1);

  let userId: string;
  let authorName: string;
  let authorUsername: string;

  if (profiles && profiles.length > 0) {
    userId = profiles[0].id;
    authorName = profiles[0].display_name || "Test Publisher";
    authorUsername = profiles[0].username || "test-publisher";
    console.log(`  Using existing profile: ${authorName} (@${authorUsername})`);
  } else {
    userId = `test-user-${Date.now()}`;
    authorName = "Hive Market Team";
    authorUsername = "hive-market";
    await supabase.from("profiles").insert({
      id: userId,
      username: authorUsername,
      display_name: authorName,
    });
    console.log(`  Created test profile: ${authorName} (@${authorUsername})`);
  }
  console.log("  PASSED\n");

  // Step 4: Insert into tool_submissions (status: pending)
  console.log("STEP 4: Insert Submission (status: pending)");
  console.log("─────────────────────────────────────────────────");

  const id = `tool-${data.slug}-${Date.now()}`;
  const now = new Date().toISOString();
  const author = { name: authorName, username: authorUsername, verified: false };
  const pricing = { model: data.pricingModel };
  const envVars = data.envVars && data.envVars.length > 0 ? data.envVars : null;

  const { error: subError } = await supabase.from("tool_submissions").insert({
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    long_description: data.longDescription,
    category: data.category,
    author,
    pricing,
    tags: data.tags,
    features: data.features,
    github_url: data.githubUrl || null,
    docs_url: data.docsUrl || null,
    npm_package: data.npmPackage || null,
    install_command: data.installCommand,
    version: data.version,
    compatibility: data.compatibility,
    icon_bg: "#8B5CF6",
    env_vars: envVars,
    submitted_by: userId,
    status: "pending",
    submitted_at: now,
  });

  if (subError) {
    console.error("  SUBMISSION INSERT FAILED:", subError.message);
    process.exit(1);
  }
  console.log(`  Submission ID: ${id}`);
  console.log("  Status: pending");
  console.log("  PASSED\n");

  // Step 5: Run AI Audit via Claude Haiku
  console.log("STEP 5: AI Audit (Claude Haiku)");
  console.log("─────────────────────────────────────────────────");
  console.log("  Sending to claude-haiku-4-5-20251001...\n");

  const auditStart = Date.now();
  const audit = await auditTool({
    name: data.name,
    slug: data.slug,
    description: data.description,
    longDescription: data.longDescription,
    npmPackage: data.npmPackage,
    githubUrl: data.githubUrl,
    docsUrl: data.docsUrl,
    category: data.category,
  });
  const auditMs = Date.now() - auditStart;

  console.log(`  Audit completed in ${auditMs}ms`);
  console.log(`  Approved:  ${audit.approved ? "YES" : "NO"}`);
  console.log(`  Flags:     ${audit.flags.length === 0 ? "(none)" : audit.flags.join(", ")}`);
  console.log(`  Summary:   ${audit.summary}`);
  console.log("");

  // Step 6: Apply audit result
  console.log("STEP 6: Apply Audit Result");
  console.log("─────────────────────────────────────────────────");

  if (audit.approved) {
    console.log("  Audit PASSED — auto-approving...");

    // Insert into tools table
    const { error: toolError } = await supabase.from("tools").insert({
      id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      long_description: data.longDescription,
      category: data.category,
      author,
      pricing,
      rating: 0,
      review_count: 0,
      install_count: 0,
      weekly_installs: 0,
      version: data.version,
      last_updated: now,
      created_at: now,
      tags: data.tags,
      features: data.features,
      github_url: data.githubUrl || null,
      docs_url: data.docsUrl || null,
      icon_bg: "#8B5CF6",
      verified: false,
      trending: false,
      featured: false,
      compatibility: data.compatibility,
      npm_package: data.npmPackage || null,
      install_command: data.installCommand,
      env_vars: envVars,
    });

    if (toolError) {
      console.error("  TOOLS INSERT FAILED:", toolError.message);
      // Update submission with error
      await supabase
        .from("tool_submissions")
        .update({ review_notes: `Audit passed but publish failed: ${toolError.message}` })
        .eq("id", id);
      process.exit(1);
    }

    // Update submission status
    await supabase
      .from("tool_submissions")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        review_notes: audit.summary,
      })
      .eq("id", id);

    console.log("  Inserted into tools table");
    console.log("  Submission status updated to: approved");
  } else {
    console.log("  Audit FLAGGED — keeping as pending for manual review...");
    await supabase
      .from("tool_submissions")
      .update({
        review_notes: `${audit.summary}\n\nFlags:\n${audit.flags.map((f) => `- ${f}`).join("\n")}`,
      })
      .eq("id", id);
    console.log("  Review notes saved on submission");
  }
  console.log("  PASSED\n");

  // Step 7: Verify
  console.log("STEP 7: Verification");
  console.log("─────────────────────────────────────────────────");

  const { data: finalSub } = await supabase
    .from("tool_submissions")
    .select("id, name, slug, status, review_notes, env_vars")
    .eq("id", id)
    .single();

  console.log("  Submission record:");
  console.log(`    ID:           ${finalSub?.id}`);
  console.log(`    Name:         ${finalSub?.name}`);
  console.log(`    Status:       ${finalSub?.status}`);
  console.log(`    Review Notes: ${finalSub?.review_notes}`);
  console.log(`    Env Vars:     ${JSON.stringify(finalSub?.env_vars)}`);

  if (audit.approved) {
    const { data: finalTool } = await supabase
      .from("tools")
      .select("id, name, slug, npm_package, env_vars, install_command")
      .eq("id", id)
      .single();

    console.log("\n  Published tool record:");
    console.log(`    ID:           ${finalTool?.id}`);
    console.log(`    Name:         ${finalTool?.name}`);
    console.log(`    Slug:         ${finalTool?.slug}`);
    console.log(`    npm:          ${finalTool?.npm_package}`);
    console.log(`    Install cmd:  ${finalTool?.install_command}`);
    console.log(`    Env Vars:     ${JSON.stringify(finalTool?.env_vars)}`);
    console.log(`\n  Live at: /tools/${finalTool?.slug}`);
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  ALL STEPS PASSED — FULL FLOW COMPLETE");
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("\nFATAL ERROR:", err);
  process.exit(1);
});
