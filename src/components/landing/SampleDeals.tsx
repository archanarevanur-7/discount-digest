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
            No signup needed. These are real deals you can claim today — for free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/deals">Browse all deals — no signup required →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
