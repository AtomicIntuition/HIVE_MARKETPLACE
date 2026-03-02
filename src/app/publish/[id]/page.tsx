import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { PublishForm, PublishFormInitialData } from "../publish-form";

export const metadata: Metadata = createMetadata({
  title: "Edit Tool",
  description: "Edit your MCP server submission on Hive Market.",
  path: "/publish",
});

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditToolPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: submission } = await supabase
    .from("tool_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) {
    notFound();
  }

  if (submission.submitted_by !== user.id) {
    redirect("/dashboard");
  }

  const pricing = submission.pricing as { model?: string; price?: number; unit?: string } | null;
  const envVarsRaw = submission.env_vars as Array<{
    name: string;
    description: string;
    required: boolean;
    placeholder?: string;
  }> | null;

  const initialData: PublishFormInitialData = {
    id: submission.id,
    name: submission.name,
    slug: submission.slug,
    description: submission.description,
    longDescription: submission.long_description,
    category: submission.category,
    tags: (submission.tags ?? []).join(", "),
    features: (submission.features ?? []).join(", "),
    githubUrl: submission.github_url ?? "",
    docsUrl: submission.docs_url ?? "",
    npmPackage: submission.npm_package ?? "",
    installCommand: (submission.install_command as "npx" | "uvx") ?? "npx",
    version: submission.version,
    compatibility: submission.compatibility ?? [],
    pricingModel: pricing?.model ?? "free",
    pricingPrice: pricing?.price?.toString() ?? "",
    pricingUnit: pricing?.unit ?? "call",
    envVars: (envVarsRaw ?? []).map((ev) => ({
      name: ev.name,
      description: ev.description,
      required: ev.required,
      placeholder: ev.placeholder ?? "",
    })),
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Tool</h1>
          <p className="mt-2 text-muted-foreground">
            Update your MCP server submission
          </p>
        </div>

        <PublishForm initialData={initialData} editMode />
      </div>
    </div>
  );
}
