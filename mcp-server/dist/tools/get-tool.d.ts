import { z } from "zod";
import type { Tool } from "../types.js";
export declare const getToolSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare function getToolHandler(params: z.infer<typeof getToolSchema>): Promise<Tool | null>;
