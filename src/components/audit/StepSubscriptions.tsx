"use client";

import { Subscription, AuditSelection } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  software: "Software & Productivity",
  streaming: "Streaming & Media",
  education: "News & Education",
  health: "Health & Wellness",
};

interface StepSubscriptionsProps {
  subscriptions: Subscription[];
  selected: AuditSelection[];
  onChange: (selections: AuditSelection[]) => void;
  onNext: () => void;
}

export default function StepSubscriptions({
  subscriptions,
  selected,
  onChange,
  onNext,
}: StepSubscriptionsProps) {
  const selectedIds = new Set(selected.map((s) => s.subscriptionId));

  const grouped = subscriptions.reduce<Record<string, Subscription[]>>((acc, sub) => {
    const cat = sub.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sub);
    return acc;
  }, {});

  function toggle(sub: Subscription) {
    if (selectedIds.has(sub.id)) {
      onChange(selected.filter((s) => s.subscriptionId !== sub.id));
    } else {
      onChange([
        ...selected,
        { subscriptionId: sub.id, currentMonthlyPrice: sub.defaultMonthlyPrice },
      ]);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">What do you currently pay for?</h2>
        <p className="text-zinc-500 mt-1 text-sm">
          Check everything you have an active subscription for. We&#39;ll show you where you can save.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, subs]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              {CATEGORY_LABELS[category] ?? category}
            </p>
            <div className="space-y-2">
              {subs.map((sub) => {
                const isChecked = selectedIds.has(sub.id);
                return (
                  <label
                    key={sub.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggle(sub)}
                      id={`sub-${sub.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-zinc-900 text-sm">{sub.name}</span>
                    </div>
                    <span className="text-sm text-zinc-400 shrink-0">
                      {formatCurrency(sub.defaultMonthlyPrice)}/mo
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onNext}
        disabled={selected.length === 0}
        className="w-full"
        size="lg"
      >
        {selected.length === 0
          ? "Select at least one subscription"
          : `Continue with ${selected.length} subscription${selected.length > 1 ? "s" : ""} →`}
      </Button>
    </div>
  );
}
