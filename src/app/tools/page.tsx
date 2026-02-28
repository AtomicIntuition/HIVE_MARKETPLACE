import { Suspense } from "react";
import { Metadata } from "next";
import { ToolSearch } from "@/components/tools/tool-search";
import { createMetadata } from "@/lib/metadata";
import { getAllTools } from "@/lib/data";

export const metadata: Metadata = createMetadata({
  title: "Browse Tools",
  description:
    "Discover MCP-compatible tools for your AI agents. Search and filter hundreds of integrations for payments, communication, data, and more.",
  path: "/tools",
});

export default async function ToolsPage() {
  const allTools = await getAllTools();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Browse Tools</h1>
          <p className="mt-2 text-muted-foreground">
            Discover MCP-compatible tools for your AI agents
          </p>
        </div>

        {/* Search + filters + grid */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          }
        >
          <ToolSearch allTools={allTools} />
        </Suspense>
      </div>
    </div>
  );
}
