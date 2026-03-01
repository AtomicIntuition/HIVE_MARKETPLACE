import { Shimmer, CategoryCardSkeleton } from "@/components/ui/skeleton-shimmer";

export default function CategoriesLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 animate-skeleton-in">
          <Shimmer className="h-9 w-44 rounded-lg" />
          <Shimmer className="mt-3 h-5 w-72 rounded-lg" />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-skeleton-in"
              style={{ animationDelay: `${50 + i * 50}ms` }}
            >
              <CategoryCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
