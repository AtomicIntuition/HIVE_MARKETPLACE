export declare function listStacksHandler(): Promise<{
    name: string;
    slug: string;
    description: string;
    toolCount: number;
    popular: boolean;
}[]>;
