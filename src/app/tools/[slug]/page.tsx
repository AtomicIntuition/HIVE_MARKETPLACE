import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, getRelatedTools } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { ToolDetail } from "@/components/tools/tool-detail";
import { ToolReviews } from "@/components/tools/tool-reviews";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};

  const category = CATEGORIES.find((c) => c.slug === tool.category);
  const ogUrl = `${SITE_CONFIG.url}/og?title=${encodeURIComponent(tool.name)}&description=${encodeURIComponent(tool.description)}&category=${encodeURIComponent(category?.name || "")}&rating=${tool.rating}`;

  return {
    ...createMetadata({
      title: `${tool.name} — ${tool.description.slice(0, 60)}`,
      description: tool.description,
      path: `/tools/${tool.slug}`,
      ogImage: ogUrl,
    }),
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: tool.pricing.model === "free"
          ? { "@type": "Offer", price: "0", priceCurrency: "USD" }
          : {
              "@type": "Offer",
              price: String(tool.pricing.price),
              priceCurrency: "USD",
            },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tool.rating,
          reviewCount: tool.reviewCount,
        },
        author: {
          "@type": "Organization",
          name: tool.author.name,
        },
        softwareVersion: tool.version,
      }),
    },
  };
}

async function getReviewsData(toolId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, author_name, author_username, rating, text, created_at")
      .eq("tool_id", toolId)
      .order("created_at", { ascending: false });

    let userHasReviewed = false;
    if (user && reviews) {
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("tool_id", toolId)
        .eq("user_id", user.id)
        .limit(1);
      userHasReviewed = (existing?.length ?? 0) > 0;
    }

    return {
      reviews: (reviews ?? []).map((r) => ({
        id: r.id,
        authorName: r.author_name,
        authorUsername: r.author_username,
        rating: r.rating,
        text: r.text,
        createdAt: r.created_at,
      })),
      userHasReviewed,
    };
  } catch {
    // DB not available (build time), return empty
    return { reviews: [], userHasReviewed: false };
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool);
  const { reviews, userHasReviewed } = await getReviewsData(tool.id);

  return (
    <ToolDetail
      tool={tool}
      relatedTools={relatedTools}
      reviewsSection={
        <ToolReviews
          toolId={tool.id}
          toolSlug={tool.slug}
          toolName={tool.name}
          reviews={reviews}
          userHasReviewed={userHasReviewed}
        />
      }
    />
  );
}
