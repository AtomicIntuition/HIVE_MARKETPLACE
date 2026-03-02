"use client";

import { useState } from "react";
import { Terminal, ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import { cn } from "@/lib/utils";

type ClientTab = "Claude Code" | "Claude Desktop" | "Cursor" | "Codex" | "OpenClaw";

const CLIENTS: ClientTab[] = ["Claude Code", "Claude Desktop", "Cursor", "Codex", "OpenClaw"];

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
    case "Codex":
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
    case "OpenClaw":
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
    case "Codex":
      return "Add to your Codex MCP configuration:";
    case "OpenClaw":
      return "Add to ~/.openclaw/openclaw.json:";
  }
}

export function Hero() {
  const [activeTab, setActiveTab] = useState<ClientTab>("Claude Code");
  const [copied, setCopied] = useState(false);

  const config = getConfig(activeTab);

  async function handleCopy() {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Terminal className="h-3.5 w-3.5" />
            The MCP Tool Marketplace
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-foreground lg:text-6xl">
            Every Tool Your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 bg-clip-text text-transparent">
              Agent
            </span>{" "}
            Needs
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            An MCP server with 60+ tools. Search, get install configs, and
            connect to any AI client — one command.
          </p>

          {/* Search bar */}
          <div className="mt-10">
            <SearchBar size="lg" />
          </div>

          {/* CTA */}
          <div className="mt-8 flex items-center justify-center">
            <Link href="/tools">
              <Button
                size="lg"
                className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
              >
                Browse Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Tabbed terminal — connect to your client */}
          <div className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl border border-white/[0.06] bg-gray-950 shadow-xl">
            <div className="border-b border-white/[0.06]">
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

            <div className="relative p-4 text-left">
              <p className="mb-2 text-xs text-gray-500">
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
        </div>
      </div>
    </section>
  );
}
