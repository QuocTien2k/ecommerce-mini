import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductGrid } from "./ProductGrid";
import { usePublicProductsQuery } from "../hooks/usePublicProduct";
import { usePublicProductFilter } from "../hooks/usePublicproductFilter";
import AppPagination from "@components/common/pagination";
import { ProductNotFound } from "@components/product/ProductNotFound";

import { SectionTitle } from "@components/ui/section-title";
import { ProductFilters } from "./search/ProductFilter";

export const ProductCatalog = () => {
  const {
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
      {/* Title */}
      <div className="">
        <SectionTitle
          title="Tất cả sản phẩm"
          description="Danh sách sản phẩm hiện có trong cửa hàng"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Filter */}
        <aside className="lg:col-span-3">
          <ProductFilters filters={filters} actions={filterActions} />
        </aside>

        {/* PRODUCTS */}
        <main className="lg:col-span-9">
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
        </main>
      </div>
    </section>
  );
};
