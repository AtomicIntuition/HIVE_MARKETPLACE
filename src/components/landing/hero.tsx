"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl md:h-[600px] md:w-[800px]" />
        <div className="absolute bottom-0 right-0 h-[200px] w-[300px] translate-x-1/4 translate-y-1/4 rounded-full bg-amber-500/5 blur-3xl md:h-[400px] md:w-[600px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <Terminal className="h-3.5 w-3.5" />
              The MCP Tool Marketplace
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Every Tool Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Agent
            </span>{" "}
            Needs
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The marketplace for MCP-compatible tools. Discover, connect, and
            power your AI agents with thousands of integrations. One command to
            connect.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SearchBar size="lg" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/tools">
              <Button
                size="lg"
                className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
              >
                Browse Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="gap-2">
                Publish a Tool
              </Button>
            </Link>
          </motion.div>

          {/* CLI preview */}
          <motion.div
            className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl border border-border/50 bg-gray-950"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  terminal
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-gray-800 hover:text-foreground"
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
              <p className="text-muted-foreground">
                <span className="text-violet-400">$</span> npx -y hive-market-mcp
              </p>
              <p className="mt-2 text-emerald-400">
                &#10003; Hive Market MCP Server running
              </p>
              <p className="text-emerald-400">
                &#10003; 50+ tools available
              </p>
              <p className="text-emerald-400">
                &#10003; Ready — search, discover, and install MCP tools
              </p>
              <p className="mt-3 text-muted-foreground/60">
                # Or add to Claude Code:
              </p>
              <p className="text-muted-foreground">
                <span className="text-violet-400">$</span> claude mcp add hive-market -- npx -y hive-market-mcp
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
