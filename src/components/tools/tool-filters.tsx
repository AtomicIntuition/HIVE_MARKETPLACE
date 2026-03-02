"use client";

import { CategorySlug } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ToolFiltersProps {
  selectedCategory: CategorySlug | null;
  selectedPricing: string | null;
  selectedSort: string;
  onCategoryChange: (cat: CategorySlug | null) => void;
  onPricingChange: (pricing: string | null) => void;
  onSortChange: (sort: string) => void;
}

export function ToolFilters({
  selectedCategory,
  selectedPricing,
  selectedSort,
  onCategoryChange,
  onPricingChange,
  onSortChange,
}: ToolFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Sort by
        </label>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-lg border border-white/[0.06] bg-gray-900 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      {/* Category filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
              !selectedCategory
                ? "bg-violet-500/10 text-violet-400"
                : "text-gray-400 hover:text-foreground"
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={cn(
                "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                selectedCategory === cat.slug
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-gray-400 hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Pricing
        </label>
        <div className="space-y-1">
          {[
            { value: null, label: "All" },
            { value: "free", label: "Free" },
            { value: "per-call", label: "Pay per call" },
            { value: "monthly", label: "Monthly" },
            { value: "tiered", label: "Tiered" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => onPricingChange(opt.value)}
              className={cn(
                "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                selectedPricing === opt.value
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-gray-400 hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
