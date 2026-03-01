import { z } from "zod";
export declare const getToolConfigSchema: z.ZodObject<{
    slug: z.ZodString;
    client: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    client?: string | undefined;
}, {
    slug: string;
    client?: string | undefined;
}>;
export declare function getToolConfigHandler(params: z.infer<typeof getToolConfigSchema>): Promise<unknown>;
