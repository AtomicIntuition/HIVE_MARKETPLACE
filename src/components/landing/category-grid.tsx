"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  MessageSquare,
  Database,
  Code,
  Calendar,
  Brain,
  Image,
  BarChart3,
} from "lucide-react";
import { Category } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard,
  MessageSquare,
  Database,
  Code,
  Calendar,
  Brain,
  Image,
  BarChart3,
};

interface CategoryGridProps {
  categories?: Category[];
}

export function CategoryGrid({ categories: categoriesProp }: CategoryGridProps) {
  const categories = categoriesProp ?? [];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground">
            Browse by Category
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find the right tools for your agent&apos;s capabilities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || Code;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/categories/${cat.slug}`}>
                  <div className="group flex flex-col items-center rounded-xl border border-border/50 bg-card p-6 text-center transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: cat.color }}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cat.toolCount} tools
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
