export type DealCategory =
  | "software"
  | "streaming"
  | "food"
  | "travel"
  | "education"
  | "health";

export type ClaimDifficulty = "easy" | "medium" | "complex";

export interface Deal {
  id: string;
  brand: string;
  logoEmoji: string;
  logoDomain: string;
  category: DealCategory;
  headline: string;
  fullPrice: number;
  studentPrice: number;
  savingsPercent: number;
  description: string;
  claimDifficulty: ClaimDifficulty;
  claimSteps: string[];
  verificationMethod: string;
  claimUrl: string;
  tags: string[];
}

export interface Subscription {
  id: string;
  name: string;
  category: DealCategory;
  defaultMonthlyPrice: number;
  dealId: string | null;
}

export interface AuditSelection {
  subscriptionId: string;
  currentMonthlyPrice: number;
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalStudentSpend: number;
  monthlySavings: number;
  annualSavings: number;
  applicableDeals: Deal[];
  breakdown: Array<{
    name: string;
    currentPrice: number;
    studentPrice: number;
    savings: number;
    deal: Deal | null;
  }>;
}
