"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function CategoryDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Failed to load category
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We couldn&apos;t load this category&apos;s tools. Please try again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/categories">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
