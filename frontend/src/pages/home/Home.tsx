import PublicBanner from "@/domains/banner/PublicBanner";
import PublicBrand from "@/domains/brand/PublicBrand";
import { PublicCategory } from "@/domains/category/PublicCategory";
import PublicPartner from "@/domains/partner/PublicPartner";
import { PublicProduct } from "@/domains/product/PublicProduct";
import TechnologyShowcase from "@/domains/technology/TechnologyShowcase";

const Home = () => {
  return (
    <>
      <div className="space-y-16">
        <PublicBanner />
        <PublicCategory />
        <PublicProduct />
        <PublicBrand />
        <TechnologyShowcase />
        <PublicPartner />
      </div>
    </>
  );
};

export default Home;
