import { getBrandImage } from "@shared/types/brand-mapper";
import { usePublicBrandsQuery } from "./hooks/usePublicBrand";
import BrandCard from "./components/BrandCard";

const PublicBrand = () => {
  const { data, isLoading } = usePublicBrandsQuery();

  const brands = data?.data ?? [];

  if (isLoading) {
    return <div>Loading brands...</div>;
  }

  if (!brands.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Thương hiệu nổi bật</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            name={brand.name}
            slug={brand.slug}
            image={getBrandImage(brand.slug)}
          />
        ))}
      </div>
    </section>
  );
};

export default PublicBrand;
