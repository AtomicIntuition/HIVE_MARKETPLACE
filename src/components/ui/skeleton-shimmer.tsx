import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Shimmer({ className, style }: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted/60",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      style={style}
    />
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-28" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
      <div className="mb-4 space-y-2">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-3 w-12" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <Shimmer className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-4 w-16" />
      </div>
    </div>
  );
}

export function StackCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <Shimmer className="mb-4 h-12 w-12 rounded-xl" />
      <Shimmer className="mb-2 h-5 w-36" />
      <Shimmer className="mb-1 h-3 w-full" />
      <Shimmer className="mb-4 h-3 w-3/4" />
      <Shimmer className="h-5 w-20 rounded-full" />
    </div>
  );
}

export function HiveSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  const dotSize = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-3 w-3" };

  return (
    <div className={cn("relative", sizeMap[size])}>
      {/* Hex dots spinning */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div
          key={deg}
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `rotate(${deg}deg) translateY(-120%)`,
            animation: `hive-pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
          }}
        >
          <div
            className={cn(
              dotSize[size],
              "rounded-full bg-amber-400",
              "-translate-x-1/2 -translate-y-1/2"
            )}
          />
        </div>
      ))}
    </div>
  );
}
