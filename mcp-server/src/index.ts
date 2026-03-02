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
import { getReviewsSchema, getReviewsHandler } from "./tools/get-reviews.js";
import { submitReviewSchema, submitReviewHandler } from "./tools/submit-review.js";
import { submitToolSchema, submitToolHandler } from "./tools/submit-tool.js";
import {
  formatSearchResults,
  formatToolDetail,
  formatToolConfig,
  formatCategories,
  formatStackList,
  formatStackDetail,
  formatRecommendations,
  formatReviews,
  formatSubmitReviewSuccess,
  formatSubmitToolSuccess,
} from "./lib/formatters.js";
import type { ToolConfigResult } from "./lib/formatters.js";

const server = new McpServer({
  name: "hive-market",
  version: "1.4.0",
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
          text: formatSearchResults(results, { query, category }),
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
        content: [
          {
            type: "text" as const,
            text: `Tool "${slug}" not found.\n\n\u2192 Use \`search-tools\` to find available tools.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text" as const, text: formatToolDetail(tool) }],
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
            text: `Tool "${slug}" not found or has no npm package.\n\n\u2192 Use \`search-tools\` to find available tools.\n\u2192 Use \`get-tool ${slug}\` to check if this tool exists.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        { type: "text" as const, text: formatToolConfig(config as ToolConfigResult) },
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
        { type: "text" as const, text: formatCategories(categories) },
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
        { type: "text" as const, text: formatStackList(stacks) },
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
          {
            type: "text" as const,
            text: `Stack "${slug}" not found.\n\n\u2192 Use \`list-stacks\` to see available stacks.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        { type: "text" as const, text: formatStackDetail(result) },
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
            text: `No matching tools found for "${useCase}".\n\n\u2192 Try a more specific use case description.\n\u2192 Use \`search-tools\` to browse by keyword.\n\u2192 Use \`list-categories\` to explore by category.`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: formatRecommendations(recommendations, useCase),
        },
      ],
    };
  }
);

server.tool(
  "get-reviews",
  "Get reviews for a specific MCP tool. Returns all reviews with ratings, text, and author info.",
  getReviewsSchema.shape,
  async ({ slug }) => {
    const result = await getReviewsHandler({ slug });
    if (!result) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Tool "${slug}" not found or reviews unavailable.\n\n\u2192 Use \`search-tools\` to find available tools.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text" as const, text: formatReviews(result) }],
    };
  }
);

server.tool(
  "submit-review",
  "Submit a review for an MCP tool. Requires HIVE_MARKET_API_KEY environment variable to be set.",
  submitReviewSchema.shape,
  async ({ slug, rating, text, authorName, authorUsername }) => {
    const result = await submitReviewHandler({ slug, rating, text, authorName, authorUsername });
    if (!result.success) {
      return {
        content: [{ type: "text" as const, text: result.error }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: formatSubmitReviewSuccess({ slug, rating, text, authorName }),
        },
      ],
    };
  }
);

server.tool(
  "submit-tool",
  "Publish an MCP tool to Hive Market. The tool goes through automated AI audit and is either auto-approved or flagged for review. Requires HIVE_MARKET_API_KEY environment variable.",
  submitToolSchema.shape,
  async (params) => {
    const result = await submitToolHandler(params);
    if (!result.success) {
      return {
        content: [{ type: "text" as const, text: result.error }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: formatSubmitToolSuccess({
            slug: params.slug,
            name: params.name,
            submission: result.submission,
          }),
        },
      ],
    };
  }
);

async function main() {
  // Detect interactive terminal (not piped by an MCP client)
  if (process.stdin.isTTY) {
    process.stderr.write(`
  Hive Market MCP Server v1.4.0

  This server communicates via the MCP protocol over stdio.
  To use it, add it to your AI client:

    Claude Code:    claude mcp add hive-market -- npx -y hive-market-mcp
    Claude Desktop: Add to ~/Library/Application Support/Claude/claude_desktop_config.json
    Cursor:         Add to ~/.cursor/mcp.json

  Docs: https://hive-mcp.vercel.app/docs/connecting-tools

  Waiting for MCP client connection...
`);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
