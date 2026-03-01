import type { Tool, Category, Stack } from "../types.js";
export declare function fetchTools(params?: {
    q?: string;
    category?: string;
    pricing?: string;
    sort?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    tools: Tool[];
    total: number;
}>;
export declare function fetchTool(slug: string): Promise<Tool>;
export declare function fetchToolConfig(slug: string, client?: string): Promise<unknown>;
export declare function fetchCategories(): Promise<{
    categories: Category[];
}>;
export declare function fetchStacks(): Promise<{
    stacks: Stack[];
}>;
export declare function fetchStack(slug: string): Promise<{
    stack: Stack;
    tools: Tool[];
    config: unknown;
}>;
