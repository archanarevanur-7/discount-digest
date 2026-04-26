/**
 * 100 edge-case tests covering email validation, deals data, audit calculation,
 * helper functions, routing logic, security inputs, and boundary conditions.
 *
 * These test every way a user (or bad actor) might misuse the site and verify
 * the code handles it gracefully — no crashes, no misleading data, no empty pages.
 */

import { describe, it, expect } from "vitest";
import { DEALS, getDealsByCategory, getFeaturedDeals, getAllCategories } from "@/lib/deals-data";
import { SUBSCRIPTIONS, calculateAuditResult } from "@/lib/audit-data";
import { isEduEmail, getEduEmailError } from "@/lib/email-validation";
import { formatCurrency } from "@/lib/utils";

// ─── GROUP 1: Email validation — standard edge cases (tests 1–20) ──────────────

describe("Email validation — standard edge cases", () => {
  // Invalid
  it("1. rejects empty string", () => expect(isEduEmail("")).toBe(false));
  it("2. rejects whitespace-only", () => expect(isEduEmail("   ")).toBe(false));
  it("3. rejects tab character", () => expect(isEduEmail("\t")).toBe(false));
  it("4. rejects @ only", () => expect(isEduEmail("@")).toBe(false));
  it("5. rejects missing @", () => expect(isEduEmail("usermit.edu")).toBe(false));
  it("6. rejects missing local part", () => expect(isEduEmail("@mit.edu")).toBe(false));
  it("7. rejects missing domain", () => expect(isEduEmail("user@")).toBe(false));
  it("8. rejects .edu with no domain prefix", () => expect(isEduEmail("user@.edu")).toBe(false));
  it("9. rejects non-academic TLD .com", () => expect(isEduEmail("user@mit.com")).toBe(false));
  it("10. rejects .edu embedded mid-domain", () => expect(isEduEmail("user@mit.edu.evil.com")).toBe(false));
  it("11. rejects no TLD at all", () => expect(isEduEmail("user@mit")).toBe(false));
  it("12. rejects .eduu typo", () => expect(isEduEmail("user@mit.eduu")).toBe(false));

  // Valid
  it("13. accepts standard .edu", () => expect(isEduEmail("student@mit.edu")).toBe(true));
  it("14. accepts minimal valid .edu", () => expect(isEduEmail("a@b.edu")).toBe(true));
  it("15. accepts all-caps (case insensitive)", () => expect(isEduEmail("USER@MIT.EDU")).toBe(true));
  it("16. accepts dots and plus in local part", () => expect(isEduEmail("first.last+tag@mit.edu")).toBe(true));
  it("17. accepts subdomain .edu", () => expect(isEduEmail("user@cs.mit.edu")).toBe(true));
  it("18. accepts .ac.uk", () => expect(isEduEmail("user@oxford.ac.uk")).toBe(true));
  it("19. accepts .edu.au", () => expect(isEduEmail("user@unsw.edu.au")).toBe(true));
  it("20. accepts .ac.in", () => expect(isEduEmail("user@iit.ac.in")).toBe(true));
});

// ─── GROUP 2: Email validation — security & injection inputs (tests 21–30) ─────

describe("Email validation — security and injection inputs", () => {
  it("21. rejects XSS attempt", () =>
    expect(isEduEmail("<script>alert(1)</script>@mit.edu")).toBe(false));
  it("22. rejects SQL injection attempt", () =>
    expect(isEduEmail("' OR 1=1; --@mit.edu")).toBe(false));
  it("23. trims trailing newline and accepts the valid .edu (good UX)", () =>
    expect(isEduEmail("user@mit.edu\n")).toBe(true));
  it("24. rejects email with space in local part", () =>
    expect(isEduEmail("user name@mit.edu")).toBe(false));
  it("25. rejects email with tab in local part", () =>
    expect(isEduEmail("user\t@mit.edu")).toBe(false));
  it("26. rejects email over 254 chars (RFC 5321 max)", () =>
    expect(isEduEmail("a".repeat(247) + "@mit.edu")).toBe(false));
  it("27. getEduEmailError returns null for valid email — not throws", () =>
    expect(() => getEduEmailError("user@mit.edu")).not.toThrow());
  it("28. getEduEmailError returns non-null for XSS string", () =>
    expect(getEduEmailError("<script>@mit.edu")).not.toBeNull());
  it("29. getEduEmailError returns specific 'not an email' message when missing @", () =>
    expect(getEduEmailError("notanemail")).toContain("doesn't look like an email"));
  it("30. isEduEmail trims leading and trailing spaces before checking", () =>
    expect(isEduEmail("  student@mit.edu  ")).toBe(true));
});

// ─── GROUP 3: Deals data integrity (tests 31–50) ──────────────────────────────

describe("Deals data — structural integrity", () => {
  it("31. DEALS has at least 25 items (expanded catalog)", () => expect(DEALS.length).toBeGreaterThanOrEqual(25));
  it("32. all deal IDs are unique", () => {
    const ids = DEALS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("33. all deal IDs are URL-safe slugs", () => {
    DEALS.forEach((d) => expect(d.id).toMatch(/^[a-z0-9-]+$/));
  });
  it("34. no deal has studentPrice >= fullPrice", () => {
    DEALS.forEach((d) => expect(d.studentPrice).toBeLessThan(d.fullPrice));
  });
  it("35. no deal has savingsPercent > 100", () => {
    DEALS.forEach((d) => expect(d.savingsPercent).toBeLessThanOrEqual(100));
  });
  it("36. no deal has savingsPercent <= 0", () => {
    DEALS.forEach((d) => expect(d.savingsPercent).toBeGreaterThan(0));
  });
  it("37. no deal has fullPrice <= 0", () => {
    DEALS.forEach((d) => expect(d.fullPrice).toBeGreaterThan(0));
  });
  it("38. no deal has studentPrice < 0", () => {
    DEALS.forEach((d) => expect(d.studentPrice).toBeGreaterThanOrEqual(0));
  });
  it("39. all deals have at least 2 claimSteps", () => {
    DEALS.forEach((d) => expect(d.claimSteps.length).toBeGreaterThanOrEqual(2));
  });
  it("40. all deals have at least 1 tag", () => {
    DEALS.forEach((d) => expect(d.tags.length).toBeGreaterThanOrEqual(1));
  });
  it("41. all claimUrls start with https://", () => {
    DEALS.forEach((d) => expect(d.claimUrl.startsWith("https://")).toBe(true));
  });
  it("42. no claimUrl contains whitespace", () => {
    DEALS.forEach((d) => expect(d.claimUrl).not.toMatch(/\s/));
  });
  it("43. no claimUrl uses javascript: protocol", () => {
    DEALS.forEach((d) =>
      expect(d.claimUrl.toLowerCase()).not.toContain("javascript:")
    );
  });
  it("44. all deals have a valid category", () => {
    const valid = ["software", "streaming", "food", "travel", "education", "health"];
    DEALS.forEach((d) => expect(valid).toContain(d.category));
  });
  it("45. all deals have a valid claimDifficulty", () => {
    DEALS.forEach((d) => expect(["easy", "medium", "complex"]).toContain(d.claimDifficulty));
  });
  it("46. Autodesk has the highest fullPrice", () => {
    const max = Math.max(...DEALS.map((d) => d.fullPrice));
    expect(DEALS.find((d) => d.id === "autodesk")?.fullPrice).toBe(max);
  });
  it("47. Spotify studentPrice is 5.99", () =>
    expect(DEALS.find((d) => d.id === "spotify")?.studentPrice).toBe(5.99));
  it("48. Microsoft 365 studentPrice is 0 and savingsPercent is 100", () => {
    const ms = DEALS.find((d) => d.id === "microsoft-365")!;
    expect(ms.studentPrice).toBe(0);
    expect(ms.savingsPercent).toBe(100);
  });
  it("49. all deal descriptions are under 300 characters", () => {
    DEALS.forEach((d) => expect(d.description.length).toBeLessThan(300));
  });
  it("50. no deal description or headline contains a <script> tag", () => {
    DEALS.forEach((d) => {
      expect(d.description.toLowerCase()).not.toContain("<script");
      expect(d.headline.toLowerCase()).not.toContain("<script");
    });
  });
});

// ─── GROUP 4: Deals helper functions (tests 51–60) ────────────────────────────

describe("Deals helper functions", () => {
  it("51. getDealsByCategory('software') returns only software deals", () => {
    getDealsByCategory("software").forEach((d) => expect(d.category).toBe("software"));
  });
  it("52. getDealsByCategory('streaming') returns only streaming deals", () => {
    getDealsByCategory("streaming").forEach((d) => expect(d.category).toBe("streaming"));
  });
  it("53. getDealsByCategory('health') returns only health deals", () => {
    getDealsByCategory("health").forEach((d) => expect(d.category).toBe("health"));
  });
  it("54. getDealsByCategory('education') returns only education deals", () => {
    getDealsByCategory("education").forEach((d) => expect(d.category).toBe("education"));
  });
  it("55. getDealsByCategory('food') returns at least 1 deal", () => {
    expect(getDealsByCategory("food").length).toBeGreaterThanOrEqual(1);
  });
  it("56. getDealsByCategory('travel') returns empty array — no travel deals exist", () => {
    expect(getDealsByCategory("travel")).toHaveLength(0);
  });
  it("57. getFeaturedDeals(3) returns exactly 3 deals", () => {
    expect(getFeaturedDeals(3)).toHaveLength(3);
  });
  it("58. getFeaturedDeals(5) returns exactly 5 deals", () => {
    expect(getFeaturedDeals(5)).toHaveLength(5);
  });
  it("59. getFeaturedDeals(999) returns all deals without exceeding total count", () => {
    expect(getFeaturedDeals(999).length).toBeLessThanOrEqual(DEALS.length);
  });
  it("60. getAllCategories returns no duplicates", () => {
    const cats = getAllCategories();
    expect(new Set(cats).size).toBe(cats.length);
  });
});

// ─── GROUP 5: Audit calculation — edge cases (tests 61–80) ────────────────────

describe("Audit calculation — edge cases", () => {
  const allSelected = SUBSCRIPTIONS.map((s) => ({
    subscriptionId: s.id,
    currentMonthlyPrice: s.defaultMonthlyPrice,
  }));

  it("61. empty selections → monthlySavings = 0", () => {
    expect(calculateAuditResult([], true).monthlySavings).toBe(0);
  });
  it("62. non-student → monthlySavings = 0 regardless of subscriptions", () => {
    expect(calculateAuditResult(allSelected, false).monthlySavings).toBe(0);
  });
  it("63. student with Spotify → savings = 6.00", () => {
    const result = calculateAuditResult(
      [{ subscriptionId: "spotify", currentMonthlyPrice: 11.99 }],
      true
    );
    expect(result.monthlySavings).toBeCloseTo(6.0, 2);
  });
  it("64. non-student with Spotify → savings = 0", () => {
    const result = calculateAuditResult(
      [{ subscriptionId: "spotify", currentMonthlyPrice: 11.99 }],
      false
    );
    expect(result.monthlySavings).toBe(0);
  });
  it("65. subscription with dealId = null → contributes to spend but 0 savings", () => {
    const wsj = SUBSCRIPTIONS.find((s) => s.dealId === null);
    if (!wsj) return; // skip if no null dealId subs
    const result = calculateAuditResult(
      [{ subscriptionId: wsj.id, currentMonthlyPrice: wsj.defaultMonthlyPrice }],
      true
    );
    expect(result.monthlySavings).toBe(0);
    expect(result.totalCurrentSpend).toBe(wsj.defaultMonthlyPrice);
  });
  it("66. unknown subscriptionId is silently ignored — no throw", () => {
    expect(() =>
      calculateAuditResult([{ subscriptionId: "fake-id-xyz", currentMonthlyPrice: 9.99 }], true)
    ).not.toThrow();
  });
  it("67. monthlySavings is never negative", () => {
    expect(calculateAuditResult(allSelected, true).monthlySavings).toBeGreaterThanOrEqual(0);
    expect(calculateAuditResult(allSelected, false).monthlySavings).toBeGreaterThanOrEqual(0);
  });
  it("68. totalStudentSpend <= totalCurrentSpend always", () => {
    const r = calculateAuditResult(allSelected, true);
    expect(r.totalStudentSpend).toBeLessThanOrEqual(r.totalCurrentSpend);
  });
  it("69. annualSavings = monthlySavings × 12 exactly", () => {
    const r = calculateAuditResult(allSelected, true);
    expect(r.annualSavings).toBeCloseTo(r.monthlySavings * 12, 5);
  });
  it("70. breakdown length equals number of matched selections", () => {
    const r = calculateAuditResult(allSelected, true);
    const validCount = allSelected.filter((s) =>
      SUBSCRIPTIONS.some((sub) => sub.id === s.subscriptionId)
    ).length;
    expect(r.breakdown.length).toBe(validCount);
  });
  it("71. breakdown item savings sum equals monthlySavings", () => {
    const r = calculateAuditResult(allSelected, true);
    const sumSavings = r.breakdown.reduce((acc, item) => acc + item.savings, 0);
    expect(sumSavings).toBeCloseTo(r.monthlySavings, 5);
  });
  it("72. Microsoft 365 student saving equals its fullPrice (100% off)", () => {
    const ms = SUBSCRIPTIONS.find((s) => s.id === "microsoft-365")!;
    const r = calculateAuditResult(
      [{ subscriptionId: ms.id, currentMonthlyPrice: ms.defaultMonthlyPrice }],
      true
    );
    expect(r.monthlySavings).toBeCloseTo(ms.defaultMonthlyPrice, 2);
  });
  it("73. currentMonthlyPrice = 0 → 0 savings even with student deal", () => {
    const r = calculateAuditResult(
      [{ subscriptionId: "spotify", currentMonthlyPrice: 0 }],
      true
    );
    expect(r.monthlySavings).toBe(0);
  });
  it("74. applicableDeals contains only deals where savings > 0", () => {
    const r = calculateAuditResult(allSelected, true);
    r.applicableDeals.forEach((deal) => {
      const item = r.breakdown.find((b) => b.deal?.id === deal.id);
      expect(item?.savings).toBeGreaterThan(0);
    });
  });
  it("75. totalCurrentSpend = sum of all selection currentMonthlyPrices (for known subs)", () => {
    const r = calculateAuditResult(allSelected, true);
    const expected = allSelected
      .filter((s) => SUBSCRIPTIONS.some((sub) => sub.id === s.subscriptionId))
      .reduce((acc, s) => acc + s.currentMonthlyPrice, 0);
    expect(r.totalCurrentSpend).toBeCloseTo(expected, 5);
  });
  it("76. all subscriptions selected at once — no crash", () => {
    expect(() => calculateAuditResult(allSelected, true)).not.toThrow();
  });
  it("77. SUBSCRIPTIONS has no duplicate IDs", () => {
    const ids = SUBSCRIPTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("78. all SUBSCRIPTIONS have valid categories", () => {
    const valid = ["software", "streaming", "food", "travel", "education", "health"];
    SUBSCRIPTIONS.forEach((s) => expect(valid).toContain(s.category));
  });
  it("79. NYT student saving = $16/mo (from $17 to $1)", () => {
    const r = calculateAuditResult(
      [{ subscriptionId: "nytimes", currentMonthlyPrice: 17 }],
      true
    );
    expect(r.monthlySavings).toBeCloseTo(16, 2);
  });
  it("80. non-student breakdown item.savings is always 0", () => {
    const r = calculateAuditResult(allSelected, false);
    r.breakdown.forEach((item) => expect(item.savings).toBe(0));
  });
});

// ─── GROUP 6: Routing and URL defensive checks (tests 81–90) ──────────────────

describe("Routing and URL defensive checks", () => {
  it("81. no two deals share the same claimUrl", () => {
    const urls = DEALS.map((d) => d.claimUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });
  it("82. all SUBSCRIPTIONS with a dealId reference an existing deal", () => {
    const dealIds = new Set(DEALS.map((d) => d.id));
    SUBSCRIPTIONS.filter((s) => s.dealId !== null).forEach((s) =>
      expect(dealIds.has(s.dealId!)).toBe(true)
    );
  });
  it("83. total deal count is greater than 20 (expanded catalog)", () => {
    expect(DEALS.length).toBeGreaterThan(20);
  });
  it("84. food category deals exist (DoorDash DashPass)", () => {
    expect(getDealsByCategory("food").length).toBeGreaterThanOrEqual(1);
  });
  it("85. valid categories from getAllCategories are all present in DEALS", () => {
    const cats = getAllCategories();
    cats.forEach((cat) =>
      expect(DEALS.some((d) => d.category === cat)).toBe(true)
    );
  });
  it("86. unknown category produces 0 filtered deals (graceful empty state)", () => {
    const invalid = "unicorn" as any;
    const result = DEALS.filter((d) => d.category === invalid);
    expect(result).toHaveLength(0);
  });
  it("87. all deal brands are unique — no duplicate product listings", () => {
    const brands = DEALS.map((d) => d.brand);
    expect(new Set(brands).size).toBe(brands.length);
  });
  it("88. no claimUrl points to localhost", () => {
    DEALS.forEach((d) => expect(d.claimUrl).not.toContain("localhost"));
  });
  it("89. no claimUrl points to example.com", () => {
    DEALS.forEach((d) => expect(d.claimUrl).not.toContain("example.com"));
  });
  it("90. no deal claimUrl has a fragment (#anchor) — lands on page load, not scroll", () => {
    DEALS.forEach((d) =>
      expect(new URL(d.claimUrl).hash).toBe("")
    );
  });
});

// ─── GROUP 7: formatCurrency and boundary conditions (tests 91–100) ───────────

describe("formatCurrency and boundary conditions", () => {
  it("91. formatCurrency(0) = '$0'", () => expect(formatCurrency(0)).toBe("$0"));
  it("92. formatCurrency(0.99) = '$0.99'", () => expect(formatCurrency(0.99)).toBe("$0.99"));
  it("93. formatCurrency(19.99) = '$19.99'", () => expect(formatCurrency(19.99)).toBe("$19.99"));
  it("94. formatCurrency(1000) = '$1,000'", () => expect(formatCurrency(1000)).toBe("$1,000"));
  it("95. formatCurrency(270) = '$270'", () => expect(formatCurrency(270)).toBe("$270"));
  it("96. formatCurrency does not throw on very large number", () =>
    expect(() => formatCurrency(999999999)).not.toThrow());
  it("97. all deal savingsPercent values are whole integers", () => {
    DEALS.forEach((d) => expect(Number.isInteger(d.savingsPercent)).toBe(true));
  });
  it("98. Chegg does not appear in DEALS", () => {
    expect(DEALS.find((d) => d.id === "chegg")).toBeUndefined();
  });
  it("99. Chegg does not appear in SUBSCRIPTIONS at all", () => {
    expect(SUBSCRIPTIONS.find((s) => s.id === "chegg")).toBeUndefined();
  });
  it("100. getEduEmailError returns null (strictly) — not false or empty string — for valid email", () => {
    expect(getEduEmailError("student@mit.edu")).toStrictEqual(null);
  });
});
