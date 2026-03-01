import { Shimmer, ToolCardSkeleton } from "@/components/ui/skeleton-shimmer";

export default function StackDetailLoading() {
  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 animate-skeleton-in">
          <Shimmer className="h-4 w-16" />
          <span className="text-muted-foreground/30">/</span>
          <Shimmer className="h-4 w-32" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="flex items-start gap-4 animate-skeleton-in" style={{ animationDelay: "50ms" }}>
              <Shimmer className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="space-y-3">
                <Shimmer className="h-8 w-52 rounded-lg" />
                <Shimmer className="h-4 w-80 max-w-full" />
                <div className="flex gap-2">
                  <Shimmer className="h-6 w-20 rounded-full" />
                  <Shimmer className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-8 space-y-3 animate-skeleton-in" style={{ animationDelay: "100ms" }}>
              <Shimmer className="h-6 w-36" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-2/3" />
            </div>

            {/* Tools */}
            <div className="mt-10 animate-skeleton-in" style={{ animationDelay: "150ms" }}>
              <Shimmer className="mb-4 h-6 w-40" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-skeleton-in"
                    style={{ animationDelay: `${200 + i * 50}ms` }}
                  >
                    <ToolCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="animate-skeleton-in" style={{ animationDelay: "100ms" }}>
              <Shimmer className="h-72 rounded-xl" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
