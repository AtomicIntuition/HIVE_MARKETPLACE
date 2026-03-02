import type { Tool, ToolSummary, Category, Recommendation, ToolEnvVar } from "../types.js";
import type { Review, ReviewsResponse } from "./api-client.js";

// ---------------------------------------------------------------------------
// Local interfaces for handler return types that aren't exported elsewhere
// ---------------------------------------------------------------------------

export interface ToolConfigResult {
  tool: { name: string; slug: string };
  client: string;
  config: { mcpServers: Record<string, unknown> };
}

export interface StackSummary {
  name: string;
  slug: string;
  description: string;
  toolCount: number;
  popular: boolean;
}

export interface StackDetailResult {
  stack: {
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    toolSlugs: string[];
    popular: boolean;
  };
  tools: Tool[];
  config: unknown;
}

// ---------------------------------------------------------------------------
// Helpers (not exported)
// ---------------------------------------------------------------------------

function formatStars(rating: number): string {
  if (rating === 0) return "No ratings yet";
  const full = Math.round(rating);
  const stars = "★".repeat(full) + "☆".repeat(5 - full);
  return `${stars} ${rating.toFixed(1)}`;
}

function formatInstallCount(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}

function verifiedBadge(verified: boolean): string {
  return verified ? " \u2713" : "";
}

function formatPricing(pricing: { model: string; price?: number; unit?: string }): string {
  if (pricing.model === "free") return "Free";
  if (pricing.price !== undefined && pricing.unit) {
    return `$${pricing.price}/${pricing.unit}`;
  }
  return pricing.model;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Exported Formatters — one per MCP tool
// ---------------------------------------------------------------------------

export function formatSearchResults(
  results: ToolSummary[],
  params: { query?: string; category?: string }
): string {
  if (results.length === 0) {
    const filter = params.query || params.category || "your query";
    return [
      `No tools found matching "${filter}".`,
      "",
      "\u2192 Try `search-tools` with a broader query.",
      "\u2192 Use `list-categories` to see available categories.",
    ].join("\n");
  }

  const header = params.query
    ? `Found ${results.length} tool${results.length === 1 ? "" : "s"} matching "${params.query}":`
    : params.category
      ? `Found ${results.length} tool${results.length === 1 ? "" : "s"} in "${params.category}":`
      : `Found ${results.length} tool${results.length === 1 ? "" : "s"}:`;

  const lines: string[] = [header, ""];

  results.forEach((t, i) => {
    lines.push(
      `${i + 1}. **${t.name}**${verifiedBadge(t.verified)} \u2014 ${formatStars(t.rating)} \u2014 ${formatInstallCount(t.installCount)} installs \u2014 ${t.pricing}`
    );
    lines.push(`   \`${t.slug}\` \u2014 ${t.description}`);
    lines.push("");
  });

  lines.push("\u2192 Use `get-tool <slug>` for full details on any tool.");
  lines.push("\u2192 Use `get-tool-config <slug>` for ready-to-paste install config.");

  return lines.join("\n");
}

export function formatToolDetail(tool: Tool): string {
  const lines: string[] = [];

  lines.push(`# ${tool.name}${verifiedBadge(tool.verified)}`);
  lines.push("");
  lines.push(tool.longDescription || tool.description);
  lines.push("");

  // Meta line
  const ratingStr = tool.rating > 0
    ? `${formatStars(tool.rating)} (${tool.reviewCount} review${tool.reviewCount === 1 ? "" : "s"})`
    : "No ratings yet";
  lines.push(`**Category:** ${tool.category} | **Rating:** ${ratingStr} | **Installs:** ${formatInstallCount(tool.installCount)}`);
  lines.push(`**Version:** ${tool.version} | **Author:** ${tool.author.name}${tool.author.verified ? " (verified)" : ""} | **Pricing:** ${formatPricing(tool.pricing)}`);

  // Features
  if (tool.features.length > 0) {
    lines.push("");
    lines.push("## Features");
    for (const f of tool.features) {
      lines.push(`- ${f}`);
    }
  }

  // Install command
  if (tool.npmPackage) {
    lines.push("");
    lines.push("## Install");
    const cmd = tool.installCommand === "uvx" ? `uvx ${tool.npmPackage}` : `npx -y ${tool.npmPackage}`;
    lines.push(`\`\`\`\n${cmd}\n\`\`\``);
  }

  // Env vars
  if (tool.envVars && tool.envVars.length > 0) {
    lines.push("");
    lines.push("## Environment Variables");
    for (const ev of tool.envVars) {
      const req = ev.required ? "required" : "optional";
      lines.push(`- **${ev.name}** (${req}) \u2014 ${ev.description}`);
    }
  }

  // Links
  const links: string[] = [];
  if (tool.githubUrl) links.push(`- GitHub: ${tool.githubUrl}`);
  if (tool.docsUrl) links.push(`- Docs: ${tool.docsUrl}`);
  if (links.length > 0) {
    lines.push("");
    lines.push("## Links");
    lines.push(...links);
  }

  // Workflow hints
  lines.push("");
  lines.push(`\u2192 Use \`get-tool-config ${tool.slug}\` for ready-to-paste config.`);
  lines.push(`\u2192 Use \`get-reviews ${tool.slug}\` to read reviews.`);

  return lines.join("\n");
}

export function formatToolConfig(result: ToolConfigResult): string {
  const lines: string[] = [];

  lines.push(`## ${result.tool.name} \u2014 Configuration for ${result.client}`);
  lines.push("");

  // Client-specific path hint
  const pathHints: Record<string, string> = {
    "Claude Desktop": "~/Library/Application Support/Claude/claude_desktop_config.json",
    "Cursor": "~/.cursor/mcp.json",
    "Windsurf": "~/.windsurf/mcp.json",
    "Claude Code": "Run: claude mcp add",
  };
  const path = pathHints[result.client];
  if (path) {
    lines.push(`Add this to \`${path}\`:`);
  } else {
    lines.push("Add this to your MCP client configuration:");
  }
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(result.config, null, 2));
  lines.push("```");

  // Extract env vars from the config
  const serverKey = Object.keys(result.config.mcpServers)[0];
  const serverConfig = result.config.mcpServers[serverKey] as Record<string, unknown> | undefined;
  const env = serverConfig?.env as Record<string, string> | undefined;

  if (env && Object.keys(env).length > 0) {
    lines.push("");
    lines.push("### Environment Variables");
    for (const [key, value] of Object.entries(env)) {
      lines.push(`- **${key}** \u2014 Replace \`${value}\` in the config above`);
    }
  }

  lines.push("");
  lines.push(`\u2192 Use \`get-tool ${result.tool.slug}\` for full tool details.`);

  return lines.join("\n");
}

export function formatCategories(categories: Category[]): string {
  const lines: string[] = [];
  const totalTools = categories.reduce((sum, c) => sum + c.toolCount, 0);

  lines.push("## MCP Tool Categories");
  lines.push("");
  lines.push("| Category | Tools | Description |");
  lines.push("|----------|-------|-------------|");

  for (const cat of categories) {
    lines.push(`| ${cat.name} | ${cat.toolCount} | ${cat.description} |`);
  }

  lines.push("");
  lines.push(`${totalTools} tools across ${categories.length} categories.`);
  lines.push("");
  lines.push("\u2192 Use `search-tools` with a category filter to browse.");

  return lines.join("\n");
}

export function formatStackList(stacks: StackSummary[]): string {
  const lines: string[] = [];

  lines.push("## MCP Tool Stacks");
  lines.push("");

  stacks.forEach((s, i) => {
    const popular = s.popular ? " \u2b50" : "";
    lines.push(
      `${i + 1}. **${s.name}**${popular} \u2014 ${s.toolCount} tool${s.toolCount === 1 ? "" : "s"} \u2014 \`${s.slug}\``
    );
    lines.push(`   ${s.description}`);
    lines.push("");
  });

  lines.push("\u2192 Use `get-stack <slug>` for full details and combined config.");

  return lines.join("\n");
}

export function formatStackDetail(result: StackDetailResult): string {
  const lines: string[] = [];
  const { stack, tools } = result;
  const config = result.config as { mcpServers: Record<string, unknown> } | undefined;

  lines.push(`# ${stack.name}${stack.popular ? " \u2b50" : ""}`);
  lines.push("");
  lines.push(stack.longDescription || stack.description);
  lines.push("");

  // Tools table
  lines.push("## Tools");
  lines.push("");
  lines.push("| Tool | Rating | Installs | Pricing |");
  lines.push("|------|--------|----------|---------|");
  for (const t of tools) {
    lines.push(
      `| **${t.name}**${verifiedBadge(t.verified)} \`${t.slug}\` | ${formatStars(t.rating)} | ${formatInstallCount(t.installCount)} | ${formatPricing(t.pricing)} |`
    );
  }

  // Combined config
  if (config?.mcpServers) {
    lines.push("");
    lines.push("## Combined Configuration");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(config, null, 2));
    lines.push("```");
  }

  // Collect all env vars across tools
  const allEnvVars: ToolEnvVar[] = [];
  for (const t of tools) {
    if (t.envVars) {
      for (const ev of t.envVars) {
        if (!allEnvVars.some((e) => e.name === ev.name)) {
          allEnvVars.push(ev);
        }
      }
    }
  }

  if (allEnvVars.length > 0) {
    lines.push("");
    lines.push("### Environment Variables Needed");
    for (const ev of allEnvVars) {
      const req = ev.required ? "required" : "optional";
      lines.push(`- **${ev.name}** (${req}) \u2014 ${ev.description}`);
    }
  }

  lines.push("");
  lines.push("\u2192 Use `get-tool <slug>` for details on any individual tool.");
  lines.push("\u2192 Use `get-tool-config <slug>` for single-tool config.");

  return lines.join("\n");
}

export function formatRecommendations(
  recommendations: Recommendation[],
  useCase: string
): string {
  const lines: string[] = [];

  lines.push("## Recommended Tools");
  lines.push("");
  lines.push(`Based on: "${useCase}"`);
  lines.push("");

  recommendations.forEach((rec, i) => {
    const t = rec.tool;
    lines.push(
      `${i + 1}. **${t.name}**${verifiedBadge(t.verified)} \u2014 ${formatStars(t.rating)} \u2014 ${t.pricing}`
    );
    lines.push(`   \`${t.slug}\` \u2014 Score: ${rec.score.toFixed(1)}`);
    if (rec.reasons.length > 0) {
      lines.push(`   Why: ${rec.reasons.join(", ")}`);
    }
    lines.push("");
  });

  lines.push("\u2192 Use `get-tool <slug>` for full details.");
  lines.push("\u2192 Use `get-tool-config <slug>` for ready-to-paste config.");

  return lines.join("\n");
}

export function formatReviews(result: ReviewsResponse): string {
  const lines: string[] = [];

  lines.push(`## Reviews for ${result.tool.name}`);
  lines.push("");
  lines.push(`${result.count} review${result.count === 1 ? "" : "s"}`);

  if (result.reviews.length === 0) {
    lines.push("");
    lines.push("No reviews yet. Be the first!");
    lines.push("");
    lines.push(`\u2192 Use \`submit-review ${result.tool.slug}\` to add your review.`);
    return lines.join("\n");
  }

  for (const r of result.reviews) {
    lines.push("");
    lines.push("---");
    const authorInfo = r.authorUsername
      ? `**${r.authorName}** (@${r.authorUsername})`
      : `**${r.authorName}**`;
    lines.push(`${formatStars(r.rating)} \u2014 by ${authorInfo} \u2014 ${formatDate(r.createdAt)}`);
    if (r.text) {
      lines.push(r.text);
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`\u2192 Use \`submit-review ${result.tool.slug}\` to add your review.`);

  return lines.join("\n");
}

export function formatSubmitReviewSuccess(params: {
  slug: string;
  rating: number;
  text: string;
  authorName: string;
}): string {
  const lines: string[] = [];

  lines.push("## Review Submitted");
  lines.push("");
  lines.push(`${formatStars(params.rating)} for \`${params.slug}\``);
  lines.push("");
  lines.push(`> ${params.text}`);
  lines.push("");
  lines.push(`\u2014 ${params.authorName}`);
  lines.push("");
  lines.push(`\u2192 Use \`get-reviews ${params.slug}\` to see all reviews.`);

  return lines.join("\n");
}

export function formatSubmitToolSuccess(params: {
  slug: string;
  name: string;
  submission: unknown;
}): string {
  const lines: string[] = [];
  const sub = params.submission as Record<string, unknown> | undefined;
  const status = sub?.status as string | undefined;

  lines.push("## Tool Submitted");
  lines.push("");
  lines.push(`**${params.name}** (\`${params.slug}\`) has been submitted to Hive Market.`);
  lines.push("");

  if (status === "approved") {
    lines.push("Status: **Approved** \u2014 Your tool is now live on Hive Market!");
  } else if (status === "pending_review") {
    lines.push("Status: **Pending Review** \u2014 Your tool is being reviewed and will be listed shortly.");
  } else if (status) {
    lines.push(`Status: **${status}**`);
  }

  lines.push("");
  lines.push(`\u2192 Use \`get-tool ${params.slug}\` to view your tool listing.`);

  return lines.join("\n");
}
