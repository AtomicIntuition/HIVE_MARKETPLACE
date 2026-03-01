import { Shimmer, ToolCardSkeleton } from "@/components/ui/skeleton-shimmer";

export default function ToolsLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 animate-skeleton-in">
          <Shimmer className="h-9 w-52 rounded-lg" />
          <Shimmer className="mt-3 h-5 w-80 rounded-lg" />
        </div>

        {/* Search bar */}
        <Shimmer className="mb-8 h-12 w-full rounded-xl animate-skeleton-in" style={{ animationDelay: "50ms" }} />

        {/* Filter pills */}
        <div className="mb-6 flex gap-2 animate-skeleton-in" style={{ animationDelay: "100ms" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="animate-skeleton-in"
              style={{ animationDelay: `${150 + i * 50}ms` }}
            >
              <ToolCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
