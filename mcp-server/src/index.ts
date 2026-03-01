#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchToolsSchema, searchTools } from "./tools/search-tools.js";
import { getToolSchema, getToolHandler } from "./tools/get-tool.js";
import { getToolConfigSchema, getToolConfigHandler } from "./tools/get-tool-config.js";
import { listCategoriesHandler } from "./tools/list-categories.js";
import { listStacksHandler } from "./tools/list-stacks.js";
import { getStackSchema, getStackHandler } from "./tools/get-stack.js";
import { recommendToolsSchema, recommendToolsHandler } from "./tools/recommend-tools.js";

const server = new McpServer({
  name: "hive-market",
  version: "0.1.0",
});

server.tool(
  "search-tools",
  "Search and browse MCP tools on Hive Market. Filter by query, category, pricing, and sort order.",
  searchToolsSchema.shape,
  async ({ query, category, pricing, sort, limit }) => {
    const results = await searchTools({ query, category, pricing, sort, limit });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get-tool",
  "Get full details about a specific MCP tool including description, features, pricing, and install info.",
  getToolSchema.shape,
  async ({ slug }) => {
    const tool = await getToolHandler({ slug });
    if (!tool) {
      return {
        content: [{ type: "text" as const, text: `Tool "${slug}" not found.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text" as const, text: JSON.stringify(tool, null, 2) }],
    };
  }
);

server.tool(
  "get-tool-config",
  "Get the MCP configuration JSON for a tool, ready to paste into your client config file.",
  getToolConfigSchema.shape,
  async ({ slug, client }) => {
    const config = await getToolConfigHandler({ slug, client });
    if (!config) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Tool "${slug}" not found or has no npm package.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(config, null, 2) },
      ],
    };
  }
);

server.tool(
  "list-categories",
  "List all tool categories with descriptions and tool counts.",
  {},
  async () => {
    const categories = await listCategoriesHandler();
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(categories, null, 2) },
      ],
    };
  }
);

server.tool(
  "list-stacks",
  "List all curated tool stacks (pre-built combinations of MCP tools for common use cases).",
  {},
  async () => {
    const stacks = await listStacksHandler();
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(stacks, null, 2) },
      ],
    };
  }
);

server.tool(
  "get-stack",
  "Get full details about a stack including all tools and combined MCP config.",
  getStackSchema.shape,
  async ({ slug }) => {
    const result = await getStackHandler({ slug });
    if (!result) {
      return {
        content: [
          { type: "text" as const, text: `Stack "${slug}" not found.` },
        ],
        isError: true,
      };
    }
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result, null, 2) },
      ],
    };
  }
);

server.tool(
  "recommend-tools",
  "Get personalized tool recommendations based on a use case description.",
  recommendToolsSchema.shape,
  async ({ useCase, maxResults }) => {
    const recommendations = await recommendToolsHandler({ useCase, maxResults });
    if (recommendations.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "No matching tools found. Try a more specific use case description.",
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(recommendations, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
