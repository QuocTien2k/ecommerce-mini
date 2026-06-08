import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { UserVoucher } from "../types/customer.type";
import { useMyVouchersQuery } from "../hooks/useCustomerVoucher";
import AppPagination from "@components/common/pagination";

const LIMIT = 10;

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

  console.log("Vouchers: ", vouchers);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Voucher của tôi</h1>

        <p className="text-muted-foreground text-sm">
          Danh sách voucher còn hiệu lực của bạn
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : vouchers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            Bạn chưa có voucher nào.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {vouchers.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {item.voucher.code}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {item.voucher.type === "PERCENT"
                        ? `Giảm ${item.voucher.value}%`
                        : `Giảm ${Number(item.voucher.value).toLocaleString(
                            "vi-VN",
                          )}đ`}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Hết hạn:{" "}
                      {item.voucher.endAt
                        ? new Date(item.voucher.endAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Không giới hạn"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Lượt còn lại
                    </p>

                    <p className="font-semibold">
                      {item.remainingUsage ?? "Không giới hạn"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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

      {isFetching && !isLoading && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Đang cập nhật dữ liệu...
        </div>
      )}
    </div>
  );
};

export default MyVouchers;
