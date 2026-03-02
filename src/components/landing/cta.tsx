"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-950/60 via-gray-900 to-amber-950/30 p-12 text-center md:p-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {/* Background effect */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
            <div className="absolute right-1/3 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-amber-500/[0.06] blur-[80px]" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to supercharge your agents?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-gray-300">
              Discover and connect MCP tools to your AI agents in seconds.
              Browse the marketplace or publish your own.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                <Button size="lg" variant="outline" className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                  Publish Your Tool
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
