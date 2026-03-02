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

export interface Review {
  id: string;
  authorName: string;
  authorUsername: string;
  rating: number;
  text: string;
  createdAt: string;
  helpful: number;
}

export interface ReviewsResponse {
  tool: { id: string; slug: string; name: string };
  reviews: Review[];
  count: number;
}

export async function fetchReviews(slug: string): Promise<ReviewsResponse> {
  return fetchJson(`/api/tools/${slug}/reviews`);
}

export async function postReview(
  slug: string,
  body: { rating: number; text: string; authorName: string; authorUsername: string },
  apiKey: string
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; message: string }> {
  const url = `${getApiUrl()}/api/tools/${slug}/reviews`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: json.error || response.statusText,
    };
  }

  return { ok: true, data: json.data ?? json };
}

export interface ToolSubmissionBody {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  features: string[];
  version: string;
  compatibility: string[];
  authorName: string;
  authorUsername: string;
  npmPackage?: string;
  installCommand?: "npx" | "uvx";
  githubUrl?: string;
  docsUrl?: string;
  pricingModel?: string;
  pricingPrice?: number;
  pricingUnit?: string;
  envVars?: Array<{ name: string; description: string; required: boolean; placeholder?: string }>;
}

export async function postToolSubmission(
  body: ToolSubmissionBody,
  apiKey: string
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; message: string }> {
  const url = `${getApiUrl()}/api/tools/submit`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: json.error || response.statusText,
    };
  }

  return { ok: true, data: json };
}
