import { Tool, ToolEnvVar } from "./types";

export type McpClient = "Claude Desktop" | "Cursor" | "Windsurf" | "Claude Code" | "Codex";

export const MCP_CLIENTS: McpClient[] = ["Claude Desktop", "Cursor", "Windsurf", "Claude Code", "Codex"];

interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export function generateToolServerConfig(tool: Tool): ServerConfig | null {
  if (!tool.npmPackage) return null;

  const isUvx = tool.installCommand === "uvx";
  const config: ServerConfig = isUvx
    ? { command: "uvx", args: [tool.npmPackage] }
    : { command: "npx", args: ["-y", tool.npmPackage] };

  if (tool.envVars && tool.envVars.length > 0) {
    config.env = {};
    for (const envVar of tool.envVars) {
      config.env[envVar.name] = envVar.placeholder || `<YOUR_${envVar.name}>`;
    }
  }

  return config;
}

export function generateToolConfig(tool: Tool, client: McpClient): string {
  const serverConfig = generateToolServerConfig(tool);
  if (!serverConfig) return "{}";

  if (client === "Claude Code") {
    return JSON.stringify(
      { mcpServers: { [tool.slug]: serverConfig } },
      null,
      2
    );
  }

  return JSON.stringify(
    { mcpServers: { [tool.slug]: serverConfig } },
    null,
    2
  );
}

export function generateMultiToolConfig(tools: Tool[], client: McpClient): string {
  const servers: Record<string, ServerConfig> = {};

  for (const tool of tools) {
    const config = generateToolServerConfig(tool);
    if (config) {
      servers[tool.slug] = config;
    }
  }

  return JSON.stringify({ mcpServers: servers }, null, 2);
}

export function getClientInstructions(client: McpClient): string {
  switch (client) {
    case "Claude Desktop":
      return "Add to your claude_desktop_config.json:";
    case "Cursor":
      return "Add to .cursor/mcp.json in your project:";
    case "Windsurf":
      return "Add to your Windsurf MCP settings:";
    case "Claude Code":
      return "Save as .mcp.json in your project root:";
    case "Codex":
      return "Add to your codex mcp config:";
  }
}

export function getEnvVarsForTools(tools: Tool[]): ToolEnvVar[] {
  const seen = new Set<string>();
  const result: ToolEnvVar[] = [];
  for (const tool of tools) {
    if (!tool.envVars) continue;
    for (const ev of tool.envVars) {
      if (!seen.has(ev.name)) {
        seen.add(ev.name);
        result.push(ev);
      }
    }
  }
  return result;
}
