import { DEALS } from "@/lib/deals-data";
import HeroSection from "@/components/landing/HeroSection";
import LifeAuditTeaser from "@/components/landing/LifeAuditTeaser";
import SampleDeals from "@/components/landing/SampleDeals";

export default function HomePage() {
  const featuredDeals = DEALS.slice(0, 6);

  return (
    <>
      <HeroSection />
      <LifeAuditTeaser />
      <SampleDeals deals={featuredDeals} />

      {/* Values strip */}
      <section className="bg-zinc-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { emoji: "🔍", label: "We find it so you don't have to" },
            { emoji: "🚀", label: "Direct links — not landing pages" },
            { emoji: "🆓", label: "Free, always. No catch." },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <p className="text-sm text-zinc-300 font-medium">{label}</p>
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
              We research every discount, test every claim flow, and give you exact step-by-step
              instructions so you can claim each one in under 5 minutes — no account required.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
