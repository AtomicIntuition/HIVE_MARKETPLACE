"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ToolDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-20">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load tool</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t load this tool&apos;s details.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Link href="/tools">
            <Button variant="ghost">Browse Tools</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
