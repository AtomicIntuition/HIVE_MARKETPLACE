"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Users, FileText, Bot, Rocket } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Shield,
    title: "AI-Powered Audit",
    description:
      "Every submission is reviewed by Claude AI for quality and security.",
  },
  {
    icon: Zap,
    title: "Instant Distribution",
    description:
      "One-click install via npx/uvx for Claude, Cursor, Windsurf, and more.",
  },
  {
    icon: Users,
    title: "Reach Developers",
    description:
      "Put your tool in front of developers building AI agents.",
  },
];

const STEPS = [
  {
    icon: FileText,
    title: "Fill out the form",
    description: "Name, description, package info, and pricing",
  },
  {
    icon: Bot,
    title: "AI reviews your submission",
    description: "Automated quality and security audit",
  },
  {
    icon: Rocket,
    title: "Go live on Hive Market",
    description: "Discoverable by agents and developers instantly",
  },
];

interface PublishHeroProps {
  stats: {
    toolCount: number;
    categoryCount: number;
  };
}

export function PublishHero({ stats }: PublishHeroProps) {
  return (
    <div className="mb-12">
      {/* Header */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
          For Creators
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Publish Your{" "}
          <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
            MCP Server
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-400">
          Reach thousands of developers building AI agents. Every submission gets
          an automated AI audit, and approved tools go live instantly.
        </p>
      </motion.div>

      {/* Value prop cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {VALUE_PROPS.map((prop, i) => (
          <motion.div
            key={prop.title}
            className="rounded-xl border border-white/[0.06] bg-gray-900/50 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <prop.icon className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="font-semibold text-foreground">{prop.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{prop.description}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <motion.div
        className="mb-10 rounded-xl border border-white/[0.06] bg-gray-900/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="mb-5 text-center text-sm font-medium uppercase tracking-wider text-gray-400">
          How It Works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-400 ring-1 ring-amber-500/20">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex items-center justify-center gap-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div>
          <p className="text-2xl font-bold text-foreground">{stats.toolCount}+</p>
          <p className="text-xs text-gray-400">Tools Listed</p>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div>
          <p className="text-2xl font-bold text-foreground">{stats.categoryCount}</p>
          <p className="text-xs text-gray-400">Categories</p>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div>
          <p className="text-2xl font-bold text-foreground">AI</p>
          <p className="text-xs text-gray-400">Powered Audit</p>
        </div>
      </motion.div>
    </div>
  );
}
