import { Subscription, AuditSelection, AuditResult } from "@/types";
import { DEALS } from "./deals-data";

export const SUBSCRIPTIONS: Subscription[] = [
  { id: "spotify", name: "Spotify", category: "streaming", defaultMonthlyPrice: 11.99, dealId: "spotify" },
  { id: "apple-music", name: "Apple Music", category: "streaming", defaultMonthlyPrice: 10.99, dealId: "apple-music" },
  { id: "youtube-premium", name: "YouTube Premium", category: "streaming", defaultMonthlyPrice: 13.99, dealId: "youtube-premium" },
  { id: "amazon-prime", name: "Amazon Prime", category: "streaming", defaultMonthlyPrice: 14.99, dealId: "amazon-prime" },
  { id: "adobe-cc", name: "Adobe Creative Cloud", category: "software", defaultMonthlyPrice: 54.99, dealId: "adobe-cc" },
  { id: "microsoft-365", name: "Microsoft 365", category: "software", defaultMonthlyPrice: 9.99, dealId: "microsoft-365" },
  { id: "notion", name: "Notion Plus", category: "software", defaultMonthlyPrice: 16, dealId: "notion" },
  { id: "figma", name: "Figma Professional", category: "software", defaultMonthlyPrice: 15, dealId: "figma" },
  { id: "canva-pro", name: "Canva Pro", category: "software", defaultMonthlyPrice: 15, dealId: "canva-pro" },
  { id: "grammarly", name: "Grammarly Premium", category: "software", defaultMonthlyPrice: 30, dealId: "grammarly" },
  { id: "calm", name: "Calm Premium", category: "health", defaultMonthlyPrice: 14.99, dealId: "calm" },
  { id: "headspace", name: "Headspace", category: "health", defaultMonthlyPrice: 12.99, dealId: "headspace" },
  { id: "nytimes", name: "New York Times", category: "education", defaultMonthlyPrice: 17, dealId: "nytimes" },
  { id: "wsj", name: "Wall Street Journal", category: "education", defaultMonthlyPrice: 38.99, dealId: "wsj" },
];

export function calculateAuditResult(
  selections: AuditSelection[],
  isStudent: boolean
): AuditResult {
  const dealsMap = new Map(DEALS.map((d) => [d.id, d]));

  let totalCurrentSpend = 0;
  let totalStudentSpend = 0;
  const applicableDeals: typeof DEALS = [];
  const breakdown: AuditResult["breakdown"] = [];

  for (const selection of selections) {
    const sub = SUBSCRIPTIONS.find((s) => s.id === selection.subscriptionId);
    if (!sub) continue;

    const currentPrice = selection.currentMonthlyPrice;
    const deal = sub.dealId ? (dealsMap.get(sub.dealId) ?? null) : null;
    const studentPrice = isStudent && deal ? deal.studentPrice : currentPrice;
    const savings = currentPrice - studentPrice;

    totalCurrentSpend += currentPrice;
    totalStudentSpend += studentPrice;

    if (deal && savings > 0) {
      applicableDeals.push(deal);
    }

    breakdown.push({
      name: sub.name,
      currentPrice,
      studentPrice,
      savings,
      deal,
    });
  }

  const monthlySavings = totalCurrentSpend - totalStudentSpend;

  return {
    totalCurrentSpend,
    totalStudentSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    applicableDeals,
    breakdown,
  };
}
