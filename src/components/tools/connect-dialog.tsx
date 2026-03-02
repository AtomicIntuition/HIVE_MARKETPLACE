"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackInstall } from "@/app/actions/track-install";
import { MCP_CLIENTS, McpClient, generateToolConfig, getClientInstructions } from "@/lib/mcp-config";
import { ToolEnvVar } from "@/lib/types";

interface ConnectDialogProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
  npmPackage?: string;
  installCommand?: "npx" | "uvx";
  githubUrl?: string;
  envVars?: ToolEnvVar[];
}

export function ConnectDialog({
  toolId,
  toolName,
  toolSlug,
  npmPackage,
  installCommand = "npx",
  githubUrl,
  envVars,
}: ConnectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<McpClient>("Claude Desktop");
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

  // Build a minimal Tool-like object for config generation
  const toolForConfig = {
    slug: toolSlug,
    npmPackage,
    installCommand,
    envVars,
  } as Parameters<typeof generateToolConfig>[0];

  const config = generateToolConfig(toolForConfig, activeTab);

  async function handleCopy() {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

          {/* Dialog — centered with scroll support */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gray-900 shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Connect {toolName}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Add to your AI agent&apos;s MCP configuration
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] px-5 sm:px-6">
                {MCP_CLIENTS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                      activeTab === tab
                        ? "border-violet-500 text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable content */}
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-5 sm:p-6">
                <p className="mb-3 text-sm text-muted-foreground">
                  {getClientInstructions(activeTab)}
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm leading-relaxed text-foreground ring-1 ring-white/[0.06]">
                    <code>{config}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-2 rounded-md bg-white/[0.06] p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.1] hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {envVars && envVars.length > 0 && (
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Environment Variables
                    </p>
                    <div className="space-y-2">
                      {envVars.filter((e) => e.required).map((e) => (
                        <div key={e.name} className="flex items-baseline gap-2 text-xs">
                          <code className="shrink-0 rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-violet-400">
                            {e.name}
                          </code>
                          <span className="text-muted-foreground">{e.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 sm:px-6">
                <p className="text-xs text-muted-foreground">
                  {installCommand === "uvx" ? "PyPI" : "npm"}: <code className="text-foreground">{npmPackage}</code>
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
