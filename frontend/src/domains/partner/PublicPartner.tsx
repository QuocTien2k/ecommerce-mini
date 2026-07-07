import { SectionTitle } from "@components/ui/section-title";
import { DELIVERY_PARTNERS } from "./core/partner.core";

const PublicPartner = () => {
  return (
    <section className="space-y-6">
      <SectionTitle
        title="Đối tác vận chuyển"
        description="Hợp tác với các đơn vị vận chuyển uy tín, giao hàng nhanh trên toàn quốc."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {DELIVERY_PARTNERS.map((partner) => (
          <a
            key={partner.shortName}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-28 items-center justify-center rounded-xl border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
              className="max-h-12 w-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PublicPartner;
