import { SUBSCRIPTIONS } from "@/lib/audit-data";
import AuditWizard from "@/components/audit/AuditWizard";

export const metadata = {
  title: "Life Audit — Discount Digest",
  description:
    "Find out exactly how much you're overpaying on subscriptions and tools. Takes 2 minutes.",
};

export default function AuditPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
          The Student Life Audit
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
          2 minutes. No account. See exactly what you&apos;re overpaying for — and what you can do about it.
        </p>
      </div>
      <AuditWizard subscriptions={SUBSCRIPTIONS} />
    </div>
  );
}
