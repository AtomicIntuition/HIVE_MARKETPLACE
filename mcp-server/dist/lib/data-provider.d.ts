import type { Tool, Category, Stack } from "../types.js";
export declare function getTools(params?: {
    q?: string;
    category?: string;
    pricing?: string;
    sort?: string;
    limit?: number;
}): Promise<Tool[]>;
export declare function getTool(slug: string): Promise<Tool | null>;
export declare function getToolConfig(slug: string, client?: string): Promise<unknown>;
export declare function getCategories(): Promise<Category[]>;
export declare function getStacks(): Promise<Stack[]>;
export declare function getStack(slug: string): Promise<{
    stack: Stack;
    tools: Tool[];
    config: unknown;
} | null>;
