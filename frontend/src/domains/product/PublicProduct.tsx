import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductGrid } from "./components/ProductGrid";
import { ProductNotFound } from "@components/product/ProductNotFound";
import { usePublicHomeProductsQuery } from "./hooks/usePublicProduct";
import { SectionTitle } from "@components/ui/section-title";

export const PublicProduct = () => {
  const { data, isLoading } = usePublicHomeProductsQuery();

  const products = data?.data ?? [];

  console.log("Data trả về: ", data);

  return (
    <section className="space-y-4">
      <SectionTitle
        title="Sản phẩm nổi bật"
        description="Những sản phẩm được khách hàng quan tâm nhiều nhất"
      />

      <div className="rounded-lg border bg-white p-4">
        <QueryStateWrapper isLoading={isLoading}>
          {products.length ? (
            <ProductGrid products={products} className="xl:grid-cols-4" />
          ) : (
            <ProductNotFound />
          )}
        </QueryStateWrapper>
      </div>
    </section>
  );
};
