"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEduEmailError } from "@/lib/email-validation";
import { CheckCircle2, Mail } from "lucide-react";

interface EmailCaptureProps {
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
}

export default function EmailCapture({
  headline = "Get your personalized discount digest",
  subtext = "We'll send you exactly the deals you qualify for, with step-by-step claim instructions. No spam, ever. Unsubscribe anytime.",
  ctaLabel = "Send me my deals",
}: EmailCaptureProps) {
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
  }

  if (submitted) {
    return (
      <div className="text-center py-6 space-y-3">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
        <h3 className="text-lg font-bold text-zinc-900">You&apos;re in!</h3>
        <p className="text-zinc-500 text-sm">
          Check your inbox — your first digest arrives within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="bg-emerald-100 text-emerald-700 rounded-full p-3">
          <Mail className="h-6 w-6" />
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-3">
        {headline}
      </h2>
      <p className="text-zinc-500 text-center mb-8 max-w-md mx-auto">{subtext}</p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
        <div>
          <Input
            type="email"
            placeholder="your@university.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className={`h-12 text-base ${error ? "border-red-400 focus-visible:ring-red-400" : ""}`}
            disabled={loading}
            autoComplete="email"
          />
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 text-base" size="lg">
          {loading ? "Sending…" : ctaLabel}
        </Button>
      </form>

      <p className="text-xs text-zinc-400 text-center mt-4">
        .edu, .ac.uk, .edu.au, and other academic emails all work
      </p>
    </div>
  );
}
