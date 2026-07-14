import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { usePublicRelatedProducts } from "../hooks/useProductRelated";
import { SectionTitle } from "@components/ui/section-title";
import { ProductCard } from "./ProductCard";

type Props = {
  slug: string;
};

export const ProductRelated = ({ slug }: Props) => {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  );

  const { data, isLoading } = usePublicRelatedProducts(slug);

  const products = data ?? [];

  if (isLoading) {
    return <div>Loading related products...</div>;
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Sản phẩm liên quan"
        description="Các sản phẩm cùng danh mục hoặc cùng thương hiệu"
      />

      <Carousel
        plugins={[autoplay.current]}
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
