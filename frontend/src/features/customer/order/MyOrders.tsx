import { useMemo } from "react";
import { useOrders } from "./hooks/useOrders";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { SectionTitle } from "@components/ui/section-title";
import AppPagination from "@components/common/pagination";
import OrderList from "./components/my-order/OrderList";
import OrderEmpty from "@components/order/OrderEmpty";
import { useSearchParams } from "react-router-dom";

const MyOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);

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

  const { data, isLoading } = useOrders(queryParams);

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  //console.log("Orders trả về: ", orders);

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="container py-6">
        <div className="mb-6">
          <SectionTitle
            title="Đơn hàng của tôi"
            description="Theo dõi trạng thái các đơn hàng đã đặt"
          />
        </div>

        {orders.length === 0 ? (
          <OrderEmpty />
        ) : (
          <>
            <OrderList orders={orders} />

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

export default MyOrders;
