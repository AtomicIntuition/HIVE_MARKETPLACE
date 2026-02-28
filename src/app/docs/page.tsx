import { Metadata } from "next";
import { Terminal, BookOpen, Package, Zap } from "lucide-react";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Documentation",
  description:
    "Hive Market documentation — learn how to discover, connect, and publish MCP tools for AI agents.",
  path: "/docs",
});

const SECTIONS = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get up and running in under 2 minutes",
    content: [
      "npx hive-market search \"<query>\"",
      "npx hive-market connect <tool-name>",
      "npx hive-market list",
    ],
  },
  {
    icon: Terminal,
    title: "CLI Reference",
    description: "All available commands",
    content: [
      "search  — Search for tools",
      "connect — Add a tool to your agent",
      "remove  — Remove a tool",
      "list    — List connected tools",
      "publish — Publish a new tool",
      "update  — Update a published tool",
    ],
  },
  {
    icon: Package,
    title: "Publishing a Tool",
    description: "Share your MCP server with the world",
    content: [
      "1. Build an MCP-compatible server",
      "2. Test locally with your agent",
      "3. Run: npx hive-market publish ./my-server",
      "4. Fill in metadata (name, description, pricing)",
      "5. Submit for review",
    ],
  },
  {
    icon: BookOpen,
    title: "MCP Spec",
    description: "Model Context Protocol reference",
    content: [
      "MCP is an open protocol for AI agent tools",
      "Servers expose tools, resources, and prompts",
      "Clients (agents) connect and invoke tools",
      "JSON-RPC based communication",
      "Supports stdio and SSE transports",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
          <p className="mt-2 text-muted-foreground">
            Everything you need to discover, connect, and publish MCP tools
          </p>
        </div>

        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                  <section.icon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-gray-950 p-4">
                <div className="font-mono text-sm">
                  {section.content.map((line, i) => (
                    <p key={i} className="py-0.5 text-muted-foreground">
                      {line.startsWith("npx") ? (
                        <>
                          <span className="text-violet-400">$</span> {line}
                        </>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
