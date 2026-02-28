# Hive Market — Project Instructions for Claude Code

## What Is This Project?
Hive Market is the MCP tool marketplace for AI agents — "App Store for agent tools." Developers discover and connect tools, creators publish and monetize MCP servers.

Part of the Hive ecosystem (Hive = deployment, Hive Market = tools). Separate codebase, shared brand and eventually shared auth.

## Tech Stack
- Next.js 15 (App Router, Server Components, Server Actions)
- TypeScript (strict — no `any`)
- Tailwind CSS v4
- shadcn/ui components
- Framer Motion for animations
- Geist Sans + Geist Mono fonts

## Code Standards
- Server Components by default — "use client" only when needed
- All components functional with TypeScript interfaces for props
- Use `cn()` from `@/lib/utils` for conditional classes
- Named exports over default exports
- No barrel exports
- Error boundaries on route segments
- Loading states on async pages

## Design Rules
- Dark mode only
- Tailwind classes exclusively — no inline styles
- Card-based layouts for tool listings
- Search is the #1 UX priority — must be fast and prominent
- Consistent with Hive brand (amber primary, violet accent for marketplace)
- Sections: `py-24`, containers: `max-w-7xl mx-auto px-6`
- Animations: subtle, purposeful

## Data (Phase 1)
- Use static seed data from `src/data/tools.json`
- Type everything with TypeScript interfaces
- Structure data exactly as it would come from the database
- This makes the database migration (Phase 3) trivial

## File Naming
- All lowercase with hyphens: `tool-card.tsx`
- Next.js conventions for pages, layouts, routes

## SEO Priority
- Tool pages are the most important for SEO — each tool must be perfectly optimized
- Dynamic OG images per tool
- Structured data on tool pages (SoftwareApplication schema)
