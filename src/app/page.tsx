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
    </>
  );
}
