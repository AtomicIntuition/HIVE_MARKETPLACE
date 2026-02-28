export default function ToolDetailLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <span className="text-muted-foreground">/</span>
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <span className="text-muted-foreground">/</span>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 animate-pulse rounded-2xl bg-muted" />
              <div className="flex-1">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
                <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-5 w-40 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="mt-8 h-20 animate-pulse rounded-xl bg-muted" />
            <div className="mt-8 space-y-2">
              <div className="h-6 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
