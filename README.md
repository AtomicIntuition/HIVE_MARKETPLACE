<p align="center">
  <img src="https://img.shields.io/badge/status-beta-violet" alt="Status: Beta" />
  <img src="https://img.shields.io/badge/platform-web-blue" alt="Platform: Web" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License: MIT" />
  <img src="https://img.shields.io/badge/tools-47+-amber" alt="Tools: 47+" />
  <img src="https://img.shields.io/badge/MCP_server-v1.4.0-8B5CF6" alt="MCP Server: v1.4.0" />
</p>

# Hive Market

**The MCP Tool Marketplace for AI Agents**

Hive Market is the discovery and distribution platform for MCP (Model Context Protocol) tools. Developers find and connect tools, creators publish and monetize MCP servers. Think "App Store for agent tools."

**Live at [hive-mcp.vercel.app](https://hive-mcp.vercel.app)**

> Agents discover tools via the REST API or the built-in MCP server. Humans browse the web UI. Both get the same catalog of 47+ MCP servers with one-click config generation for Claude Desktop, Cursor, Windsurf, and Claude Code.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js 15 (App Router)            │
│   Server Components  ·  Server Actions  ·  API  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐ │
│  │  Web UI   │  │ REST API  │  │ MCP Server  │ │
│  │  browse,  │  │ /api/*    │  │ hive-market  │ │
│  │  search,  │  │ CORS,     │  │ -mcp         │ │
│  │  publish  │  │ API keys  │  │ 10 tools     │ │
│  └───────────┘  └───────────┘  └─────────────┘ │
│                                                 │
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐ │
│  │  Drizzle  │  │ Supabase  │  │  AI Audit   │ │
│  │  ORM      │  │ Auth      │  │  Claude     │ │
│  │  Postgres │  │ Sessions  │  │  Haiku      │ │
│  └───────────┘  └───────────┘  └─────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Features

### Tool Directory
- 47+ MCP tools across 8 categories (payments, communication, data, devtools, productivity, AI/ML, content, analytics)
- Search with full-text matching, category filtering, sort by popular/rating/newest
- Tool detail pages with reviews, feature lists, compatibility matrix, and install instructions

### Config Generation
- One-click MCP config for Claude Desktop, Cursor, Windsurf, and Claude Code
- Environment variable documentation with placeholders
- Copy-paste ready JSON config blocks

### Stack Builder
- Curated combinations of tools for common use cases (e.g., "Full-Stack Web," "Vibe Coder Starter")
- Combined config generation for entire stacks
- Tool dependency awareness

### Tool Submission + AI Audit
- Creators submit MCP servers through the web UI or API
- Claude Haiku runs an automated audit (naming, description quality, security flags)
- Auto-approve or flag for manual review
- Approved tools get an AI-generated review

### Public REST API
- Full programmatic access to the catalog, designed for agent consumption
- CORS-enabled for cross-origin access
- API key authentication for write operations (reviews, submissions)
- Rate limiting with sliding window (10 reviews/hour per key)

### MCP Server (hive-market-mcp)
- Standalone MCP server package with 10 tools
- Agents can search, discover, configure, review, and publish tools
- API-first with offline fallback to bundled data
- Published as `hive-market-mcp` on npm

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions, API routes |
| Language | TypeScript 5 (strict) | Type safety across the entire stack |
| UI | React 19 | Latest concurrent features |
| Styling | Tailwind CSS v4 + shadcn/ui | Consistent design system, dark mode only |
| Animation | Framer Motion | Smooth, purposeful transitions |
| Database | Drizzle ORM + PostgreSQL | Type-safe queries, zero runtime overhead |
| Hosting | Supabase | PostgreSQL, Auth, real-time |
| Auth | Supabase Auth (@supabase/ssr) | Cookie-based sessions, OAuth providers |
| Validation | Zod | Runtime type checking for API inputs |
| Fonts | Geist Sans + Geist Mono | Clean, modern typography |
| Deployment | Vercel | Edge functions, preview deployments |
| MCP | @modelcontextprotocol/sdk | Official MCP SDK for the server package |
| Build | pnpm workspaces | Monorepo with mcp-server package |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Supabase project (for database and auth)

### Environment Variables

Create a `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# AI Audit (optional — needed for tool submission audit)
ANTHROPIC_API_KEY=your-anthropic-key
```

### Install & Run

```bash
# Clone
git clone https://github.com/AtomicIntuition/hive-market.git
cd hive-market

# Install dependencies
pnpm install

# Push schema to database
pnpm db:push

# Seed the database with 47 tools
pnpm db:seed

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
pnpm build
pnpm start
```

---

## API Reference

All endpoints are served from `https://hive-mcp.vercel.app/api` (or `localhost:3000/api` in development).

### Public Endpoints (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tools` | List all tools. Query params: `q`, `category`, `sort`, `limit` |
| `GET` | `/api/tools/[slug]` | Get full tool details by slug |
| `GET` | `/api/tools/[slug]/config` | Get MCP config JSON for a tool. Query param: `client` |
| `GET` | `/api/tools/[slug]/reviews` | Get reviews for a tool |
| `GET` | `/api/categories` | List all categories with tool counts |
| `GET` | `/api/stacks` | List all curated stacks |
| `GET` | `/api/stacks/[slug]` | Get stack details with combined config |

### Authenticated Endpoints (API key or session required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tools/[slug]/reviews` | Submit a review (API key via `Authorization: Bearer hm_sk_...`) |
| `POST` | `/api/tools/submit` | Submit a new tool for review |
| `GET` | `/api/keys` | List your API keys (session auth) |
| `POST` | `/api/keys` | Create a new API key (session auth) |
| `DELETE` | `/api/keys/[id]` | Revoke an API key (session auth) |

### Example: Search Tools

```bash
curl "https://hive-mcp.vercel.app/api/tools?q=stripe&category=payments&sort=popular&limit=10"
```

### Example: Get Tool Config

```bash
curl "https://hive-mcp.vercel.app/api/tools/stripe-mcp/config?client=Claude%20Desktop"
```

---

## MCP Server

The `hive-market-mcp` package is a standalone MCP server that gives AI agents direct access to the Hive Market catalog.

### 10 Tools

| Tool | Description |
|---|---|
| `search-tools` | Search and filter tools by query, category, pricing, sort |
| `get-tool` | Get full details for a specific tool |
| `get-tool-config` | Get MCP config JSON for any supported client |
| `list-categories` | List all tool categories |
| `list-stacks` | List curated tool stacks |
| `get-stack` | Get stack details with all included tools |
| `recommend-tools` | Get personalized recommendations based on use case |
| `get-reviews` | Read reviews for a tool |
| `submit-review` | Write a review (requires `HIVE_MARKET_API_KEY`) |
| `submit-tool` | Publish a new tool (requires `HIVE_MARKET_API_KEY`) |

### Installation

Add to your MCP client config:

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

For write operations (reviews, submissions), set the `HIVE_MARKET_API_KEY` environment variable:

```json
{
  "mcpServers": {
    "hive-market": {
      "command": "npx",
      "args": ["-y", "hive-market-mcp"],
      "env": {
        "HIVE_MARKET_API_KEY": "hm_sk_your_key_here"
      }
    }
  }
}
```

---

## Project Structure

```
hive-market/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # REST API routes
│   │   │   ├── tools/          # /api/tools, /api/tools/[slug], config, reviews, submit
│   │   │   ├── categories/     # /api/categories
│   │   │   ├── stacks/         # /api/stacks, /api/stacks/[slug]
│   │   │   ├── keys/           # /api/keys (API key management)
│   │   │   └── analytics/      # /api/analytics/event
│   │   ├── tools/              # Tool directory + detail pages
│   │   ├── categories/         # Category browse pages
│   │   ├── stacks/             # Stack browse + detail pages
│   │   ├── dashboard/          # User dashboard (connected tools, API keys)
│   │   ├── publish/            # Tool submission flow
│   │   └── auth/               # Auth callback handler
│   ├── components/             # React components
│   │   ├── landing/            # Homepage sections
│   │   ├── tools/              # Tool cards, detail, search, connect dialog
│   │   ├── stacks/             # Stack cards, detail
│   │   ├── dashboard/          # Dashboard sections, API key management
│   │   ├── shared/             # Header, footer, search bar
│   │   └── ui/                 # shadcn/ui primitives
│   ├── db/                     # Drizzle schema, seed script, connection
│   ├── lib/                    # Utilities, data layer, types, config
│   │   ├── data.ts             # Data access (DB with JSON fallback)
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── mcp-config.ts       # MCP config generation
│   │   ├── stacks.ts           # Stack definitions
│   │   ├── api-keys.ts         # API key hashing + validation
│   │   ├── rate-limiter.ts     # Sliding window rate limiter
│   │   ├── audit-tool.ts       # AI audit for submissions
│   │   └── trending.ts         # Trending score calculation
│   └── data/
│       └── tools.json          # Seed data (47 MCP servers)
│
├── mcp-server/                 # Standalone MCP server package
│   └── src/
│       ├── tools/              # 10 MCP tool implementations
│       └── lib/                # Formatters, API client
│
├── scripts/
│   ├── discover-tools.ts       # Auto-discovery (GitHub + npm search)
│   └── review-existing-tools.ts
│
└── drizzle.config.ts           # Drizzle Kit configuration
```

---

## Database Schema

8 tables managed by Drizzle ORM:

| Table | Purpose |
|---|---|
| `tools` | MCP tool catalog (name, description, pricing, ratings, env vars, config) |
| `categories` | 8 tool categories with metadata |
| `reviews` | User reviews with ratings (one review per user per tool) |
| `profiles` | User profiles (synced from Supabase Auth) |
| `tool_submissions` | Pending/approved/rejected tool submissions |
| `user_connections` | Tools a user has connected/installed |
| `api_keys` | API keys for programmatic access (SHA-256 hashed) |
| `tool_analytics` | Install, config copy, API view, and MCP request events |

---

## Scripts

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint

pnpm db:push          # Push Drizzle schema to database
pnpm db:seed          # Seed database with tools.json
pnpm db:generate      # Generate Drizzle migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)

pnpm mcp:build        # Build the MCP server package
pnpm mcp:dev          # Run MCP server in dev mode

pnpm discover-tools   # Auto-discover new MCP tools from GitHub + npm
```

---

## Hive Ecosystem

| Project | Description | Link |
|---|---|---|
| **Hive Market** | MCP tool marketplace -- discover, connect, publish (this repo) | [hive-mcp.vercel.app](https://hive-mcp.vercel.app) |
| **Hive Desktop** | Local AI workflow runtime -- wire MCP tools into persistent workflows | [github.com/AtomicIntuition/hive-desktop](https://github.com/AtomicIntuition/hive-desktop) |

Hive Market provides the tool catalog. Hive Desktop consumes it -- browse tools from the marketplace, install them locally, and build AI-powered automations that run on your machine.

---

## Contributing

Contributions welcome. Please open an issue first to discuss what you'd like to change.

```bash
pnpm install
pnpm dev

# Before submitting
pnpm lint
pnpm build
```

---

## License

MIT
