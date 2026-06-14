import { getBrandImage } from "@shared/types/brand-mapper";
import { usePublicBrandsQuery } from "./hooks/usePublicBrand";
import BrandCard from "./components/BrandCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@components/ui/carousel";
import { SectionTitle } from "@components/ui/section-title";

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
      <SectionTitle
        title="Thương hiệu nổi bật"
        description="Các thương hiệu được khách hàng quan tâm nhiều nhất"
      />

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {brands.map((brand) => (
            <CarouselItem
              key={brand.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/6"
            >
              <BrandCard
                name={brand.name}
                slug={brand.slug}
                image={getBrandImage(brand.slug)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default PublicBrand;
