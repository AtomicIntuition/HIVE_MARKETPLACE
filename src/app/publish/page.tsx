import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getMarketplaceStats } from "@/lib/data";
import { PublishHero } from "@/components/publish/publish-hero";
import { PublishForm } from "./publish-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Publish a Tool",
  description: "Submit your MCP server to the Hive Market marketplace.",
  path: "/publish",
});

export default async function PublishPage() {
  const stats = await getMarketplaceStats();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-6">
        <PublishHero stats={stats} />
        <PublishForm />
      </div>
    </div>
  );
}
