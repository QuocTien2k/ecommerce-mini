import { formatCurrency } from "@lib/format-currency";
import { cn } from "@lib/utils";
import { ORDER_STATUS_COLORS } from "@shared/types/order-status.utils";
import type { OrderDetail } from "@shared/types/order.type";
import { PAYMENT_LABEL, PAYMENT_STATUS_LABEL } from "@shared/types/payment";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const OrderHeader = ({ order }: { order: OrderDetail }) => {
  const payment = order.payment;

  return (
    <div className="p-6 space-y-6 border-b">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Đơn hàng #{order.id}
          </h2>
          <p className="text-sm text-muted-foreground">
            Đặt lúc{" "}
            {format(new Date(order.createdAt), "HH:mm dd/MM/yyyy", {
              locale: vi,
            })}
          </p>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            ORDER_STATUS_COLORS[order.status],
          )}
        >
          {order.statusLabel}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <span className="text-[14px] text-muted-foreground">Thanh toán:</span>
        <span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
          {PAYMENT_LABEL[payment.method]}
        </span>

        <span className="rounded bg-muted px-2 py-1 text-xs">
          {PAYMENT_STATUS_LABEL[payment.status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t pt-6">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="text-xs text-muted-foreground">Sản phẩm</div>

          <div className="text-xl font-semibold">{order.items.length}</div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="text-xs text-muted-foreground">Tổng thanh toán</div>

          <div className="text-xl font-bold">
            {formatCurrency(order.pricing.totalPrice)}
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="text-xs text-muted-foreground">Trạng thái</div>

          <div className="font-semibold">{order.statusLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
