"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Connect to Your AI Client
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Add Hive Market as an MCP server. Your agent gets access to every
            tool in the directory.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-white/[0.06] bg-gray-950 shadow-xl">
          {/* Terminal header with tabs */}
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

          {/* Config content */}
          <div className="relative p-4">
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
    </section>
  );
}
