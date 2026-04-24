import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden bg-white">
      {/* Background accent */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-emerald-100">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Free for students &amp; working grads
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 leading-tight tracking-tight mb-6">
          You&apos;re already a student.
          <br />
          <span className="text-emerald-600">Start getting paid like one.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The average working grad student overpays{" "}
          <strong className="text-zinc-800">$1,764/year</strong> on tools and subscriptions
          they could get free — or close to it. We&apos;ll show you exactly where your money is
          going.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button asChild size="lg" className="w-full sm:w-auto text-base px-8">
            <Link href="/audit">
              Take the Life Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
            <Link href="/deals">Browse Deals</Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
          {[
            "No account needed",
            "Takes 2 minutes",
            "See savings before you give your email",
            "Free, always",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
