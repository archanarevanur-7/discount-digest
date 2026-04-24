import { DEALS } from "@/lib/deals-data";
import HeroSection from "@/components/landing/HeroSection";
import LifeAuditTeaser from "@/components/landing/LifeAuditTeaser";
import SampleDeals from "@/components/landing/SampleDeals";
import EmailCapture from "@/components/landing/EmailCapture";

export default function HomePage() {
  const featuredDeals = DEALS.filter((d) => !d.isLocked).slice(0, 6);

  return (
    <>
      <HeroSection />
      <LifeAuditTeaser />
      <SampleDeals deals={featuredDeals} />

      {/* Social proof strip */}
      <section className="bg-zinc-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { stat: "20+", label: "Verified deals" },
            { stat: "$1,764", label: "Avg. annual savings" },
            { stat: "100%", label: "Free, always" },
            { stat: "2 min", label: "Life audit" },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{stat}</p>
              <p className="text-sm text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-12">
            Why people give up on student discounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                emoji: "😤",
                title: "The process is a maze",
                body: "Navigate to a special URL, create a new account, wait for email verification, upload your student ID, wait 3-5 business days — or just pay full price.",
              },
              {
                emoji: "🤷",
                title: "They don't know it exists",
                body: "Companies don't advertise their student pricing prominently. It's buried in FAQs and support docs. Most students never find it.",
              },
              {
                emoji: "⏳",
                title: "Life gets in the way",
                body: "Working grad students don't have time to research 20 different verification systems. So the full-price charge hits every month.",
              },
            ].map(({ emoji, title, body }) => (
              <div key={title} className="text-center">
                <p className="text-4xl mb-4">{emoji}</p>
                <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
            <p className="text-lg font-semibold text-zinc-900 mb-2">
              That&apos;s exactly what Discount Digest fixes.
            </p>
            <p className="text-zinc-500 text-sm">
              We research every discount, test every claim flow, and send you exact step-by-step
              instructions so you can claim each one in under 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section id="email-capture" className="bg-zinc-50 py-20 px-4 sm:px-6 border-t border-zinc-100">
        <div className="max-w-2xl mx-auto">
          <EmailCapture />
        </div>
      </section>
    </>
  );
}
