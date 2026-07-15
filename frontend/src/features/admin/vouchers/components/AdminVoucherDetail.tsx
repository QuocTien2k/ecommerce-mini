import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { useAdminVoucherDetailQuery } from "../hooks/useAdminVoucherQuery";

import { formatCurrency } from "@lib/format-currency";
import {
  VOUCHER_SCOPES,
  VOUCHER_TARGETS,
  VOUCHER_TYPES,
} from "@shared/types/voucher";

type AdminVoucherDetailModalProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  voucherId?: string | null;
};

export default function AdminVoucherDetailModal({
  open,
  onOpenChange,
  voucherId,
}: AdminVoucherDetailModalProps) {
  const {
    data: voucherDetail,
    isLoading,
    isFetching,
  } = useAdminVoucherDetailQuery(voucherId ?? undefined);

  const voucher = voucherDetail?.data;

  if (!open) return null;

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
        onClick={() => onOpenChange}
      >
        <div
          className="w-full max-w-3xl rounded-xl border bg-background shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">Chi tiết voucher</h2>

              <p className="text-sm text-muted-foreground">
                Thông tin chi tiết voucher
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* CONTENT */}
          {voucher && (
            <div className="space-y-6 p-6">
              {/* BASIC INFO */}
              <div className="grid grid-cols-2 gap-4">
                {/* MÃ VOUCHER - Highlight mạnh nhất */}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Mã voucher
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 border border-primary/30">
                    <span className="font-mono text-2xl font-bold tracking-wider text-primary">
                      {voucher.code}
                    </span>
                  </div>
                </div>

                {/* Loại giảm */}
                <div>
                  <p className="text-xs text-muted-foreground">Loại giảm</p>
                  <p className="font-semibold mt-1">
                    {voucher.type === VOUCHER_TYPES.PERCENT ? (
                      <span className="text-green-600">Phần trăm (%)</span>
                    ) : (
                      <span className="text-blue-600">Cố định (VND)</span>
                    )}
                  </p>
                </div>

                {/* Giá trị - Highlight */}
                <div>
                  <p className="text-xs text-muted-foreground">Giá trị giảm</p>
                  <p className="font-bold text-2xl mt-1 text-primary">
                    {voucher.type === VOUCHER_TYPES.PERCENT
                      ? `${voucher.value}%`
                      : formatCurrency(voucher.value)}
                  </p>
                </div>

                {/* SCOPE */}
                <div>
                  <p className="text-xs text-muted-foreground">Phạm vi</p>
                  <p className="font-semibold mt-1 capitalize">
                    {voucher.scope === VOUCHER_SCOPES.ORDER
                      ? "Toàn đơn hàng"
                      : voucher.scope === VOUCHER_SCOPES.PRODUCT
                        ? "Theo sản phẩm"
                        : "Theo danh mục"}
                  </p>
                </div>

                {/* Giảm tối đa */}
                <div>
                  <p className="text-xs text-muted-foreground">Giảm tối đa</p>
                  <p className="font-semibold mt-1">
                    {voucher.maxDiscount
                      ? formatCurrency(voucher.maxDiscount)
                      : "--"}
                  </p>
                </div>

                {/* Đơn tối thiểu */}
                <div>
                  <p className="text-xs text-muted-foreground">Đơn tối thiểu</p>
                  <p className="font-semibold mt-1">
                    {voucher.minOrderValue
                      ? formatCurrency(voucher.minOrderValue)
                      : "--"}
                  </p>
                </div>

                {/* Lượt dùng */}
                <div>
                  <p className="text-xs text-muted-foreground">Lượt sử dụng</p>
                  <p className="font-semibold mt-1">
                    <span className="text-lg">{voucher.usedCount}</span>
                    {voucher.usageLimit && (
                      <span className="text-muted-foreground">
                        {" "}
                        / {voucher.usageLimit}
                      </span>
                    )}
                  </p>
                </div>

                {/* Trạng thái */}
                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <div className="mt-1">
                    {voucher.isDeleted ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                        Đã xóa
                      </span>
                    ) : voucher.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        Tạm khóa
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* PRODUCTS */}
              {voucher.scope === VOUCHER_SCOPES.PRODUCT && (
                <div>
                  <p className="mb-3 text-sm font-semibold">Sản phẩm áp dụng</p>
                  <div className="flex flex-wrap gap-2">
                    {voucher.products.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium"
                      >
                        {product.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CATEGORIES */}
              {voucher.scope === VOUCHER_SCOPES.CATEGORY && (
                <div>
                  <p className="mb-3 text-sm font-semibold">Danh mục áp dụng</p>
                  <div className="flex flex-wrap gap-2">
                    {voucher.categories.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium"
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target */}
              <div>
                <p className="text-xs text-muted-foreground">Đối tượng</p>

                <div className="mt-1">
                  {voucher.target === VOUCHER_TARGETS.GLOBAL ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      Công khai
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                      Cá nhân
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </QueryStateWrapper>
  );
}
