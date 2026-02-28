export default function ToolsLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mb-6 h-10 w-full animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="mb-3 space-y-1">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
