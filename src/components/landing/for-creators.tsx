"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  {
    icon: Users,
    title: "Reach",
    description: "12,000+ developers building agents discover tools here daily.",
  },
  {
    icon: DollarSign,
    title: "Earn",
    description:
      "Set per-call or monthly pricing. We handle billing and payouts.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description:
      "Analytics, ratings, and promotion tools to grow your tool's audience.",
  },
];

export function ForCreators() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-violet-950/50 to-card">
          <div className="grid gap-12 p-8 md:grid-cols-2 md:p-12 lg:p-16">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                For Creators
              </div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Build Tools.{" "}
                <span className="text-amber-400">Earn Money.</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Publish your MCP server to reach thousands of agent developers.
                Set your price, track your analytics, get paid automatically.
              </p>

              <div className="mt-8 space-y-6">
                {BENEFITS.map((benefit, i) => (
                  <motion.div
                    key={benefit.title}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                      <benefit.icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link href="/docs">
                  <Button
                    size="lg"
                    className="gap-2 bg-amber-500 text-gray-950 hover:bg-amber-400"
                  >
                    Start Publishing
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: CLI preview */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-gray-950">
                <div className="flex items-center gap-1.5 border-b border-border/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    terminal
                  </span>
                </div>
                <div className="p-4 font-mono text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-amber-400">$</span> npx hive-market
                    publish ./my-mcp-server
                  </p>
                  <p className="mt-3 text-muted-foreground">
                    Validating MCP server spec...
                  </p>
                  <p className="text-emerald-400">
                    &#10003; Validated MCP server spec
                  </p>
                  <p className="text-emerald-400">
                    &#10003; Security scan passed
                  </p>
                  <p className="text-emerald-400">
                    &#10003; Published: my-tool v1.0.0
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    <span className="text-emerald-400">&#10003;</span> Live at:{" "}
                    <span className="text-violet-400">
                      market.hive.sh/tools/my-tool
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
