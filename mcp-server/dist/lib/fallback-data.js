import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
let cachedTools = null;
let cachedStacks = null;
function loadTools() {
    if (cachedTools)
        return cachedTools;
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const toolsPath = resolve(__dirname, "../../data/tools.json");
        const data = readFileSync(toolsPath, "utf-8");
        cachedTools = JSON.parse(data);
        return cachedTools;
    }
    catch {
        return [];
    }
}
function loadStacks() {
    if (cachedStacks)
        return cachedStacks;
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const stacksPath = resolve(__dirname, "../../data/stacks.json");
        const data = readFileSync(stacksPath, "utf-8");
        cachedStacks = JSON.parse(data);
        return cachedStacks;
    }
    catch {
        return [];
    }
}
export function getFallbackTools() {
    return loadTools();
}
export function getFallbackStacks() {
    return loadStacks();
}
