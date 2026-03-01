import type { Tool, Category, Stack } from "../types.js";
import * as api from "./api-client.js";
import { getFallbackTools, getFallbackStacks } from "./fallback-data.js";

const CATEGORIES = [
  { name: "Payments & Commerce", slug: "payments", description: "Process payments, manage invoices, and handle subscriptions" },
  { name: "Communication", slug: "communication", description: "Send messages, manage channels, and automate outreach" },
  { name: "Data & Databases", slug: "data", description: "Query databases, manage data, and build backends" },
  { name: "Developer Tools", slug: "devtools", description: "Manage repos, track issues, deploy, and monitor" },
  { name: "Productivity", slug: "productivity", description: "Calendars, documents, spreadsheets, and project management" },
  { name: "AI & ML", slug: "ai-ml", description: "Access models, run inference, and build AI pipelines" },
  { name: "Content & Media", slug: "content", description: "Images, videos, file management, and media processing" },
  { name: "Analytics", slug: "analytics", description: "Track events, analyze traffic, and measure engagement" },
];

async function tryApi<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function getTools(params?: {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: string;
  limit?: number;
}): Promise<Tool[]> {
  const result = await tryApi(() => api.fetchTools(params));
  if (result) return result.tools;

  let tools = getFallbackTools();
  if (params?.q) {
    const q = params.q.toLowerCase();
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  if (params?.category) {
    tools = tools.filter((t) => t.category === params.category);
  }
  if (params?.pricing) {
    tools = tools.filter((t) => t.pricing.model === params.pricing);
  }
  tools.sort((a, b) => b.installCount - a.installCount);
  if (params?.limit) {
    tools = tools.slice(0, params.limit);
  }
  return tools;
}

export async function getTool(slug: string): Promise<Tool | null> {
  const result = await tryApi(() => api.fetchTool(slug));
  if (result) return result;

  const tools = getFallbackTools();
  return tools.find((t) => t.slug === slug) || null;
}

export async function getToolConfig(
  slug: string,
  client?: string
): Promise<unknown> {
  const result = await tryApi(() => api.fetchToolConfig(slug, client));
  if (result) return result;

  const tool = getFallbackTools().find((t) => t.slug === slug);
  if (!tool || !tool.npmPackage) return null;

  const isUvx = tool.installCommand === "uvx";
  const serverConfig: Record<string, unknown> = isUvx
    ? { command: "uvx", args: [tool.npmPackage] }
    : { command: "npx", args: ["-y", tool.npmPackage] };

  if (tool.envVars && tool.envVars.length > 0) {
    const env: Record<string, string> = {};
    for (const ev of tool.envVars) {
      env[ev.name] = ev.placeholder || `<YOUR_${ev.name}>`;
    }
    serverConfig.env = env;
  }

  return {
    tool: { name: tool.name, slug: tool.slug },
    client: client || "Claude Desktop",
    config: { mcpServers: { [tool.slug]: serverConfig } },
  };
}

export async function getCategories(): Promise<Category[]> {
  const result = await tryApi(() => api.fetchCategories());
  if (result) return result.categories;

  const tools = getFallbackTools();
  return CATEGORIES.map((cat) => ({
    ...cat,
    toolCount: tools.filter((t) => t.category === cat.slug).length,
  }));
}

export async function getStacks(): Promise<Stack[]> {
  const result = await tryApi(() => api.fetchStacks());
  if (result) return result.stacks;
  return getFallbackStacks();
}

export async function getStack(
  slug: string
): Promise<{ stack: Stack; tools: Tool[]; config: unknown } | null> {
  const result = await tryApi(() => api.fetchStack(slug));
  if (result) return result;

  const stacks = getFallbackStacks();
  const stack = stacks.find((s) => s.slug === slug);
  if (!stack) return null;

  const allTools = getFallbackTools();
  const tools = stack.toolSlugs
    .map((s) => allTools.find((t) => t.slug === s))
    .filter((t): t is Tool => !!t);

  const servers: Record<string, unknown> = {};
  for (const tool of tools) {
    if (!tool.npmPackage) continue;
    const isUvx = tool.installCommand === "uvx";
    const config: Record<string, unknown> = isUvx
      ? { command: "uvx", args: [tool.npmPackage] }
      : { command: "npx", args: ["-y", tool.npmPackage] };
    if (tool.envVars && tool.envVars.length > 0) {
      const env: Record<string, string> = {};
      for (const ev of tool.envVars) {
        env[ev.name] = ev.placeholder || `<YOUR_${ev.name}>`;
      }
      config.env = env;
    }
    servers[tool.slug] = config;
  }

  return { stack, tools, config: { mcpServers: servers } };
}
