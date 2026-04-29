import { DEALS, getAllCategories } from "@/lib/deals-data";
import { DealCategory } from "@/types";
import CategoryFilter from "@/components/deals/CategoryFilter";
import DealGrid from "@/components/deals/DealGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DealsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const categories = getAllCategories();
  const requestedCategory = params.category;
  const isValidCategory =
    !requestedCategory || (categories as string[]).includes(requestedCategory);
  const activeCategory: DealCategory | "all" = isValidCategory
    ? ((requestedCategory as DealCategory) ?? "all")
    : "all";

  const filteredDeals =
    activeCategory === ("all" as string)
      ? DEALS
      : DEALS.filter((d) => d.category === activeCategory);

  const dealCounts: Partial<Record<DealCategory | "all", number>> = {
    all: DEALS.length,
  };
  for (const cat of categories) {
    dealCounts[cat] = DEALS.filter((d) => d.category === cat).length;
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
          Student Deals
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          {DEALS.length} deals across {categories.length} categories. All free to view &mdash; no account required.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <CategoryFilter activeCategory={activeCategory} dealCounts={dealCounts} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <DealGrid deals={filteredDeals} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-14 text-center">
        <div className="bg-zinc-50 rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Not sure which ones apply to you?
          </h2>
          <p className="text-zinc-500 mb-6">
            Take the 2-minute Life Audit and see exactly how much you&#39;re overpaying.
          </p>
          <Button asChild size="lg">
            <Link href="/audit">Take the Life Audit &rarr;</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
