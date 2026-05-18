/**
 * 50 logo validation tests.
 *
 * Validates that every deal's logoDomain:
 *   1. Is present and non-empty
 *   2. Follows valid domain format (no http prefix, no www, has TLD, lowercase)
 *   3. Maps to the correct official brand domain
 *   4. Produces a well-formed Clearbit logo URL
 *   5. Is consistent with the deal's claimUrl (brand identity matches destination)
 *
 * These are static data tests — no network calls.
 */

import { describe, it, expect } from "vitest";
import { DEALS } from "@/lib/deals-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deal(id: string) {
  const d = DEALS.find((x) => x.id === id);
  if (!d) throw new Error(`Deal "${id}" not found in DEALS`);
  return d;
}

const UNIDAYS_ROUTED = new Set(["nordvpn", "grammarly", "expressvpn", "coursera-plus"]);
const GITHUB_ROUTED = new Set(["github-student", "datacamp", "1password"]);

// ─── GROUP 1: Every deal has a non-empty logoDomain (28 tests) ────────────────

describe("Every deal has a logoDomain set", () => {
  for (const d of DEALS) {
    it(`${d.brand} — logoDomain is present`, () => {
      expect(d.logoDomain, `${d.id}.logoDomain`).toBeDefined();
      expect(d.logoDomain.trim()).not.toBe("");
    });
  }
});

// ─── GROUP 2: Domain format rules (6 tests) ───────────────────────────────────

describe("logoDomain format rules", () => {
  it("T29. no domain contains 'http://' or 'https://'", () => {
    for (const d of DEALS) {
      expect(d.logoDomain, d.id).not.toMatch(/^https?:\/\//);
    }
  });

  it("T30. no domain starts with 'www.'", () => {
    for (const d of DEALS) {
      expect(d.logoDomain, d.id).not.toMatch(/^www\./);
    }
  });

  it("T31. every domain contains at least one dot", () => {
    for (const d of DEALS) {
      expect(d.logoDomain, d.id).toContain(".");
    }
  });

  it("T32. every domain is lowercase", () => {
    for (const d of DEALS) {
      expect(d.logoDomain, d.id).toBe(d.logoDomain.toLowerCase());
    }
  });

  it("T33. every domain ends with a valid TLD (2+ chars after last dot)", () => {
    for (const d of DEALS) {
      const tld = d.logoDomain.split(".").at(-1) ?? "";
      expect(tld.length, `${d.id} TLD "${tld}"`).toBeGreaterThanOrEqual(2);
    }
  });

  it("T34. no domain contains spaces or slashes", () => {
    for (const d of DEALS) {
      expect(d.logoDomain, d.id).not.toMatch(/[\s/]/);
    }
  });
});

// ─── GROUP 3: Correct brand-to-domain accuracy (16 tests) ────────────────────

describe("Brand-to-domain accuracy — specific brand checks", () => {
  it("T35. Spotify → spotify.com", () =>
    expect(deal("spotify").logoDomain).toBe("spotify.com"));

  it("T36. Apple Music → apple.com (not music.apple.com)", () =>
    expect(deal("apple-music").logoDomain).toBe("apple.com"));

  it("T37. YouTube Premium → youtube.com", () =>
    expect(deal("youtube-premium").logoDomain).toBe("youtube.com"));

  it("T38. Hulu → hulu.com", () =>
    expect(deal("hulu").logoDomain).toBe("hulu.com"));

  it("T39. Amazon Prime → amazon.com", () =>
    expect(deal("amazon-prime").logoDomain).toBe("amazon.com"));

  it("T40. Adobe Creative Cloud → adobe.com", () =>
    expect(deal("adobe-cc").logoDomain).toBe("adobe.com"));

  it("T41. Microsoft 365 → microsoft.com", () =>
    expect(deal("microsoft-365").logoDomain).toBe("microsoft.com"));

  it("T42. Notion → notion.so (Clearbit serves the official logo from .so)", () =>
    expect(deal("notion").logoDomain).toBe("notion.so"));

  it("T43. GitHub Student Pack → github.com", () =>
    expect(deal("github-student").logoDomain).toBe("github.com"));

  it("T44. Peloton App → onepeloton.com (official brand domain)", () =>
    expect(deal("peloton").logoDomain).toBe("onepeloton.com"));

  it("T45. DoorDash DashPass → doordash.com", () =>
    expect(deal("doordash-dashpass").logoDomain).toBe("doordash.com"));

  it("T46. NordVPN → nordvpn.com (even though claim goes via UNiDAYS)", () =>
    expect(deal("nordvpn").logoDomain).toBe("nordvpn.com"));

  it("T47. Wall Street Journal → wsj.com", () =>
    expect(deal("wsj").logoDomain).toBe("wsj.com"));

  it("T48. The Economist → economist.com", () =>
    expect(deal("economist").logoDomain).toBe("economist.com"));

  it("T49. Headspace → headspace.com", () =>
    expect(deal("headspace").logoDomain).toBe("headspace.com"));

  it("T50. Coursera Plus → coursera.org (official brand domain, not myunidays.com)", () =>
    expect(deal("coursera-plus").logoDomain).toBe("coursera.org"));
});

// ─── GROUP 4: Clearbit logo URL construction (4 tests) ───────────────────────

describe("Clearbit logo URL integrity", () => {
  it("T51. every Clearbit URL is a valid HTTPS URL", () => {
    for (const d of DEALS) {
      const url = `https://logo.clearbit.com/${d.logoDomain}`;
      expect(() => new URL(url), `${d.id} Clearbit URL`).not.toThrow();
    }
  });

  it("T52. Clearbit hostname is exactly 'logo.clearbit.com'", () => {
    for (const d of DEALS) {
      const url = new URL(`https://logo.clearbit.com/${d.logoDomain}`);
      expect(url.hostname).toBe("logo.clearbit.com");
    }
  });

  it("T53. Clearbit path equals '/' + logoDomain (no double slashes)", () => {
    for (const d of DEALS) {
      const url = new URL(`https://logo.clearbit.com/${d.logoDomain}`);
      expect(url.pathname).toBe(`/${d.logoDomain}`);
    }
  });

  it("T54. no Clearbit URL has a query string or hash", () => {
    for (const d of DEALS) {
      const url = new URL(`https://logo.clearbit.com/${d.logoDomain}`);
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
    }
  });
});

// ─── GROUP 5: ClaimUrl / logoDomain brand consistency (7 tests) ──────────────

describe("claimUrl and logoDomain identify the same brand", () => {
  it("T55. Direct deals: claimUrl host shares the same brand name as logoDomain", () => {
    const directDeals = DEALS.filter(
      (d) => !UNIDAYS_ROUTED.has(d.id) && !GITHUB_ROUTED.has(d.id)
    );
    for (const d of directDeals) {
      const host = new URL(d.claimUrl).hostname.replace(/^www\./, "");
      // Extract first label of logoDomain as the canonical brand name
      // e.g. "notion.so" → "notion", "onepeloton.com" → "onepeloton"
      const brandLabel = d.logoDomain.split(".")[0];
      expect(
        host.includes(brandLabel),
        `${d.id}: claimUrl host "${host}" should contain brand label "${brandLabel}"`
      ).toBe(true);
    }
  });

  it("T56. UNiDAYS-routed deals: claimUrl host is myunidays.com", () => {
    for (const id of UNIDAYS_ROUTED) {
      const d = deal(id);
      const host = new URL(d.claimUrl).hostname;
      expect(host, `${id} expected myunidays.com`).toBe("www.myunidays.com");
    }
  });

  it("T57. UNiDAYS-routed deals: brand name appears in the claimUrl path", () => {
    const brandSlug: Record<string, string> = {
      nordvpn: "nordvpn",
      grammarly: "grammarly",
      expressvpn: "expressvpn",
      "coursera-plus": "coursera",
    };
    for (const [id, slug] of Object.entries(brandSlug)) {
      const d = deal(id);
      expect(d.claimUrl, `${id} claimUrl should contain "${slug}"`).toContain(slug);
    }
  });

  it("T58. GitHub-routed deals: claimUrl points to github.com or brand site", () => {
    for (const id of GITHUB_ROUTED) {
      const d = deal(id);
      const url = d.claimUrl;
      const isGitHub = url.includes("github.com") || url.includes("education.github.com");
      const isBrandSite = url.includes(d.logoDomain.split(".")[0]);
      expect(isGitHub || isBrandSite, `${id}: unexpected claimUrl "${url}"`).toBe(true);
    }
  });

  it("T59. Peloton claimUrl host matches logoDomain (onepeloton.com)", () => {
    const d = deal("peloton");
    expect(d.claimUrl).toContain("onepeloton.com");
    expect(d.logoDomain).toBe("onepeloton.com");
  });

  it("T60. DoorDash claimUrl host matches logoDomain (doordash.com)", () => {
    const d = deal("doordash-dashpass");
    expect(d.claimUrl).toContain("doordash.com");
    expect(d.logoDomain).toBe("doordash.com");
  });

  it("T61. all claimUrls are valid HTTPS URLs", () => {
    for (const d of DEALS) {
      expect(() => new URL(d.claimUrl), `${d.id} claimUrl`).not.toThrow();
      expect(new URL(d.claimUrl).protocol, d.id).toBe("https:");
    }
  });
});
