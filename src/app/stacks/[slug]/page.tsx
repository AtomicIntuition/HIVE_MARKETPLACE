import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Layers,
  Rocket,
  Palette,
  ShoppingCart,
  BarChart3,
  Server,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { STACKS } from "@/lib/stacks";
import { getAllTools } from "@/lib/data";
import { StackConfigGenerator } from "@/components/stacks/stack-config-generator";
import { ToolCard } from "@/components/tools/tool-card";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-8 w-8" />,
  Layers: <Layers className="h-8 w-8" />,
  Rocket: <Rocket className="h-8 w-8" />,
  Palette: <Palette className="h-8 w-8" />,
  ShoppingCart: <ShoppingCart className="h-8 w-8" />,
  BarChart3: <BarChart3 className="h-8 w-8" />,
  Server: <Server className="h-8 w-8" />,
  Globe: <Globe className="h-8 w-8" />,
};

interface StackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stack = STACKS.find((s) => s.slug === slug);
  if (!stack) return {};

  return {
    title: `${stack.name} Stack — ${stack.toolSlugs.length} MCP Servers | Hive Market`,
    description: stack.description,
  };
}

export default async function StackPage({ params }: StackPageProps) {
  const { slug } = await params;
  const stack = STACKS.find((s) => s.slug === slug);
  if (!stack) notFound();

  const allTools = await getAllTools();
  const stackTools = stack.toolSlugs
    .map((s) => allTools.find((t) => t.slug === s))
    .filter(Boolean) as Awaited<ReturnType<typeof getAllTools>>;

  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/stacks"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Stacks
          </Link>
          <span>/</span>
          <span className="text-foreground">{stack.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="flex items-start gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: stack.color }}
              >
                {ICON_MAP[stack.icon]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {stack.name}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {stack.description}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary">
                    {stackTools.length} tools
                  </Badge>
                  {stack.popular && (
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                About this stack
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {stack.longDescription}
              </p>
            </div>

            {/* Tools in this stack */}
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Tools included ({stackTools.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {stackTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — Config Generator */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <StackConfigGenerator
                stackName={stack.name}
                tools={stackTools}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
