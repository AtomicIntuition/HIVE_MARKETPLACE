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
    description: "Connect an MCP tool to your AI agent in under 2 minutes",
    content: [
      "1. Browse or search for a tool on Hive Market",
      "2. Click \"Connect to Agent\" on the tool page",
      "3. Choose your client (Claude Desktop, Cursor, Windsurf)",
      "4. Copy the JSON config into your client's config file",
      "5. Restart your client — the tool is now available",
    ],
  },
  {
    icon: Terminal,
    title: "Claude Desktop Setup",
    description: "Add MCP tools to Claude Desktop",
    content: [
      "1. Open Claude Desktop → Settings → Developer",
      "2. Click \"Edit Config\" to open claude_desktop_config.json",
      "3. Paste the MCP server config from Hive Market",
      "4. Save the file and restart Claude Desktop",
      "5. The tool will appear in Claude's tool list",
    ],
  },
  {
    icon: Package,
    title: "Publishing a Tool",
    description: "Share your MCP server with the community",
    content: [
      "1. Build an MCP-compatible server (stdio or SSE transport)",
      "2. Publish it to npm or host on GitHub",
      "3. Go to Hive Market → Publish",
      "4. Fill in metadata (name, description, npm package, pricing)",
      "5. Your tool goes live on the marketplace",
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
                      {line}
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
