"use client";

import { useState } from "react";
import { Subscription, AuditSelection, AuditResult } from "@/types";
import { Progress } from "@/components/ui/progress";
import { calculateAuditResult } from "@/lib/audit-data";
import StepSubscriptions from "./StepSubscriptions";
import StepStudentStatus from "./StepStudentStatus";
import StepSavingsReport from "./StepSavingsReport";

interface AuditWizardProps {
  subscriptions: Subscription[];
}

const STEP_LABELS = ["Your subscriptions", "Student status", "Your savings"];

export default function AuditWizard({ subscriptions }: AuditWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<AuditSelection[]>([]);
  const [isStudent, setIsStudent] = useState<boolean | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  function handleNext() {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const r = calculateAuditResult(selections, isStudent ?? false);
      setResult(r);
      setStep(3);
    }
  }

  const progress = ((step - 1) / (STEP_LABELS.length - 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-zinc-900">
            Step {step} of {STEP_LABELS.length}:{" "}
            <span className="text-zinc-500">{STEP_LABELS[step - 1]}</span>
          </p>
          <p className="text-xs text-zinc-400">{Math.round(progress)}%</p>
        </div>
        <Progress value={progress} />
      </div>

      {step === 1 && (
        <StepSubscriptions
          subscriptions={subscriptions}
          selected={selections}
          onChange={setSelections}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <StepStudentStatus
          isStudent={isStudent}
          onChange={setIsStudent}
          onNext={handleNext}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && result && (
        <StepSavingsReport result={result} />
      )}
    </div>
  );
}
