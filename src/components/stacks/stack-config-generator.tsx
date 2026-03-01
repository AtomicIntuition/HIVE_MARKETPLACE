"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tool } from "@/lib/types";

interface StackConfigGeneratorProps {
  stackName: string;
  tools: Tool[];
}

const TABS = ["Claude Desktop", "Cursor", "Windsurf", "Claude Code"] as const;
type Tab = (typeof TABS)[number];

function buildConfig(tools: Tool[], tab: Tab): string {
  const servers: Record<string, { command: string; args: string[] }> = {};

  for (const tool of tools) {
    if (!tool.npmPackage) continue;
    const isUvx = tool.installCommand === "uvx";
    servers[tool.slug] = isUvx
      ? { command: "uvx", args: [tool.npmPackage] }
      : { command: "npx", args: ["-y", tool.npmPackage] };
  }

  if (tab === "Claude Code") {
    return JSON.stringify({ mcpServers: servers }, null, 2);
  }

  return JSON.stringify({ mcpServers: servers }, null, 2);
}

function getInstructions(tab: Tab): string {
  switch (tab) {
    case "Claude Desktop":
      return "Paste into your claude_desktop_config.json:";
    case "Cursor":
      return "Paste into .cursor/mcp.json in your project:";
    case "Windsurf":
      return "Paste into your Windsurf MCP settings:";
    case "Claude Code":
      return "Save as .mcp.json in your project root:";
  }
}

export function StackConfigGenerator({
  stackName,
  tools,
}: StackConfigGeneratorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Claude Desktop");
  const [copied, setCopied] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);

  const config = buildConfig(tools, activeTab);
  const toolsWithPackage = tools.filter((t) => t.npmPackage);

  async function handleCopy() {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const slugs = tools.map((t) => t.slug).join(",");
    const url = `${window.location.origin}/stacks/custom?tools=${slugs}`;
    await navigator.clipboard.writeText(url);
    setSharedLink(true);
    setTimeout(() => setSharedLink(false), 2000);
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      {/* Header */}
      <div className="border-b border-border/50 px-6 py-4">
        <h3 className="font-semibold text-foreground">
          {stackName} Config
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {toolsWithPackage.length} MCP servers ready to paste
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border/50 px-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-xs transition-colors",
              activeTab === tab
                ? "border-violet-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Config */}
      <div className="p-4">
        <p className="mb-2 text-xs text-muted-foreground">
          {getInstructions(activeTab)}
        </p>
        <div className="relative">
          <pre className="max-h-80 overflow-auto rounded-lg bg-gray-950 p-4 text-xs text-foreground">
            <code>{config}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded-lg bg-gray-800 p-1.5 text-muted-foreground transition-colors hover:bg-gray-700 hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleCopy}
            className="flex-1 gap-2 bg-violet-600 text-white hover:bg-violet-700"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Config
              </>
            )}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {sharedLink ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
