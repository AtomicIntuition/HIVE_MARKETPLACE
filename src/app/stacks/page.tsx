import { Metadata } from "next";
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
  ArrowRight,
  Boxes,
} from "lucide-react";
import { STACKS } from "@/lib/stacks";
import { Badge } from "@/components/ui/badge";
import { BuildYourStack } from "@/components/stacks/build-your-stack";
import { getAllTools } from "@/lib/data";

export const metadata: Metadata = {
  title: "Stacks — Curated MCP Bundles | Hive Market",
  description:
    "Pre-built MCP server bundles for vibe coders. One click to copy the config for your entire stack.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-6 w-6" />,
  Layers: <Layers className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  ShoppingCart: <ShoppingCart className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
  Server: <Server className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
};

export default async function StacksPage() {
  const allTools = await getAllTools();

  return (
    <main className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Boxes className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            MCP Stacks
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Curated bundles of MCP servers for every workflow. Pick a stack,
            copy one config, and your AI agent is fully loaded.
          </p>
        </div>

        {/* Popular Stacks */}
        <section className="mb-20">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Popular Stacks
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STACKS.filter((s) => s.popular).map((stack) => {
              const toolCount = stack.toolSlugs.length;
              return (
                <Link
                  key={stack.id}
                  href={`/stacks/${stack.slug}`}
                  className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: stack.color }}
                  >
                    {ICON_MAP[stack.icon]}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-violet-400 transition-colors">
                    {stack.name}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {stack.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{toolCount} tools</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Stacks */}
        <section className="mb-20">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            All Stacks
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STACKS.filter((s) => !s.popular).map((stack) => {
              const toolCount = stack.toolSlugs.length;
              return (
                <Link
                  key={stack.id}
                  href={`/stacks/${stack.slug}`}
                  className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: stack.color }}
                  >
                    {ICON_MAP[stack.icon]}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-violet-400 transition-colors">
                    {stack.name}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {stack.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{toolCount} tools</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Build Your Own */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Build Your Own Stack
            </h2>
            <p className="mt-1 text-muted-foreground">
              Pick the exact MCPs you need and generate a single config to paste
              into Claude Desktop, Cursor, or Windsurf.
            </p>
          </div>
          <BuildYourStack tools={allTools} />
        </section>
      </div>
    </main>
  );
}
