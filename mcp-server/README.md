# Hive Market MCP Server

Give your AI agent access to 50+ MCP tools. Search, discover, get install configs, and explore curated stacks — all from within your agent conversation.

## Quick Setup

### Claude Code

```bash
claude mcp add hive-market -- npx -y hive-market-mcp
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "hive-market": {
      "command": "npx",
      "args": ["-y", "hive-market-mcp"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "hive-market": {
      "command": "npx",
      "args": ["-y", "hive-market-mcp"]
    }
  }
}
```

### Windsurf

Add to your Windsurf MCP settings:

```json
{
  "mcpServers": {
    "hive-market": {
      "command": "npx",
      "args": ["-y", "hive-market-mcp"]
    }
  }
}
```

## What Your Agent Can Do

Once connected, your agent gets 7 tools:

| Tool | Description |
|------|-------------|
| `search-tools` | Search and filter MCP tools by query, category, pricing, sort |
| `get-tool` | Get full details on any tool (features, pricing, env vars, compatibility) |
| `get-tool-config` | Get ready-to-paste MCP config for Claude Desktop, Cursor, Windsurf, or Claude Code |
| `list-categories` | Browse all 8 tool categories with descriptions and counts |
| `list-stacks` | See curated tool combinations for common use cases |
| `get-stack` | Get full stack details with all tools and combined config |
| `recommend-tools` | Describe your use case, get personalized tool recommendations |

## Example Usage

Just ask your agent:

- *"Search for database tools on Hive Market"*
- *"What MCP tools are available for Stripe payments?"*
- *"Recommend tools for building a Slack bot with AI"*
- *"Get the install config for the GitHub MCP server"*
- *"Show me the full-stack developer stack"*

## Categories

- Payments & Commerce
- Communication
- Data & Databases
- Developer Tools
- Productivity
- AI & ML
- Content & Media
- Analytics

## How It Works

The server connects to the Hive Market API for live data. If the API is unavailable, it falls back to bundled data (50+ tools, 8 stacks) so your agent always has access.

## License

MIT
