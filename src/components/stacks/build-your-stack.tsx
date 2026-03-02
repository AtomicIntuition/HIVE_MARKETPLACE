"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Search, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tool } from "@/lib/types";

interface BuildYourStackProps {
  tools: Tool[];
}

const TABS = ["Claude Desktop", "Cursor", "Windsurf", "Claude Code", "OpenClaw"] as const;
type Tab = (typeof TABS)[number];

export function BuildYourStack({ tools }: BuildYourStackProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Claude Desktop");
  const [copied, setCopied] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);

  const installableTools = useMemo(
    () => tools.filter((t) => t.npmPackage),
    [tools]
  );

  const filtered = useMemo(() => {
    if (!search) return installableTools;
    const q = search.toLowerCase();
    return installableTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [installableTools, search]);

  const selectedTools = useMemo(
    () => installableTools.filter((t) => selected.has(t.slug)),
    [installableTools, selected]
  );

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function buildConfig(): string {
    const servers: Record<string, { command: string; args: string[] }> = {};
    for (const tool of selectedTools) {
      if (!tool.npmPackage) continue;
      const isUvx = tool.installCommand === "uvx";
      servers[tool.slug] = isUvx
        ? { command: "uvx", args: [tool.npmPackage] }
        : { command: "npx", args: ["-y", tool.npmPackage] };
    }
    return JSON.stringify({ mcpServers: servers }, null, 2);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const slugs = Array.from(selected).join(",");
    const url = `${window.location.origin}/stacks/custom?tools=${slugs}`;
    await navigator.clipboard.writeText(url);
    setSharedLink(true);
    setTimeout(() => setSharedLink(false), 2000);
  }

  // Group tools by category
  const grouped = useMemo(() => {
    const map = new Map<string, Tool[]>();
    for (const tool of filtered) {
      const cat = tool.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(tool);
    }
    return map;
  }, [filtered]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Tool selector */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-border/50 bg-card">
          {/* Search */}
          <div className="border-b border-border/50 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-lg border border-border/50 bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {selected.size > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {selected.size} selected
                </span>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-violet-400 hover:text-violet-300"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Tool grid */}
          <div className="max-h-96 overflow-y-auto p-4">
            {Array.from(grouped.entries()).map(([category, categoryTools]) => (
              <div key={category} className="mb-4 last:mb-0">
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {category}
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => toggle(tool.slug)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-all",
                        selected.has(tool.slug)
                          ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                          : "border-border/50 text-foreground hover:border-border hover:bg-card"
                      )}
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: tool.iconBg }}
                      >
                        {tool.name.charAt(0)}
                      </div>
                      <span className="truncate text-xs font-medium">
                        {tool.name}
                      </span>
                      {selected.has(tool.slug) && (
                        <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-violet-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Config output */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-xl border border-border/50 bg-card">
          <div className="border-b border-border/50 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              Your Stack
            </h3>
            <p className="text-xs text-muted-foreground">
              {selected.size === 0
                ? "Select tools to generate config"
                : `${selected.size} MCP servers`}
            </p>
          </div>

          {selected.size > 0 && (
            <>
              {/* Selected tool pills */}
              <div className="flex flex-wrap gap-1.5 border-b border-border/50 px-4 py-3">
                {selectedTools.map((tool) => (
                  <Badge
                    key={tool.slug}
                    variant="secondary"
                    className="cursor-pointer gap-1 hover:bg-red-500/10 hover:text-red-400"
                    onClick={() => toggle(tool.slug)}
                  >
                    {tool.name}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>

              {/* Platform tabs */}
              <div className="flex overflow-x-auto border-b border-border/50 px-3">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "shrink-0 border-b-2 px-2.5 py-2 text-xs transition-colors",
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
                <pre className="max-h-64 overflow-auto rounded-lg bg-gray-950 p-3 text-xs text-foreground">
                  <code>{buildConfig()}</code>
                </pre>
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className="flex-1 gap-2 bg-violet-600 text-white hover:bg-violet-700"
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
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1"
                  >
                    {sharedLink ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {selected.size === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Click tools on the left to add them to your stack
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
