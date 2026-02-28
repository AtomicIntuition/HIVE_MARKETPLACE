"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ToolsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-20">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load tools</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t load the tool data. Please try again.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="ghost">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
