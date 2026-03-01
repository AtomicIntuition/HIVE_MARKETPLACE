import { Shimmer, ToolCardSkeleton } from "@/components/ui/skeleton-shimmer";

export default function CategoryLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 animate-skeleton-in">
          <Shimmer className="h-4 w-20" />
          <span className="text-muted-foreground/30">/</span>
          <Shimmer className="h-4 w-28" />
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4 animate-skeleton-in" style={{ animationDelay: "50ms" }}>
          <Shimmer className="h-14 w-14 shrink-0 rounded-2xl" />
          <div className="space-y-3">
            <Shimmer className="h-8 w-44 rounded-lg" />
            <Shimmer className="h-4 w-64" />
          </div>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-skeleton-in"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              <ToolCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
