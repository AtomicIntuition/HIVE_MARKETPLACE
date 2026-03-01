#!/usr/bin/env tsx

/**
 * Hive Market Auto-Discovery Script
 *
 * Searches GitHub and npm for MCP servers and outputs discovered tools.
 *
 * Usage:
 *   pnpm discover-tools [--dry-run] [--json] [--limit=N]
 */

import { classifyCategory } from "./lib/classify-category.js";

interface GithubRepo {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  topics: string[];
  owner: { login: string };
  updated_at: string;
  created_at: string;
}

interface DiscoveredTool {
  name: string;
  slug: string;
  description: string;
  githubUrl: string;
  category: string;
  author: string;
  stars: number;
  topics: string[];
  updatedAt: string;
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const jsonOutput = args.includes("--json");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 50;

async function searchGithub(query: string): Promise<GithubRepo[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${Math.min(limit, 100)}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "hive-market-discovery",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = (await response.json()) as { items: GithubRepo[] };
    return data.items || [];
  } catch (error) {
    console.error("GitHub search failed:", error);
    return [];
  }
}

async function searchNpm(keyword: string): Promise<Array<{ name: string; description: string; version: string }>> {
  const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(keyword)}&size=${Math.min(limit, 100)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = (await response.json()) as {
      objects: Array<{
        package: { name: string; description: string; version: string };
      }>;
    };
    return data.objects.map((o) => o.package);
  } catch {
    return [];
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function loadExistingSlugs(): Promise<Set<string>> {
  try {
    const { readFileSync } = await import("node:fs");
    const { resolve, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const data = readFileSync(resolve(__dirname, "../src/data/tools.json"), "utf-8");
    const tools = JSON.parse(data) as Array<{ slug: string }>;
    return new Set(tools.map((t) => t.slug));
  } catch {
    return new Set();
  }
}

async function main() {
  console.log("🔍 Discovering MCP servers...\n");

  const existingSlugs = await loadExistingSlugs();
  console.log(`📦 ${existingSlugs.size} tools already in database\n`);

  // Search GitHub with multiple queries
  const queries = [
    "topic:mcp-server",
    "topic:model-context-protocol",
    '"mcp server" in:description language:TypeScript',
    '"mcp server" in:description language:Python',
  ];

  const allRepos: GithubRepo[] = [];
  const seenRepos = new Set<string>();

  for (const query of queries) {
    console.log(`  Searching GitHub: "${query}"...`);
    const repos = await searchGithub(query);
    for (const repo of repos) {
      if (!seenRepos.has(repo.full_name)) {
        seenRepos.add(repo.full_name);
        allRepos.push(repo);
      }
    }
    // Rate limit courtesy
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n  Found ${allRepos.length} unique GitHub repos`);

  // Search npm
  console.log(`  Searching npm for "mcp-server"...`);
  const npmPackages = await searchNpm("mcp-server");
  console.log(`  Found ${npmPackages.length} npm packages\n`);

  // Process GitHub repos into discovered tools
  const discovered: DiscoveredTool[] = [];

  for (const repo of allRepos) {
    const slug = slugify(repo.name.endsWith("-mcp") ? repo.name : `${repo.name}-mcp`);

    // Skip if already exists
    if (existingSlugs.has(slug)) continue;

    // Skip if no description
    if (!repo.description) continue;

    const category = classifyCategory(
      repo.name,
      repo.description,
      repo.topics
    );

    discovered.push({
      name: repo.name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/Mcp/g, "MCP"),
      slug,
      description: repo.description,
      githubUrl: repo.html_url,
      category,
      author: repo.owner.login,
      stars: repo.stargazers_count,
      topics: repo.topics,
      updatedAt: repo.updated_at,
    });
  }

  // Deduplicate by slug
  const uniqueBySlug = new Map<string, DiscoveredTool>();
  for (const tool of discovered) {
    if (!uniqueBySlug.has(tool.slug)) {
      uniqueBySlug.set(tool.slug, tool);
    }
  }

  const results = [...uniqueBySlug.values()]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);

  // Output
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`📋 Discovered ${results.length} new MCP tools:\n`);
    for (const tool of results) {
      console.log(`  ⭐ ${tool.stars.toString().padStart(5)} | ${tool.name}`);
      console.log(`         ${tool.description}`);
      console.log(`         Category: ${tool.category} | Author: ${tool.author}`);
      console.log(`         ${tool.githubUrl}`);
      console.log("");
    }
  }

  if (dryRun) {
    console.log("🔒 Dry run — no database writes");
    return;
  }

  // Insert into tool_submissions if DB is available
  if (process.env.DATABASE_URL && results.length > 0) {
    try {
      const dotenv = await import("dotenv");
      dotenv.config();

      console.log(`\n📝 Inserting ${results.length} tool submissions...`);

      // Dynamic import to avoid requiring DB at script load
      const { db } = await import("../src/db/index.js");
      const { toolSubmissions } = await import("../src/db/schema.js");

      for (const tool of results) {
        const id = `disc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await db.insert(toolSubmissions).values({
          id,
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          longDescription: `Discovered from GitHub: ${tool.githubUrl}`,
          category: tool.category as "devtools",
          author: { name: tool.author, username: tool.author, verified: false },
          pricing: { model: "free" as const },
          tags: tool.topics.slice(0, 10),
          features: [],
          githubUrl: tool.githubUrl,
          submittedBy: "system",
          status: "pending",
        });
      }

      console.log(`✅ Inserted ${results.length} submissions as pending`);
    } catch (error) {
      console.error("Failed to insert into database:", error);
    }
  }
}

main().catch(console.error);
