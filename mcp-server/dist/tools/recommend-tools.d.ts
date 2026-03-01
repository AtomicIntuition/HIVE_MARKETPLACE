import { z } from "zod";
import type { Recommendation } from "../types.js";
export declare const recommendToolsSchema: z.ZodObject<{
    useCase: z.ZodString;
    maxResults: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    useCase: string;
    maxResults: number;
}, {
    useCase: string;
    maxResults?: number | undefined;
}>;
export declare function recommendToolsHandler(params: z.infer<typeof recommendToolsSchema>): Promise<Recommendation[]>;
