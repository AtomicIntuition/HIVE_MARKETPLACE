import { Shimmer, StackCardSkeleton } from "@/components/ui/skeleton-shimmer";

export default function StacksLoading() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <div className="mb-16 text-center animate-skeleton-in">
          <Shimmer className="mx-auto mb-4 h-16 w-16 rounded-2xl" />
          <Shimmer className="mx-auto h-12 w-56 rounded-lg" />
          <Shimmer className="mx-auto mt-4 h-5 w-96 max-w-full" />
        </div>

        {/* Popular Stacks */}
        <section className="mb-20 animate-skeleton-in" style={{ animationDelay: "50ms" }}>
          <Shimmer className="mb-6 h-6 w-36" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-skeleton-in"
                style={{ animationDelay: `${100 + i * 60}ms` }}
              >
                <StackCardSkeleton />
              </div>
            ))}
          </div>
        </section>

        {/* All Stacks */}
        <section className="mb-20 animate-skeleton-in" style={{ animationDelay: "150ms" }}>
          <Shimmer className="mb-6 h-6 w-28" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-skeleton-in"
                style={{ animationDelay: `${200 + i * 60}ms` }}
              >
                <StackCardSkeleton />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
