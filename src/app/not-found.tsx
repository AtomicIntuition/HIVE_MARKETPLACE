import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-7xl font-bold text-violet-400/20">404</h1>
      <p className="mt-4 text-xl font-semibold text-foreground">
        Page not found
      </p>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 w-full max-w-md">
        <SearchBar placeholder="Search for tools..." size="lg" />
      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
        <Link href="/tools">
          <Button className="bg-violet-600 text-white hover:bg-violet-700">
            Browse Tools
          </Button>
        </Link>
      </div>

      <div className="mt-12">
        <p className="mb-3 text-sm text-muted-foreground">Popular tools</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["GitHub", "Filesystem", "Slack", "PostgreSQL", "Puppeteer", "Notion"].map(
            (name) => (
              <Link
                key={name}
                href={`/tools?q=${name.toLowerCase()}`}
                className="rounded-full border border-border/50 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-violet-500/30 hover:text-violet-400"
              >
                {name}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
