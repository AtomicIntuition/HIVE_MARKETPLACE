"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tool } from "@/lib/types";
import {
  MCP_CLIENTS,
  McpClient,
  generateToolConfig,
  getClientInstructions,
} from "@/lib/mcp-config";

interface McpConfigDisplayProps {
  tool: Tool;
}

export function McpConfigDisplay({ tool }: McpConfigDisplayProps) {
  const [activeTab, setActiveTab] = useState<McpClient>("Claude Desktop");
  const [copied, setCopied] = useState(false);

  if (!tool.npmPackage) return null;

  const config = generateToolConfig(tool, activeTab);

  async function handleCopy() {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      <div className="border-b border-border/50 px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          MCP Configuration
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Paste into your client config
        </p>
      </div>

      {/* Client tabs */}
      <div className="flex overflow-x-auto border-b border-border/50 px-4">
        {MCP_CLIENTS.map((client) => (
          <button
            key={client}
            onClick={() => setActiveTab(client)}
            className={cn(
              "shrink-0 border-b-2 px-2.5 py-2 text-xs transition-colors",
              activeTab === client
                ? "border-violet-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {client}
          </button>
        ))}
      </div>

      <div className="p-4">
        <p className="mb-2 text-xs text-muted-foreground">
          {getClientInstructions(activeTab)}
        </p>
        <div className="relative">
          <pre className="max-h-48 overflow-auto rounded-lg bg-gray-950 p-3 text-xs text-foreground">
            <code>{config}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-1.5 top-1.5 rounded-md bg-gray-800 p-1.5 text-muted-foreground transition-colors hover:bg-gray-700 hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        {tool.envVars && tool.envVars.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Environment Variables
            </p>
            {tool.envVars.map((ev) => (
              <div key={ev.name} className="text-xs">
                <code className="text-violet-400">{ev.name}</code>
                {ev.required && (
                  <span className="ml-1 text-red-400">*</span>
                )}
                <span className="ml-1.5 text-muted-foreground">
                  {ev.description}
                </span>
              </div>
            ))}
          </div>
        )}

        <a
          href={`/api/tools/${tool.slug}/config`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-violet-400"
        >
          Raw JSON API
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
