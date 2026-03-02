"use server";

import { z } from "zod/v4";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const envVarSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean(),
  placeholder: z.string().optional(),
});

const updateToolSchema = z.object({
  submissionId: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters").max(300),
  longDescription: z.string().min(50, "Long description must be at least 50 characters"),
  category: z.enum([
    "payments",
    "communication",
    "data",
    "devtools",
    "productivity",
    "ai-ml",
    "content",
    "analytics",
  ]),
  tags: z.string().transform((val) =>
    val
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  ),
  githubUrl: z.union([z.url(), z.literal("")]).optional(),
  docsUrl: z.union([z.url(), z.literal("")]).optional(),
  npmPackage: z.string().max(255).optional(),
  installCommand: z.enum(["npx", "uvx"]).default("npx"),
  version: z.string().min(1, "Version is required").max(50),
  compatibility: z.array(z.string()).min(1, "Select at least one"),
  pricingModel: z.enum(["free", "per-call", "monthly"]),
  pricingPrice: z.coerce.number().min(0).optional(),
  pricingUnit: z.string().optional(),
  features: z.string().transform((val) =>
    val
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  ),
  envVars: z
    .string()
    .transform((val) => {
      if (!val) return [];
      try {
        return JSON.parse(val) as unknown[];
      } catch {
        return [];
      }
    })
    .pipe(z.array(envVarSchema))
    .optional(),
});

export interface UpdateToolState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
}

export async function updateTool(
  _prevState: UpdateToolState,
  formData: FormData
): Promise<UpdateToolState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update a tool." };
  }

  const raw = {
    submissionId: formData.get("submissionId") as string,
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    longDescription: formData.get("longDescription") as string,
    category: formData.get("category") as string,
    tags: formData.get("tags") as string,
    githubUrl: formData.get("githubUrl") as string,
    docsUrl: formData.get("docsUrl") as string,
    npmPackage: formData.get("npmPackage") as string,
    installCommand: (formData.get("installCommand") as string) || "npx",
    version: formData.get("version") as string,
    compatibility: formData.getAll("compatibility") as string[],
    pricingModel: formData.get("pricingModel") as string,
    pricingPrice: formData.get("pricingPrice") as string,
    pricingUnit: formData.get("pricingUnit") as string,
    features: formData.get("features") as string,
    envVars: (formData.get("envVars") as string) || "[]",
  };

  const result = updateToolSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { fieldErrors };
  }

  const data = result.data;

  // Verify ownership
  const { data: submission } = await supabase
    .from("tool_submissions")
    .select("id, submitted_by, status")
    .eq("id", data.submissionId)
    .single();

  if (!submission) {
    return { error: "Submission not found." };
  }

  if (submission.submitted_by !== user.id) {
    return { error: "You do not have permission to edit this tool." };
  }

  const now = new Date().toISOString();
  const pricing = {
    model: data.pricingModel,
    ...(data.pricingModel !== "free" && data.pricingPrice
      ? { price: data.pricingPrice, unit: data.pricingUnit || "call" }
      : {}),
  };

  const envVars = data.envVars && data.envVars.length > 0 ? data.envVars : null;

  // Update the submission record
  const { error: subError } = await supabase
    .from("tool_submissions")
    .update({
      name: data.name,
      description: data.description,
      long_description: data.longDescription,
      category: data.category,
      pricing,
      tags: data.tags,
      features: data.features,
      github_url: data.githubUrl || null,
      docs_url: data.docsUrl || null,
      npm_package: data.npmPackage || null,
      install_command: data.installCommand,
      version: data.version,
      compatibility: data.compatibility,
      env_vars: envVars,
    })
    .eq("id", data.submissionId);

  if (subError) {
    return { error: `Update failed: ${subError.message}` };
  }

  // If the submission was approved, also update the tools table
  if (submission.status === "approved") {
    const { error: toolError } = await supabase
      .from("tools")
      .update({
        name: data.name,
        description: data.description,
        long_description: data.longDescription,
        category: data.category,
        pricing,
        tags: data.tags,
        features: data.features,
        github_url: data.githubUrl || null,
        docs_url: data.docsUrl || null,
        npm_package: data.npmPackage || null,
        install_command: data.installCommand,
        version: data.version,
        last_updated: now,
        compatibility: data.compatibility,
        env_vars: envVars,
      })
      .eq("id", data.submissionId);

    if (toolError) {
      return { error: `Tool update failed: ${toolError.message}` };
    }

    revalidatePath(`/tools/${data.slug}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
