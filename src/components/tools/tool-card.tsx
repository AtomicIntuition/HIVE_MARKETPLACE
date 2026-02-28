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
          "group relative flex h-full flex-col rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-violet-500/5",
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
              <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-violet-400 transition-colors">
                {tool.name}
              </h3>
              {tool.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-violet-400" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              by {tool.author.name}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
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
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
          <RatingStars rating={tool.rating} count={tool.reviewCount} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="h-3 w-3" />
            {tool.installCount.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
