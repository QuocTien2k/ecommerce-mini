import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductGrid } from "./ProductGrid";
import { usePublicProductsQuery } from "../hooks/usePublicProduct";
import { usePublicProductFilter } from "../hooks/usePublicproductFilter";
import AppPagination from "@components/common/pagination";
import { ProductNotFound } from "@components/product/ProductNotFound";
import { SectionTitle } from "@components/ui/section-title";
import { ProductFilters } from "./search/ProductFilter";
import { useEffect, useState } from "react";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export const ProductCatalog = () => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const {
    goToPage,

    queryParams,

    // dùng cho phase filter tiếp theo
    filters,
    filterActions,
  } = usePublicProductFilter();

  const { data, isLoading } = usePublicProductsQuery(queryParams);

  const products = data?.data.data ?? [];

  //console.log("Data: ", data?.data.breadcrumb);

  useEffect(() => {
    if (data?.data?.breadcrumb) {
      setBreadcrumb(data.data.breadcrumb);
    }
  }, [data]);

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

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 min-h-5">
        {breadcrumb.length > 0 ? (
          <ol className="flex items-center gap-2">
            {breadcrumb.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="flex items-center gap-2"
              >
                {index !== 0 && <span>/</span>}

                {item.href ? (
                  <a href={item.href} className="hover:text-gray-900">
                    {item.name}
                  </a>
                ) : (
                  <span className="text-gray-700 font-medium">{item.name}</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="opacity-0 select-none">breadcrumb</div>
        )}
      </nav>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Filter */}
        <aside className="lg:col-span-3">
          <ProductFilters value={filters} actions={filterActions} />
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
                      onPageChange={goToPage}
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
