import type { Tool, Stack } from "../types.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

let cachedTools: Tool[] | null = null;
let cachedStacks: Stack[] | null = null;

function loadTools(): Tool[] {
  if (cachedTools) return cachedTools;
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const toolsPath = resolve(__dirname, "../../data/tools.json");
    const data = readFileSync(toolsPath, "utf-8");
    cachedTools = JSON.parse(data) as Tool[];
    return cachedTools;
  } catch {
    return [];
  }
}

function loadStacks(): Stack[] {
  if (cachedStacks) return cachedStacks;
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const stacksPath = resolve(__dirname, "../../data/stacks.json");
    const data = readFileSync(stacksPath, "utf-8");
    cachedStacks = JSON.parse(data) as Stack[];
    return cachedStacks;
  } catch {
    return [];
  }
}

export function getFallbackTools(): Tool[] {
  return loadTools();
}

export function getFallbackStacks(): Stack[] {
  return loadStacks();
}
