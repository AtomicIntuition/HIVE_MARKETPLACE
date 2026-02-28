import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({
  rating,
  count,
  size = "sm",
  className,
}: RatingStarsProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) {
            return (
              <Star
                key={i}
                className={cn(iconSize, "fill-amber-400 text-amber-400")}
              />
            );
          }
          if (i === full && hasHalf) {
            return (
              <StarHalf
                key={i}
                className={cn(iconSize, "fill-amber-400 text-amber-400")}
              />
            );
          }
          return (
            <Star
              key={i}
              className={cn(iconSize, "text-gray-600")}
            />
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
