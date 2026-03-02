import Link from "next/link";
import {
  Zap,
  Layers,
  Rocket,
  Globe,
  ArrowRight,
  Boxes,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PREVIEW_STACKS = [
  {
    name: "Vibe Coder Starter",
    slug: "vibe-coder-starter",
    description: "Real-time docs, reasoning, memory, and project access",
    icon: <Zap className="h-5 w-5" />,
    color: "#8B5CF6",
    toolCount: 6,
  },
  {
    name: "Full-Stack Web App",
    slug: "full-stack-web",
    description: "Database, deployment, testing, monitoring, payments",
    icon: <Layers className="h-5 w-5" />,
    color: "#3B82F6",
    toolCount: 6,
  },
  {
    name: "SaaS Operations",
    slug: "saas-operations",
    description: "Billing, issue tracking, alerts, analytics, email",
    icon: <Rocket className="h-5 w-5" />,
    color: "#F59E0B",
    toolCount: 6,
  },
  {
    name: "Web Research & Scraping",
    slug: "web-research",
    description: "Crawl, search, automate browsers, extract data",
    icon: <Globe className="h-5 w-5" />,
    color: "#8B5CF6",
    toolCount: 6,
  },
];

export function StacksPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <Boxes className="h-6 w-6 text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            MCP Stacks
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Pre-built bundles of MCP servers. One click to copy the config for
            your entire workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_STACKS.map((stack) => (
            <Link
              key={stack.slug}
              href={`/stacks/${stack.slug}`}
              className="group flex h-full flex-col rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition-all duration-200 hover:border-white/[0.1] hover:shadow-lg hover:-translate-y-0.5"
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: stack.color }}
              >
                {stack.icon}
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-violet-400">
                {stack.name}
              </h3>
              <p className="mb-3 flex-1 text-xs text-gray-400">
                {stack.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {stack.toolCount} tools
                </Badge>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-violet-400" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/stacks">
            <Button
              variant="outline"
              className="gap-2 border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
            >
              View All Stacks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
