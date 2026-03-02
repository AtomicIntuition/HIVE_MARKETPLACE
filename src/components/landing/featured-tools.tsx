"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { Tool } from "@/lib/types";

interface FeaturedToolsProps {
  trendingTools?: Tool[];
  featuredTools?: Tool[];
}

export function FeaturedTools({ trendingTools, featuredTools }: FeaturedToolsProps) {
  const trending = (trendingTools ?? []).slice(0, 4);
  const featured = (featuredTools ?? []).slice(0, 4);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Trending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1 rounded-full bg-amber-400" />
              <Flame className="h-5 w-5 text-amber-400" />
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Trending Tools
              </h2>
            </div>
            <Link
              href="/tools?sort=popular"
              className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1 rounded-full bg-violet-500" />
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Featured Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-foreground"
            >
              Browse all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
