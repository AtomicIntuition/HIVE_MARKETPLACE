"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-20">
      <div className="text-center">
        <div className="mb-4 text-6xl font-bold text-muted-foreground/20">Error</div>
        <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={reset} variant="outline" className="mt-6">
          Try Again
        </Button>
      </div>
    </div>
  );
}
