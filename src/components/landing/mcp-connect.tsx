"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Shield,
  Star,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ClientTab = "Claude Code" | "Claude Desktop" | "Cursor";

const CLIENTS: ClientTab[] = ["Claude Code", "Claude Desktop", "Cursor"];

const CAPABILITIES = [
  {
    icon: Search,
    text: "Search and discover 50+ MCP tools",
  },
  {
    icon: Download,
    text: "Get install configs for any client",
  },
  {
    icon: Layers,
    text: "Browse curated tool stacks",
  },
  {
    icon: Star,
    text: "AI-powered tool recommendations",
  },
  {
    icon: Shield,
    text: "Every tool audited for safety",
  },
];

function getConfig(client: ClientTab): string {
  switch (client) {
    case "Claude Code":
      return `claude mcp add hive-market -- npx -y hive-market-mcp`;
    case "Claude Desktop":
      return JSON.stringify(
        {
          mcpServers: {
            "hive-market": {
              command: "npx",
              args: ["-y", "hive-market-mcp"],
            },
          },
        },
        null,
        2
      );
    case "Cursor":
      return JSON.stringify(
        {
          mcpServers: {
            "hive-market": {
              command: "npx",
              args: ["-y", "hive-market-mcp"],
            },
          },
        },
        null,
        2
      );
  }
}

function getInstruction(client: ClientTab): string {
  switch (client) {
    case "Claude Code":
      return "Run this command in your terminal:";
    case "Claude Desktop":
      return "Add to ~/Library/Application Support/Claude/claude_desktop_config.json:";
    case "Cursor":
      return "Add to .cursor/mcp.json in your project:";
  }
}

export function McpConnect() {
  const [activeTab, setActiveTab] = useState<ClientTab>("Claude Code");
  const [copied, setCopied] = useState(false);

  const config = getConfig(activeTab);

  async function handleCopy() {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-violet-950/30 to-card">
          <div className="grid gap-12 p-8 md:grid-cols-2 md:p-12 lg:p-16">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
                Connect via MCP
              </div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Your Agent&apos;s{" "}
                <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                  Tool Store
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Connect Hive Market as an MCP server and let your agent
                discover, configure, and install tools on its own.
              </p>

              <div className="mt-8 space-y-4">
                {CAPABILITIES.map((cap, i) => (
                  <motion.div
                    key={cap.text}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                      <cap.icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {cap.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: tabbed terminal */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-gray-950">
                {/* Terminal header with tabs */}
                <div className="border-b border-border/50">
                  <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex overflow-x-auto px-4 pt-2">
                    {CLIENTS.map((client) => (
                      <button
                        key={client}
                        onClick={() => setActiveTab(client)}
                        className={cn(
                          "shrink-0 border-b-2 px-3 py-2 text-xs transition-colors",
                          activeTab === client
                            ? "border-violet-500 text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {client}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Config content */}
                <div className="relative p-4">
                  <p className="mb-2 text-xs text-muted-foreground">
                    {getInstruction(activeTab)}
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900/50 p-3 font-mono text-sm text-foreground">
                    <code>{config}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute right-5 top-12 rounded-md bg-gray-800 p-1.5 text-muted-foreground transition-colors hover:bg-gray-700 hover:text-foreground"
                    title="Copy config"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
