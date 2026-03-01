import { z } from "zod";
export declare const getStackSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare function getStackHandler(params: z.infer<typeof getStackSchema>): Promise<{
    stack: import("../types.js").Stack;
    tools: import("../types.js").Tool[];
    config: unknown;
} | null>;
