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
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-violet-950/80 via-card to-amber-950/30 p-12 text-center md:p-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Background effect */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Ready to supercharge your agents?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Join thousands of developers discovering and connecting MCP tools.
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
              <Link href="/docs">
                <Button size="lg" variant="outline" className="gap-2">
                  Publish a Tool
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
