import { Deal } from "@/types";
import DealCard from "@/components/deals/DealCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SampleDealsProps {
  deals: Deal[];
}

export default function SampleDeals({ deals }: SampleDealsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">
            Here&apos;s what you&apos;re missing right now
          </h2>
          <p className="text-zinc-500">
            No signup needed to look. These are real deals you can claim today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {/* Show first 5 unlocked freely */}
          {deals.slice(0, 5).map((deal) => (
            <DealCard key={deal.id} deal={deal} isLocked={false} />
          ))}

          {/* 6th card shows a locked teaser */}
          {deals[5] && <DealCard key={deals[5].id} deal={deals[5]} isLocked={true} />}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="mr-4">
            <Link href="/deals">Browse all 20 deals →</Link>
          </Button>
          <Button asChild size="lg">
            <a href="#email-capture">Unlock locked deals →</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
