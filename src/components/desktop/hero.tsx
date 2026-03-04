"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, Shield, Cpu, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GITHUB_RELEASE_URL =
  "https://github.com/AtomicIntuition/hive-desktop/releases/latest";

const pills = [
  { icon: Shield, label: "Local-first" },
  { icon: Cpu, label: "MCP Native" },
  { icon: Zap, label: "AI Workflows" },
];

export function DesktopHero() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300"
          >
            <Download className="h-3.5 w-3.5" />
            Native Desktop App
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-5xl font-bold tracking-tight leading-[1.08] text-foreground lg:text-7xl"
          >
            Your Tools.{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 bg-clip-text text-transparent">
              Your Machine.
            </span>
            <br />
            Your Workflows.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed md:text-xl"
          >
            Wire MCP tools into persistent, event-driven workflows using natural
            language. Everything runs locally — your API keys never leave your
            device.
          </motion.p>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            {pills.map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-gray-400"
              >
                <pill.icon className="h-3 w-3 text-violet-400" />
                {pill.label}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a href={GITHUB_RELEASE_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gap-2.5 bg-violet-600 px-8 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 hover:shadow-violet-600/30"
              >
                <Download className="h-4.5 w-4.5" />
                Download for macOS
              </Button>
            </a>
            <a
              href="https://github.com/AtomicIntuition/hive-desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/[0.1] text-gray-300 hover:border-white/[0.2] hover:text-foreground"
              >
                View on GitHub
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-4 text-xs text-gray-600"
          >
            macOS (Apple Silicon + Intel) — v0.1.0 — MIT License
          </motion.p>

          {/* App preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-16 max-w-3xl"
          >
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-gray-950 shadow-2xl shadow-violet-600/5">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-gray-900/50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  Hive Desktop
                </span>
              </div>

              {/* App content mockup */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-48 shrink-0 border-r border-white/[0.06] bg-gray-950 p-3">
                  <div className="mb-4 flex items-center gap-2 px-2">
                    <div className="h-5 w-5 rounded bg-amber-500/30" />
                    <span className="text-xs font-semibold text-gray-200">
                      Hive Desktop
                    </span>
                  </div>
                  {["Dashboard", "Workflows", "Servers", "Vault", "Settings"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`mb-0.5 rounded-md px-2 py-1.5 text-xs ${
                          i === 0
                            ? "bg-violet-500/10 text-violet-300"
                            : "text-gray-500"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                  <div className="mt-4 border-t border-white/[0.04] pt-3">
                    <div className="flex items-center gap-1.5 px-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-gray-600">Runtime</span>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4">
                  {/* Stats row */}
                  <div className="mb-4 grid grid-cols-4 gap-2">
                    {[
                      { label: "Active Workflows", value: "3", color: "text-violet-400" },
                      { label: "Running Servers", value: "5", color: "text-emerald-400" },
                      { label: "Total Runs", value: "1,247", color: "text-amber-400" },
                      { label: "Error Rate", value: "0.3%", color: "text-gray-400" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-white/[0.04] bg-gray-900/40 p-2.5"
                      >
                        <p className={`text-lg font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="text-[9px] text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Workflow cards */}
                  <div className="space-y-2">
                    {[
                      {
                        name: "Payment Monitor",
                        status: "Active",
                        statusColor: "bg-emerald-500",
                        trigger: "Every 60s",
                        runs: "423 runs",
                      },
                      {
                        name: "Issue Triager",
                        status: "Active",
                        statusColor: "bg-emerald-500",
                        trigger: "Webhook",
                        runs: "189 runs",
                      },
                      {
                        name: "Daily Digest",
                        status: "Scheduled",
                        statusColor: "bg-amber-500",
                        trigger: "9:00 AM",
                        runs: "31 runs",
                      },
                    ].map((wf) => (
                      <div
                        key={wf.name}
                        className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-gray-900/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${wf.statusColor}`}
                          />
                          <span className="text-xs text-gray-200">{wf.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-600">
                            {wf.trigger}
                          </span>
                          <span className="text-[10px] text-gray-600">
                            {wf.runs}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
