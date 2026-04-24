"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepStudentStatusProps {
  isStudent: boolean | null;
  onChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepStudentStatus({
  isStudent,
  onChange,
  onNext,
  onBack,
}: StepStudentStatusProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">What&apos;s your student status?</h2>
        <p className="text-zinc-500 mt-1 text-sm">
          No verification needed here — just tell us where you&apos;re at. We&apos;ll show you what you qualify for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onChange(true)}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all text-left cursor-pointer",
            isStudent === true
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-200 hover:border-zinc-300 bg-white"
          )}
        >
          <GraduationCap
            className={cn("h-8 w-8", isStudent === true ? "text-zinc-900" : "text-zinc-400")}
          />
          <div>
            <p className="font-semibold text-zinc-900">Yes, I&apos;m a student</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Currently enrolled, or graduated within the past 2 years
            </p>
          </div>
        </button>

        <button
          onClick={() => onChange(false)}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all text-left cursor-pointer",
            isStudent === false
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-200 hover:border-zinc-300 bg-white"
          )}
        >
          <Briefcase
            className={cn("h-8 w-8", isStudent === false ? "text-zinc-900" : "text-zinc-400")}
          />
          <div>
            <p className="font-semibold text-zinc-900">Not currently a student</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Still lots of deals available — some don&apos;t require student status
            </p>
          </div>
        </button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button onClick={onNext} disabled={isStudent === null} className="flex-1" size="lg">
          See my savings →
        </Button>
      </div>
    </div>
  );
}
