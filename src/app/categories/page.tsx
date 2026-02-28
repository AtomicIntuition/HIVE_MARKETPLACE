import { Metadata } from "next";
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
  ArrowRight,
} from "lucide-react";
import { getAllCategoriesWithCounts } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Categories",
  description:
    "Browse MCP tools by category — Payments, Communication, Data, Developer Tools, Productivity, AI & ML, Content, and Analytics.",
  path: "/categories",
});

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

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCounts();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Browse MCP tools by category
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Code;
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                <div className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: cat.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-foreground">
                        {cat.name}
                      </h2>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                    <p className="mt-2 text-sm font-medium" style={{ color: cat.color }}>
                      {cat.toolCount} tools
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
