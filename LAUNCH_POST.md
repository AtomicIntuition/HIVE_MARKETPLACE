# X Launch Thread

## Tweet 1
I built a marketplace for MCP tools.

MCP is how AI agents connect to external services. The problem is finding and setting up MCP servers sucks — scattered across GitHub, no standard way to discover them, manual config for every client.

Hive Market fixes that.

hive-mcp.vercel.app 🧵

## Tweet 2
50+ MCP servers listed right now. Stripe, GitHub, Supabase, Slack, Notion, PostgreSQL, Sentry, Vercel, and more.

You search for what you need, select your client (Claude Desktop, Cursor, Windsurf, Claude Code, Codex, OpenClaw), and it gives you the exact JSON config to paste. Done.

## Tweet 3
There are also curated stacks — pre-built tool bundles for specific workflows.

Full-stack web dev: Supabase + Vercel + GitHub + Playwright + Sentry + Stripe

SaaS ops: Stripe + Linear + Slack + Sentry + PostHog + SMTP

8 stacks total. Or build your own on the site.

## Tweet 4
The marketplace itself is an MCP server.

npx -y hive-market-mcp

That gives your agent 10 tools — search the marketplace, get tool details, get install configs, browse categories, browse stacks, get recommendations, read reviews, submit reviews, and publish new tools. All from inside your AI client.

## Tweet 5
There's also a public REST API. No auth needed for reads.

GET /api/tools — search and filter
GET /api/tools/{slug} — tool details
GET /api/tools/{slug}/config?client=Cursor — ready to paste config
GET /api/categories
GET /api/stacks

Base URL: hive-mcp.vercel.app/api

## Tweet 6
If you've built an MCP server you can publish it for free. There's a submit form on the site, it runs through an automated review, and gets listed.

Or publish directly from your agent using the MCP server — no browser needed.

hive-mcp.vercel.app
