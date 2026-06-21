import { useMemo, useState } from "react";
import { useMyVouchersQuery } from "./hooks/useCustomerVoucher";
import type { UserVoucher } from "./types/customer.type";
import VoucherEmpty from "./components/VoucherEmpty";
import VoucherList from "./components/VoucherList";
import AppPagination from "@components/common/pagination";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { SectionTitle } from "@components/ui/section-title";

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

  const { data, isLoading } = useMyVouchersQuery(queryParams);

  const vouchers: UserVoucher[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="container py-6">
        <div className="mb-6">
          <SectionTitle
            title="Voucher của tôi"
            description="Danh sách voucher còn hiệu lực của bạn"
          />
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
      </div>
    </QueryStateWrapper>
  );
};

export default MyVouchers;
