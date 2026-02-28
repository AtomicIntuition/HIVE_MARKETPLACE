import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { PublishForm } from "./publish-form";

export const metadata: Metadata = createMetadata({
  title: "Publish a Tool",
  description: "Submit your MCP server to the Hive Market marketplace.",
  path: "/publish",
});

export default function PublishPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Publish a Tool</h1>
          <p className="mt-2 text-muted-foreground">
            Submit your MCP server to the Hive Market marketplace
          </p>
        </div>

        <PublishForm />
      </div>
    </div>
  );
}
