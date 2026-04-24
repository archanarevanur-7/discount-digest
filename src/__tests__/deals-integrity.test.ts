import { describe, it, expect } from "vitest";
import { DEALS } from "@/lib/deals-data";
import { SUBSCRIPTIONS, calculateAuditResult } from "@/lib/audit-data";
import { isEduEmail, getEduEmailError } from "@/lib/email-validation";

// ─── Data shape ────────────────────────────────────────────────────────────────

describe("Every deal has all required fields", () => {
  for (const deal of DEALS) {
    it(`${deal.brand} — required fields present`, () => {
      expect(deal.id, "id").toBeTruthy();
      expect(deal.brand, "brand").toBeTruthy();
      expect(deal.logoEmoji, "logoEmoji").toBeTruthy();
      expect(deal.category, "category").toBeTruthy();
      expect(deal.headline, "headline").toBeTruthy();
      expect(deal.description, "description").toBeTruthy();
      expect(deal.verificationMethod, "verificationMethod").toBeTruthy();
      expect(deal.claimUrl, "claimUrl").toBeTruthy();
      expect(deal.claimSteps, "claimSteps").toBeInstanceOf(Array);
      expect(deal.tags, "tags").toBeInstanceOf(Array);
    });
  }
});

// ─── Prices ────────────────────────────────────────────────────────────────────

describe("Prices are logically consistent", () => {
  for (const deal of DEALS) {
    it(`${deal.brand} — studentPrice < fullPrice`, () => {
      expect(deal.studentPrice).toBeLessThan(deal.fullPrice);
    });

    it(`${deal.brand} — fullPrice > 0`, () => {
      expect(deal.fullPrice).toBeGreaterThan(0);
    });

    it(`${deal.brand} — studentPrice >= 0`, () => {
      expect(deal.studentPrice).toBeGreaterThanOrEqual(0);
    });
  }
});

// ─── Savings percentage accuracy ───────────────────────────────────────────────

describe("Savings percentages match the actual price difference", () => {
  for (const deal of DEALS) {
    it(`${deal.brand} — savingsPercent is mathematically accurate`, () => {
      const calculated = Math.round(
        ((deal.fullPrice - deal.studentPrice) / deal.fullPrice) * 100
      );
      // Allow ±2% rounding tolerance
      expect(deal.savingsPercent).toBeGreaterThanOrEqual(calculated - 2);
      expect(deal.savingsPercent).toBeLessThanOrEqual(calculated + 2);
    });
  }
});

// ─── Claim URLs ────────────────────────────────────────────────────────────────

describe("Claim URLs are valid HTTPS URLs", () => {
  for (const deal of DEALS) {
    it(`${deal.brand} — claimUrl is a valid https:// URL`, () => {
      expect(() => new URL(deal.claimUrl)).not.toThrow();
      const url = new URL(deal.claimUrl);
      expect(url.protocol).toBe("https:");
      expect(url.hostname.length).toBeGreaterThan(0);
    });

    it(`${deal.brand} — claimUrl is not a generic homepage`, () => {
      const url = new URL(deal.claimUrl);
      // Pathname must have more than just "/"
      const hasPath = url.pathname.length > 1 || url.search.length > 0;
      expect(hasPath, `${deal.claimUrl} appears to be a bare homepage`).toBe(true);
    });
  }
});

// ─── Claim steps quality ───────────────────────────────────────────────────────

describe("Claim steps are actionable and direct", () => {
  for (const deal of DEALS) {
    it(`${deal.brand} — has at least 2 claim steps`, () => {
      expect(deal.claimSteps.length).toBeGreaterThanOrEqual(2);
    });

    it(`${deal.brand} — first step directs user to click the link`, () => {
      const firstStep = deal.claimSteps[0].toLowerCase();
      expect(
        firstStep.includes("click") || firstStep.includes("go to") || firstStep.includes("open"),
        `First step should direct user to act: "${deal.claimSteps[0]}"`
      ).toBe(true);
    });

    it(`${deal.brand} — no step contains a dead-end instruction like 'google it'`, () => {
      for (const step of deal.claimSteps) {
        expect(step.toLowerCase()).not.toContain("google it");
        expect(step.toLowerCase()).not.toContain("search for");
      }
    });
  }
});

// ─── No duplicate IDs ──────────────────────────────────────────────────────────

describe("Deal IDs are unique", () => {
  it("no two deals share the same id", () => {
    const ids = DEALS.map((d) => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ─── Audit calculation ─────────────────────────────────────────────────────────

describe("Audit savings calculation is correct", () => {
  it("student savings are always >= non-student savings", () => {
    const allSelected = SUBSCRIPTIONS.map((s) => ({
      subscriptionId: s.id,
      currentMonthlyPrice: s.defaultMonthlyPrice,
    }));
    const studentResult = calculateAuditResult(allSelected, true);
    const nonStudentResult = calculateAuditResult(allSelected, false);
    expect(studentResult.monthlySavings).toBeGreaterThanOrEqual(
      nonStudentResult.monthlySavings
    );
  });

  it("non-student savings are zero (no applicable deals)", () => {
    const allSelected = SUBSCRIPTIONS.map((s) => ({
      subscriptionId: s.id,
      currentMonthlyPrice: s.defaultMonthlyPrice,
    }));
    const result = calculateAuditResult(allSelected, false);
    expect(result.monthlySavings).toBe(0);
  });

  it("annualSavings is exactly monthlySavings × 12", () => {
    const allSelected = SUBSCRIPTIONS.map((s) => ({
      subscriptionId: s.id,
      currentMonthlyPrice: s.defaultMonthlyPrice,
    }));
    const result = calculateAuditResult(allSelected, true);
    expect(result.annualSavings).toBeCloseTo(result.monthlySavings * 12, 5);
  });

  it("totalStudentSpend + monthlySavings = totalCurrentSpend", () => {
    const allSelected = SUBSCRIPTIONS.map((s) => ({
      subscriptionId: s.id,
      currentMonthlyPrice: s.defaultMonthlyPrice,
    }));
    const result = calculateAuditResult(allSelected, true);
    expect(result.totalStudentSpend + result.monthlySavings).toBeCloseTo(
      result.totalCurrentSpend,
      5
    );
  });

  it("empty selection returns zero savings", () => {
    const result = calculateAuditResult([], true);
    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
    expect(result.totalCurrentSpend).toBe(0);
  });
});

// ─── Email validation ──────────────────────────────────────────────────────────

describe(".edu email validation", () => {
  const validEmails = [
    "student@mit.edu",
    "a.b.c@university.edu",
    "grad@oxford.ac.uk",
    "student@unsw.edu.au",
    "user@iit.ac.in",
    "student@nus.edu.sg",
    "user@uct.ac.za",
  ];

  const invalidEmails = [
    "user@gmail.com",
    "user@company.com",
    "notanemail",
    "",
    "user@",
    "@mit.edu",
    "user@mit.edu.fake.com",
  ];

  for (const email of validEmails) {
    it(`accepts ${email}`, () => {
      expect(isEduEmail(email)).toBe(true);
      expect(getEduEmailError(email)).toBeNull();
    });
  }

  for (const email of invalidEmails) {
    it(`rejects ${email || "(empty string)"}`, () => {
      expect(isEduEmail(email)).toBe(false);
      expect(getEduEmailError(email)).not.toBeNull();
    });
  }
});

// ─── Subscription ↔ Deal linkage ───────────────────────────────────────────────

describe("All subscription dealIds reference a real deal", () => {
  const dealIds = new Set(DEALS.map((d) => d.id));

  for (const sub of SUBSCRIPTIONS) {
    if (sub.dealId !== null) {
      it(`Subscription "${sub.name}" links to real deal "${sub.dealId}"`, () => {
        expect(dealIds.has(sub.dealId!)).toBe(true);
      });
    }
  }
});
