import { Metadata } from "next";
import { notFound } from "next/navigation";
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
import {
  getToolsByCategory,
  getCategoryWithCount,
} from "@/lib/data";
import { CategorySlug } from "@/lib/types";
import { createMetadata } from "@/lib/metadata";
import { ToolCard } from "@/components/tools/tool-card";

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

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryWithCount(slug as CategorySlug);
  if (!category) return {};

  return createMetadata({
    title: `${category.name} Tools`,
    description: `${category.description}. Browse ${category.toolCount} MCP-compatible ${category.name.toLowerCase()} tools for AI agents.`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryWithCount(slug as CategorySlug);
  if (!category) notFound();

  const tools = await getToolsByCategory(slug as CategorySlug);
  const Icon = ICON_MAP[category.icon] || Code;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/categories"
            className="hover:text-foreground transition-colors"
          >
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category header */}
        <div className="mb-8 flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <Icon className="h-7 w-7" style={{ color: category.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {category.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {category.description} &middot; {category.toolCount} tools
            </p>
          </div>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {tools.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              No tools in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
