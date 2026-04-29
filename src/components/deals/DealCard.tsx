import { Deal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DealCardProps {
  deal: Deal;
}

const difficultyConfig = {
  easy: { label: "Easy to claim", icon: Zap, color: "text-emerald-600 bg-emerald-50" },
  medium: { label: "Takes 5 min", icon: Clock, color: "text-amber-600 bg-amber-50" },
  complex: { label: "Some effort", icon: AlertCircle, color: "text-red-600 bg-red-50" },
};

export default function DealCard({ deal }: DealCardProps) {
  const diff = difficultyConfig[deal.claimDifficulty];
  const DiffIcon = diff.icon;
  const monthlySavings = deal.fullPrice - deal.studentPrice;

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-label={deal.brand}>
              {deal.logoEmoji}
            </span>
            <div>
              <p className="font-semibold text-zinc-900 leading-tight">{deal.brand}</p>
              <p className="text-xs text-zinc-500 capitalize">{deal.category}</p>
            </div>
          </div>
          <Badge variant="success" className="shrink-0 text-sm font-bold px-2 py-1">
            -{deal.savingsPercent}%
          </Badge>
        </div>

        <div>
          <p className="font-bold text-zinc-900 text-lg leading-snug">{deal.headline}</p>
          <p className="text-sm text-zinc-500 mt-1">{deal.description}</p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-400 line-through">{formatCurrency(deal.fullPrice)}/mo</span>
          <span className="font-bold text-emerald-700 text-base">
            {deal.studentPrice === 0 ? "Free" : `${formatCurrency(deal.studentPrice)}/mo`}
          </span>
          {monthlySavings > 0 && (
            <span className="text-zinc-400 text-xs">
              (save {formatCurrency(monthlySavings)}/mo)
            </span>
          )}
        </div>

        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit ${diff.color}`}>
          <DiffIcon className="h-3 w-3" />
          {diff.label}
        </div>

        <div className="mt-auto pt-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={deal.claimUrl} target="_blank" rel="noopener noreferrer">
              How to claim <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
