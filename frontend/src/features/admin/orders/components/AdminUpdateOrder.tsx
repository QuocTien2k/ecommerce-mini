import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { useAdminOrderDetail } from "../hooks/useAdminOrderDetail";
import { useUpdateOrderStatus } from "../hooks/useAdminOrderUpdate";
import { useEffect, useState } from "react";
import { type OrderStatus } from "@shared/types/order-status.type";
import { PAYMENT_LABEL, PAYMENT_STATUS_LABEL } from "@shared/types/payment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { ORDER_STATUS_OPTIONS } from "@shared/types/order-status.utils";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { formatCurrency } from "@lib/format-currency";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error-message";
import { AsyncButton } from "@components/common/async-button";
import { ORDER_STATUS_TRANSITIONS } from "../types/adimn-order.type";

interface AdminOrderUpdateProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

const AdminUpdateOrder = ({
  open,
  orderId,
  onClose,
}: AdminOrderUpdateProps) => {
  const { data, isLoading, isFetching } = useAdminOrderDetail(
    orderId ?? "",
    open,
  );
  const { loading, run } = useScopedLoading();
  const updateOrder = useUpdateOrderStatus();
  const [status, setStatus] = useState<OrderStatus | "">("");

  const availableStatuses = data?.status
    ? ORDER_STATUS_TRANSITIONS[data.status]
    : [];

  useEffect(() => {
    if (!data?.status) return;

    const nextStatuses = ORDER_STATUS_TRANSITIONS[data.status];
    setStatus(nextStatuses[0] ?? "");
  }, [data]);

  const handleUpdate = async () => {
    if (!orderId || !status || status === data?.status) return;

    try {
      const result = await run(
        () =>
          updateOrder.mutateAsync({
            orderId,
            data: { status },
          }),
        {
          minDuration: 500,
        },
      );

      sonnerToast.success(result?.message ?? "Cập nhật thành công");
      onClose();
    } catch (error) {
      console.error("Update order error:", error);

      sonnerToast.error(getErrorMessage(error, "Cập nhật đơn hàng thất bại"), {
        id: "update-order-error",
      });
    }
  };

  if (!open || !orderId) return null;

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cập nhật đơn hàng</h2>

            <Button variant="destructive" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Info */}
          <div className="space-y-4 text-sm">
            {/* Order status */}
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="font-medium">{data?.statusLabel}</span>
            </div>

            {/* Payment */}
            <div className="flex justify-between">
              <span className="text-gray-500">Thanh toán:</span>
              <span className="font-medium">
                {data?.payment?.method
                  ? PAYMENT_LABEL[data.payment.method]
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái thanh toán:</span>
              <span className="font-medium">
                {data?.payment?.status
                  ? PAYMENT_STATUS_LABEL[data.payment.status]
                  : "—"}
              </span>
            </div>

            {/* Pricing */}
            <div className="flex justify-between">
              <span className="text-gray-500">Tổng tiền:</span>
              <span className="font-medium">
                {formatCurrency(data?.pricing?.totalPrice)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-500">Cập nhật trạng thái</label>

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus)}
              disabled={availableStatuses.length === 0}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue
                  placeholder={
                    availableStatuses.length === 0
                      ? "Không thể cập nhật"
                      : "Chọn trạng thái"
                  }
                />
              </SelectTrigger>

              <SelectContent position="popper">
                {ORDER_STATUS_OPTIONS.filter(
                  (opt) =>
                    opt.value !== "ALL" &&
                    availableStatuses.includes(opt.value as OrderStatus),
                ).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {availableStatuses.length === 0 && (
              <p className="mt-2 text-sm font-medium text-amber-600">
                Đơn hàng đã ở trạng thái cuối, không thể cập nhật.
              </p>
            )}
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Huỷ
            </Button>

            <AsyncButton
              type="button"
              loading={loading}
              disabled={
                loading ||
                availableStatuses.length === 0 ||
                status === data?.status
              }
              onClick={handleUpdate}
            >
              Cập nhật
            </AsyncButton>
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default AdminUpdateOrder;
