"use client";

import Link from "next/link";
import { Download, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { Tool } from "@/lib/types";
import { COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const categoryColor =
    COLORS.categories[tool.category as keyof typeof COLORS.categories];

  return (
    <Link href={`/tools/${tool.slug}`}>
      <div
        className={cn(
          "group relative flex h-full flex-col rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition-all duration-200 hover:border-white/[0.1] hover:shadow-lg hover:-translate-y-0.5",
          className
        )}
      >
        {/* Header: icon + name + verified */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{ backgroundColor: tool.iconBg }}
          >
            {tool.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-violet-400">
                {tool.name}
              </h3>
              {tool.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-violet-400" />
              )}
            </div>
            <p className="text-xs text-gray-400">
              by {tool.author.name}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className="border-none text-xs"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {tool.category}
          </Badge>
          {tool.pricing.model === "free" ? (
            <Badge
              variant="outline"
              className="border-none bg-emerald-500/10 text-xs text-emerald-400"
            >
              Free
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-none bg-amber-500/10 text-xs text-amber-400"
            >
              ${tool.pricing.price}/{tool.pricing.unit}
            </Badge>
          )}
        </div>

        {/* Footer: rating + installs */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          {tool.reviewCount > 0 ? (
            <RatingStars rating={tool.rating} count={tool.reviewCount} />
          ) : (
            <span className="text-xs text-gray-500">No reviews yet</span>
          )}
          {tool.installCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Download className="h-3 w-3" />
              {tool.installCount.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
