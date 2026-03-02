"use client";

import { useState } from "react";
import { Terminal, ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";

const CLI_COMMAND = "npx -y hive-market-mcp";

export function Hero() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(CLI_COMMAND);
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
          <h1
            className="text-5xl font-bold tracking-tight leading-[1.1] text-foreground lg:text-6xl"
          >
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

          {/* CLI preview */}
          <div
            className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl border border-white/[0.06] bg-gray-950 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
                <span className="ml-2 font-mono text-xs text-gray-500">
                  terminal
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-foreground"
                title="Copy install command"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <div className="overflow-x-auto p-4 text-left font-mono text-sm">
              <p className="text-gray-300">
                <span className="text-violet-400">$</span> npx -y hive-market-mcp
              </p>
              <p className="mt-2 text-emerald-400">
                &#10003; Hive Market MCP Server running
              </p>
              <p className="text-emerald-400">
                &#10003; 60+ tools available
              </p>
              <p className="text-emerald-400">
                &#10003; Ready — search, discover, and install MCP tools
              </p>
              <p className="mt-3 text-gray-600">
                # Or add to Claude Code:
              </p>
              <p className="text-gray-300">
                <span className="text-violet-400">$</span> claude mcp add hive-market -- npx -y hive-market-mcp
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
