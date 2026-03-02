"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import { ToolGrid } from "./tool-grid";
import { ToolFilters } from "./tool-filters";
import { Tool, CategorySlug } from "@/lib/types";
import {
  filterTools,
  sortTools,
  searchToolsClient,
} from "@/lib/tool-utils";
import { cn } from "@/lib/utils";

interface ToolSearchProps {
  allTools?: Tool[];
}

export function ToolSearch({ allTools }: ToolSearchProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") as CategorySlug | null;
  const initialSort = searchParams.get("sort") || "popular";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | null>(
    initialCategory
  );
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTools = useMemo(() => {
    const tools = allTools ?? [];
    let result = query ? searchToolsClient(tools, query) : tools;
    result = filterTools(result, {
      category: selectedCategory || undefined,
      pricing: selectedPricing || undefined,
    });
    result = sortTools(
      result,
      selectedSort as "popular" | "newest" | "rating" | "name"
    );
    return result;
  }, [query, selectedCategory, selectedPricing, selectedSort, allTools]);

  const activeFiltersCount = [selectedCategory, selectedPricing].filter(
    Boolean
  ).length;

  return (
    <div>
      {/* Search + filter toggle */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1">
          <SearchBar
            defaultValue={query}
            onSearch={setQuery}
            placeholder="Search tools..."
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn("gap-2", showFilters && "bg-violet-500/10 text-violet-400 border-violet-500/20")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Active filters badges */}
      {(query || selectedCategory || selectedPricing) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
          </span>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-400"
            >
              &ldquo;{query}&rdquo;
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-400"
            >
              {selectedCategory}
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedPricing && (
            <button
              onClick={() => setSelectedPricing(null)}
              className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-400"
            >
              {selectedPricing}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Main layout: filters sidebar + grid */}
      <div className="flex gap-8">
        {showFilters && (
          <aside className="hidden w-56 shrink-0 md:block">
            <ToolFilters
              selectedCategory={selectedCategory}
              selectedPricing={selectedPricing}
              selectedSort={selectedSort}
              onCategoryChange={setSelectedCategory}
              onPricingChange={setSelectedPricing}
              onSortChange={setSelectedSort}
            />
          </aside>
        )}
        <div className="flex-1">
          <ToolGrid tools={filteredTools} />
        </div>
      </div>
    </div>
  );
}
