import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { useAdminOrderDetail } from "../hooks/useAdminOrderDetail";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";
import { formatDate } from "@lib/format-date";
import { formatCurrency } from "@lib/format-currency";
import { formatProductAttributes } from "@/utils/format-product-attributes";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@shared/types/order-status.utils";

interface AdminOrderDetailProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

const AdminOrderDetail = ({
  open,
  orderId,
  onClose,
}: AdminOrderDetailProps) => {
  const { data, isLoading, isFetching } = useAdminOrderDetail(
    orderId ?? "",
    open,
  );

  //console.log(data);

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
            <h2 className="text-lg font-semibold">Chi tiết đơn hàng</h2>

            <Button variant="destructive" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Info */}
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              {/* ORDER INFO */}
              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">Thông tin đơn hàng</h3>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn hàng</span>
                    <span>{data?.id}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trạng thái</span>

                    {data?.status && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusColor(
                          data.status,
                        )}`}
                      >
                        {getOrderStatusLabel(data.status)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tạo</span>
                    <span>
                      {data?.createdAt ? formatDate(data.createdAt) : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật</span>
                    <span>
                      {data?.updatedAt ? formatDate(data.updatedAt) : "-"}
                    </span>
                  </div>
                </div>
              </section>

              {/* RECEIVER */}
              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">Thông tin người nhận</h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Họ tên:</span>{" "}
                    {data?.receiver.name}
                  </p>

                  <p>
                    <span className="text-muted-foreground">
                      Số điện thoại:
                    </span>{" "}
                    {data?.receiver.phone}
                  </p>

                  <p>
                    <span className="text-muted-foreground">Địa chỉ:</span>{" "}
                    {data?.receiver.address}
                  </p>
                </div>
              </section>

              {/* ITEMS */}
              <section className="rounded-xl border p-4">
                <h3 className="mb-4 font-semibold">
                  Sản phẩm ({data?.items.length ?? 0})
                </h3>

                <div className="space-y-4">
                  {data?.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-20 w-20 rounded-lg border object-cover"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>

                        {item.selectedAttributes && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            {formatProductAttributes(item.selectedAttributes)}
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          <span>SL: {item.quantity}</span>
                          <span>{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* VOUCHER */}
              {data?.voucher && (
                <section className="rounded-xl border p-4">
                  <h3 className="mb-3 font-semibold">Voucher</h3>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Mã:</span>{" "}
                      {data.voucher.code}
                    </p>

                    <p>
                      <span className="text-muted-foreground">Loại:</span>{" "}
                      {data.voucher.type}
                    </p>

                    <p>
                      <span className="text-muted-foreground">Giá trị:</span>{" "}
                      {data.voucher.value}
                    </p>
                  </div>
                </section>
              )}

              {/* PRICING */}
              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">Thanh toán</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(data?.pricing.subtotal ?? 0)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>
                      -{formatCurrency(data?.pricing.discountAmount ?? 0)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-base font-semibold">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(data?.pricing.totalPrice ?? 0)}</span>
                  </div>
                </div>
              </section>

              {/* NOTE */}
              {data?.note && (
                <section className="rounded-xl border p-4">
                  <h3 className="mb-2 font-semibold">Ghi chú</h3>

                  <p className="text-sm text-muted-foreground">{data.note}</p>
                </section>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default AdminOrderDetail;
