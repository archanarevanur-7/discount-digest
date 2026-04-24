import { Deal } from "@/types";
import DealCard from "./DealCard";

interface DealGridProps {
  deals: Deal[];
}

export default function DealGrid({ deals }: DealGridProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 text-lg">No deals in this category yet.</p>
        <p className="text-zinc-400 text-sm mt-1">Check back soon — we add new ones weekly.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
