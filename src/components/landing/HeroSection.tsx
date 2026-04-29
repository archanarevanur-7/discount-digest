import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden bg-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-emerald-100">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Free &middot; No account needed
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 leading-tight tracking-tight mb-5">
          Every student discount.
          <br />
          <span className="text-emerald-600">In one place.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-500 max-w-xl mx-auto mb-10">
          See what you&apos;re overpaying and claim your discounts in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Button asChild size="lg" className="w-full sm:w-auto text-base px-8">
            <Link href="/audit">
              See my savings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
            <Link href="/deals">Browse all deals</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          No signup &middot; No email required &middot; Always free
        </div>
      </div>
    </section>
  );
}
