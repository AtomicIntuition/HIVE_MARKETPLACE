import { Shimmer } from "@/components/ui/skeleton-shimmer";

export default function ToolDetailLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 animate-skeleton-in">
          <Shimmer className="h-4 w-14" />
          <span className="text-muted-foreground/30">/</span>
          <Shimmer className="h-4 w-20" />
          <span className="text-muted-foreground/30">/</span>
          <Shimmer className="h-4 w-28" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="flex items-start gap-4 animate-skeleton-in" style={{ animationDelay: "50ms" }}>
              <Shimmer className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Shimmer className="h-8 w-56 rounded-lg" />
                <Shimmer className="h-4 w-36" />
                <div className="flex gap-2">
                  <Shimmer className="h-6 w-16 rounded-full" />
                  <Shimmer className="h-6 w-20 rounded-full" />
                  <Shimmer className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-8 animate-skeleton-in" style={{ animationDelay: "100ms" }}>
              <Shimmer className="h-20 w-full rounded-xl" />
            </div>

            {/* Description */}
            <div className="mt-8 space-y-3 animate-skeleton-in" style={{ animationDelay: "150ms" }}>
              <Shimmer className="h-6 w-28" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-4 w-5/6" />
            </div>

            {/* Features */}
            <div className="mt-8 space-y-3 animate-skeleton-in" style={{ animationDelay: "200ms" }}>
              <Shimmer className="h-6 w-24" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Shimmer key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="animate-skeleton-in" style={{ animationDelay: "100ms" }}>
              <Shimmer className="h-44 rounded-xl" />
            </div>
            <div className="animate-skeleton-in" style={{ animationDelay: "150ms" }}>
              <Shimmer className="h-56 rounded-xl" />
            </div>
            <div className="animate-skeleton-in" style={{ animationDelay: "200ms" }}>
              <Shimmer className="h-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
