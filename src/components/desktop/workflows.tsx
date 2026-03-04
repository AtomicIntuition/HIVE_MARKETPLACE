"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  GitPullRequest,
  AlertCircle,
  Newspaper,
  Rocket,
  UserPlus,
  ShieldCheck,
  FileText,
  Search,
  Database,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const templates = [
  {
    name: "Payment Monitor",
    desc: "Stripe: payments above threshold → Slack alert",
    icon: CreditCard,
    trigger: "Every 60s",
    servers: ["stripe-mcp", "slack-mcp"],
  },
  {
    name: "Issue Triager",
    desc: "GitHub: new issue → AI categorize → auto-label",
    icon: GitPullRequest,
    trigger: "Webhook",
    servers: ["github-mcp", "slack-mcp"],
  },
  {
    name: "Error Alerter",
    desc: "Sentry: new error → GitHub issue + Slack",
    icon: AlertCircle,
    trigger: "Webhook",
    servers: ["sentry-mcp", "github-mcp"],
  },
  {
    name: "Daily Digest",
    desc: "Summarize GitHub + Stripe + analytics → email",
    icon: Newspaper,
    trigger: "9:00 AM",
    servers: ["github-mcp", "stripe-mcp"],
  },
  {
    name: "Deploy Watcher",
    desc: "Vercel: deployment failure → Slack alert",
    icon: Rocket,
    trigger: "Webhook",
    servers: ["vercel-mcp", "slack-mcp"],
  },
  {
    name: "Customer Onboarding",
    desc: "Stripe: new customer → welcome email → Slack",
    icon: UserPlus,
    trigger: "Webhook",
    servers: ["stripe-mcp", "resend-mcp"],
  },
  {
    name: "Dependency Auditor",
    desc: "Weekly: npm audit → create vulnerability issues",
    icon: ShieldCheck,
    trigger: "Weekly",
    servers: ["github-mcp"],
  },
  {
    name: "Content Pipeline",
    desc: "File watch: markdown → process → publish to CMS",
    icon: FileText,
    trigger: "File watch",
    servers: ["filesystem-mcp"],
  },
  {
    name: "Competitor Monitor",
    desc: "Daily: search mentions → summarize → email",
    icon: Search,
    trigger: "Daily",
    servers: ["brave-search-mcp"],
  },
  {
    name: "Backup Alert",
    desc: "Interval: check backup status → alert on failure",
    icon: Database,
    trigger: "Every 30m",
    servers: ["supabase-mcp", "slack-mcp"],
  },
];

const plannerSteps = [
  {
    label: "You describe",
    text: '"Watch Stripe and Slack me when a payment over $500 comes in"',
    done: true,
  },
  {
    label: "AI parses intent",
    text: "Monitor Stripe → filter amount > $500 → notify Slack",
    done: true,
  },
  {
    label: "Detect servers",
    text: "stripe-mcp (installed) · slack-mcp (needs install)",
    done: true,
  },
  {
    label: "Generate workflow",
    text: "3 steps: poll → condition → MCP call",
    done: true,
  },
  { label: "You approve", text: "Preview → confirm → activate", done: false },
];

export function DesktopWorkflows() {
  return (
    <section className="border-y border-white/[0.03] bg-gray-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* AI Planner showcase */}
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2"
            >
              <div className="h-5 w-1 rounded-full bg-violet-400" />
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">
                AI Workflow Planner
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
              Describe it.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                It builds it.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-4 max-w-lg text-gray-400 leading-relaxed"
            >
              Tell the AI planner what you want in plain English. It figures out
              the triggers, the steps, and which MCP servers you need — then
              offers to install anything missing from Hive Market.
            </motion.p>

            {/* Planner steps */}
            <div className="relative mt-10">
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/30 via-violet-500/10 to-transparent" />
              <div className="space-y-5">
                {plannerSteps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <div className="relative z-10 mt-0.5">
                      {step.done ? (
                        <CheckCircle2 className="h-[22px] w-[22px] text-violet-400" />
                      ) : (
                        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-gray-600">
                          <div className="h-2 w-2 rounded-full bg-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {step.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: terminal-style NL preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center"
          >
            <div className="w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gray-950 shadow-2xl shadow-violet-600/5">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-gray-900/50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  AI Workflow Planner
                </span>
              </div>

              <div className="p-5">
                {/* User input */}
                <div className="mb-4 rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3">
                  <p className="text-xs text-gray-500">You said:</p>
                  <p className="mt-1 text-sm text-gray-200">
                    &quot;Watch my Stripe and Slack me when a payment over $500
                    comes in&quot;
                  </p>
                </div>

                {/* AI response */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    <span className="text-xs font-medium text-violet-300">
                      Generated Workflow
                    </span>
                  </div>

                  {/* Trigger */}
                  <div className="rounded-md border border-white/[0.04] bg-gray-900/40 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Trigger</span>
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                        interval
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-gray-300">
                      Every 60 seconds
                    </p>
                  </div>

                  {/* Steps */}
                  {[
                    {
                      step: "1",
                      name: "List recent charges",
                      server: "stripe-mcp",
                      tool: "list_charges",
                    },
                    {
                      step: "2",
                      name: "Filter amount > $500",
                      server: null,
                      tool: "condition",
                    },
                    {
                      step: "3",
                      name: "Send Slack notification",
                      server: "slack-mcp",
                      tool: "send_message",
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="flex items-center gap-3 rounded-md border border-white/[0.04] bg-gray-900/40 px-3 py-2"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-300">
                        {s.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-200">{s.name}</p>
                        {s.server && (
                          <p className="font-mono text-[10px] text-gray-500">
                            {s.server} → {s.tool}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Servers needed */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">
                      Required:
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                      stripe-mcp ✓
                    </span>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                      slack-mcp — install
                    </span>
                  </div>

                  {/* Approve button mock */}
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 rounded-md bg-violet-600 py-1.5 text-center text-xs font-medium text-white">
                      Approve & Activate
                    </div>
                    <div className="rounded-md border border-white/[0.06] px-3 py-1.5 text-center text-xs text-gray-400">
                      Edit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Templates section */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-3 flex items-center gap-2"
          >
            <div className="h-5 w-1 rounded-full bg-amber-400" />
            <span className="text-sm font-medium text-amber-300">
              10 Built-in Templates
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Start automating in seconds
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 max-w-lg text-gray-400"
          >
            Pre-built workflows for the most common automation scenarios.
            One-click activate, customize as needed.
          </motion.p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {templates.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group rounded-lg border border-white/[0.06] bg-gray-950/50 p-4 transition-colors duration-200 hover:border-white/[0.1]"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10">
                    <t.icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {t.name}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {t.desc}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                    {t.trigger}
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-600 transition-colors group-hover:text-violet-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
