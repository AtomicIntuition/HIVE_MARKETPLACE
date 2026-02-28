export default function PublishLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mb-8 flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              <div className="hidden h-4 w-16 animate-pulse rounded bg-muted sm:block" />
            </div>
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl border border-border/50 bg-muted" />
      </div>
    </div>
  );
}
