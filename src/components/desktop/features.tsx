"use client";

import { motion } from "framer-motion";
import {
  Workflow,
  Server,
  Shield,
  MessageSquare,
  Timer,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "MCP Server Management",
    description:
      "Browse Hive Market, install servers with one click, and manage their full lifecycle — start, stop, restart, view logs — all from the app.",
    color: "violet",
  },
  {
    icon: Workflow,
    title: "Persistent Workflows",
    description:
      "Build automations that survive restarts. Five trigger types — cron, interval, webhook, file watch, manual — with variable passing between steps.",
    color: "violet",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Creation",
    description:
      "Describe what you want in plain English. The AI planner generates the workflow, detects required servers, and offers to install anything missing.",
    color: "amber",
  },
  {
    icon: Timer,
    title: "Event-Driven Scheduling",
    description:
      "Cron expressions, fixed intervals, webhooks, and file watchers. Workflows fire exactly when they should, with retry logic and error handling.",
    color: "violet",
  },
  {
    icon: Lock,
    title: "Encrypted Vault",
    description:
      "AES-256-GCM encrypted credential storage. API keys are injected into server environments at runtime — never written to disk in plaintext.",
    color: "emerald",
  },
  {
    icon: Shield,
    title: "Local-First Architecture",
    description:
      "Everything runs on your machine. No cloud. No telemetry. No phone-home. Your data, your API keys, your workflows — fully under your control.",
    color: "emerald",
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    ring: "ring-violet-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    ring: "ring-amber-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/20",
  },
};

export function DesktopFeatures() {
  return (
    <section className="border-y border-white/[0.03] bg-gray-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2"
          >
            <div className="h-5 w-1 rounded-full bg-violet-400" />
            <span className="text-sm font-medium text-violet-300">
              Core Features
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
          >
            Everything you need to automate
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            MCP server management, workflow orchestration, and AI-powered
            creation — in a single native app.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group rounded-xl border border-white/[0.06] bg-gray-950/50 p-6 transition-colors duration-200 hover:border-white/[0.1]"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg} ring-1 ${colors.ring}`}
                >
                  <feature.icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
