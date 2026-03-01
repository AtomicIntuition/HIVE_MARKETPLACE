import type { Tool, Category, Stack } from "../types.js";

const DEFAULT_API_URL = "https://market.hive.sh";

function getApiUrl(): string {
  return process.env.HIVE_MARKET_API_URL || DEFAULT_API_URL;
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${getApiUrl()}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchTools(params?: {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<{ tools: Tool[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.category) search.set("category", params.category);
  if (params?.pricing) search.set("pricing", params.pricing);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  const qs = search.toString();
  return fetchJson(`/api/tools${qs ? `?${qs}` : ""}`);
}

export async function fetchTool(slug: string): Promise<Tool> {
  return fetchJson(`/api/tools/${slug}`);
}

export async function fetchToolConfig(slug: string, client?: string): Promise<unknown> {
  const qs = client ? `?client=${encodeURIComponent(client)}` : "";
  return fetchJson(`/api/tools/${slug}/config${qs}`);
}

export async function fetchCategories(): Promise<{ categories: Category[] }> {
  return fetchJson("/api/categories");
}

export async function fetchStacks(): Promise<{ stacks: Stack[] }> {
  return fetchJson("/api/stacks");
}

export async function fetchStack(slug: string): Promise<{ stack: Stack; tools: Tool[]; config: unknown }> {
  return fetchJson(`/api/stacks/${slug}`);
}
