"use client";

import { useState } from "react";
import { AuditResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEduEmailError } from "@/lib/email-validation";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Mail } from "lucide-react";

interface AuditEmailCaptureProps {
  auditResult: AuditResult;
  onSuccess: (email: string) => void;
}

export default function AuditEmailCapture({ auditResult, onSuccess }: AuditEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = getEduEmailError(email);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
    onSuccess(email);
  }

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">You&apos;re in!</h2>
        <p className="text-zinc-500">
          Your savings report is on its way to <strong>{email}</strong>.
          <br />
          Check your inbox — your first digest arrives within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-emerald-100 text-emerald-700 rounded-full p-3">
            <Mail className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-zinc-900">
          Send me my {formatCurrency(auditResult.annualSavings)}/year savings report
        </h2>
        <p className="text-zinc-500 text-sm mt-2">
          We&apos;ll email you step-by-step claim instructions for each deal you qualify for.
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input
            type="email"
            placeholder="your@university.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className={error ? "border-red-400 focus-visible:ring-red-400" : ""}
            disabled={loading}
            autoComplete="email"
          />
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? "Sending…" : `Send me my deals →`}
        </Button>
      </form>

      <p className="text-xs text-zinc-400 text-center">
        .edu, .ac.uk, .edu.au, and other academic domains all work.
      </p>
    </div>
  );
}
