import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductGrid } from "./ProductGrid";
import { usePublicProductsQuery } from "../hooks/usePublicProduct";
import AppPagination from "@components/common/pagination";
import { ProductNotFound } from "@components/product/ProductNotFound";
import { SectionTitle } from "@components/ui/section-title";
import { ProductFilters } from "./search/ProductFilter";
import { usePublicProductFilter } from "../hooks/usePublicProductFilter";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMediaQuery } from "@/hooks/use-media-query";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export const ProductCatalog = () => {
  const {
    goToPage,

    queryParams,

    // dùng cho phase filter tiếp theo
    filters,
    filterActions,
  } = usePublicProductFilter();

  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  const { data, isLoading } = usePublicProductsQuery(queryParams);

  const products = data?.data.data ?? [];
  const breadcrumb: BreadcrumbItem[] = data?.data.breadcrumb ?? [];

  //console.log("Data: ", data?.data.breadcrumb);

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

      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Desktop Filter */}
        {!isMobile && (
          <aside className="lg:col-span-3">
            <ProductFilters value={filters} actions={filterActions} />
          </aside>
        )}

        {/* PRODUCTS */}
        <main className="lg:col-span-9">
          {isMobile && (
            <div className="mb-4 flex items-center justify-between px-4">
              <h2 className="text-base font-semibold">Bộ lọc</h2>

              <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  showCloseButton={false}
                  className="w-80 overflow-y-auto sm:w-96"
                >
                  <VisuallyHidden>
                    <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                  </VisuallyHidden>

                  <ProductFilters value={filters} actions={filterActions} />
                </SheetContent>
              </Sheet>
            </div>
          )}

          <div className="px-4">
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
