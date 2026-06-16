"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SUBSCRIPTIONS } from "@/lib/audit-data";
import { DEALS } from "@/lib/deals-data";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const TEASER_SUBS = SUBSCRIPTIONS.slice(0, 7);

export default function LifeAuditTeaser() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const { monthly, annual } = useMemo(() => {
    const dealsMap = new Map(DEALS.map((d) => [d.id, d]));
    let savings = 0;
    for (const id of checked) {
      const sub = SUBSCRIPTIONS.find((s) => s.id === id);
      if (!sub) continue;
      const deal = sub.dealId ? dealsMap.get(sub.dealId) : null;
      if (deal) {
        savings += sub.defaultMonthlyPrice - deal.studentPrice;
      }
    }
    return { monthly: savings, annual: savings * 12 };
  }, [checked]);

  return (
    <section id="life-audit-teaser" className="bg-zinc-50 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">
            Which of these are you already paying for?
          </h2>
          <p className="text-zinc-500">
            Check what you have — we&apos;ll show you exactly how much you&apos;re overpaying as a student.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {TEASER_SUBS.map((sub) => {
              const isChecked = checked.has(sub.id);
              return (
                <label
                  key={sub.id}
                  className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors ${
                    isChecked ? "bg-emerald-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggle(sub.id)}
                    id={`teaser-${sub.id}`}
                  />
                  <span className="flex-1 font-medium text-zinc-800 text-sm">{sub.name}</span>
                  <span className="text-sm text-zinc-400">
                    {formatCurrency(sub.defaultMonthlyPrice)}/mo
                  </span>
                </label>
              );
            })}
          </div>

          <div
            className={`border-t transition-all duration-300 ${
              monthly > 0 ? "bg-emerald-50 border-emerald-100" : "bg-zinc-50 border-zinc-100"
            } px-5 py-4`}
          >
            {monthly > 0 ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    You could save{" "}
                    <span className="text-2xl font-bold">{formatCurrency(monthly)}/mo</span>
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    That&apos;s <strong>{formatCurrency(annual)}/year</strong> just by using your student status.
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href="/audit">
                    Full report <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-zinc-400 text-center">
                Check your subscriptions above to see your potential savings →
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/audit"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors underline underline-offset-4"
          >
            See your full personalized savings report →
          </Link>
        </div>
      </div>
    </section>
  );
}
