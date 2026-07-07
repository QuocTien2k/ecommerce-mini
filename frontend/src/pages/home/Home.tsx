import PublicBrand from "@/domains/brand/PublicBrand";
import { PublicCategory } from "@/domains/category/PublicCategory";
import PublicPartner from "@/domains/partner/PublicPartner";
import { PublicProduct } from "@/domains/product/PublicProduct";

const Home = () => {
  return (
    <>
      <div className="space-y-16">
        <PublicCategory />
        <PublicProduct />
        <PublicBrand />
        <PublicPartner />
      </div>
    </>
  );
};

export default Home;
