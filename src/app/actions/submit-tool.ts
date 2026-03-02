"use server";

import { z } from "zod/v4";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { auditToolSubmission } from "@/lib/audit-tool";
import { generateAIReview, CLAUDE_REVIEWER } from "@/lib/review-tool";

const envVarSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean(),
  placeholder: z.string().optional(),
});

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
    envVars: (formData.get("envVars") as string) || "[]",
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

  const pricing = {
    model: data.pricingModel,
    ...(data.pricingModel !== "free" && data.pricingPrice
      ? { price: data.pricingPrice, unit: data.pricingUnit || "call" }
      : {}),
  };

  const author = {
    name: authorName,
    username: authorUsername,
    verified: false,
  };

  const envVars = data.envVars && data.envVars.length > 0 ? data.envVars : null;

  // Insert into tool_submissions with status "pending"
  const { error: subError } = await supabase
    .from("tool_submissions")
    .insert({
      id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      long_description: data.longDescription,
      category: data.category,
      author,
      pricing,
      tags: data.tags,
      features: data.features,
      github_url: data.githubUrl || null,
      docs_url: data.docsUrl || null,
      npm_package: data.npmPackage || null,
      install_command: data.installCommand,
      version: data.version,
      compatibility: data.compatibility,
      icon_bg: "#8B5CF6",
      env_vars: envVars,
      submitted_by: user.id,
      status: "pending",
      submitted_at: now,
    });

  if (subError) {
    return { error: `Submission failed: ${subError.message}` };
  }

  // Run AI audit (non-blocking to user — if it fails, submission stays pending)
  const audit = await auditToolSubmission({
    name: data.name,
    slug: data.slug,
    description: data.description,
    longDescription: data.longDescription,
    npmPackage: data.npmPackage,
    githubUrl: data.githubUrl,
    docsUrl: data.docsUrl,
    category: data.category,
  });

  if (audit.approved) {
    // Auto-approve: insert into tools table and update submission status
    const { error: toolError } = await supabase.from("tools").insert({
      id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      long_description: data.longDescription,
      category: data.category,
      author,
      pricing,
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
      env_vars: envVars,
    });

    if (toolError) {
      // Tool insert failed, but submission is saved — update notes
      await supabase
        .from("tool_submissions")
        .update({
          review_notes: `Audit passed but tool publish failed: ${toolError.message}`,
        })
        .eq("id", id);
    } else {
      await supabase
        .from("tool_submissions")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          review_notes: audit.summary,
        })
        .eq("id", id);

      // Generate AI review (non-blocking — failure never stops publication)
      try {
        // Upsert claude-reviewer profile
        await supabase.from("profiles").upsert(
          {
            id: CLAUDE_REVIEWER.id,
            username: CLAUDE_REVIEWER.username,
            display_name: CLAUDE_REVIEWER.displayName,
          },
          { onConflict: "id" }
        );

        const aiReview = await generateAIReview({
          name: data.name,
          slug: data.slug,
          description: data.description,
          longDescription: data.longDescription,
          category: data.category,
          features: data.features,
          tags: data.tags,
          npmPackage: data.npmPackage,
          githubUrl: data.githubUrl,
        });

        const reviewId = `review-ai-${data.slug}-${Date.now()}`;
        await supabase.from("reviews").insert({
          id: reviewId,
          tool_id: id,
          user_id: CLAUDE_REVIEWER.id,
          author_name: aiReview.authorName,
          author_username: aiReview.authorUsername,
          rating: aiReview.rating,
          text: aiReview.text,
        });

        // Update tool rating
        await supabase
          .from("tools")
          .update({
            rating: aiReview.rating,
            review_count: 1,
          })
          .eq("id", id);
      } catch (reviewError) {
        console.error("AI review generation failed (non-blocking):", reviewError);
      }
    }
  } else {
    // Flagged for manual review — keep as pending with audit notes
    await supabase
      .from("tool_submissions")
      .update({
        review_notes: `${audit.summary}\n\nFlags:\n${audit.flags.map((f) => `- ${f}`).join("\n")}`,
      })
      .eq("id", id);
  }

  redirect("/dashboard");
}
