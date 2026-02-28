export default function DashboardLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-5 w-56 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card p-6"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-9 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
