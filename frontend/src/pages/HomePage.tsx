import { MarketplaceHero } from "../components/hero";
import {
  CategoryGrid,
  FeaturedListings,
  SevenShieldSection,
  TodaysMarketplace,
} from "../components/home";
import PricingExplanation from "../components/home/PricingExplanation";

export default function HomePage() {
  return (
    <>
      <MarketplaceHero />
      <TodaysMarketplace />
      <SevenShieldSection />
      <PricingExplanation />
      <CategoryGrid />
      <FeaturedListings />
    </>
  );
}