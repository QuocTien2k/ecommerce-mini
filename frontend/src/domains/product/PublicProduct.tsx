import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductGrid } from "./components/ProductGrid";
import { ProductNotFound } from "@components/product/ProductNotFound";
import { usePublicHomeProductsQuery } from "./hooks/usePublicProduct";
import { SectionTitle } from "@components/ui/section-title";
import { Button } from "@components/ui/button";
import { Link } from "react-router-dom";

export const PublicProduct = () => {
  const { data, isLoading } = usePublicHomeProductsQuery();

  const products = data?.data ?? [];

  //console.log("Data trả về: ", data);

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

        <div className="mt-6 flex justify-center">
          <Button asChild className="h-12 px-10 text-base">
            <Link to="/products">Xem tất cả</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
