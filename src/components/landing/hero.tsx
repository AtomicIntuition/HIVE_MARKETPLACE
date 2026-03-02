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
    <section className="relative overflow-hidden py-32 lg:py-40">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[600px] -translate-y-1/3 rounded-full bg-violet-600/8 blur-[100px] md:h-[700px] md:w-[900px]" />
        <div className="absolute right-1/4 top-1/4 h-[300px] w-[400px] rounded-full bg-violet-500/5 blur-[80px]" />
        <div className="absolute bottom-0 right-1/3 h-[300px] w-[500px] translate-y-1/3 rounded-full bg-amber-500/[0.04] blur-[100px] md:h-[500px] md:w-[700px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <Terminal className="h-3.5 w-3.5" />
              The MCP Tool Marketplace
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl font-bold tracking-tight leading-[1.1] text-foreground lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Every Tool Your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 bg-clip-text text-transparent">
              Agent
            </span>{" "}
            Needs
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            The marketplace for MCP-compatible tools. Discover, connect, and
            power your AI agents with 60+ ready-to-use integrations. One command to
            connect.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <SearchBar size="lg" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
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
            <Link href="/publish">
              <Button size="lg" variant="outline" className="gap-2 border-white/[0.1] hover:bg-white/[0.04]">
                Publish a Tool
              </Button>
            </Link>
          </motion.div>

          {/* CLI preview */}
          <motion.div
            className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl border border-white/[0.06] bg-gray-950 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            style={{ boxShadow: "0 0 40px rgba(139,92,246,0.08), 0 20px 40px rgba(0,0,0,0.3)" }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
