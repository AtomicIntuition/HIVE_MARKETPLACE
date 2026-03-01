"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tool } from "@/lib/types";
import {
  MCP_CLIENTS,
  McpClient,
  generateMultiToolConfig,
  getClientInstructions,
  getEnvVarsForTools,
} from "@/lib/mcp-config";

interface StackConfigGeneratorProps {
  stackName: string;
  tools: Tool[];
}

export function StackConfigGenerator({
  stackName,
  tools,
}: StackConfigGeneratorProps) {
  const [activeTab, setActiveTab] = useState<McpClient>("Claude Desktop");
  const [copied, setCopied] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);

  const config = generateMultiToolConfig(tools, activeTab);
  const toolsWithPackage = tools.filter((t) => t.npmPackage);
  const requiredEnvVars = getEnvVarsForTools(tools).filter((e) => e.required);

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
        {MCP_CLIENTS.map((tab) => (
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
          {getClientInstructions(activeTab)}
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

        {requiredEnvVars.length > 0 && (
          <div className="mt-3 rounded-lg border border-border/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Required Environment Variables</p>
            <div className="space-y-1">
              {requiredEnvVars.map((e) => (
                <div key={e.name} className="text-xs">
                  <code className="text-violet-400">{e.name}</code>
                  <span className="ml-2 text-muted-foreground">{e.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
