import { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { apiSuccess, apiError, handleCors } from "@/lib/api-utils";
import { validateApiKey } from "@/lib/api-keys";
import { auditToolSubmission } from "@/lib/audit-tool";
import { generateAIReview, CLAUDE_REVIEWER } from "@/lib/review-tool";

/** Admin client that bypasses RLS */
function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const VALID_CATEGORIES = [
  "payments",
  "communication",
  "data",
  "devtools",
  "productivity",
  "ai-ml",
  "content",
  "analytics",
] as const;

const VALID_INSTALL_COMMANDS = ["npx", "uvx"] as const;
const VALID_PRICING_MODELS = ["free", "per-call", "monthly"] as const;

export async function POST(request: NextRequest) {
  try {
    // Authenticate via API key
    const authHeader = request.headers.get("authorization");
    const keyResult = await validateApiKey(authHeader);

    if (!keyResult.valid || !keyResult.userId) {
      return apiError(
        "Authentication required. Provide Authorization: Bearer hm_sk_... API key.",
        401
      );
    }

    const body = await request.json();

    // Validate required fields
    const {
      name,
      slug,
      description,
      longDescription,
      category,
      tags,
      features,
      version,
      compatibility,
      npmPackage,
      installCommand,
      githubUrl,
      docsUrl,
      pricingModel,
      pricingPrice,
      pricingUnit,
      envVars,
      authorName,
      authorUsername,
    } = body;

    if (!name || typeof name !== "string" || name.length < 2 || name.length > 100) {
      return apiError("name is required (2-100 characters)", 400);
    }

    if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug) || slug.length < 2 || slug.length > 100) {
      return apiError("slug is required (2-100 chars, lowercase letters, numbers, hyphens)", 400);
    }

    if (!description || typeof description !== "string" || description.length < 10 || description.length > 300) {
      return apiError("description is required (10-300 characters)", 400);
    }

    if (!longDescription || typeof longDescription !== "string" || longDescription.length < 50) {
      return apiError("longDescription is required (min 50 characters)", 400);
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return apiError(`category must be one of: ${VALID_CATEGORIES.join(", ")}`, 400);
    }

    if (!version || typeof version !== "string") {
      return apiError("version is required", 400);
    }

    if (!compatibility || !Array.isArray(compatibility) || compatibility.length === 0) {
      return apiError("compatibility is required (array of supported clients, e.g. ['Claude Desktop', 'Cursor'])", 400);
    }

    if (!authorName || typeof authorName !== "string") {
      return apiError("authorName is required", 400);
    }

    if (!authorUsername || typeof authorUsername !== "string") {
      return apiError("authorUsername is required", 400);
    }

    const validInstallCmd = VALID_INSTALL_COMMANDS.includes(installCommand) ? installCommand : "npx";
    const validPricingModel = VALID_PRICING_MODELS.includes(pricingModel) ? pricingModel : "free";

    const parsedTags = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === "string") : [];
    const parsedFeatures = Array.isArray(features) ? features.filter((f: unknown) => typeof f === "string") : [];

    // Validate envVars shape if provided
    let parsedEnvVars = null;
    if (envVars && Array.isArray(envVars)) {
      parsedEnvVars = envVars
        .filter(
          (v: Record<string, unknown>) =>
            typeof v === "object" &&
            v !== null &&
            typeof v.name === "string" &&
            typeof v.description === "string" &&
            typeof v.required === "boolean"
        )
        .map((v: Record<string, unknown>) => ({
          name: v.name as string,
          description: v.description as string,
          required: v.required as boolean,
          placeholder: typeof v.placeholder === "string" ? v.placeholder : undefined,
        }));
      if (parsedEnvVars.length === 0) parsedEnvVars = null;
    }

    const admin = createAdminClient();
    const id = `tool-${slug}-${Date.now()}`;
    const now = new Date().toISOString();

    const pricing = {
      model: validPricingModel,
      ...(validPricingModel !== "free" && pricingPrice
        ? { price: Number(pricingPrice), unit: pricingUnit || "call" }
        : {}),
    };

    const author = {
      name: authorName,
      username: authorUsername,
      verified: false,
    };

    // Upsert agent profile so FK constraint is satisfied
    await admin.from("profiles").upsert(
      {
        id: `agent-${keyResult.userId}-${authorUsername}`,
        username: authorUsername,
        display_name: authorName,
      },
      { onConflict: "id" }
    );

    // Insert into tool_submissions
    const { error: subError } = await admin.from("tool_submissions").insert({
      id,
      name,
      slug,
      description,
      long_description: longDescription,
      category,
      author,
      pricing,
      tags: parsedTags,
      features: parsedFeatures,
      github_url: githubUrl || null,
      docs_url: docsUrl || null,
      npm_package: npmPackage || null,
      install_command: validInstallCmd,
      version,
      compatibility,
      icon_bg: "#8B5CF6",
      env_vars: parsedEnvVars,
      submitted_by: `agent-${keyResult.userId}-${authorUsername}`,
      status: "pending",
      submitted_at: now,
    });

    if (subError) {
      if (subError.code === "23505") {
        return apiError("A tool with this slug already exists", 409);
      }
      return apiError(`Submission failed: ${subError.message}`, 500);
    }

    // Run AI audit
    const audit = await auditToolSubmission({
      name,
      slug,
      description,
      longDescription,
      npmPackage,
      githubUrl,
      docsUrl,
      category,
    });

    if (audit.approved) {
      // Auto-approve: insert into tools table
      const { error: toolError } = await admin.from("tools").insert({
        id,
        name,
        slug,
        description,
        long_description: longDescription,
        category,
        author,
        pricing,
        rating: 0,
        review_count: 0,
        install_count: 0,
        weekly_installs: 0,
        version,
        last_updated: now,
        created_at: now,
        tags: parsedTags,
        features: parsedFeatures,
        github_url: githubUrl || null,
        docs_url: docsUrl || null,
        icon_bg: "#8B5CF6",
        verified: false,
        trending: false,
        featured: false,
        compatibility,
        npm_package: npmPackage || null,
        install_command: validInstallCmd,
        env_vars: parsedEnvVars,
      });

      if (toolError) {
        await admin
          .from("tool_submissions")
          .update({
            review_notes: `Audit passed but tool publish failed: ${toolError.message}`,
          })
          .eq("id", id);

        return apiSuccess(
          {
            id,
            slug,
            status: "pending",
            message: "Submission saved but auto-publish failed. It will be reviewed manually.",
            audit: { approved: true, summary: audit.summary },
          },
          202
        );
      }

      // Mark submission approved
      await admin
        .from("tool_submissions")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          review_notes: audit.summary,
        })
        .eq("id", id);

      // Generate AI review (non-blocking)
      generateAIReviewForTool(admin, id, {
        name,
        slug,
        description,
        longDescription,
        category,
        features: parsedFeatures,
        tags: parsedTags,
        npmPackage,
        githubUrl,
      }).catch(() => {});

      return apiSuccess(
        {
          id,
          slug,
          status: "approved",
          message: "Tool approved and published!",
          audit: { approved: true, summary: audit.summary },
        },
        201
      );
    }

    // Flagged — stays pending
    await admin
      .from("tool_submissions")
      .update({
        review_notes: `${audit.summary}\n\nFlags:\n${audit.flags.map((f) => `- ${f}`).join("\n")}`,
      })
      .eq("id", id);

    return apiSuccess(
      {
        id,
        slug,
        status: "pending",
        message: "Submission received but flagged for review.",
        audit: { approved: false, summary: audit.summary, flags: audit.flags },
      },
      202
    );
  } catch (e) {
    console.error("API /tools/submit POST error:", e);
    return apiError("Failed to submit tool", 500);
  }
}

/** Fire-and-forget AI review generation */
async function generateAIReviewForTool(
  admin: ReturnType<typeof createAdminClient>,
  toolId: string,
  input: {
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    category: string;
    features: string[];
    tags: string[];
    npmPackage?: string;
    githubUrl?: string;
  }
) {
  await admin.from("profiles").upsert(
    {
      id: CLAUDE_REVIEWER.id,
      username: CLAUDE_REVIEWER.username,
      display_name: CLAUDE_REVIEWER.displayName,
    },
    { onConflict: "id" }
  );

  const aiReview = await generateAIReview(input);
  const reviewId = `review-ai-${input.slug}-${Date.now()}`;

  await admin.from("reviews").insert({
    id: reviewId,
    tool_id: toolId,
    user_id: CLAUDE_REVIEWER.id,
    author_name: aiReview.authorName,
    author_username: aiReview.authorUsername,
    rating: aiReview.rating,
    text: aiReview.text,
  });

  await admin
    .from("tools")
    .update({
      rating: aiReview.rating,
      review_count: 1,
    })
    .eq("id", toolId);
}

export async function OPTIONS() {
  return handleCors();
}
