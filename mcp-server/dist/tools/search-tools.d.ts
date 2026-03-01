import { z } from "zod";
import type { ToolSummary } from "../types.js";
export declare const searchToolsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    pricing: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    category?: string | undefined;
    pricing?: string | undefined;
    sort?: string | undefined;
    query?: string | undefined;
}, {
    category?: string | undefined;
    pricing?: string | undefined;
    sort?: string | undefined;
    limit?: number | undefined;
    query?: string | undefined;
}>;
export declare function searchTools(params: z.infer<typeof searchToolsSchema>): Promise<ToolSummary[]>;
