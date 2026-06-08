import { useMemo, useState } from "react";
import { useMyVouchersQuery } from "./hooks/useCustomerVoucher";
import type { UserVoucher } from "./types/customer.type";
import Loading from "@components/ui/loading";
import VoucherEmpty from "./components/VoucherEmpty";
import VoucherList from "./components/VoucherList";
import AppPagination from "@components/common/pagination";

const LIMIT = 6;

const MyVouchers = () => {
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: LIMIT,
    }),
    [page],
  );

  const { data, isLoading, isFetching } = useMyVouchersQuery(queryParams);

  const vouchers: UserVoucher[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  if (isLoading) {
    return <Loading text="Đang tải voucher..." />;
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Voucher của tôi</h1>

        <p className="text-sm text-muted-foreground">
          Danh sách voucher còn hiệu lực của bạn
        </p>
      </div>

      {vouchers.length === 0 ? (
        <VoucherEmpty />
      ) : (
        <>
          <VoucherList vouchers={vouchers} />

          {totalPages > 1 && (
            <div className="mt-6">
              <AppPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {isFetching && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Đang cập nhật dữ liệu...
        </div>
      )}
    </div>
  );
};

export default MyVouchers;
