import { useMemo } from "react";
import { useCustomerWishlistQuery } from "./hooks/useCustomerWishlist";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { SectionTitle } from "@components/ui/section-title";
import AppPagination from "@components/common/pagination";
import { ProductGrid } from "@/domains/product/components/ProductGrid";
import { WishlistEmpty } from "@components/wishlist/WishlistEmpty";
import { useSearchParams } from "react-router-dom";

const MyWishlist = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("trang") ?? 1);

  const queryParams = useMemo(
    () => ({
      page,
    }),
    [page],
  );

  const handlePageChange = (newPage: number) => {
    if (newPage === 1) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      page: String(newPage),
    });
  };

  const { data, isLoading } = useCustomerWishlistQuery(queryParams);

  const wishlists = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  //console.log(data);

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="container py-6">
        <div className="mb-6">
          <SectionTitle
            title="Sản phẩm yêu thích"
            description="Danh sách sản phẩm bạn đã thêm vào yêu thích"
          />
        </div>

        {wishlists.length === 0 ? (
          <WishlistEmpty />
        ) : (
          <>
            <ProductGrid products={wishlists} className="xl:grid-cols-4" />

            {totalPages > 1 && (
              <div className="mt-6">
                <AppPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </QueryStateWrapper>
  );
};

export default MyWishlist;
