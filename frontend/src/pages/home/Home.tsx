import { PublicCategory } from "@/domains/category/PublicCategory";
import { PublicProduct } from "@/domains/product/PublicProduct";

const Home = () => {
  return (
    <>
      <div className="space-y-12">
        <PublicCategory />
        <PublicProduct />
      </div>
    </>
  );
};

export default Home;
