import Link from "next/link";
import { DealCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<DealCategory | "all", string> = {
  all: "All deals",
  software: "Software",
  streaming: "Streaming",
  education: "Education",
  health: "Health",
  food: "Food",
  travel: "Travel",
};

interface CategoryFilterProps {
  activeCategory: DealCategory | "all";
  dealCounts: Partial<Record<DealCategory | "all", number>>;
}

export default function CategoryFilter({ activeCategory, dealCounts }: CategoryFilterProps) {
  const categories = (Object.keys(CATEGORY_LABELS) as (DealCategory | "all")[]).filter(
    (c) => c === "all" || (dealCounts[c] ?? 0) > 0
  );

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const count = dealCounts[cat] ?? 0;
        return (
          <Link
            key={cat}
            href={cat === "all" ? "/deals" : `/deals?category=${cat}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
              isActive
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
            )}
          >
            {CATEGORY_LABELS[cat]}
            <span
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5",
                isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
              )}
            >
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
