"use client";

import { motion } from "framer-motion";
import { Download, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_RELEASE_URL =
  "https://github.com/AtomicIntuition/hive-desktop/releases/latest";

export function DesktopCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-gray-900 to-gray-950" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-violet-600/[0.08] blur-[80px]" />
            <div className="absolute -left-20 -bottom-20 h-[250px] w-[250px] rounded-full bg-amber-500/[0.05] blur-[80px]" />
          </div>

          <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
              Ready to automate?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mx-auto mt-4 max-w-lg text-gray-400 leading-relaxed"
            >
              Download Hive Desktop, connect your MCP tools, and build your
              first workflow in minutes. Everything runs locally — no account
              required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href={GITHUB_RELEASE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <Github className="h-4 w-4" />
                  Star on GitHub
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mx-auto mt-8 flex max-w-md items-center justify-center gap-6 text-xs text-gray-500"
            >
              <span>macOS (Apple Silicon + Intel)</span>
              <span className="h-3 w-px bg-gray-700" />
              <span>MIT License</span>
              <span className="h-3 w-px bg-gray-700" />
              <span>327 Tests</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
