"use client";

import { motion } from "framer-motion";
import { Search, Plug, Rocket, Hammer, Upload, Banknote } from "lucide-react";

const DEV_STEPS = [
  {
    icon: Search,
    title: "Search",
    description: "Find the perfect tool for your agent",
  },
  {
    icon: Plug,
    title: "Connect",
    description: "One command to add it to your agent",
  },
  {
    icon: Rocket,
    title: "Ship",
    description: "Your agent now has superpowers",
  },
];

const CREATOR_STEPS = [
  {
    icon: Hammer,
    title: "Build",
    description: "Create an MCP-compatible server",
  },
  {
    icon: Upload,
    title: "Publish",
    description: "Submit to Hive Market with one command",
  },
  {
    icon: Banknote,
    title: "Earn",
    description: "Get paid every time an agent uses your tool",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-white/[0.03] bg-gray-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground">How It Works</h2>
          <p className="mt-3 text-gray-400">
            Two paths, one marketplace
          </p>
        </motion.div>

        <div className="grid gap-16 md:grid-cols-2">
          {/* For Developers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-400">
              For Developers
            </div>
            <div className="relative space-y-8">
              {/* Connecting line */}
              <div className="absolute left-5 top-12 bottom-4 w-px bg-gradient-to-b from-violet-500/20 to-transparent" />
              {DEV_STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-400 ring-1 ring-violet-500/20">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* For Creators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
              For Creators
            </div>
            <div className="relative space-y-8">
              {/* Connecting line */}
              <div className="absolute left-5 top-12 bottom-4 w-px bg-gradient-to-b from-amber-500/20 to-transparent" />
              {CREATOR_STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-400 ring-1 ring-amber-500/20">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
