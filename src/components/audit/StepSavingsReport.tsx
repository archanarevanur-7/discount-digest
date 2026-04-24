"use client";

import { useEffect, useState } from "react";
import { AuditResult } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, ArrowRight } from "lucide-react";

interface StepSavingsReportProps {
  result: AuditResult;
  onContinue: () => void;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function StepSavingsReport({ result, onContinue }: StepSavingsReportProps) {
  const animatedMonthly = useCountUp(result.monthlySavings);
  const animatedAnnual = useCountUp(result.annualSavings);

  if (result.monthlySavings === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-xl font-bold text-zinc-900">You&apos;re already optimized!</h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Based on your selections, you&apos;re either already claiming these discounts, or the items you selected don&apos;t have student deals available yet.
          </p>
        </div>
        <Button onClick={onContinue} className="w-full" size="lg">
          Get notified when new deals drop →
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Here&apos;s what you&apos;re leaving on the table</h2>
        <p className="text-zinc-500 mt-1 text-sm">
          Based on your subscriptions and student status.
        </p>
      </div>

      {/* Big number */}
      <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
        <div className="flex items-center justify-center gap-2 text-emerald-700 mb-1">
          <TrendingDown className="h-5 w-5" />
          <span className="text-sm font-medium">Monthly overpayment</span>
        </div>
        <p className="text-5xl font-bold text-emerald-700">
          {formatCurrency(animatedMonthly)}
          <span className="text-2xl font-medium text-emerald-600">/mo</span>
        </p>
        <p className="text-emerald-600 mt-2 font-semibold">
          = {formatCurrency(animatedAnnual)} per year
        </p>
      </div>

      {/* Breakdown */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Breakdown
          </p>
          <div className="space-y-3">
            {result.breakdown.map((item, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-3" />}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 text-sm truncate">{item.name}</p>
                    {item.deal && (
                      <p className="text-xs text-zinc-400">via {item.deal.verificationMethod}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {item.savings > 0 ? (
                      <>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-sm text-zinc-400 line-through">
                            {formatCurrency(item.currentPrice)}
                          </span>
                          <ArrowRight className="h-3 w-3 text-zinc-300" />
                          <span className="text-sm font-bold text-emerald-700">
                            {item.studentPrice === 0 ? "Free" : formatCurrency(item.studentPrice)}
                          </span>
                        </div>
                        <Badge variant="success" className="mt-0.5">
                          Save {formatCurrency(item.savings)}/mo
                        </Badge>
                      </>
                    ) : (
                      <span className="text-sm text-zinc-400">{formatCurrency(item.currentPrice)}/mo</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onContinue} className="w-full" size="lg">
        Send me my savings report →
      </Button>
      <p className="text-xs text-zinc-400 text-center">
        We&apos;ll email you this report plus step-by-step claim instructions for each deal.
      </p>
    </div>
  );
}
