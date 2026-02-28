"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackInstall } from "@/app/actions/track-install";

interface ConnectDialogProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
  npmPackage?: string;
  githubUrl?: string;
}

const TABS = ["Claude Desktop", "Cursor", "Windsurf", "Generic"] as const;

export function ConnectDialog({
  toolId,
  toolName,
  toolSlug,
  npmPackage,
  githubUrl,
}: ConnectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Claude Desktop");
  const [copied, setCopied] = useState(false);

  if (!npmPackage && !githubUrl) return null;

  if (!npmPackage) {
    return (
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
      >
        Visit GitHub
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  function getConfig() {
    const serverConfig = {
      command: "npx",
      args: ["-y", npmPackage!],
    };

    switch (activeTab) {
      case "Claude Desktop":
        return JSON.stringify(
          {
            mcpServers: {
              [toolSlug]: serverConfig,
            },
          },
          null,
          2
        );
      case "Cursor":
        return JSON.stringify(
          {
            mcpServers: {
              [toolSlug]: serverConfig,
            },
          },
          null,
          2
        );
      case "Windsurf":
        return JSON.stringify(
          {
            mcpServers: {
              [toolSlug]: serverConfig,
            },
          },
          null,
          2
        );
      case "Generic":
        return JSON.stringify(serverConfig, null, 2);
    }
  }

  function getInstructions() {
    switch (activeTab) {
      case "Claude Desktop":
        return "Add to your claude_desktop_config.json:";
      case "Cursor":
        return "Add to your Cursor MCP settings (.cursor/mcp.json):";
      case "Windsurf":
        return "Add to your Windsurf MCP settings:";
      case "Generic":
        return "MCP server configuration for any client:";
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track install
    trackInstall(toolId);
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full gap-2 bg-violet-600 text-white hover:bg-violet-700"
      >
        Connect to Agent
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-x-4 top-[50%] z-50 mx-auto max-w-lg -translate-y-1/2 rounded-2xl border border-border/50 bg-card shadow-2xl md:inset-x-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Connect {toolName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add to your AI agent&apos;s MCP configuration
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50 px-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "border-b-2 px-3 py-3 text-sm transition-colors",
                    activeTab === tab
                      ? "border-violet-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-3 text-sm text-muted-foreground">
                {getInstructions()}
              </p>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-foreground">
                  <code>{getConfig()}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 rounded-lg bg-gray-800 p-2 text-muted-foreground transition-colors hover:bg-gray-700 hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Package: {npmPackage}
                </p>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Config
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
