"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  size?: "default" | "lg";
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  size = "default",
  className,
  placeholder = "Search tools... (e.g. payments, email, database)",
  defaultValue = "",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(query);
      } else if (query.trim()) {
        router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, onSearch, router]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "search-glow group relative flex items-center rounded-xl border border-border/50 bg-surface transition-all",
        size === "lg" && "rounded-2xl",
        className
      )}
    >
      <Search
        className={cn(
          "absolute left-4 text-muted-foreground transition-colors group-focus-within:text-violet-400",
          size === "lg" ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none",
          size === "lg"
            ? "py-4 pl-12 pr-4 text-base md:text-lg"
            : "py-2.5 pl-10 pr-4 text-base md:text-sm"
        )}
      />
      {query && (
        <button
          type="submit"
          className={cn(
            "mr-2 shrink-0 rounded-lg bg-violet-600 px-4 font-medium text-white transition-colors hover:bg-violet-700",
            size === "lg" ? "py-2 text-sm" : "py-1.5 text-xs"
          )}
        >
          Search
        </button>
      )}
    </form>
  );
}
