export default function PublishLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Hero skeleton */}
        <div className="mb-12">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-4 h-7 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />
            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
          </div>

          {/* Value prop card skeletons */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-gray-900/50 p-5"
              >
                <div className="mb-3 h-10 w-10 animate-pulse rounded-lg bg-muted" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* How it works skeleton */}
          <div className="mb-10 rounded-xl border border-white/[0.06] bg-gray-900/50 p-6">
            <div className="mx-auto mb-5 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="grid gap-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="mt-1 h-3 w-36 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form skeleton */}
        <div className="mb-8 flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl border border-border/50 bg-muted" />
      </div>
    </div>
  );
}
