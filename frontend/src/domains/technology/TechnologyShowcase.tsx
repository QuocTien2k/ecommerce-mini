import TiltCard from "@components/common/tilt-card";

const banners = [
  {
    id: 1,
    image:
      "https://cs-maxmin-4.myshopify.com/cdn/shop/files/1_aadca4dc-8683-4654-927b-ef530dfd810e_785x.png?v=1636425245",
    alt: "Technology Banner 1",
  },
  {
    id: 2,
    image:
      "https://cs-maxmin-4.myshopify.com/cdn/shop/files/2_c32e22f6-1988-44d6-bd11-090918e6b937_785x.png?v=1636425261",
    alt: "Technology Banner 2",
  },
];

const TechnologyShowcase = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-background via-background to-muted/40 p-6 lg:p-8">
      {/* <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" /> */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
        {banners.map((banner) => (
          <TiltCard
            key={banner.id}
            //className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow duration-300 hover:shadow-lg"
            className="group overflow-hidden rounded-2xl border bg-background shadow-sm"
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </TiltCard>
        ))}
      </div>
    </section>
  );
};

export default TechnologyShowcase;
