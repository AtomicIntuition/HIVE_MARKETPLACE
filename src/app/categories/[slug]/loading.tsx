export default function CategoryLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <span className="text-muted-foreground">/</span>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-8 flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-muted" />
          <div>
            <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border border-border/50 bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
