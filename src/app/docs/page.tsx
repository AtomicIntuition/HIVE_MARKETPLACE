import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Cable, Upload, BookOpen } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { DocsHeader } from "@/components/docs/docs-header";
import { Callout } from "@/components/docs/callout";

export const metadata: Metadata = createMetadata({
  title: "Documentation",
  description:
    "Hive Market documentation — learn how to discover, connect, and publish MCP tools for AI agents.",
  path: "/docs",
});

const QUICK_LINKS = [
  {
    icon: Cable,
    title: "Connecting Tools",
    description: "Set up MCP tools in Claude Desktop, Cursor, or Windsurf",
    href: "/docs/connecting-tools",
  },
  {
    icon: Upload,
    title: "Publishing",
    description: "Submit your MCP server to the marketplace",
    href: "/docs/publishing",
  },
  {
    icon: BookOpen,
    title: "MCP Basics",
    description: "Learn what the Model Context Protocol is and how it works",
    href: "/docs/mcp-basics",
  },
];

export default function DocsPage() {
  return (
    <>
      <DocsHeader
        title="Getting Started"
        description="Everything you need to discover, connect, and publish MCP tools on Hive Market."
      />

      {/* What is Hive Market */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          What is Hive Market?
        </h2>
        <p className="mb-4 text-muted-foreground">
          Hive Market is the marketplace for MCP-compatible tools — think of it as
          an app store for AI agent integrations. Developers discover tools that
          give their AI clients (like Claude Desktop, Cursor, or Windsurf) new
          capabilities: reading files, querying databases, calling APIs, managing
          infrastructure, and more.
        </p>
        <p className="text-muted-foreground">
          Creators publish their MCP servers to the marketplace where thousands
          of developers can find and connect them. Each tool listing includes
          documentation, install counts, user reviews, and a one-click
          configuration snippet for every major AI client.
        </p>
      </section>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Quick Start
        </h2>
        <p className="mb-6 text-muted-foreground">
          Connect an MCP tool to your AI agent in under two minutes:
        </p>
        <ol className="mb-6 space-y-4">
          {[
            {
              step: "Browse or search",
              detail:
                "Find a tool on Hive Market by name, category, or keyword. Use the search bar or browse the 8 categories.",
            },
            {
              step: "Click Connect",
              detail:
                'Open the tool page and click "Connect to Agent." Choose your AI client from the tabs.',
            },
            {
              step: "Copy the config",
              detail:
                "Copy the JSON configuration snippet shown for your client. It contains the server command and any required arguments.",
            },
            {
              step: "Paste into your client",
              detail:
                "Open your client's MCP config file and paste the snippet into the mcpServers object.",
            },
            {
              step: "Restart your client",
              detail:
                "Restart your AI client. The tool's capabilities will appear in your tool list, ready to use.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-medium text-violet-400">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">{item.step}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Callout variant="tip" title="Need detailed setup instructions?">
          <p>
            See the{" "}
            <Link href="/docs/connecting-tools">Connecting Tools</Link> page for
            step-by-step instructions with exact config file paths and JSON
            examples for each AI client.
          </p>
        </Callout>
      </section>

      {/* Browsing & Search */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Browsing & Search
        </h2>
        <p className="mb-4 text-muted-foreground">
          Hive Market organizes tools into 8 categories: Payments, Communication,
          Data, DevTools, Productivity, AI/ML, Content, and Analytics. You can
          browse by category or use the global search to find tools by name,
          description, or keyword.
        </p>
        <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-gray-950 p-4">
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
          <div>
            <p className="font-medium text-foreground">Search tips</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Search by tool name: &ldquo;filesystem&rdquo;, &ldquo;slack&rdquo;, &ldquo;postgres&rdquo;</li>
              <li>Search by capability: &ldquo;send email&rdquo;, &ldquo;read files&rdquo;, &ldquo;query database&rdquo;</li>
              <li>Filter by category and sort by popularity, rating, or newest</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Explore the Docs
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-border/50 bg-gray-950 p-5 transition-colors hover:border-violet-500/30 hover:bg-gray-950/80"
            >
              <link.icon className="mb-3 h-5 w-5 text-violet-400" />
              <p className="font-medium text-foreground">{link.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {link.description}
              </p>
              <span className="mt-3 flex items-center gap-1 text-sm text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
