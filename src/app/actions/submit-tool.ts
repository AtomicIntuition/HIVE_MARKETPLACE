"use server";

import { z } from "zod/v4";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const toolSubmissionSchema = z.object({
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
});

export interface SubmitToolState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
}

export async function submitTool(
  _prevState: SubmitToolState,
  formData: FormData
): Promise<SubmitToolState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to submit a tool." };
  }

  const raw = {
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
  };

  const result = toolSubmissionSchema.safeParse(raw);

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
  const id = `tool-${data.slug}-${Date.now()}`;
  const now = new Date().toISOString();

  // Get user profile info for author
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  const authorName = profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown";
  const authorUsername = profile?.username || user.user_metadata?.user_name || user.email?.split("@")[0] || "unknown";

  const toolData = {
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    long_description: data.longDescription,
    category: data.category,
    author: {
      name: authorName,
      username: authorUsername,
      verified: false,
    },
    pricing: {
      model: data.pricingModel,
      ...(data.pricingModel !== "free" && data.pricingPrice
        ? { price: data.pricingPrice, unit: data.pricingUnit || "call" }
        : {}),
    },
    tags: data.tags,
    features: data.features,
    github_url: data.githubUrl || null,
    docs_url: data.docsUrl || null,
    npm_package: data.npmPackage || null,
    install_command: data.installCommand,
    version: data.version,
    compatibility: data.compatibility,
    icon_bg: "#8B5CF6",
    submitted_by: user.id,
    status: "approved",
    submitted_at: now,
    reviewed_at: now,
  };

  // Insert into tool_submissions
  const { error: subError } = await supabase
    .from("tool_submissions")
    .insert(toolData);

  if (subError) {
    return { error: `Submission failed: ${subError.message}` };
  }

  // Auto-approve: also insert into tools table
  const { error: toolError } = await supabase.from("tools").insert({
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    long_description: data.longDescription,
    category: data.category,
    author: {
      name: authorName,
      username: authorUsername,
      verified: false,
    },
    pricing: {
      model: data.pricingModel,
      ...(data.pricingModel !== "free" && data.pricingPrice
        ? { price: data.pricingPrice, unit: data.pricingUnit || "call" }
        : {}),
    },
    rating: 0,
    review_count: 0,
    install_count: 0,
    weekly_installs: 0,
    version: data.version,
    last_updated: now,
    created_at: now,
    tags: data.tags,
    features: data.features,
    github_url: data.githubUrl || null,
    docs_url: data.docsUrl || null,
    icon_bg: "#8B5CF6",
    verified: false,
    trending: false,
    featured: false,
    compatibility: data.compatibility,
    npm_package: data.npmPackage || null,
    install_command: data.installCommand,
  });

  if (toolError) {
    return { error: `Failed to publish tool: ${toolError.message}` };
  }

  redirect(`/tools/${data.slug}`);
}
