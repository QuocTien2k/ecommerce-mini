import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@components/ui/carousel";
import { HOME_BANNERS } from "./core/public-banner.core";

const PublicBanner = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <Carousel
      setApi={setApi}
      plugins={[autoplay.current]}
      opts={{
        loop: true,
      }}
    >
      <div className="relative mx-auto max-w-7xl">
        <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 size-12 border bg-white/90 text-black shadow-lg hover:bg-white" />

        <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 size-12 border bg-white/90 text-black shadow-lg hover:bg-white" />

        <CarouselContent>
          {HOME_BANNERS.map((banner) => (
            <CarouselItem key={banner.id}>
              <img
                src={banner.image}
                alt={banner.alt}
                className="h-full w-full rounded-2xl object-cove"
                loading="lazy"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                current === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </Carousel>
  );
};

export default PublicBanner;
