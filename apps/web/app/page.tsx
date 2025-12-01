import { BannerCarousel } from '@/components/organisms/BannerCarousel';
import { TrustBar } from "@/components/organisms/TrustBar";
import { OffersSection } from "@/components/organisms/OffersSection";
import { FeaturedCategories } from "@/components/organisms/FeaturedCategories";
import { FeaturedBrands } from '@/components/organisms/FeaturedBrands';
import { ProductSelection } from "@/components/organisms/ProductSelection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Banner Carousel - Full Width */}
      <BannerCarousel />
      <TrustBar />
      <OffersSection />
      <FeaturedCategories />
      <ProductSelection />
      <FeaturedBrands />
    </div>
  );
}
