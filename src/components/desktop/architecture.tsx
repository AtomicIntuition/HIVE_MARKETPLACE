"use client";

import { motion } from "framer-motion";
import { Box, Cpu, Monitor, ArrowDown } from "lucide-react";

const layers = [
  {
    label: "Tauri v2 Shell",
    tech: "Rust",
    color: "amber",
    icon: Monitor,
    items: ["System Tray", "Auto-Updater", "Keychain", "~15 MB Binary"],
  },
  {
    label: "Runtime Server",
    tech: "Node.js",
    color: "violet",
    icon: Cpu,
    items: [
      "MCP Manager",
      "Workflow Engine",
      "AI Planner",
      "Encrypted Vault",
    ],
  },
  {
    label: "React Frontend",
    tech: "Tauri Webview",
    color: "emerald",
    icon: Box,
    items: ["Dashboard", "Workflows", "Servers", "Vault"],
  },
];

const colorStyles: Record<
  string,
  { border: string; bg: string; text: string; dot: string; tagBg: string }
> = {
  amber: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.04]",
    text: "text-amber-400",
    dot: "bg-amber-400",
    tagBg: "bg-amber-500/10",
  },
  violet: {
    border: "border-violet-500/20",
    bg: "bg-violet-500/[0.04]",
    text: "text-violet-400",
    dot: "bg-violet-400",
    tagBg: "bg-violet-500/10",
  },
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.04]",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    tagBg: "bg-emerald-500/10",
  },
};

const techDecisions = [
  {
    tech: "Rust (Tauri)",
    reason: "Native OS integration, tiny binary, system tray, auto-updates",
  },
  {
    tech: "Node.js (Fastify)",
    reason: "MCP SDK is TypeScript, async I/O for process management",
  },
  {
    tech: "React 19",
    reason: "Same design language as Hive Market, fast development",
  },
  {
    tech: "SQLite",
    reason: "Zero-config embedded database, no external dependencies",
  },
];

export function DesktopArchitecture() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: text + tech decisions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2"
            >
              <div className="h-5 w-1 rounded-full bg-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                Architecture
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
              Three layers,{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                one binary
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-4 max-w-lg text-gray-400 leading-relaxed"
            >
              Each layer does what it&apos;s best at. Rust for the native shell,
              Node.js for the MCP runtime, React for the UI. Clean separation
              means each layer is testable independently.
            </motion.p>

            {/* Tech decisions */}
            <div className="mt-10 space-y-4">
              {techDecisions.map((item, i) => (
                <motion.div
                  key={item.tech}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {item.tech}
                    </span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      — {item.reason}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: architecture diagram */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center"
          >
            <div className="w-full space-y-3">
              {layers.map((layer, i) => {
                const c = colorStyles[layer.color];
                return (
                  <div key={layer.label}>
                    <div
                      className={`rounded-xl border ${c.border} ${c.bg} p-5`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.tagBg}`}
                          >
                            <layer.icon className={`h-4 w-4 ${c.text}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {layer.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {layer.tech}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-full ${c.tagBg} px-2.5 py-0.5`}
                        >
                          <span className={`text-[10px] font-medium ${c.text}`}>
                            Layer {i + 1}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {layer.items.map((item) => (
                          <div
                            key={item}
                            className="rounded-md border border-white/[0.04] bg-gray-950/50 px-2.5 py-1.5 text-center text-xs text-gray-400"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow between layers */}
                    {i < layers.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Stats bar */}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { label: "Binary Size", value: "~15 MB" },
                  { label: "Test Coverage", value: "327 tests" },
                  { label: "License", value: "MIT" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/[0.04] bg-gray-950/30 px-3 py-2 text-center"
                  >
                    <p className="text-sm font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
