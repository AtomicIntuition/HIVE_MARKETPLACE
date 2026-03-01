export interface ToolEnvVar {
    name: string;
    description: string;
    required: boolean;
    placeholder?: string;
}
export interface Tool {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    category: string;
    author: {
        name: string;
        username: string;
        verified: boolean;
    };
    pricing: {
        model: string;
        price?: number;
        unit?: string;
        freeTier?: string;
    };
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
    installCommand?: "npx" | "uvx";
    envVars?: ToolEnvVar[];
}
export interface ToolSummary {
    name: string;
    slug: string;
    description: string;
    rating: number;
    installCount: number;
    pricing: string;
    verified: boolean;
    category: string;
}
export interface Category {
    name: string;
    slug: string;
    description: string;
    toolCount: number;
}
export interface Stack {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    icon: string;
    color: string;
    toolSlugs: string[];
    popular: boolean;
}
export interface Recommendation {
    tool: ToolSummary;
    score: number;
    reasons: string[];
}
