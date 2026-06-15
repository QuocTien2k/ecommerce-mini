import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductGrid } from "./ProductGrid";
import { usePublicProductsQuery } from "../hooks/usePublicProduct";
import { usePublicProductFilter } from "../hooks/usePublicproductFilter";
import AppPagination from "@components/common/pagination";
import { ProductNotFound } from "@components/product/ProductNotFound";

export const ProductCatalog = () => {
  const {
    page,
    setPage,

    queryParams,

    // dùng cho phase filter tiếp theo
    filters,
    filterActions,
  } = usePublicProductFilter();

  const { data, isLoading } = usePublicProductsQuery(queryParams);

  const products = data?.data.data ?? [];

  const meta = data?.data.meta;

  return (
    <section className="space-y-6">
      {/* FILTER AREA */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold">Tất cả sản phẩm</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách sản phẩm hiện có trong cửa hàng
        </p>

        {/* TODO:
            Search
            Category Filter
            Brand Filter
            Price Sort
        */}
      </div>

      {/* PRODUCTS */}
      <div className="rounded-lg border bg-white p-4">
        <QueryStateWrapper isLoading={isLoading}>
          {products.length ? (
            <div className="space-y-6">
              <ProductGrid products={products} className="xl:grid-cols-4" />

              {meta && meta.totalPages > 1 && (
                <AppPagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          ) : (
            <ProductNotFound />
          )}
        </QueryStateWrapper>
      </div>
    </section>
  );
};
