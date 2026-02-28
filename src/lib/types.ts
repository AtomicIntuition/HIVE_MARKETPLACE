export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: CategorySlug;
  author: ToolAuthor;
  pricing: ToolPricing;
  rating: number;
  reviewCount: number;
  installCount: number;
  weeklyInstalls: number;
  version: string;
  lastUpdated: string;
  createdAt: string;
  tags: string[];
  features: string[];
  githubUrl?: string;
  docsUrl?: string;
  iconBg: string;
  verified: boolean;
  trending: boolean;
  featured: boolean;
  compatibility: string[];
  npmPackage?: string;
}

export interface ToolAuthor {
  name: string;
  username: string;
  avatar?: string;
  verified: boolean;
}

export interface ToolPricing {
  model: "free" | "per-call" | "monthly" | "tiered";
  price?: number;
  unit?: string;
  freeTier?: string;
}

export type CategorySlug =
  | "payments"
  | "communication"
  | "data"
  | "devtools"
  | "productivity"
  | "ai-ml"
  | "content"
  | "analytics";

export interface Category {
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
  color: string;
  toolCount: number;
}

export interface Review {
  id: string;
  toolId: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  rating: number;
  text: string;
  date: string;
  helpful: number;
}
