import { Shimmer, ToolCardSkeleton, CategoryCardSkeleton } from "@/components/ui/skeleton-shimmer";

export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Shimmer className="mx-auto h-8 w-48 rounded-full" />
          <Shimmer className="mx-auto mt-6 h-14 w-[32rem] max-w-full rounded-xl" />
          <Shimmer className="mx-auto mt-4 h-6 w-96 max-w-full" />
          <div className="mx-auto mt-8 flex justify-center gap-4">
            <Shimmer className="h-12 w-40 rounded-xl" />
            <Shimmer className="h-12 w-36 rounded-xl" />
          </div>
          {/* Search bar */}
          <Shimmer className="mx-auto mt-10 h-14 w-[36rem] max-w-full rounded-xl" />
        </div>
      </section>

      {/* Featured tools skeleton */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 animate-skeleton-in">
            <Shimmer className="h-8 w-48 rounded-lg" />
            <Shimmer className="mt-3 h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-skeleton-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ToolCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories skeleton */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 animate-skeleton-in">
            <Shimmer className="h-8 w-40 rounded-lg" />
            <Shimmer className="mt-3 h-5 w-60" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-skeleton-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <CategoryCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
